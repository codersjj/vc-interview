# Comprehensive Project Test Plan

## 1. Overview & Philosophy
This document outlines the testing strategy for the full-stack application. We follow the **Testing Pyramid** approach to ensure a fast, reliable, and maintainable codebase.

**The Pyramid Strategy:**
* **Unit/Component Tests (~70%):** Fast, isolated, covers logic and UI states.
* **Integration Tests (~20%):** Covers API endpoints, database interactions, and feature workflows.
* **E2E Tests (~10%):** Covers critical "Happy Paths" and user flows in a real browser environment.

## 2. Frontend Testing Strategy (React + Vite)

### 2.1 Unit & Component Testing
**Tools:** `Vitest` + `React Testing Library (RTL)` + `MSW`
* **Vitest:** Test runner compatible with Vite configurations.
* **RTL:** Tests components from a user's perspective (accessibility, interactions).
* **MSW (Mock Service Worker):** Intercepts network requests at the network layer to mock API responses effectively.

**Scope:**
* **Utility Functions:** Pure logic formatters, validators, transformers.
* **Components:** Rendering, props, user events, error states.
* **Hooks:** Custom hook logic in isolation.

**Key Practice:**
* Do not mock `fetch` or `axios` manually; use **MSW** handlers.
* Tests should simulate user behavior (e.g., `userEvent.click`), not implementation details.

### 2.2 Configuration Highlights
* **Environment:** `jsdom`
* **Setup File:** `src/test/setup.ts` (Includes RTL cleanup and MSW server reset).

## 3. Backend Testing Strategy (Node.js + Express)

### 3.1 Unit Testing
**Tools:** `Jest`
**Scope:**
* **Services/Utils:** Business logic independent of the HTTP layer or Database.
* **Middleware:** Authentication and validation logic (mocking `req`, `res`).

### 3.2 Integration Testing (API Level)
**Tools:** `Jest` + `Supertest`
**Scope:**
* **API Endpoints:** Verify HTTP status codes, response payload structure, and headers.
* **Database Interactions:** Verify data persistence and retrieval.

**Database Strategy (Crucial):**
* **Environment:** Use a separate **Test Database** to prevent data corruption in development.
* **Implementation:**
    * *Option A (Recommended):* Use an in-memory database (e.g., SQLite via `better-sqlite3`) for speed.
    * *Option B (Docker):* Spin up a fresh Postgres/Mongo container for the test suite.
* **Lifecycle:** Clear/Reset the database between *every* test case (`beforeEach` / `afterEach`) to ensure isolation.

## 4. End-to-End (E2E) Testing Strategy

**Tools:** `Playwright`
**Scope:** Critical User Journeys (CUJs). These tests verify the system works as a whole (Frontend + Backend + DB).

**Target Scenarios:**
1.  **Authentication:** Sign up, Login, Logout, Session persistence.
2.  **Core Feature:** Dashboard loading, Data extraction flow (Backend email extraction).
3.  **Data Export:** Verifying file download capabilities.
4.  **Cross-Browser:** Verify functionality on Chromium, Firefox, and WebKit.

**Configuration:**
* Run against a local staging build (`npm run build` + `npm run preview`).
* Global setup to seed the database with required test users.

## 5. Quality Metrics & Best Practices

### 5.1 Coverage Goals
We aim for "Meaningful Coverage" over 100% metrics.
* **Global Statements:** > 70%
* **Critical Business Logic:** > 90%
* **UI Components:** > 60% (Focus on interactive components, not static layout).

### 5.2 Performance & Standards
* **Unit Tests:** Should complete in < 30 seconds.
* **E2E Tests:** Should complete in < 5 minutes.
* **Naming Convention:**
    * Files: `*.test.tsx` (Unit/Component), `*.spec.ts` (E2E).
    * Descriptions: Use "should [expected behavior] when [condition]".

### 5.3 AAA Pattern
All tests must follow the **Arrange, Act, Assert** structure:
```javascript
test('should calculate total correctly', () => {
  // Arrange
  const items = [{ price: 10 }, { price: 20 }];
  // Act
  const total = calculateTotal(items);
  // Assert
  expect(total).toBe(30);
});
```

## 6. Implementation Roadmap

### Phase 1: Infrastructure & "Walking Skeleton"

1. FE: Install vitest, jsdom, msw. Create setup.ts.
2. BE: Install jest, supertest. Configure jest.config.js and Test DB connection.
3. Scripts: Add test:unit, test:integration, test:e2e to package.json.

### Phase 2: Critical Path & Smoke Tests

1. BE: Write integration tests for Health Check (/api/health) and Login (/api/auth/login).
2. FE: Write component tests for the Login Form (using MSW to mock success/failure).
3. E2E: Create one Playwright test: User loads app -> Sees Login page.

### Phase 3: CI/CD & Scaling

1. GitHub Actions: Configure workflow to run npm test on PRs.
2. Caching: Cache node_modules in CI to speed up runs.
3. Reporting: Generate HTML coverage reports.

## 7. Recommended Directory Structure

```Plaintext
root/
├── frontend/
│   ├── src/
│   │   ├── mocks/
│   │   │   ├── handlers.ts      <-- MSW Request Handlers
│   │   │   └── server.ts        <-- MSW Server Setup
│   │   ├── components/
│   │   │   ├── LoginForm.tsx
│   │   │   └── LoginForm.test.tsx  <-- Colocated Component Test
│   │   └── utils/
│   │       └── format.test.ts
│   ├── vitest.setup.ts
│   └── vite.config.ts
├── backend/
│   ├── src/
│   ├── tests/
│   │   ├── integration/
│   │   │   ├── auth.test.js     <-- API/DB Tests
│   │   │   └── users.test.js
│   │   └── unit/
│   │       └── emailParser.test.js
│   ├── jest.config.js
│   └── package.json
└── playwright/                  <-- Separate E2E Directory
    ├── tests/
    │   └── login.spec.ts
    └── playwright.config.ts
```
