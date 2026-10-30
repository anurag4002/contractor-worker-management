# Testing Strategy — Contractor Worker Management

## Purpose

Define a verifiable, evidence-based testing process for the Contractor Worker Management application across backend and frontend surfaces, covering unit, service, API, integration, component, end-to-end, acceptance, regression, security, performance, accessibility, reliability, data-integrity, and manual testing where applicable.

## Testing modes

### Feature / Regression mode

Used when the request concerns a specific bug fix or feature.

Required coverage:

1. The changed behavior.
2. Neighboring workflows affected by the change.
3. Relevant cross-layer interactions (frontend → API → service → repository).
4. Regression risks and previously working behavior.

A targeted test run must never be described as proof that the whole project is tested.

### Project-wide mode

Used when the request is to audit or improve QA coverage for the entire application.

Required activities:

1. Inventory every module in the module map.
2. Discover all configured test suites and commands.
3. Build a module-by-testing-type coverage matrix.
4. Assess applicable testing types per module.
5. Run supported checks and record results.
6. Document missing or blocked coverage.

## Comprehensive testing types

For each type, record status using: `COVERED`, `PARTIAL`, `MISSING`, `BLOCKED`, or `NOT APPLICABLE` (each with evidence or rationale).

1. **Static quality checks** — lint, formatting, build, type checking (if configured), dependency/security scans (if available). Status source: commands and exit codes.
2. **Unit testing** — pure functions, utilities, validators, boundary conditions, calculations, error cases.
3. **Service / business-logic testing** — business rules, state transitions, salary calculations, permissions, data transformations.
4. **API and contract testing** — routes, HTTP methods, validation, response shapes, status codes, errors, pagination, backward compatibility.
5. **Database integration testing** — persistence, repository queries, relationships, constraints, soft deletion, transactions, tenant scoping.
6. **Component and UI testing** — forms, validation, tables, modals, loading/empty/error states, visible results. Requires real frontend test infrastructure.
7. **End-to-end testing** — supported browser workflows; requires real frontend/E2E setup.
8. **Acceptance testing** — Given/When/Then business scenarios mapped to acceptance criteria.
9. **Regression testing** — previously working behavior affected by a change, neighboring features, repeated submissions, partial operations.
10. **Smoke and sanity testing** — startup, health endpoint, login, critical navigation, essential workflows appropriate to environment.
11. **Security testing** — auth, authorization, roles/permissions, tenant isolation, IDOR, validation, sensitive-data exposure, session/token behavior. Security-sensitive flows (authN/authZ, tenant isolation, personal data, financial operations) must verify real paths: JWT verification with real signing using test-only secrets, authorization middleware, tenant-scoped queries, input validation; unit tests with mocks do not substitute for these checks.
12. **Data integrity and financial testing** — salary calculations, rounding, partial/full payments, outstanding balances, duplicate operations, idempotency, relationships, PDF/Excel exports.
13. **Accessibility testing** — keyboard, labels, focus, contrast, dialogs, form errors, WCAG-oriented checks.
14. **Responsive and compatibility testing** — viewport sizes, browsers, keyboard/touch, layout.
15. **Performance testing** — response-time baselines, load, stress, soak in approved non-production environment.
16. **Resilience and reliability testing** — outages, timeouts, retries, recovery, concurrency, race conditions, partial failures.
17. **Property-based, fuzz, boundary, and mutation testing** — where meaningful and supported by available tools.
18. **Manual exploratory testing** — uncertain UI behavior not yet automatable; clearly labeled manual, not automated.

## Status vocabulary

- `COVERED` — implemented and executed (or otherwise verified) with evidence.
- `PARTIAL` — some scenarios covered; meaningful gaps remain.
- `MISSING` — no coverage found.
- `BLOCKED` — implementation cannot be tested in current environment.
- `NOT APPLICABLE` — category not applicable to the module/scope, with reason.

## Module map requirements

For each application module, record relevant frontend and backend artifacts:

- Authentication and session handling.
- Users, roles, permissions.
- Tenants, onboarding, tenant isolation.
- Worker profiles and validation.
- Site and worker assignments.
- Attendance, histories, summaries.
- Payroll generation, editing, recalculation, advances, salary payments.
- Payment history and salary slips.
- Dashboard totals/charts.
- Reports and PDF/Excel exports.
- Notifications.
- Subscription plans, subscriptions, subscription payments.
- Platform/super-admin operations.
- Shared middleware, validation, database handling, API config, rate limiting, error handling.

## Repository-specific notes

- Backend: Jest 30, Supertest, MongoDB Memory Server, ES modules; `npm test` = `NODE_OPTIONS=--experimental-vm-modules jest`.
- Frontend: build/lint scripts and Playwright installed; no standard frontend test script confirmed. Do not invent frontend test commands or mark UI/E2E coverage as passed without infrastructure.
- Financial and security checks must not run against production or trigger real payments.

## Reporting rules

- Distinguish: implemented, executed, passed, failed, blocked, not run, missing tooling, not applicable.
- Never mark a test passed that did not run.
- Never mark coverage as present without evidence.

## Execution order per task type

- Feature / regression: targeted → related → regression → broader as risk dictates.
- Project-wide: static checks → unit/service → API/DB → component where possible → E2E where possible → security → regression → smoke → reporting.

## Final QA workflow

Every QA workflow — feature or project-wide — follows these stages in order:

1. **Investigation** — Code Auditor.
2. **Planning** — Test Planner.
3. **Implementation** — Test Writer.
4. **Execution** — Test Runner.
5. **Security review** — Security Reviewer (authentication, authorization, tenant isolation, personal data, financial operations; `NOT APPLICABLE` with reason for unrelated low-risk changes).
6. **Independent review** — Quality Reviewer.
7. **Consolidation** — QA Orchestrator.

A feature must not be reported as fully verified while important tests are failing, missing,
blocked, or not executed.

## Final instruction

This strategy is the shared source of truth for QA behavior until superseded by an updated strategy.
