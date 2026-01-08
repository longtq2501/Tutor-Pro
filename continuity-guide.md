# CONTINUITY LEDGER - QUICK REFERENCE GUIDE

## 1. FILE STRUCTURE

### CONTINUITY.md (Root project)
Location: `project-root/CONTINUITY.md`
```markdown
# [Project Name] Continuity Ledger

## Goal
[Main objective - What you're trying to achieve]
- Success criteria 1
- Success criteria 2

## Constraints
- Technical constraints (tech stack, infrastructure limits)
- Business constraints (time, resources, budget)
- Team constraints (solo dev, part-time, etc.)

## Key Decisions
- Architecture decisions
- Technology choices
- Important trade-offs made

## State

### Done:
- ✅ Completed milestone 1
- ✅ Completed milestone 2

### Now:
- 🔄 Current focus: [Module name] - [What you're doing]

### Next:
- ⏭️ Planned work 1
- ⏭️ Planned work 2

## Open Questions (Optional)
- Question 1? (UNCONFIRMED)
- Question 2? (UNCONFIRMED)

## Working Set
Current module: [module-name]
Active files: 
- path/to/file1
- path/to/file2
Focus: [Specific area of work]
```

---

### ISSUES.md (Per module)
Location: `frontend/features/{module-name}/ISSUES.md`
```markdown
# [Module Name] - Issues & Optimization

## Performance Issues
- [ ] [P0-Critical] Issue description
  - Root cause: ...
  - Target: ...
  - Metrics: ...
- [ ] [P1-High] Issue description

## UX Issues
- [ ] [P1-High] Issue description
- [ ] [P2-Medium] Issue description

## UI Issues
- [ ] [P2-Medium] Issue description
- [ ] [P3-Low] Issue description

## Technical Debt (Optional)
- [ ] Code smell 1
- [ ] Refactor needed 2

---

## Completed Work (Archive)
- [x] [P0-Critical] Fixed issue
  - Solution: ...
  - Performance impact: X → Y
  - Tested: ✅
```

---

## 2. PRIORITY LEVELS

| Level | Name | When to Use | Action Timeline |
|-------|------|-------------|-----------------|
| **P0** | Critical | Blocks core functionality, data loss, security issue, or massive performance hit | Fix immediately (today) |
| **P1** | High | Significant user impact, major UX degradation, scalability blocker | Fix this week |
| **P2** | Medium | Minor annoyance, workaround exists, affects small % of users | Fix when available |
| **P3** | Low | Polish, aesthetic, nice-to-have improvements | Backlog (may never fix) |

### Decision Framework:
Ask yourself:
1. **Does it block users?** → P0
2. **Will users complain frequently?** → P1
3. **Is it just annoying but workable?** → P2
4. **Would it just be nicer?** → P3

---

## 3. WORKFLOW

### Starting a New Module

**Step 1:** Update CONTINUITY.md
```markdown
### Now:
- 🔄 [Module Name]: [Brief description of work]
```

**Step 2:** Create ISSUES.md
```
Prompt to AI:
"Đọc CONTINUITY.md.

Tôi muốn tối ưu module [Module Name]. Các vấn đề:
[Describe issues in Vietnamese - natural language]

Hãy:
1. Phân loại thành Performance/UX/UI issues
2. Tạo file frontend/features/[module]/ISSUES.md bằng tiếng Anh
3. Đánh priority P0/P1/P2/P3 dựa trên impact
4. Suggest metrics và solutions"
```

**Step 3:** Work on Issues
```
Prompt to AI:
"Đọc CONTINUITY.md và features/[module]/ISSUES.md.
Bắt đầu fix [specific issue].
[Paste relevant code if needed]"
```

**Step 4:** Update Progress
```
Mark checkbox in ISSUES.md:
- [x] [P0-Critical] Issue fixed
  - Solution: [What you did]
  - Metrics: Before → After
  - Tested: ✅

Commit:
git commit -m "fix(module): brief description"
```

**Step 5:** When Module Complete
```
Update CONTINUITY.md:

### Done:
- ✅ [Module Name] optimized: [Key achievements + metrics]

### Now:
- 🔄 [Next Module]: ...
```

---

### Handling Ad-hoc Issues (During Work)

**When you discover new issues:**
```
Prompt to AI:
"Đọc ISSUES.md.

Vừa phát hiện thêm vấn đề:
[Describe issue in Vietnamese]

Hãy:
1. Translate sang tiếng Anh professional
2. Add vào đúng section (Performance/UX/UI)
3. Đánh priority phù hợp
4. Update ISSUES.md"
```

