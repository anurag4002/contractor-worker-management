# Project-Wide Test Coverage Matrix

## Task Information

- Task: Upgrade and Validate the Complete QA Agent System
- Task Slug: `project-wide-testing-audit`
- Agent: Test Planner
- Date: 2026-10-30
- Status: COMPLETE
- Testing mode: PROJECT_WIDE
- Input Reports Reviewed: code-auditor, test-planner, test-writer, test-runner, quality-reviewer reports; shared strategy.

## Purpose

Provide a module-by-testing-type coverage matrix for the Contractor Worker Management
application. One row per discovered application module. Separate columns exist for each
applicable testing type. Every cell records coverage implementation status, execution
status, evidence, and rationale for missing/blocked coverage.

## Status vocabularies

### Coverage status (module / testing type)

- `COVERED` — implemented and executed (or otherwise verified) with supporting evidence.
- `PARTIAL` — some scenarios covered; meaningful gaps remain.
- `MISSING` — no coverage found for the module or testing type.
- `BLOCKED` — coverage cannot be established in the current environment.
- `NOT APPLICABLE` — testing type not applicable to the module/scope, with reason.

### Execution status (actual run outcome)

- `PASSED` — relevant checks executed and passed.
- `FAILED` — relevant checks executed and failed.
- `BLOCKED` — could not execute due to environment/tooling.
- `NOT RUN` — not executed in the current verification.

## Module-by-testing-type matrix

| Module | Static quality | Unit | Service | API / contract | Database integration | Component / UI | E2E | Acceptance | Regression | Smoke / sanity | Security | Data integrity / financial | Accessibility | Responsive / browser compatibility | Performance | Resilience / reliability | Property / fuzz / boundary / mutation | Manual exploratory | Coverage status | Execution status | Evidence / notes |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Authentication and session handling | PARTIAL | PARTIAL | PARTIAL | MISSING | PARTIAL | MISSING | MISSING | PARTIAL | PARTIAL | MISSING | PARTIAL | NOT APPLICABLE | NOT APPLICABLE | NOT APPLICABLE | NOT APPLICABLE | NOT APPLICABLE | NOT APPLICABLE | NOT APPLICABLE | PARTIAL | FAILED | Auth service suites executed via mocks; 7 failures (duplicate-email false positives) caused by ineffective ESM mocks + fixed mock user. JWT mock now delegates to real verification. Real auth middleware/DB integration path not yet executed. |
| Users, roles and permissions | PARTIAL | MISSING | PARTIAL | MISSING | PARTIAL | MISSING | MISSING | MISSING | MISSING | MISSING | PARTIAL | NOT APPLICABLE | NOT APPLICABLE | NOT APPLICABLE | NOT APPLICABLE | NOT APPLICABLE | NOT APPLICABLE | NOT APPLICABLE | PARTIAL | NOT RUN | No dedicated automated coverage confirmed for full user/role/permission surface. |
| Tenants and tenant isolation | PARTIAL | PARTIAL | PARTIAL | MISSING | PARTIAL | MISSING | MISSING | PARTIAL | MISSING | MISSING | PARTIAL | NOT APPLICABLE | NOT APPLICABLE | NOT APPLICABLE | NOT APPLICABLE | NOT APPLICABLE | NOT APPLICABLE | NOT APPLICABLE | PARTIAL | FAILED | Tenant service suite failing (12 failures) due to mock-state/leak and fixed mock-user behavior; tenant API-level authorization coverage missing. |
| Workers | PARTIAL | PARTIAL | MISSING | MISSING | MISSING | MISSING | MISSING | MISSING | PARTIAL | MISSING | MISSING | PARTIAL | NOT APPLICABLE | NOT APPLICABLE | NOT APPLICABLE | NOT APPLICABLE | NOT APPLICABLE | NOT APPLICABLE | MISSING | NOT RUN | Worker salary/skill logic reviewed; dedicated automated coverage not confirmed. |
| Sites and worker assignments | PARTIAL | MISSING | MISSING | MISSING | MISSING | MISSING | MISSING | MISSING | MISSING | MISSING | MISSING | NOT APPLICABLE | NOT APPLICABLE | NOT APPLICABLE | NOT APPLICABLE | NOT APPLICABLE | NOT APPLICABLE | NOT APPLICABLE | MISSING | NOT RUN | No executed coverage found. |
| Attendance | PARTIAL | PARTIAL | PARTIAL | MISSING | MISSING | MISSING | MISSING | MISSING | PARTIAL | MISSING | PARTIAL | NOT APPLICABLE | NOT APPLICABLE | NOT APPLICABLE | NOT APPLICABLE | NOT APPLICABLE | NOT APPLICABLE | NOT APPLICABLE | PARTIAL | NOT RUN | Payroll/attendance sync relationship only indirectly covered via payroll tests; attendance module itself not executed. |
| Payroll | PARTIAL | COVERED | COVERED | MISSING | MISSING | MISSING | MISSING | PARTIAL | COVERED | MISSING | PARTIAL | COVERED | NOT APPLICABLE | NOT APPLICABLE | NOT APPLICABLE | NOT APPLICABLE | NOT APPLICABLE | NOT APPLICABLE | PARTIAL | PASSED | Service-level regression tests executed green (38/38 targeted incl. payroll+validator); API-level payroll security/authz/export scenarios TP-008/TP-011/TP-012 not implemented; DB integration via memory server not executed for payroll. |
| Payment history and salary slips | PARTIAL | MISSING | MISSING | MISSING | MISSING | MISSING | MISSING | MISSING | MISSING | MISSING | MISSING | COVERED (financial calc evidence) | NOT APPLICABLE | NOT APPLICABLE | NOT APPLICABLE | NOT APPLICABLE | NOT APPLICABLE | NOT APPLICABLE | MISSING | NOT RUN | No automated coverage confirmed; PDF/Excel export financial path only partially evidenced. |
| Dashboard | PARTIAL | MISSING | MISSING | MISSING | MISSING | MISSING | MISSING | MISSING | MISSING | MISSING | MISSING | MISSING | NOT APPLICABLE | NOT APPLICABLE | NOT APPLICABLE | NOT APPLICABLE | NOT APPLICABLE | NOT APPLICABLE | MISSING | NOT RUN | No executed coverage found. |
| Reports and exports | PARTIAL | MISSING | MISSING | MISSING | MISSING | MISSING | MISSING | MISSING | MISSING | MISSING | MISSING | MISSING | NOT APPLICABLE | NOT APPLICABLE | NOT APPLICABLE | NOT APPLICABLE | NOT APPLICABLE | NOT APPLICABLE | MISSING | NOT RUN | PDF/Excel export financial coverage not executed. |
| Notifications | PARTIAL | MISSING | MISSING | MISSING | MISSING | MISSING | MISSING | MISSING | MISSING | MISSING | MISSING | NOT APPLICABLE | NOT APPLICABLE | NOT APPLICABLE | NOT APPLICABLE | NOT APPLICABLE | NOT APPLICABLE | NOT APPLICABLE | MISSING | NOT RUN | No executed coverage found. |
| Subscription plans and subscriptions | PARTIAL | PARTIAL | PARTIAL | MISSING | MISSING | MISSING | MISSING | MISSING | PARTIAL | MISSING | PARTIAL | NOT APPLICABLE | NOT APPLICABLE | NOT APPLICABLE | NOT APPLICABLE | NOT APPLICABLE | NOT APPLICABLE | NOT APPLICABLE | PARTIAL | PASSED | Subscription plan validator suite executed green; service-level subscription behavior not fully covered. |
| Subscription payments | PARTIAL | MISSING | MISSING | MISSING | MISSING | MISSING | MISSING | MISSING | MISSING | MISSING | MISSING | NOT APPLICABLE | NOT APPLICABLE | NOT APPLICABLE | NOT APPLICABLE | NOT APPLICABLE | NOT APPLICABLE | NOT APPLICABLE | MISSING | NOT RUN | No executed coverage found. |
| Platform and super-admin operations | PARTIAL | MISSING | MISSING | MISSING | MISSING | MISSING | MISSING | MISSING | MISSING | MISSING | MISSING | NOT APPLICABLE | NOT APPLICABLE | NOT APPLICABLE | NOT APPLICABLE | NOT APPLICABLE | NOT APPLICABLE | NOT APPLICABLE | MISSING | NOT RUN | No executed coverage found. |
| Shared middleware, validation and error handling | PARTIAL | PARTIAL | MISSING | PARTIAL | MISSING | MISSING | MISSING | MISSING | PARTIAL | MISSING | PARTIAL | NOT APPLICABLE | NOT APPLICABLE | NOT APPLICABLE | NOT APPLICABLE | NOT APPLICABLE | NOT APPLICABLE | NOT APPLICABLE | PARTIAL | NOT RUN | Backend lint reported pre-existing no-undef errors in error middleware usage; global middleware mocked in setup; genuine error-handling integration not executed. |

