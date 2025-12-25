# API Endpoints - Role Permissions

## 🔐 Authentication Endpoints
| Endpoint | Method | Role Required | Description |
|----------|--------|---------------|-------------|
| `/api/auth/register` | POST | None | Register new user |
| `/api/auth/login` | POST | None | Login |
| `/api/auth/refresh-token` | POST | None | Refresh access token |
| `/api/auth/me` | GET | Authenticated | Get current user info |
| `/api/auth/logout` | POST | Authenticated | Logout |

---

## 👨‍🎓 Student Endpoints
| Endpoint | Method | Role Required | Description |
|----------|--------|---------------|-------------|
| `/api/students` | GET | ADMIN, TUTOR | Get all students |
| `/api/students/{id}` | GET | ADMIN, TUTOR | Get student by ID |
| `/api/students` | POST | ADMIN, TUTOR | Create student |
| `/api/students/{id}` | PUT | ADMIN, TUTOR | Update student |
| `/api/students/{id}` | DELETE | ADMIN, TUTOR | Delete student |
| `/api/students/{id}/generate-account` | POST | ADMIN, TUTOR | Generate user account |

---

## 👪 Parent Endpoints
| Endpoint | Method | Role Required | Description |
|----------|--------|---------------|-------------|
| `/api/parents` | GET | ADMIN, TUTOR | Get all parents |
| `/api/parents/{id}` | GET | ADMIN, TUTOR | Get parent by ID |
| `/api/parents` | POST | ADMIN, TUTOR | Create parent |
| `/api/parents/{id}` | PUT | ADMIN, TUTOR | Update parent |
| `/api/parents/{id}` | DELETE | ADMIN, TUTOR | Delete parent |

---

## 📅 Schedule Endpoints
| Endpoint | Method | Role Required | Description |
|----------|--------|---------------|-------------|
| `/api/schedules` | GET | ADMIN, TUTOR | Get all schedules |
| `/api/schedules/{id}` | GET | ADMIN, TUTOR | Get schedule by ID |
| `/api/schedules/student/{id}` | GET | ADMIN, TUTOR | Get schedules by student |
| `/api/schedules` | POST | ADMIN, TUTOR | Create schedule |
| `/api/schedules/{id}` | PUT | ADMIN, TUTOR | Update schedule |
| `/api/schedules/{id}` | DELETE | ADMIN, TUTOR | Delete schedule |

---

## 💰 Finance - Session Records
| Endpoint | Method | Role Required | Description |
|----------|--------|---------------|-------------|
| `/api/sessions` | GET | ADMIN, TUTOR | Get all sessions |
| `/api/sessions/month/{month}` | GET | ADMIN, TUTOR | Get sessions by month |
| `/api/sessions/months` | GET | ADMIN, TUTOR | Get distinct months |
| `/api/sessions/unpaid` | GET | ADMIN, TUTOR | Get unpaid sessions |
| `/api/sessions` | POST | ADMIN, TUTOR | Create session |
| `/api/sessions/{id}` | PUT | ADMIN, TUTOR | Update session |
| `/api/sessions/{id}/toggle-payment` | PUT | ADMIN, TUTOR | Toggle payment status |
| `/api/sessions/{id}/toggle-completed` | PUT | ADMIN, TUTOR | Toggle completed status |
| `/api/sessions/{id}` | DELETE | ADMIN, TUTOR | Delete session |

---

## 💰 Finance - Invoices
| Endpoint | Method | Role Required | Description |
|----------|--------|---------------|-------------|
| `/api/invoices` | GET | ADMIN, TUTOR | Get all invoices |
| `/api/invoices/{id}` | GET | ADMIN, TUTOR | Get invoice by ID |
| `/api/invoices/month/{month}` | GET | ADMIN, TUTOR | Get invoices by month |
| `/api/invoices/generate` | POST | ADMIN, TUTOR | Generate invoice |
| `/api/invoices/{id}/send-email` | POST | ADMIN, TUTOR | Send invoice email |

---

## 📚 Lessons - Admin (ADMIN/TUTOR Only)
| Endpoint | Method | Role Required | Description |
|----------|--------|---------------|-------------|
| `/api/admin/lessons` | GET | **ADMIN, TUTOR** | Get all lessons (including drafts) |
| `/api/admin/lessons/{id}` | GET | **ADMIN, TUTOR** | Get lesson by ID |
| `/api/admin/lessons/student/{id}` | GET | **ADMIN, TUTOR** | Get lessons by student |
| `/api/admin/lessons` | POST | **ADMIN, TUTOR** | Create lesson |
| `/api/admin/lessons/{id}` | PUT | **ADMIN, TUTOR** | Update lesson |
| `/api/admin/lessons/{id}` | DELETE | **ADMIN, TUTOR** | Delete lesson |
| `/api/admin/lessons/{id}/toggle-publish` | PUT | **ADMIN, TUTOR** | Toggle publish status |

---

## 📚 Lessons - Library (Public)
| Endpoint | Method | Role Required | Description |
|----------|--------|---------------|-------------|
| `/api/library/lessons` | GET | Authenticated | Get all library lessons |
| `/api/library/lessons/published` | GET | Authenticated | Get published lessons |
| `/api/library/lessons/{id}` | GET | Authenticated | Get lesson by ID |
| `/api/library/lessons/search` | GET | Authenticated | Search lessons |

---

