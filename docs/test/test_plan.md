# Project Test Plan

## 1. Overview
This document outlines the testing strategy for the full-stack application (React Frontend + Node.js/Express Backend). The goal is to ensure code quality, prevent regressions, and facilitate safe refactoring.

## 2. Frontend Testing Strategy (React + Vite)

### 2.1 Unit & Component Testing
**Tools:** `Vitest` + `React Testing Library`
- **Vitest**: A blazing fast unit test framework powered by Vite. It integrates seamlessly with the existing Vite configuration.
- **React Testing Library**: Focuses on testing components from the user's perspective (rendering, clicking, typing).

**Scope:**
- **Utility Functions**: Test pure logic (e.g., formatters, validators).
- **Components**: Test rendering, user interactions, and state updates.
- **Hooks**: Test custom hooks behavior.

**Example Test File Location:** `frontend/src/__tests__` or `*.test.tsx` alongside components.

### 2.2 End-to-End (E2E) Testing
**Tools:** `Playwright`
- **Why**: You are already using Playwright in the backend for email extraction. It is robust, fast, and handles modern web features well.

**Scope:**
- Critical user flows (e.g., Login, Dashboard navigation, Data export).
- Cross-browser compatibility.

## 3. Backend Testing Strategy (Node.js + Express)

### 3.1 Unit & Integration Testing
**Tools:** `Jest` + `Supertest`
- **Jest**: The standard testing framework for Node.js.
- **Supertest**: For testing HTTP endpoints (Integration tests).

**Scope:**
- **API Endpoints**: Verify request/response structure, status codes, and error handling using `Supertest`.
- **Controllers/Services**: Unit test business logic in isolation.
- **Database Models**: Verify schema validation and static methods (if complex).

**Example Test File Location:** `backend/tests` or `*.test.js` alongside source files.

## 4. Implementation Roadmap

### Phase 1: Infrastructure Setup
1.  **Frontend**: Install `vitest`, `jsdom`, `@testing-library/react`. Configure `vite.config.ts`.
2.  **Backend**: Install `jest`, `supertest`, `cross-env`. Configure `jest.config.js`.

### Phase 2: Critical Path Testing
1.  **Frontend**: Write smoke tests for `App.tsx` and main pages.
2.  **Backend**: Write integration tests for health check and core API endpoints.

### Phase 3: CI/CD Integration
- Configure GitHub Actions (or other CI) to run `npm test` on Pull Requests.

## 5. Recommended Directory Structure

```text
frontend/
  src/
    components/
      Button.tsx
      Button.test.tsx  <-- Colocation
backend/
  src/
  tests/
    integration/
      auth.test.js
    unit/
      utils.test.js
```
