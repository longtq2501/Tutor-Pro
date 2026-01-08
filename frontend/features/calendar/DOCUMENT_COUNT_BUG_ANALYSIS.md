# Document Count Bug - Initial Analysis

## Problem Statement
In the document selection modal (Image 4), the category tabs show incorrect document counts that don't match the actual available documents.

**Example from screenshot:**
- Tab shows: "43 Tìm thấy" (43 found)
- But user reports: Cannot find/select all expected documents
- This prevents proper document selection for teaching sessions

## Visual Evidence (From Image 4)

### Modal Structure:
```
CHI TIẾT BUỔI HỌC
Thông tin lớp học

Stats Bar:
- Tổng mục: 5
- Tìm thấy: 43  ← SUSPECT: This count may be wrong
- Đã chọn: 0

Tabs: [Tất cả] [VOCABULARY] [GRAMMAR] [IELTS] [EXAM]
Active Tab: "Tất cả" (All)

Document List:
✓ THG4 - WEEK 9 TO 13 (HẢN BÌNH) - EXAM
✓ THG4 - WEEK 1 TO 8 (HẢN BÌNH) - EXAM  
✓ UNIT 2_ADVERTISING - VOCABULARY LIST (BẢO HÂN) - EXAM
✓ UNIT 1_POETRY - VOCABULARY LIST (BẢO HÂN) - EXAM
```

## Potential Root Causes

### 1. **Frontend Filtering Mismatch**
```javascript
// Hypothesis: Frontend filter doesn't match backend query
// Example problematic code:

const filteredDocs = documents.filter(doc => 
  selectedTab === 'all' 
    ? true 
    : doc.category === selectedTab // ← May not match all docs
)

// Issue: If documents have multiple categories or nested structure,
// simple equality check might miss documents
```

**Check:**
- Is `doc.category` a string or array?
- Are category names case-sensitive?
- Do documents support multiple categories?

### 2. **Pagination/Lazy Loading Issue**
```javascript
// Hypothesis: Count shows total but only loads first page

const { data } = useQuery(['documents', studentId], () =>
  fetchDocuments(studentId, { page: 1, limit: 20 })
)

// Issue: API returns { count: 43, documents: [...20 items] }
// but frontend only displays 20 items while showing "43 found"
```

**Check:**
- Is there pagination in the document list?
- Does "Load More" button exist but hidden?
- Is infinite scroll implemented?

### 3. **Stale Cache in React Query**
```javascript
// Hypothesis: Count is cached but document list is stale

const documentsQuery = useQuery(['documents', studentId], fetchDocuments, {
  staleTime: 5 * 60 * 1000, // 5 minutes
  // If documents were added/deleted, count may be outdated
})
```

**Check:**
- What are React Query cache settings?
- Is invalidation working after CRUD operations?
- Are there multiple queries racing?

### 4. **Backend Query Logic Error**
```java
// Hypothesis: COUNT(*) query doesn't match SELECT query

// Count query
SELECT COUNT(*) FROM documents 
WHERE student_id = ? AND category = ?  // Returns 43

// Actual fetch query  
SELECT * FROM documents 
WHERE student_id = ? 
  AND category = ?
  AND archived = false  // ← Additional filter not in count!
  LIMIT 20              // Returns fewer items
```

**Check:**
- Are COUNT and SELECT queries using same filters?
- Is soft-delete implemented (archived/deleted flag)?
- Any permission-based filtering?

### 5. **Category Tab Logic Error**
```javascript
// Hypothesis: "Tất cả" (All) tab shows wrong count

// May be showing:
// - Sum of all categories (could be inflated if docs have multiple categories)
// - Only documents with no category assigned
// - Count from wrong student/class

const allCount = selectedTab === 'all'
  ? documents.length  // Wrong: should be total from API
  : documents.filter(d => d.category === selectedTab).length
```

**Check:**
- How is "Tất cả" count calculated?
- Is it `SUM(category_counts)` or separate query?

## Investigation Steps