## 📚 Lessons - Student (STUDENT Only)
| Endpoint | Method | Role Required | Description |
|----------|--------|---------------|-------------|
| `/api/student/lessons` | GET | **STUDENT** | Get my assigned lessons |
| `/api/student/lessons/{id}` | GET | **STUDENT** | Get lesson detail |
| `/api/student/lessons/{id}/complete` | PUT | **STUDENT** | Mark lesson as completed |
| `/api/student/lessons/{id}/view` | PUT | **STUDENT** | Increment view count |

---

## 📝 Homework - Student (STUDENT Only)
| Endpoint | Method | Role Required | Description |
|----------|--------|---------------|-------------|
| `/api/student/homeworks` | GET | **STUDENT** | Get my homeworks |
| `/api/student/homeworks/{id}` | GET | **STUDENT** | Get homework by ID |
| `/api/student/homeworks/stats` | GET | **STUDENT** | Get homework stats |
| `/api/student/homeworks/{id}/status` | PUT | **STUDENT** | Update homework status |
| `/api/student/homeworks/{id}/submit` | POST | **STUDENT** | Submit homework |
| `/api/student/homeworks/upload` | POST | **STUDENT** | Upload homework file |

---

## 📝 Homework - Tutor (ADMIN/TUTOR Only)
| Endpoint | Method | Role Required | Description |
|----------|--------|---------------|-------------|
| `/api/tutor/homeworks` | GET | **ADMIN, TUTOR** | Get all homeworks |
| `/api/tutor/homeworks/student/{id}` | GET | **ADMIN, TUTOR** | Get student homeworks |
| `/api/tutor/homeworks` | POST | **ADMIN, TUTOR** | Create homework |
| `/api/tutor/homeworks/{id}` | PUT | **ADMIN, TUTOR** | Update homework |
| `/api/tutor/homeworks/{id}/grade` | POST | **ADMIN, TUTOR** | Grade homework |
| `/api/tutor/homeworks/{id}` | DELETE | **ADMIN, TUTOR** | Delete homework |
| `/api/tutor/homeworks/search` | GET | **ADMIN, TUTOR** | Search homeworks |

---

## 📄 Documents
| Endpoint | Method | Role Required | Description |
|----------|--------|---------------|-------------|
| `/api/documents` | GET | ADMIN, TUTOR | Get all documents |
| `/api/documents/{id}` | GET | ADMIN, TUTOR | Get document by ID |
| `/api/documents/category/{category}` | GET | ADMIN, TUTOR | Get documents by category |
| `/api/documents/upload` | POST | ADMIN, TUTOR | Upload document |
| `/api/documents/{id}/download` | GET | ADMIN, TUTOR | Download document |
| `/api/documents/{id}` | DELETE | ADMIN, TUTOR | Delete document |
| `/api/documents/stats` | GET | ADMIN, TUTOR | Get document stats |

---

## 📊 Dashboard
| Endpoint | Method | Role Required | Description |
|----------|--------|---------------|-------------|
| `/api/dashboard/stats` | GET | ADMIN, TUTOR | Get dashboard statistics |

---

## 🔑 Quick Reference

### Demo Accounts

| Role | Email | Password | Access |
|------|-------|----------|--------|
| **ADMIN** | admin@tutormanagement.com | password123 | ✅ All endpoints |
| **TUTOR** | tutor@tutormanagement.com | password123 | ✅ All except admin-specific |
| **STUDENT** | student@tutormanagement.com | password123 | ✅ Only student endpoints |

### Common 403 Errors

**Error:** `403 Forbidden - Access Denied`

**Causes:**
1. ❌ Using STUDENT account to access ADMIN/TUTOR endpoints
2. ❌ Using TUTOR account to access STUDENT endpoints
3. ❌ Token expired

**Solutions:**
1. ✅ Login with correct role account
2. ✅ Use appropriate endpoints for your role
3. ✅ Refresh token if expired

---

## 📝 Testing Scenarios

### Scenario 1: ADMIN Testing
```
1. Login as ADMIN
2. Test all endpoints ✅
```

### Scenario 2: TUTOR Testing
```
1. Login as TUTOR
2. Test management endpoints (students, lessons, homework) ✅
3. Cannot access student-specific endpoints ❌
```

### Scenario 3: STUDENT Testing
```
1. Login as STUDENT
2. Test student endpoints (/api/student/*) ✅
3. Test library endpoints (/api/library/*) ✅
4. Cannot access admin/tutor endpoints ❌
```

---

## 🎯 Endpoint Categories by Role

### ADMIN Can Access:
- ✅ All endpoints

### TUTOR Can Access:
- ✅ Students, Parents, Schedules
- ✅ Finance (Sessions, Invoices)
- ✅ Lessons - Admin endpoints
- ✅ Lessons - Library endpoints
- ✅ Homework - Tutor endpoints
- ✅ Documents
- ✅ Dashboard

### STUDENT Can Access:
- ✅ Lessons - Student endpoints
- ✅ Lessons - Library endpoints
- ✅ Homework - Student endpoints
- ✅ Auth endpoints

---

## 💡 Tips

1. **Always check role requirements** before testing endpoints
2. **Use correct account** for the endpoint you're testing
3. **Token is automatically set** after login (if using provided collection)
4. **403 errors** usually mean wrong role, not wrong credentials
5. **401 errors** mean not authenticated or token expired