## Module inventory

1. Authentication and session handling.
2. Users, roles, permissions.
3. Tenants, onboarding, tenant isolation.
4. Worker profiles and validation.
5. Site and worker assignments.
6. Attendance, histories, summaries.
7. Payroll generation, editing, recalculation, advances, salary payments.
8. Payment history and salary slips.
9. Dashboard totals/charts.
10. Reports and PDF/Excel exports.
11. Notifications.
12. Subscription plans, subscriptions, subscription payments.
13. Platform and super-admin operations.
14. Shared middleware, validation, database handling, API config, rate limiting, error handling.

## Execution evidence summary

- Targeted (this session): `cd backend && NODE_OPTIONS=--experimental-vm-modules npx jest --runInBand tests/payroll tests/validators` → 3 suites, 38 tests, all passed.
- Full backend: `cd backend && NODE_OPTIONS=--experimental-vm-modules npx jest --runInBand` → 6 suites, 2 failed (auth, tenant.service), 4 passed; 19 failed / 50 passed / 69 total. Payroll-related suites green.
- Backend lint: `npm run lint` (backend) → exit 1 (14 errors, 21 warnings; pre-existing).
- Backend format check: `npm run format:check` (backend) → exit 1 (138 files with style issues; pre-existing).
- Frontend build: `npm run build` (frontend) → exit 0 (chunk-size warning only).
- Frontend lint: `npm run lint` (frontend) → exit 1 (133 errors, 32 warnings; pre-existing).
- Frontend tests: not run (no standard frontend test script confirmed).

## Open questions

- Whether remaining auth/tenant failures indicate product defects or test defects, and the minimal mock-infra fix to reach green.
- Whether MongoDB Memory Server can support the session/transaction flows required by the auth registration path.

## Next steps

- Route full-suite failures to Test Writer for mock isolation.
- Add API-level coverage for TP-008, TP-011, TP-012.
- Implement frontend component/E2E automation within authorized scope.
- Re-run Quality Reviewer after final remediation.
