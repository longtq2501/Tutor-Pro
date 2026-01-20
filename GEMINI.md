# Global Antigravity Rules - Tutor Pro

## Project Context
- EdTech platform for tutor management with AI-powered features
- Tech stack: Next.js 15 + Spring Boot 3.4.1 + MySQL 8.0
- Architecture: Feature-based Frontend + Modular Monolith Backend
- Hosted on Railway (free tier constraints apply)

## Build & Execution

### Frontend (Next.js 15)
1. Use `npm` (v10+) for all package management
2. Build command: `npm run build`
3. Dev server: `npm run dev`
4. Lint before commit: `npm run lint`

### Backend (Spring Boot 3.4.1)
1. Use Maven wrapper: `./mvnw` (never global `mvn`)
2. Test command: `./mvnw test`
3. Build command: `./mvnw clean install`
4. Run: `./mvnw spring-boot:run`

## Architecture Rules

### Frontend Structure
1. Follow Feature-based architecture in `frontend/features/`
2. Shared UI components go in `frontend/components/`
3. Routes in `frontend/app/` (Next.js App Router)
4. Never mix business logic with UI components

### Backend Structure
1. Maintain Modular Monolith architecture
2. Keep modules independent in `backend/src/main/java/`
3. **CRITICAL**: OSIV (Open Session In View) must remain DISABLED
4. Use JPA/Hibernate properly with explicit transaction boundaries

## Code Quality Standards

### Naming Conventions
1. Variables/Functions: `camelCase`
2. Classes/Types: `PascalCase`
3. Constants: `UPPER_SNAKE_CASE`
4. Files: Match class names exactly

### Code Design Principles
1. Follow Single Responsibility Principle (SRP)
2. Use Return Early pattern
3. Function length: Target 10-20 lines, Max 50 lines
4. Apply modern Java features: Streams, Optional, records
5. Refer to `CLEAN_CODE_CRITERIA.md` for detailed standards

### Performance Requirements
1. Page load time: < 2 seconds
2. API response time (P95): < 2 seconds
3. Code coverage target: 80%+

## Technology Constraints

### Must Use
1. **Frontend**: Shadcn/UI components, Tailwind CSS 4, Lucide React icons
2. **Backend**: Spring Boot 3.4.1, Java 21 features
3. **Database**: MySQL 8.0 with connection pooling awareness

### Must NOT Use
1. Class components in React (use functional components only)
2. Global state management without proper justification
3. Direct SQL queries (use JPA/Hibernate)
4. OSIV pattern (keep disabled)

### Database Constraints
1. Be mindful of connection pool limits (Railway free tier)
2. Always close resources properly
3. Use pagination for large datasets
4. Optimize queries before deployment

## Responsive Design
1. All UI must work on iPhone SE (375x667)
2. Test on iPhone 16 viewport
3. Use Tailwind responsive utilities
4. Mobile-first approach

## Testing Requirements

### Backend
1. Write JUnit 5 tests for all business logic
2. Use Spring Boot Test for integration tests
3. Run `./mvnw test` before committing
4. Target 80%+ code coverage

### Frontend
1. Run `npm run lint` before committing
2. Fix all ESLint errors (warnings are negotiable)
3. TODO: Implement Vitest/Jest when prioritized

## Workflow & Documentation

### Ledger System
1. Update `CONTINUITY.md` for project-level changes
2. Update module-specific `ISSUES.md` for technical debt
3. Never guess - mark unknown info as `UNCONFIRMED`

### Issue Management
1. Classify issues: `Performance`, `UX`, `UI`, `Technical Debt`
2. Prioritize: P0 (Critical) → P1 (High) → P2 (Medium) → P3 (Low)
3. Document root cause and solution approach

### Commit Messages
1. Format: `type(module): description`
2. Examples:
   - `fix(finance): optimize invoice query`
   - `feat(student): add learning path visualization`
   - `refactor(auth): extract JWT validation logic`

### Documentation
1. Add JSDoc for all exported functions (Frontend)
2. Add Javadoc for all public APIs (Backend)
3. Update README when adding new features
4. Document architectural decisions in relevant files

## File Restrictions
1. **DO NOT modify**:
   - `pom.xml` without approval (dependency changes need review)
   - Database migration files once applied
   - `next.config.ts` (needs careful testing)
2. **Careful with**:
   - `CONTINUITY.md` (follow format strictly)
   - Config files (always backup before changes)

## Before Every Commit
1. Run linter: `npm run lint` (Frontend)
2. Run tests: `./mvnw test` (Backend)
3. Check `CONTINUITY.md` is updated if needed
4. Verify no console.log/System.out left in code
5. Ensure responsive design works on target devices

## AI Agent Specific
1. Always read `CONTINUITY.md` at start of session
2. Ask clarifying questions before major refactors
3. Provide rollback plan for risky changes
4. Explain trade-offs when multiple solutions exist
5. Update ledger when making architectural decisions