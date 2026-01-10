# CLEAN CODE STANDARDS - UNIVERSAL GUIDELINES

## CORE PRINCIPLE
Code is written once but read many times. Optimize for readability and maintainability, not cleverness.

---

## 1. DOCUMENTATION & COMMENTS

### File Header (OPTIONAL)
- Brief description of file's purpose and main responsibilities
- Only add if file purpose is not obvious from filename/structure

### Function/Method Documentation (REQUIRED for public APIs)
**Document these 3 things:**
1. **Purpose**: What does this do?
2. **Parameters**: What inputs does it expect? Any constraints?
3. **Returns/Throws**: What does it produce? What errors can occur?

**Format by language:**
- Java/C#: `/** Javadoc */`
- Python: `"""Docstring"""`
- JavaScript/TypeScript: `/** JSDoc */`
- Go: `// Comment above function`

### Inline Comments (Use SPARINGLY - only for WHY, not WHAT)

**✅ GOOD - Explains WHY:**
```
// Using POST instead of GET to avoid URL length limits with large filters
// Retry 3 times because external API has intermittent connection issues
// Offset by 7 hours to account for Vietnam timezone (UTC+7)
```

**❌ BAD - States the obvious WHAT:**
```
// Increment counter by 1
// Loop through array
// Call API
```

**When to comment:**
- Complex business logic or algorithms
- Non-obvious technical decisions
- Workarounds for bugs/limitations
- TODO/FIXME with context and owner
- Security-sensitive code
- Performance optimizations

**When NOT to comment:**
- Code that is self-explanatory
- Redundant descriptions of what code clearly does
- Outdated information (delete old comments!)

---

## 2. NAMING CONVENTIONS

### Universal Rules
- Names must reveal intent - no one should need to guess
- Use pronounceable names you can discuss verbally
- Use searchable names (avoid single letters except loop counters)
- Avoid mental mapping - explicit is better than implicit

### Variables & Functions

**Style by language:**
- Java, JavaScript, TypeScript, C#: `camelCase`
- Python, Ruby, Rust: `snake_case`
- Go: `camelCase` (exported) or `lowercase` (package-private)

**Boolean variables:**
- Prefix with `is`, `has`, `can`, `should`, `will`
- Examples: `isActive`, `hasPermission`, `canEdit`, `shouldRetry`

**Function names:**
- Use verbs: `calculateTotal`, `sendEmail`, `validateInput`
- Be specific: `getUserById` not `get`, `deleteExpiredTokens` not `cleanup`

**Examples:**
```
✅ GOOD:
- userAuthenticationToken
- calculateMonthlyRevenue()
- isEligibleForDiscount
- fetchActiveSubscriptions()

❌ BAD:
- data, info, temp, obj, arr (too generic)
- get(), process(), handle() (too vague)
- flg, usr, mgr (unclear abbreviations)
```

### Classes/Types
- **PascalCase** in all languages: `UserService`, `OrderRepository`, `PaymentProcessor`
- Nouns or noun phrases: `Customer`, `InvoiceGenerator`
- Avoid generic names: `Manager`, `Helper`, `Utility` (be more specific)

### Constants
- **UPPER_SNAKE_CASE**: `MAX_RETRY_COUNT`, `API_BASE_URL`, `DEFAULT_TIMEOUT`
- Place at top of file/class with comments if values aren't self-evident

### Avoid Abbreviations
```
❌ BAD: usrMgr, notifSvc, tmpVar
✅ GOOD: userManager, notificationService, temporaryVariable
```

---

## 3. FUNCTION/METHOD DESIGN

### Single Responsibility Principle
- One function = one clear, specific job
- If you use "and" to describe it, split it into multiple functions
- Example: `validateAndSaveUser()` → split to `validateUser()` + `saveUser()`

### Function Length
- **Target**: 10-20 lines
- **Maximum**: 50 lines (if longer, refactor into smaller functions)
- If you need to scroll to see entire function, it's too long

### Function Parameters
- **Ideal**: 0-2 parameters
- **Acceptable**: 3 parameters
- **Avoid**: 4+ parameters (use object/struct/config instead)

**Bad:**
```javascript
createUser(firstName, lastName, email, phone, address, city, country, zipCode)
```

**Good:**
```javascript
createUser(userProfile) // userProfile is object with all fields
```

### Levels of Abstraction
- Keep consistent abstraction level within a function
- Don't mix high-level logic with low-level details

**Bad:**
```python
def process_order(order):
    validate_order(order)  # high-level
    sql = "INSERT INTO..."  # low-level SQL in same function
    db.execute(sql)
```

