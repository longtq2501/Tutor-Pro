# 📁 Module [Tên Module] ([Tên Tiếng Anh])

## 1. Giới thiệu tổng quan
[Mô tả ngắn gọn về module: mục đích, vai trò trong hệ thống, vấn đề nó giải quyết]

**Bối cảnh:**
- Module này thuộc ứng dụng **Tutor Management Pro**
- Đây là [trung tâm/công cụ/hệ thống] để [chức năng chính]
- Được thiết kế để [thay thế/cải tiến/tối ưu] [quy trình cũ nếu có]

---

## 2. Các chức năng chính
Hệ thống [Tên Module] bao gồm các chức năng cốt lõi sau:

*   **[Chức năng 1]:**
    *   [Mô tả chi tiết]
    *   [Các điểm nổi bật hoặc sub-features]
    
*   **[Chức năng 2]:**
    *   [Mô tả chi tiết]
    *   [Các điểm nổi bật hoặc sub-features]

*   **[Chức năng 3]:**
    *   [Mô tả chi tiết]
    *   [Các điểm nổi bật hoặc sub-features]

[Liệt kê 3-5 chức năng chính, mỗi chức năng có bullet points con mô tả chi tiết]

---

## 3. Cách hoạt động (Workflow)

### A. Quy trình [Tên Quy trình 1] ([Process Name])
1.  **Bước 1:** [Mô tả hành động/component/layer xử lý]
2.  **Bước 2:** [Mô tả luồng dữ liệu hoặc logic]
3.  **Bước 3:** [Kết quả hoặc output]
4.  **[Tính năng đặc biệt]:** [Giải thích các cơ chế tối ưu như Optimistic Updates, Caching, v.v.]

### B. Quy trình [Tên Quy trình 2]
*   **[Điểm nhấn 1]:** [Chi tiết]
*   **[Điểm nhấn 2]:** [Chi tiết]

[Chia workflow thành 2-4 quy trình con logic, mỗi quy trình giải thích luồng xử lý từ đầu đến cuối]

---

## 4. Cấu trúc kỹ thuật

### Backend (Modular Monolith)
*   **Package:** `com.tutor_management.backend.modules.[module_name]`
*   **Entity Chính:**
    *   `[Entity1]`: [Mô tả ý nghĩa và các trường quan trọng]
    *   `[Entity2]`: [Mô tả mối quan hệ với entity khác]
*   **Query Optimization:** 
    *   [Các kỹ thuật tối ưu query: JOIN FETCH, indexing, caching]
    *   [Giải pháp cho N+1 problem hoặc performance bottleneck]
*   **API Endpoints:**
    *   `GET /api/[module]/[resource]` - [Mô tả]
    *   `POST /api/[module]/[action]` - [Mô tả]

### Frontend (Feature-based)
*   **Thư mục:** `frontend/features/[module-name]/[sub-feature]`
*   **Công nghệ:** [Stack công nghệ: Next.js, React, Tailwind, v.v.]
*   **Components Chính:**
    *   `[Component1]`: [Vai trò và responsibility]
    *   `[Component2]`: [Vai trò và responsibility]
*   **Hiệu suất:**
    *   [Các kỹ thuật tối ưu render: React.memo, useMemo, lazy loading]
    *   [Metrics hoặc con số cụ thể về performance improvement]

### Database Schema (nếu có thay đổi)
```sql
-- [Bảng quan trọng và các trường chính]
-- [Indexes và constraints đặc biệt]
```

---

## 5. Use Cases & User Stories

### Use Case 1: [Tên Use Case]
**Actor:** [Quản trị viên/Giáo viên/Phụ huynh]  
**Mô tả:** [Tình huống sử dụng cụ thể]  
**Luồng chính:**
1. [Bước 1]
2. [Bước 2]
3. [Kết quả mong đợi]

### Use Case 2: [Tên Use Case]
[Tương tự như trên]

[Liệt kê 2-3 use cases điển hình nhất]

---

## 6. Xử lý lỗi & Edge Cases

*   **[Edge Case 1]:** [Tình huống] → [Cách xử lý]
*   **[Edge Case 2]:** [Tình huống] → [Cách xử lý]
*   **Error Handling Strategy:**
    *   [Frontend validation]
    *   [Backend error responses]
    *   [User feedback mechanism]

---

## 7. Testing Strategy

### Unit Tests
*   [Component/Service nào được test]
*   [Coverage target: ví dụ 80%+]

### Integration Tests
*   [API endpoints được test]
*   [Scenarios end-to-end]

### E2E Tests (nếu có)
*   [User flows chính được automated]

---

## 8. Hướng phát triển (Planned Optimizations)

*   [ ] [Tính năng tiếp theo 1]
*   [ ] [Cải tiến hiệu suất 2]
*   [ ] [Tích hợp với module khác 3]
*   [ ] [Refactoring hoặc technical debt 4]

[Liệt kê 3-7 items với checkbox để track progress]

---

## 9. Dependencies & Related Modules

*   **Phụ thuộc vào:**
    *   `[Module A]` - [Lý do]
    *   `[Module B]` - [Lý do]
*   **Được sử dụng bởi:**
    *   `[Module C]` - [Cách sử dụng]

---

## 10. Tài liệu tham khảo

*   [Link đến API Documentation]
*   [Link đến Figma Design nếu có]
*   [Link đến ADR (Architecture Decision Records)]
*   [Link đến related technical docs]

---

> **Lưu ý:** [Ghi chú đặc biệt về module này: legacy migration status, known limitations, breaking changes, v.v.]