**When you fix an ad-hoc issue on the spot:**
```
Prompt to AI:
"Update ISSUES.md:
Vừa fix xong vấn đề: [describe]
Solution: [what you did]
Mark as done và ghi metrics nếu có."
```

---

## 4. AI PROMPTS CHEAT SHEET

### Initial Setup
```
"Đọc CONTINUITY.md.
Tạo file frontend/features/[module]/ISSUES.md.
Audit [module] về performance, UX, UI.
[Optional: Paste specific concerns in Vietnamese]"
```

### Start Working
```
"Đọc CONTINUITY.md và features/[module]/ISSUES.md.
Fix issue: [specific issue from list].
Current code: [paste if needed]"
```

### Add New Issue
```
"Đọc ISSUES.md.
Thêm issue mới: [Vietnamese description].
Classify và đánh priority."
```

### Update Progress
```
"Update ISSUES.md:
✅ Fixed [issue name]
Solution: [brief description]
Metrics: [before] → [after]"
```

### Resume After Break
```
"Đọc CONTINUITY.md.
Tóm tắt progress gần nhất và suggest next step."
```

### Complete Module
```
"Đọc CONTINUITY.md và ISSUES.md.
Module [name] đã xong. Update CONTINUITY.md:
- Move to Done
- Add metrics/achievements
- Clear Working Set"
```

---

## 5. BEST PRACTICES

### DO:
✅ Update CONTINUITY.md when switching modules  
✅ Use checkboxes [ ] in ISSUES.md for tracking  
✅ Include metrics (before → after) when marking done  
✅ Commit with meaningful messages referencing issue  
✅ Archive completed phases when ISSUES.md gets too long  
✅ Use Vietnamese naturally when describing problems  
✅ Let AI translate and structure professionally  

### DON'T:
❌ Update every tiny code change in ledger  
❌ Make CONTINUITY.md too detailed (keep high-level)  
❌ Forget to mark [x] done items  
❌ Skip priority labels (you'll lose focus)  
❌ Let ISSUES.md become stale (update as you work)  
❌ Copy-paste huge code blocks into ledger files  

---

## 6. EXAMPLE REAL WORKFLOW

**Monday Morning:**
```
You: "Đọc CONTINUITY.md. Bắt đầu Exercise module.
Vấn đề: Upload file 10MB mất 1 phút, scroll lag, mobile vỡ layout."

AI: [Creates ISSUES.md with organized priorities]

You: "OK. Bắt đầu fix P0 upload issue."
[Work, fix, commit]

You: "Update ISSUES.md: ✅ Upload optimized 60s → 8s using chunked upload"
```

**Wednesday:**
```
You: "Đọc CONTINUITY.md và ISSUES.md.
Tiếp tục fix scroll lag."
[Work continues]
```

**Friday:**
```
You: "Exercise module xong. Update CONTINUITY.md:
Done: Exercise optimized (upload 60s→8s, scroll smooth, mobile fixed)
Now: Schedule module"
```

---

## 7. EMERGENCY REFERENCE

**Forgot where you were?**
```
"Đọc CONTINUITY.md. 
Tôi đang làm gì? Suggest next step."
```

**ISSUES.md too messy?**
```
"Reorganize ISSUES.md:
- Move completed items to bottom (Archive section)
- Keep active items at top
- Re-prioritize if needed"
```

**Lost motivation?**
```
"Đọc CONTINUITY.md.
Show me progress summary: modules done vs remaining."
```

---

## 8. FILE LOCATIONS SUMMARY
```
project-root/
├── CONTINUITY.md                          # Master ledger
├── frontend/
│   └── features/
│       ├── document/
│       │   └── ISSUES.md                 # Document module issues
│       ├── exercise/
│       │   └── ISSUES.md                 # Exercise module issues
│       └── schedule/
│           └── ISSUES.md                 # Schedule module issues
└── backend/
    └── modules/
        └── [same pattern if needed]
```

---

## 9. QUICK START TEMPLATE

**Copy this to start today:**
```markdown
# [Your Project] Continuity Ledger

## Goal
Upgrade from "functional" to "production-ready"
- Performance: < 2s page loads
- UX: Proper states & error handling  
- UI: Mobile responsive

## Constraints
- Solo developer, part-time
- Tech stack: [Your stack]
- [Other constraints]

## State

### Done:
- ✅ Core features functional

### Now:
- 🔄 [First module to optimize]

### Next:
- ⏭️ [Other modules]

## Working Set
Current module: [module-name]
Focus: [specific area]
```

Save this, commit, and start working! 🚀