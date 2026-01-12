# CONTINUITY WORKFLOW GUIDE

## 📋 Overview

Workflow này sử dụng 5 file tiêu chuẩn để quản lý dự án:

| File | Purpose | Location | Update Frequency |
|------|---------|----------|------------------|
| **CONTINUITY.md** | Project state & progress | Root | When switching modules |
| **GEMINI.md** | Global coding rules | Root | Rarely (when standards change) |
| **CLEAN_CODE_CRITERIA.md** | Code quality standards | Root | Reference only |
| **ISSUES.md** | Module-specific issues | Per module | During work |
| **README_MODULE.md** | Module documentation | Per module | After completion |

---

## 🚀 WORKFLOW

### 1️⃣ Start Every Session
```
Prompt:
"Đọc CONTINUITY.md và GEMINI.md, sau đó cho tôi Ledger Snapshot."
```

**Agent will provide:**
- Current Goal
- Now (what you're working on)
- Next (what's planned)
- Open Questions

---

### 2️⃣ Start New Module

#### Step A: Update CONTINUITY.md
```markdown
### Now:
- 🔄 Student Module: Optimization (performance + UX + code quality)

### Working Set:
Current module: student
Active files:
- frontend/features/student/components/EnrollmentForm.tsx
- backend/src/main/java/com/tutorpro/student/StudentService.java
Focus: Performance optimization + error handling
```

#### Step B: Create ISSUES.md
```
Prompt:
"Đọc CONTINUITY.md và GEMINI.md.

Tạo file frontend/features/student/ISSUES.md theo template ISSUES_CRITERIA.md.

Audit Student module về:
- Performance (target < 2s)
- UX issues
- UI responsive (iPhone SE/16)
- GEMINI.md violations (function length, missing tests/docs)

Vấn đề hiện tại:
[Describe issues in Vietnamese]"
```

**Agent creates:** `frontend/features/student/ISSUES.md`
```markdown
# Student Module - Issues & Optimization

## Performance Issues
- [ ] [P0-Critical] Student list query takes 3.2s (target < 2s)
  - Root cause: N+1 query problem
  - Target: < 2s page load
  - Current metrics: 3.2s P95
  - Solution: Add @EntityGraph or JOIN FETCH

## UX Issues
- [ ] [P1-High] No error message when enrollment fails
  - Impact: Users confused when submission fails silently
  - Expected: Toast notification with error details

## UI Issues
- [ ] [P2-Medium] Mobile layout broken on iPhone SE
  - Responsive: Tested on iPhone SE (375x667)
  - Current state: Form overflows screen

## Technical Debt
- [ ] [P1-High] StudentService.enrollStudent() is 85 lines (max 50)
  - Violates: GEMINI.md function length rule
  - Needs: Extract to smaller functions following SRP
- [ ] [P2-Medium] Missing JSDoc for exported functions
  - Violates: CLEAN_CODE_CRITERIA.md documentation rules
- [ ] [P2-Medium] Test coverage 65% (target 80%+)

---

## Completed Work (Archive)
[Empty initially]
```

---

### 3️⃣ Work on Issues
```
Prompt:
"Đọc CONTINUITY.md, GEMINI.md, CLEAN_CODE_CRITERIA.md và student/ISSUES.md.

Fix issue: [P0-Critical] Student list query N+1 problem.

Requirements:
- Follow GEMINI.md rules (naming, function length < 50, add tests)
- Follow CLEAN_CODE_CRITERIA.md (JSDoc, error handling, validation)
- Target performance < 2s
- Update ISSUES.md when done

Current code:
[Paste code if needed]"
```

**Agent:**
1. Reads all standard files
2. Fixes issue following standards
3. Runs pre-commit checklist
4. Updates ISSUES.md

---

### 4️⃣ Pre-Commit Checklist (Auto)

Agent automatically runs:
```
□ Frontend lint: npm run lint ✓
□ Backend tests: ./mvnw test ✓
□ No debug statements ✓
□ Functions < 50 lines (GEMINI.md) ✓
□ JSDoc/Javadoc added (CLEAN_CODE_CRITERIA.md) ✓
□ Input validation added (CLEAN_CODE_CRITERIA.md) ✓
□ Error handling with context (CLEAN_CODE_CRITERIA.md) ✓
□ Responsive tested (iPhone SE/16) ✓
□ CONTINUITY.md updated (if key decision) ✓
□ ISSUES.md checkbox marked [x] ✓
```

---

### 5️⃣ Mark Issue Complete

**Agent updates ISSUES.md:**
```markdown
## Completed Work (Archive)
- [x] [P0-Critical] Student list query takes 3.2s
  - Solution: Added @EntityGraph(attributePaths = {"enrollments", "courses"})
  - Performance impact: 3.2s → 0.7s (P95)
  - Code coverage: 65% → 78%
  - Tests added: StudentRepositoryTest with N+1 scenario
  - Follows: GEMINI.md (function < 50 lines), CLEAN_CODE_CRITERIA.md (documented)
  - Commit: `fix(student): optimize list query with EntityGraph`
  - Tested: ✅
```

---

### 6️⃣ Complete Module

#### Step A: Verify All Issues Done
```
Prompt:
"Đọc student/ISSUES.md. 
List remaining open issues.
Nếu còn P0/P1, cần fix trước khi complete module."
```

#### Step B: Create Module Documentation
```
Prompt:
"Đọc CONTINUITY.md, student/ISSUES.md.

Module Student đã hoàn thành. 
Tạo file frontend/features/student/README.md theo template README_STRUCTURE_MODULE.md.

Include:
- All completed optimizations
- Performance metrics (before → after)
- Architecture decisions
- API endpoints
- Use cases"
```

**Agent creates:** `frontend/features/student/README.md`

#### Step C: Update CONTINUITY.md
```
Prompt:
"Update CONTINUITY.md:

Move Student module to Done với:
- Performance achievements (3.2s → 0.7s)
- Coverage improvement (65% → 87%)
- All P0/P1 issues resolved
- Key decisions made

Clear Working Set.
Suggest next module based on priorities."
```

**Agent updates:**
```markdown
### Done:
- ✅ Student Module optimized (Jan 11, 2026)
  - Performance: 3.2s → 0.7s list load (target < 2s ✓)
  - Coverage: 65% → 87% (target 80%+ ✓)
  - UX: Error handling + loading states
  - UI: Mobile responsive (iPhone SE/16 ✓)
  - Refactor: Split 85-line function → 3 services < 40 lines
  - Docs: Complete README.md created

### Now:
- 🔄 Schedule Module: Fix P0 booking conflict issue

### Working Set:
[Cleared]
```

#### Step D: Commit
```bash
git add .
git commit -m "feat(module (& module if more than 2 modules)): complete module optimization

- Performance: 
- Coverage: 
- UX: 
- UI: 
- Refactor: 
- Docs: 

Closes: All issues in frontend/features/[module]/ISSUES.md"

git push origin main
```

---

## 🔧 Ad-hoc Tasks

### Add New Issue During Work
```
Prompt:
"Đọc student/ISSUES.md và GEMINI.md.

Phát hiện issue mới:
[Describe in Vietnamese]

Check GEMINI.md violations.
Add to ISSUES.md với priority phù hợp."
```

### Fix Quick Issue
```
Prompt:
"Fix quick issue: [describe]

Follow GEMINI.md + CLEAN_CODE_CRITERIA.md.
Update ISSUES.md.
Run pre-commit checklist."
```

### Code Review
```
Prompt:
"Review code này theo GEMINI.md và CLEAN_CODE_CRITERIA.md:
[Paste code]

Check:
- Naming (GEMINI.md)
- Function length (GEMINI.md)
- Documentation (CLEAN_CODE_CRITERIA.md)
- Error handling (CLEAN_CODE_CRITERIA.md)
- Security (CLEAN_CODE_CRITERIA.md)"
```

### Refactor Request
```
Prompt:
"Refactor [module/function] theo:
- GEMINI.md rules
- CLEAN_CODE_CRITERIA.md standards

Extract functions > 50 lines.
Apply SRP.
Add missing docs/tests.
Update ISSUES.md technical debt section."
```

---

## 📁 File Locations
```
project-root/
├── CONTINUITY.md                    # ← Update when switching modules
├── GEMINI.md                        # ← Reference for coding rules
├── CLEAN_CODE_CRITERIA.md           # ← Reference for code quality
├── ISSUES_CRITERIA.md               # ← Template for ISSUES.md
├── README_STRUCTURE_MODULE.md       # ← Template for module docs
│
├── frontend/features/
│   ├── student/
│   │   ├── ISSUES.md               # ← Create at module start
│   │   └── README.md               # ← Create at module completion
│   ├── schedule/
│   │   ├── ISSUES.md
│   │   └── README.md
│   └── finance/
│       ├── ISSUES.md
│       └── README.md
│
└── backend/src/main/java/.../modules/
    └── [same pattern if needed]
```

---

## 🎯 Standard File Usage

### CONTINUITY.md
**When to update:**
- Starting new module
- Making key architectural decisions
- Completing module
- Switching context

**What to track:**
- High-level goals
- Current focus (module + specific area)
- Completed milestones
- Next planned work

### GEMINI.md
**When to reference:**
- Every coding task
- Code review
- Refactoring
- Pre-commit

**What it defines:**
- Build commands
- Architecture rules
- Naming conventions
- Function length limits
- Testing requirements
- Responsive targets

### CLEAN_CODE_CRITERIA.md
**When to reference:**
- Writing new code
- Code review
- Refactoring
- Documentation

**What it defines:**
- Documentation standards (JSDoc/Javadoc)
- Error handling patterns
- Security best practices
- Code formatting rules
- DRY principle

### ISSUES.md (per module)
**When to update:**
- Module start (create from template)
- Finding new issues
- Completing issues
- Module completion (archive)

**What to track:**
- Performance issues (with metrics)
- UX issues (with user impact)
- UI issues (with device specs)
- Technical debt (GEMINI/CLEAN_CODE violations)

### README_MODULE.md (per module)
**When to create:**
- After module completion
- Major feature completion

**What to document:**
- Overview & purpose
- Main features
- Workflow explanations
- Technical architecture
- Use cases
- Planned optimizations

---

## 🔄 Relationship Between Files
```
CONTINUITY.md (Where am I?)
    ↓
GEMINI.md (How to code?) + CLEAN_CODE_CRITERIA.md (Quality standards?)
    ↓
ISSUES.md (What to fix?)
    ↓
[Work following standards]
    ↓
README_MODULE.md (Document results)
    ↓
Update CONTINUITY.md (Mark done, move to next)
```

---

## 💡 Key Principles

### 1. Always Start with Context
```
"Đọc CONTINUITY.md và GEMINI.md..."
```

This ensures Agent knows WHERE you are and HOW to work.

### 2. Use Templates

- Don't write ISSUES.md from scratch → use `ISSUES_CRITERIA.md`
- Don't write README from scratch → use `README_STRUCTURE_MODULE.md`
- Templates ensure consistency

### 3. Reference Standards

Every coding task should reference:
- `GEMINI.md` for project-specific rules
- `CLEAN_CODE_CRITERIA.md` for universal quality

### 4. Document as You Go

- Update `ISSUES.md` when finding/fixing issues
- Update `CONTINUITY.md` when making key decisions
- Create `README.md` when completing module

### 5. Automate Checks

Agent should automatically run pre-commit checklist against:
- `GEMINI.md` rules
- `CLEAN_CODE_CRITERIA.md` standards

---

## 🚨 Emergency Commands

### Lost Context?
```
"Đọc CONTINUITY.md và GEMINI.md.
Tôi đang ở đâu? Đang làm gì? Next step?"
```

### Issues File Messy?
```
"Reorganize [module]/ISSUES.md theo ISSUES_CRITERIA.md template.
Move completed to Archive.
Re-prioritize active issues."
```

### Code Quality Check?
```
"Audit [module] theo GEMINI.md và CLEAN_CODE_CRITERIA.md.
List all violations.
Suggest fixes."
```

### Module Status?
```
"Đọc [module]/ISSUES.md.
Summary: Done vs Remaining.
Estimate effort to complete."
```

---

## 📊 Success Metrics

Track in CONTINUITY.md:
- Performance improvements (before → after)
- Code coverage trend
- Technical debt resolved
- Modules completed

Example:
```markdown
### Done:
- ✅ Student Module (3.2s → 0.7s, 65% → 87% coverage)
- ✅ Finance Module (2.8s → 0.9s, 70% → 85% coverage)

Progress: 2/5 modules optimized (40%)
```

---

## 🎓 Learning Path

### Week 1: Get comfortable with workflow

- Use templates strictly
- Reference standards every task
- Update ledger consistently

### Week 2: Internalize standards

- Less copy-paste from standards
- Agent follows rules automatically
- Focus on complex problems

### Week 3: Optimize workflow

- Custom prompts for common tasks
- Faster context switching
- Better estimation

---

## 📝 PROMPT TEMPLATES

### Session Start
```
Đọc CONTINUITY.md và GEMINI.md, sau đó cho tôi Ledger Snapshot.
```

### Module Start
```
Đọc CONTINUITY.md và GEMINI.md.

Tạo file frontend/features/[module]/ISSUES.md theo template ISSUES_CRITERIA.md.

Audit [module] về:
- Performance (target < 2s)
- UX issues
- UI responsive (iPhone SE/16)
- GEMINI.md violations (function length, missing tests/docs)

Vấn đề hiện tại:
[Describe issues in Vietnamese]
```

### Working on Issue
```
Đọc CONTINUITY.md, GEMINI.md, CLEAN_CODE_CRITERIA.md và [module]/ISSUES.md.

Fix issue: [specific issue from list].

Requirements:
- Follow GEMINI.md rules (naming, function length < 50, add tests)
- Follow CLEAN_CODE_CRITERIA.md (JSDoc, error handling, validation)
- Target performance < 2s
- Update ISSUES.md when done

Current code:
[Paste code if needed]
```

### Code Review
```
Review code này theo GEMINI.md và CLEAN_CODE_CRITERIA.md:
[Paste code]

Check:
- Naming (GEMINI.md)
- Function length (GEMINI.md)
- Documentation (CLEAN_CODE_CRITERIA.md)
- Error handling (CLEAN_CODE_CRITERIA.md)
- Security (CLEAN_CODE_CRITERIA.md)
```

### Add New Issue
```
Đọc [module]/ISSUES.md và GEMINI.md.

Phát hiện issue mới:
[Describe in Vietnamese]

Check GEMINI.md violations.
Add to ISSUES.md với priority phù hợp.
```

### Module Complete
```
Đọc CONTINUITY.md, student/ISSUES.md.

Module [name] đã hoàn thành. 
Tạo file frontend/features/[module]/README.md theo template README_STRUCTURE_MODULE.md.

Include:
- All completed optimizations
- Performance metrics (before → after)
- Architecture decisions
- API endpoints
- Use cases
```

### Update CONTINUITY After Module
```
Update CONTINUITY.md:

Move [module] to Done với:
- Performance achievements
- Coverage improvement
- All P0/P1 issues resolved
- Key decisions made

Clear Working Set.
Suggest next module based on priorities.
```

### Refactor Request
```
Refactor [module/function] theo:
- GEMINI.md rules
- CLEAN_CODE_CRITERIA.md standards

Extract functions > 50 lines.
Apply SRP.
Add missing docs/tests.
Update ISSUES.md technical debt section.
```

### Audit Module
```
Đọc CONTINUITY.md và GEMINI.md.
Audit [module] về:
- Performance (target < 2s)
- UX issues
- UI responsive (iPhone SE/16)
- GEMINI.md violations
Tạo file [module]/ISSUES.md theo ISSUES_CRITERIA.md template.
```

---

## 🎯 Best Practices

### DO:

- ✅ Always read CONTINUITY.md + GEMINI.md at session start
- ✅ Update CONTINUITY.md when switching modules
- ✅ Use templates strictly (ISSUES_CRITERIA.md, README_STRUCTURE_MODULE.md)
- ✅ Include metrics (before → after) in all optimizations
- ✅ Reference standards (GEMINI.md, CLEAN_CODE_CRITERIA.md) in every task
- ✅ Run pre-commit checklist before committing
- ✅ Test responsive on iPhone SE/16
- ✅ Archive completed issues regularly
- ✅ Use Vietnamese naturally when describing problems
- ✅ Let AI translate and structure professionally
- ✅ Document architecture decisions in CONTINUITY.md

### DON'T:

- ❌ Skip reading context files at session start
- ❌ Write ISSUES.md from scratch (use template)
- ❌ Update every tiny change in ledger
- ❌ Make CONTINUITY.md too detailed
- ❌ Forget to mark [x] done items
- ❌ Skip priority labels
- ❌ Let ISSUES.md become stale
- ❌ Copy-paste huge code blocks
- ❌ Violate GEMINI.md rules
- ❌ Commit without running lint/tests
- ❌ Forget responsive testing

---

## 📖 Example: Complete Module Flow

### Monday 9:00 AM - Start Session
```
You: "Đọc CONTINUITY.md và GEMINI.md, sau đó cho tôi Ledger Snapshot."

AI: "Ledger Snapshot:
Goal: Optimize Tutor Pro modules to production-ready
Now: Nothing in progress
Next: Student module optimization
Open Questions: None

Suggest: Start Student module (has P0 performance issue)"

You: "OK. Bắt đầu Student module."
```

### Monday 9:05 AM - Create ISSUES.md
```
You: "Đọc CONTINUITY.md và GEMINI.md.

Tạo file frontend/features/student/ISSUES.md theo template ISSUES_CRITERIA.md.

Audit Student module về:
- Performance (target < 2s)
- UX issues
- UI responsive (iPhone SE/16)
- GEMINI.md violations

Vấn đề:
- Student list mất 3s load
- Mobile layout vỡ trên iPhone SE
- Thiếu error handling khi enrollment fail
- Function StudentService.enrollStudent() 85 lines"

AI: [Creates student/ISSUES.md with organized priorities]
"✅ Created student/ISSUES.md
Found:
- 1 P0 (performance)
- 2 P1 (UX + technical debt)
- 1 P2 (UI mobile)

Updated CONTINUITY.md:
Now: 🔄 Student Module - Performance optimization
Working Set: student module"
```

### Monday 9:30 AM - Fix P0 Issue
```
You: "Đọc CONTINUITY.md, GEMINI.md, CLEAN_CODE_CRITERIA.md và student/ISSUES.md.
Fix issue: [P0-Critical] Student list query N+1 problem."

AI: [Analyzes code, suggests solution]
"Found N+1 in StudentRepository.findAll()
Solution: Add @EntityGraph(attributePaths = {"enrollments", "courses"})

Implementing with:
- GEMINI.md: Keep function < 50 lines ✓
- CLEAN_CODE_CRITERIA.md: Add Javadoc ✓
- Test: Add StudentRepositoryTest ✓"

[Implements fix]

AI: "✅ Fixed. Pre-commit checklist:
□ Backend tests: ./mvnw test ✓ (Coverage 65% → 78%)
□ Functions < 50 lines ✓
□ Javadoc added ✓
□ ISSUES.md updated ✓

Performance: 3.2s → 0.7s (P95)

Commit:
fix(student): optimize list query with EntityGraph

- Added @EntityGraph to prevent N+1 problem
- Performance: 3.2s → 0.7s (P95)
- Coverage: 65% → 78%
- Added StudentRepositoryTest"
```

### Tuesday - Continue with P1 Issues
```
You: "Đọc CONTINUITY.md và student/ISSUES.md. Tiếp tục fix enrollment error handling."

AI: [Reads context, continues work following standards]
```

### Friday - Complete Module
```
You: "Đọc student/ISSUES.md. List remaining open issues."

AI: "All P0/P1 issues completed ✓
Remaining: 1 P2 (minor mobile styling)
Ready to complete module."

You: "OK. Complete module Student."

AI: "Creating student/README.md theo README_STRUCTURE_MODULE.md..."
[Creates comprehensive documentation]

"Updating CONTINUITY.md..."

Done:
✅ Student Module optimized (Jan 17, 2026)
  - Performance: 3.2s → 0.7s ✓
  - Coverage: 65% → 87% ✓
  - Mobile: iPhone SE responsive ✓
  - Refactor: 85-line function → 3 services

Commit:
feat(student): complete module optimization

- Performance: 3.2s → 0.7s with EntityGraph + caching
- Coverage: 65% → 87%
- UX: Error handling + toast notifications  
- UI: Mobile responsive (iPhone SE/16)
- Refactor: Split StudentService following SRP
- Docs: Added comprehensive README.md

Closes: All P0/P1 issues in student/ISSUES.md

Next suggested module: Schedule (has P0 booking conflict)"
```

---

## 🔗 File Interdependencies
```
Read First (Context):
├── CONTINUITY.md ────────────┐
└── GEMINI.md ────────────────┤
                              ├──→ Know WHERE you are & HOW to work
Reference (Standards):        │
├── CLEAN_CODE_CRITERIA.md ───┤
└── ISSUES_CRITERIA.md ───────┤
└── README_STRUCTURE_MODULE.md┘

Work Files (Per Module):
├── [module]/ISSUES.md ───────→ Track what to fix
└── [module]/README.md ───────→ Document results

Update After Work:
└── CONTINUITY.md ────────────→ Mark progress, move to next
```

---

## 🎬 Quick Start Checklist

### Day 1: Setup

- [ ] Create `CONTINUITY.md` from template
- [ ] Ensure `GEMINI.md` exists with rules
- [ ] Ensure `CLEAN_CODE_CRITERIA.md` exists
- [ ] Ensure `ISSUES_CRITERIA.md` template exists
- [ ] Ensure `README_STRUCTURE_MODULE.md` template exists

### Day 1: First Module

- [ ] Start session: Read CONTINUITY.md + GEMINI.md
- [ ] Create module ISSUES.md from template
- [ ] Pick P0 issue to fix
- [ ] Work following standards
- [ ] Run pre-commit checklist
- [ ] Update ISSUES.md
- [ ] Commit with proper message

### Week 1: Complete First Module

- [ ] Verify all P0/P1 issues done
- [ ] Create module README.md from template
- [ ] Update CONTINUITY.md (move to Done)
- [ ] Archive completed issues
- [ ] Commit module completion
- [ ] Start next module

---

## 🏆 Success Indicators

You're doing it right when:

✅ Agent always knows context without asking
✅ Code consistently follows GEMINI.md rules
✅ All issues tracked in ISSUES.md with priorities
✅ Commits have meaningful messages with metrics
✅ Modules have complete documentation
✅ CONTINUITY.md shows clear progress
✅ Technical debt is identified and tracked
✅ Performance improvements are measured
✅ Code coverage trends upward

You need to improve when:

❌ Agent asks "what are we working on?"
❌ Code violates GEMINI.md standards
❌ Issues scattered in random notes
❌ Commits say "fix stuff"
❌ No module documentation
❌ CONTINUITY.md outdated
❌ Technical debt hidden/ignored
❌ Performance unmeasured
❌ Tests not written

---

**Version**: 2.0 (Template-based Workflow)  
**Last Updated**: January 11, 2026  
**For**: Tutor Pro Project

**End of Guide** 🚀