**Good:**
```python
def process_order(order):
    validate_order(order)  # high-level
    save_order(order)      # high-level - hides SQL details
```

### Return Early Pattern
- Handle edge cases and errors first
- Reduce nesting depth

**Bad:**
```javascript
function processPayment(amount) {
    if (amount > 0) {
        if (userHasBalance(amount)) {
            if (paymentGatewayAvailable()) {
                // actual logic here
            }
        }
    }
}
```

**Good:**
```javascript
function processPayment(amount) {
    if (amount <= 0) return error("Invalid amount");
    if (!userHasBalance(amount)) return error("Insufficient balance");
    if (!paymentGatewayAvailable()) return error("Gateway unavailable");
    
    // actual logic here - no nesting
}
```

---

## 4. ERROR HANDLING

### Always Validate Inputs
- Check at function entry point
- Fail fast with clear error messages
- Never assume inputs are valid
```python
def divide(a, b):
    if b == 0:
        raise ValueError("Divisor cannot be zero")
    return a / b
```

### Use Specific Exceptions/Errors
```
❌ BAD:  throw new Error("Something went wrong")
✅ GOOD: throw new UserNotFoundException(`User ${userId} not found`)
```

### Never Silently Ignore Errors
```javascript
// ❌ BAD
try {
    sendEmail(user);
} catch (e) {
    // Silent - error lost forever
}

// ✅ GOOD
try {
    sendEmail(user);
} catch (e) {
    logger.error(`Failed to send email to ${user.email}: ${e.message}`);
    throw new EmailDeliveryException(user.email, e);
}
```

### Log Errors with Context
Include relevant IDs, user info, operation details:
```
logger.error("Payment processing failed", {
    userId: user.id,
    amount: amount,
    transactionId: txId,
    error: error.message
});
```

---

## 5. CODE FORMATTING

### Consistency is Key
- Use project's existing style (check .editorconfig, .prettierrc, etc.)
- Use automated formatters: Prettier, Black, gofmt, rustfmt

### Line Length
- **Target**: 80-100 characters
- **Maximum**: 120 characters
- Break long lines logically

### Indentation
- **Spaces over tabs** (most standards)
- **2 spaces**: JavaScript, TypeScript, Ruby, HTML, CSS
- **4 spaces**: Python, Java, C#, PHP
- Configure editor to insert spaces when pressing Tab

### Whitespace
```python
# ✅ GOOD - readable spacing
def calculate_total(items, discount_rate):
    subtotal = sum(item.price * item.quantity for item in items)
    discount = subtotal * discount_rate
    total = subtotal - discount
    return total

# ❌ BAD - cramped
def calculate_total(items,discount_rate):
    subtotal=sum(item.price*item.quantity for item in items)
    discount=subtotal*discount_rate
    total=subtotal-discount
    return total
```

### Blank Lines
- One blank line between functions
- One blank line between logical blocks within function
- Two blank lines between class definitions (Python)

---

## 6. DRY PRINCIPLE (Don't Repeat Yourself)

### Extract Repeated Code
**Bad:**
```javascript
// Payment calculation repeated 3 times
const orderTotal = order.subtotal + order.tax + order.shipping;
const invoiceTotal = invoice.subtotal + invoice.tax + invoice.shipping;
const cartTotal = cart.subtotal + cart.tax + cart.shipping;
```

**Good:**
```javascript
function calculateTotal(item) {
    return item.subtotal + item.tax + item.shipping;
}

const orderTotal = calculateTotal(order);
const invoiceTotal = calculateTotal(invoice);
const cartTotal = calculateTotal(cart);
```

### Magic Numbers → Constants
```python
# ❌ BAD
if user.age >= 18:
    if order.amount > 1000:
        
# ✅ GOOD
LEGAL_AGE = 18
HIGH_VALUE_THRESHOLD = 1000

if user.age >= LEGAL_AGE:
    if order.amount > HIGH_VALUE_THRESHOLD:
```

---

## 7. SECURITY & BEST PRACTICES

### Input Validation
- Validate ALL external inputs (user input, API calls, file reads)
- Sanitize data before using in queries/commands
- Use parameterized queries, never string concatenation

### Authorization Checks
```python
def delete_post(post_id, user_id):
    post = get_post(post_id)
    
    # ✅ Always verify ownership
    if post.author_id != user_id:
        logger.warning(f"User {user_id} attempted to delete post {post_id} owned by {post.author_id}")
        raise UnauthorizedException("Cannot delete other user's post")
    
    delete(post)
```

### Sensitive Data
- Never log passwords, tokens, credit cards
- Use placeholders: `logger.info(f"User logged in: {user.email}")` not full session token