### Step 1: Check Network Tab
```
1. Open document selection modal
2. Open DevTools → Network tab
3. Look for API calls like:
   - GET /api/documents?studentId=...
   - GET /api/documents/count?studentId=...

4. Compare:
   - Response body: How many documents in array?
   - Response metadata: What's the total count?
   
Example expected response:
{
  "data": [ /* array of documents */ ],
  "meta": {
    "total": 43,      ← Compare this with actual array length
    "page": 1,
    "limit": 20,
    "pages": 3
  }
}
```

### Step 2: Check React Query DevTools
```javascript
// Enable React Query DevTools in development

import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

// Check:
// - What data is cached for 'documents' query?
// - Is the data stale?
// - What's the structure of cached data?
```

### Step 3: Console Logging
```javascript
// Add temporary logs in document selection component

const DocumentSelectionModal = () => {
  const { data: documents } = useQuery(...)
  
  useEffect(() => {
    console.log('📄 Documents fetched:', {
      totalFromAPI: data?.meta?.total,
      actualLength: data?.documents?.length,
      selectedTab,
      filteredCount: filteredDocuments.length
    })
  }, [data, selectedTab])
  
  // ...
}
```

### Step 4: Backend Logging
```java
@GetMapping("/documents")
public ResponseEntity<DocumentResponse> getDocuments(
    @RequestParam String studentId,
    @RequestParam(required = false) String category
) {
    List<Document> docs = documentService.findAll(studentId, category);
    long count = documentService.count(studentId, category);
    
    log.info("Documents fetched - Count: {}, Actual: {}, Category: {}", 
             count, docs.size(), category);
    
    // Check if count == docs.size()
    if (count != docs.size()) {
        log.warn("COUNT MISMATCH! Expected {} but got {}", count, docs.size());
    }
    
    return ResponseEntity.ok(new DocumentResponse(docs, count));
}
```

## Quick Fix Checklist

Once root cause is identified:

- [ ] Fix query logic to ensure count matches actual documents
- [ ] Ensure frontend filtering matches backend filtering
- [ ] Add React Query invalidation after document CRUD operations
- [ ] Test with different categories and edge cases
- [ ] Add error boundary for count mismatch scenarios
- [ ] Add E2E test for document selection flow

## Success Criteria

✅ **Fixed when:**
1. Count displays exactly the number of selectable documents
2. User can scroll/paginate to see ALL documents
3. No documents are hidden or unreachable
4. Count updates correctly after filtering by category
5. Count stays accurate after adding/removing documents

## Testing Scenarios

After fix, test these cases:
```
1. Select "Tất cả" tab → Verify count matches total documents
2. Select "EXAM" tab → Verify count matches only EXAM documents  
3. Add new document → Verify count increases by 1
4. Delete document → Verify count decreases by 1
5. Switch between tabs → Verify counts update correctly
6. Filter by student → Verify count is per-student accurate
7. Test with 0 documents → Should show "0 Tìm thấy"
8. Test with 100+ documents → Verify pagination/virtualization works
```

## Prevention

To avoid similar issues in the future:

```javascript
// Add data validation hook
const useDocumentCount = (documents, apiCount) => {
  useEffect(() => {
    if (documents.length !== apiCount) {
      console.error('❌ Document count mismatch!', {
        displayed: documents.length,
        reported: apiCount
      })
      
      // Optional: Send to error tracking
      reportError('document_count_mismatch', { 
        displayed: documents.length, 
        reported: apiCount 
      })
    }
  }, [documents, apiCount])
}
```

## Related Files to Check

```
frontend/
├── features/calendar/
│   ├── add-session-modal/
│   │   ├── DocumentSelectionModal.tsx  ← Main suspect
│   │   ├── useDocuments.ts             ← React Query hook
│   │   └── documentService.ts          ← API calls
│   └── components/
│       └── DocumentList.tsx

backend/
├── controllers/
│   └── DocumentController.java
├── services/
│   └── DocumentService.java
└── repositories/
    └── DocumentRepository.java
```