### Null/None Safety
- Check before accessing properties
- Use language features: Optional (Java), ?. operator (JS), Option (Rust)

---

## 8. LANGUAGE-SPECIFIC PATTERNS

### Python
- Use list comprehensions for simple transformations
- Use context managers (`with` statements) for resources
- Follow PEP 8 style guide

### JavaScript/TypeScript
- Use `const` by default, `let` when needed, never `var`
- Prefer arrow functions for callbacks
- Use async/await over promise chains
- Destructure objects for cleaner code

### Java
- Use streams for collection operations
- Prefer immutability (`final` keyword)
- Use try-with-resources for auto-closing

### Go
- Handle errors explicitly, don't ignore
- Use defer for cleanup
- Keep interfaces small

---

## 9. THINGS TO AVOID

### ❌ Deep Nesting
```javascript
// BAD - 4 levels deep
if (user) {
    if (user.isActive) {
        if (user.hasPermission) {
            if (order.isPaid) {
                // logic
            }
        }
    }
}

// GOOD - flat
if (!user) return;
if (!user.isActive) return;
if (!user.hasPermission) return;
if (!order.isPaid) return;
// logic
```

### ❌ God Classes/Functions
- Classes with 1000+ lines → split into smaller classes
- Functions with 100+ lines → extract smaller functions

### ❌ Premature Optimization
- Write clear code first
- Optimize only when profiling shows bottleneck
- "Premature optimization is the root of all evil" - Donald Knuth

### ❌ Clever Code
```python
# ❌ TOO CLEVER - what does this do?
result = [x for x in range(100) if x % 3 == 0 if x % 5 != 0]

# ✅ CLEAR
def is_divisible_by_three_not_five(n):
    return n % 3 == 0 and n % 5 != 0

result = [x for x in range(100) if is_divisible_by_three_not_five(x)]
```

---

## 10. CODE REVIEW CHECKLIST

Before submitting code, ask yourself:

- [ ] Can someone understand this without asking me?
- [ ] Are all public functions documented?
- [ ] Are variable/function names descriptive?
- [ ] Is each function doing only one thing?
- [ ] Are all inputs validated?
- [ ] Are errors handled properly with context?
- [ ] Are there any magic numbers that should be constants?
- [ ] Is there duplicated code that should be extracted?
- [ ] Are security checks in place (auth, input sanitization)?
- [ ] Have I removed commented-out code and debug statements?
- [ ] Does this follow the project's existing patterns?

---

## AUTOMATION TOOLS

Use these to enforce standards automatically:

### Linters (catch issues)
- **JavaScript/TypeScript**: ESLint
- **Python**: Pylint, Flake8, Ruff
- **Java**: Checkstyle, SpotBugs
- **Go**: golint, staticcheck
- **Rust**: Clippy

### Formatters (fix style)
- **JavaScript/TypeScript**: Prettier
- **Python**: Black, autopep8
- **Java**: google-java-format
- **Go**: gofmt
- **Rust**: rustfmt

### Setup Pre-commit Hooks
Automatically check code before git commit using:
- **husky** (JavaScript)
- **pre-commit** (Python)
- Git hooks for any language

---

## REMEMBER

1. **Code is communication** - write for humans first, machines second
2. **Clarity > Cleverness** - simple and obvious beats smart and obscure
3. **Consistency matters** - follow project conventions even if you disagree
4. **Clean code is maintained code** - it's easier to change and less buggy
5. **Refactor continuously** - leave code better than you found it

> "Any fool can write code that a computer can understand. Good programmers write code that humans can understand." - Martin Fowler

---

## WHEN TO USE THIS GUIDE

1. **Writing new code** - apply all standards from the start
2. **Code review** - use checklist to review others' code
3. **Refactoring** - improve existing code section by section
4. **Teaching** - share with junior developers
5. **AI prompts** - paste relevant sections when asking AI to write code

---

**Version**: 1.0  
**Last Updated**: January 2026  
**Maintain this file**: Update when team agrees on new standards
```

---

## CÁCH SỬ DỤNG VỚI AI AGENT

### Option 1: Thêm vào System Prompt
```
You are an expert developer. Always follow clean code standards defined in CLEAN_CODE_CRITERIA.md when writing or reviewing code.

[Paste nội dung file CLEAN_CODE_CRITERIA.md ở đây]
```

### Option 2: Reference trong mỗi request
```
Review/Write this code following CLEAN_CODE_CRITERIA.md standards:

[Your code here]

Focus on:
- Documentation (Javadoc/docstrings)
- Naming conventions
- Error handling
- Security checks
- Code organization