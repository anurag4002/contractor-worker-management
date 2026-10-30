# Project-Wide Test Coverage Matrix

## Task Information

- Task: Final QA Agent System Validation and Remediation
- Task Slug: `project-wide-testing-audit`
- Agent: Test Planner
- Date: 2026-10-30
- Status: COMPLETE
- Testing mode: PROJECT_WIDE
- Input Reports Reviewed: code-auditor, test-planner, test-writer, test-runner, quality-reviewer, security-reviewer reports; shared strategy.

## Purpose

Module-by-testing-type coverage matrix for the Contractor Worker Management application. Each
module/testing-type combination records:

- Coverage status.
- Execution status.
- Relevant test file.
- Evidence.
- Reason for missing or blocked coverage.

Coverage status values: `COVERED`, `PARTIAL`, `MISSING`, `BLOCKED`, `NOT APPLICABLE`.
Execution status values: `PASSED`, `FAILED`, `BLOCKED`, `NOT RUN`.

## Matrix

| Module | Static quality | Unit | Service | API / contract | Database integration | Component / UI | E2E | Acceptance | Regression | Smoke / sanity | Security | Data integrity / financial | Accessibility | Responsive / browser compatibility | Performance | Resilience / reliability | Property / fuzz / boundary / mutation | Manual exploratory | Coverage status | Execution status | Relevant test file | Evidence / notes |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|

### Module: Authentication and session handling

| Module | Static quality | Unit | Service | API / contract | Database integration | Component / UI | E2E | Acceptance | Regression | Smoke / sanity | Security | Data integrity / financial | Accessibility | Responsive / browser compatibility | Performance | Resilience / reliability | Property / fuzz / boundary / mutation | Manual exploratory | Coverage status | Execution status | Relevant test file | Evidence / notes |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Authentication and session handling | PARTIAL | PARTIAL | PARTIAL | MISSING | PARTIAL | MISSING | MISSING | PARTIAL | PARTIAL | MISSING | PARTIAL | NOT APPLICABLE | NOT APPLICABLE | NOT APPLICABLE | NOT APPLICABLE | NOT APPLICABLE | NOT APPLICABLE | NOT APPLICABLE | PARTIAL | FAILED | `backend/tests/auth/jwt-auth.test.js`, `backend/tests/auth/multi-tenant-auth.test.js` | JWT mock repaired (real verify); 5/5 JWT API tests pass. Multi-tenant auth suite failing (7) on duplicate-email mocks; real authN path partially exercised. | Reason for missing: real DB-backed auth flows not fully executed. |

### Module: Users, roles and permissions

| Module | Static quality | Unit | Service | API / contract | Database integration | Component / UI | E2E | Acceptance | Regression | Smoke / sanity | Security | Data integrity / financial | Accessibility | Responsive / browser compatibility | Performance | Resilience / reliability | Property / fuzz / boundary / mutation | Manual exploratory | Coverage status | Execution status | Relevant test file | Evidence / notes |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Users, roles and permissions | PARTIAL | MISSING | PARTIAL | MISSING | PARTIAL | MISSING | MISSING | MISSING | MISSING | MISSING | PARTIAL | NOT APPLICABLE | NOT APPLICABLE | NOT APPLICABLE | NOT APPLICABLE | NOT APPLICABLE | NOT APPLICABLE | NOT APPLICABLE | PARTIAL | NOT RUN | `backend/tests/tenant/tenant.service.test.js` (service-level) | No dedicated executed coverage for full user/role/permission surface. | Reason for missing: no dedicated executed suite. |

### Module: Tenants and tenant isolation

| Module | Static quality | Unit | Service | API / contract | Database integration | Component / UI | E2E | Acceptance | Regression | Smoke / sanity | Security | Data integrity / financial | Accessibility | Responsive / browser compatibility | Performance | Resilience / reliability | Property / fuzz / boundary / mutation | Manual exploratory | Coverage status | Execution status | Relevant test file | Evidence / notes |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Tenants and tenant isolation | PARTIAL | PARTIAL | PARTIAL | MISSING | PARTIAL | MISSING | MISSING | PARTIAL | MISSING | MISSING | PARTIAL | NOT APPLICABLE | NOT APPLICABLE | NOT APPLICABLE | NOT APPLICABLE | NOT APPLICABLE | NOT APPLICABLE | NOT APPLICABLE | PARTIAL | FAILED | `backend/tests/tenant/tenant.service.test.js`, `backend/tests/tenant/tenant.test.js`, `backend/tests/auth/multi-tenant-auth.test.js` | Tenant service suite failing (12); tenant API authorization tests passing in `tenant.test.js`. Duplicate-email failures indicate mock-state/mock-fidelity gaps. | Reason for missing: full tenant isolation runtime coverage pending. |

### Module: Workers

| Module | Static quality | Unit | Service | API / contract | Database integration | Component / UI | E2E | Acceptance | Regression | Smoke / sanity | Security | Data integrity / financial | Accessibility | Responsive / browser compatibility | Performance | Resilience / reliability | Property / fuzz / boundary / mutation | Manual exploratory | Coverage status | Execution status | Relevant test file | Evidence / notes |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Workers | PARTIAL | PARTIAL | MISSING | MISSING | MISSING | MISSING | MISSING | MISSING | PARTIAL | MISSING | MISSING | PARTIAL | NOT APPLICABLE | NOT APPLICABLE | NOT APPLICABLE | NOT APPLICABLE | NOT APPLICABLE | NOT APPLICABLE | MISSING | NOT RUN | — | Worker salary/skill logic reviewed; dedicated automated coverage not confirmed. | Reason for missing: not executed. |

### Module: Sites and worker assignments

| Module | Static quality | Unit | Service | API / contract | Database integration | Component / UI | E2E | Acceptance | Regression | Smoke / sanity | Security | Data integrity / financial | Accessibility | Responsive / browser compatibility | Performance | Resilience / reliability | Property / fuzz / boundary / mutation | Manual exploratory | Coverage status | Execution status | Relevant test file | Evidence / notes |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Sites and worker assignments | PARTIAL | MISSING | MISSING | MISSING | MISSING | MISSING | MISSING | MISSING | MISSING | MISSING | MISSING | NOT APPLICABLE | NOT APPLICABLE | NOT APPLICABLE | NOT APPLICABLE | NOT APPLICABLE | NOT APPLICABLE | NOT APPLICABLE | MISSING | NOT RUN | — | No executed coverage found. | Reason for missing: not executed. |

### Module: Attendance

| Module | Static quality | Unit | Service | API / contract | Database integration | Component / UI | E2E | Acceptance | Regression | Smoke / sanity | Security | Data integrity / financial | Accessibility | Responsive / browser compatibility | Performance | Resilience / reliability | Property / fuzz / boundary / mutation | Manual exploratory | Coverage status | Execution status | Relevant test file | Evidence / notes |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Attendance | PARTIAL | PARTIAL | PARTIAL | MISSING | MISSING | MISSING | MISSING | MISSING | PARTIAL | MISSING | PARTIAL | NOT APPLICABLE | NOT APPLICABLE | NOT APPLICABLE | NOT APPLICABLE | NOT APPLICABLE | NOT APPLICABLE | NOT APPLICABLE | PARTIAL | NOT RUN | `backend/tests/payroll/update-payroll.test.js` (indirect sync) | Payroll/attendance sync relationship only indirectly covered. | Reason for missing: attendance module not executed standalone. |

### Module: Payroll

| Module | Static quality | Unit | Service | API / contract | Database integration | Component / UI | E2E | Acceptance | Regression | Smoke / sanity | Security | Data integrity / financial | Accessibility | Responsive / browser compatibility | Performance | Resilience / reliability | Property / fuzz / boundary / mutation | Manual exploratory | Coverage status | Execution status | Relevant test file | Evidence / notes |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Payroll | PARTIAL | COVERED | COVERED | MISSING | MISSING | MISSING | MISSING | PARTIAL | COVERED | MISSING | PARTIAL | COVERED | NOT APPLICABLE | NOT APPLICABLE | NOT APPLICABLE | NOT APPLICABLE | NOT APPLICABLE | NOT APPLICABLE | PARTIAL | PASSED | `backend/tests/payroll/update-payroll.test.js`, `backend/tests/validators/payroll.validator.test.js` | Service regression + financial calculation tests executed green (38/38 targeted incl. payroll+validators). API-level payroll security/export scenarios not implemented (TP-008/TP-011/TP-012). | Reason for missing: API-level financial/export flows not yet implemented. |

### Module: Payment history and salary slips

| Module | Static quality | Unit | Service | API / contract | Database integration | Component / UI | E2E | Acceptance | Regression | Smoke / sanity | Security | Data integrity / financial | Accessibility | Responsive / browser compatibility | Performance | Resilience / reliability | Property / fuzz / boundary / mutation | Manual exploratory | Coverage status | Execution status | Relevant test file | Evidence / notes |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Payment history and salary slips | PARTIAL | MISSING | MISSING | MISSING | MISSING | MISSING | MISSING | MISSING | MISSING | MISSING | MISSING | COVERED | NOT APPLICABLE | NOT APPLICABLE | NOT APPLICABLE | NOT APPLICABLE | NOT APPLICABLE | NOT APPLICABLE | MISSING | NOT RUN | — | No executed coverage; financial calculation evidence limited to payroll tests. | Reason for missing: not executed. |

### Module: Dashboard

| Module | Static quality | Unit | Service | API / contract | Database integration | Component / UI | E2E | Acceptance | Regression | Smoke / sanity | Security | Data integrity / financial | Accessibility | Responsive / browser compatibility | Performance | Resilience / reliability | Property / fuzz / boundary / mutation | Manual exploratory | Coverage status | Execution status | Relevant test file | Evidence / notes |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Dashboard | PARTIAL | MISSING | MISSING | MISSING | MISSING | MISSING | MISSING | MISSING | MISSING | MISSING | MISSING | MISSING | NOT APPLICABLE | NOT APPLICABLE | NOT APPLICABLE | NOT APPLICABLE | NOT APPLICABLE | NOT APPLICABLE | MISSING | NOT RUN | — | No executed coverage found. | Reason for missing: not executed. |

### Module: Reports and exports

| Module | Static quality | Unit | Service | API / contract | Database integration | Component / UI | E2E | Acceptance | Regression | Smoke / sanity | Security | Data integrity / financial | Accessibility | Responsive / browser compatibility | Performance | Resilience / reliability | Property / fuzz / boundary / mutation | Manual exploratory | Coverage status | Execution status | Relevant test file | Evidence / notes |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Reports and exports | PARTIAL | MISSING | MISSING | MISSING | MISSING | MISSING | MISSING | MISSING | MISSING | MISSING | MISSING | MISSING | NOT APPLICABLE | NOT APPLICABLE | NOT APPLICABLE | NOT APPLICABLE | NOT APPLICABLE | NOT APPLICABLE | MISSING | NOT RUN | — | PDF/Excel export financial coverage not executed. | Reason for missing: not executed. |

### Module: Notifications

| Module | Static quality | Unit | Service | API / contract | Database integration | Component / UI | E2E | Acceptance | Regression | Smoke / sanity | Security | Data integrity / financial | Accessibility | Responsive / browser compatibility | Performance | Resilience / reliability | Property / fuzz / boundary / mutation | Manual exploratory | Coverage status | Execution status | Relevant test file | Evidence / notes |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Notifications | PARTIAL | MISSING | MISSING | MISSING | MISSING | MISSING | MISSING | MISSING | MISSING | MISSING | MISSING | NOT APPLICABLE | NOT APPLICABLE | NOT APPLICABLE | NOT APPLICABLE | NOT APPLICABLE | NOT APPLICABLE | NOT APPLICABLE | MISSING | NOT RUN | — | No executed coverage found. | Reason for missing: not executed. |

### Module: Subscription plans and subscriptions

| Module | Static quality | Unit | Service | API / contract | Database integration | Component / UI | E2E | Acceptance | Regression | Smoke / sanity | Security | Data integrity / financial | Accessibility | Responsive / browser compatibility | Performance | Resilience / reliability | Property / fuzz / boundary / mutation | Manual exploratory | Coverage status | Execution status | Relevant test file | Evidence / notes |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Subscription plans and subscriptions | PARTIAL | PARTIAL | PARTIAL | MISSING | MISSING | MISSING | MISSING | MISSING | PARTIAL | MISSING | PARTIAL | NOT APPLICABLE | NOT APPLICABLE | NOT APPLICABLE | NOT APPLICABLE | NOT APPLICABLE | NOT APPLICABLE | NOT APPLICABLE | PARTIAL | PASSED | `backend/tests/validators/subscriptionPlan.validator.test.js` | Subscription plan validator suite executed green. | Reason for missing: service-level subscription behavior not fully covered. |

### Module: Subscription payments

| Module | Static quality | Unit | Service | API / contract | Database integration | Component / UI | E2E | Acceptance | Regression | Smoke / sanity | Security | Data integrity / financial | Accessibility | Responsive / browser compatibility | Performance | Resilience / reliability | Property / fuzz / boundary / mutation | Manual exploratory | Coverage status | Execution status | Relevant test file | Evidence / notes |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Subscription payments | PARTIAL | MISSING | MISSING | MISSING | MISSING | MISSING | MISSING | MISSING | MISSING | MISSING | MISSING | NOT APPLICABLE | NOT APPLICABLE | NOT APPLICABLE | NOT APPLICABLE | NOT APPLICABLE | NOT APPLICABLE | NOT APPLICABLE | MISSING | NOT RUN | — | No executed coverage found. | Reason for missing: not executed. |

### Module: Platform and super-admin operations

| Module | Static quality | Unit | Service | API / contract | Database integration | Component / UI | E2E | Acceptance | Regression | Smoke / sanity | Security | Data integrity / financial | Accessibility | Responsive / browser compatibility | Performance | Resilience / reliability | Property / fuzz / boundary / mutation | Manual exploratory | Coverage status | Execution status | Relevant test file | Evidence / notes |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Platform and super-admin operations | PARTIAL | MISSING | MISSING | MISSING | MISSING | MISSING | MISSING | MISSING | MISSING | MISSING | MISSING | NOT APPLICABLE | NOT APPLICABLE | NOT APPLICABLE | NOT APPLICABLE | NOT APPLICABLE | NOT APPLICABLE | NOT APPLICABLE | MISSING | NOT RUN | — | No executed coverage found. | Reason for missing: not executed. |

### Module: Shared middleware, validation and error handling

| Module | Static quality | Unit | Service | API / contract | Database integration | Component / UI | E2E | Acceptance | Regression | Smoke / sanity | Security | Data integrity / financial | Accessibility | Responsive / browser compatibility | Performance | Resilience / reliability | Property / fuzz / boundary / mutation | Manual exploratory | Coverage status | Execution status | Relevant test file | Evidence / notes |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Shared middleware, validation and error handling | PARTIAL | PARTIAL | MISSING | PARTIAL | MISSING | MISSING | MISSING | MISSING | PARTIAL | MISSING | PARTIAL | NOT APPLICABLE | NOT APPLICABLE | NOT APPLICABLE | NOT APPLICABLE | NOT APPLICABLE | NOT APPLICABLE | NOT APPLICABLE | PARTIAL | NOT RUN | `backend/tests/setup/jest.setup.js` (middleware mocks), `backend/tests/validators/*` | Global middleware mocked in setup; genuine error-handling integration not executed; lint reported no-undef in error middleware usage. | Reason for blocked: no executed error-handling integration suite. |

## Module inventory

1. Authentication and session handling.
2. Users, roles and permissions.
3. Tenants, onboarding, tenant isolation.
4. Worker profiles and validation.
5. Site and worker assignments.
6. Attendance, histories, summaries.
7. Payroll.
8. Payment history and salary slips.
9. Dashboard.
10. Reports and exports.
11. Notifications.
12. Subscription plans and subscriptions.
13. Subscription payments.
14. Platform and super-admin.
15. Shared middleware, validation and error handling.

## Execution evidence summary

- Targeted (this phase): `cd backend && NODE_OPTIONS=--experimental-vm-modules npx jest --runInBand tests/payroll tests/validators` → 38/38 passed (exit 0).
- Targeted (this phase): `cd backend && NODE_OPTIONS=--experimental-vm-modules npx jest --runInBand tests/auth/jwt-auth.test.js` → 5/5 passed (exit 0).
- Full backend: `cd backend && NODE_OPTIONS=--experimental-vm-modules npx jest --runInBand` → 2 suites failed (auth, tenant.service), 19 failed / 50 passed / 69 total (exit 1).
- Backend lint: `npm run lint` (backend) → exit 1 (14 errors / 21 warnings observed).
- Backend format check: `npm run format:check` (backend) → exit 1 (138 files with issues).
- Frontend build: `npm run build` (frontend) → exit 0 (chunk-size warning).
- Frontend lint: `npm run lint` (frontend) → exit 1 (133 errors / 32 warnings).

## Open questions

- Whether remaining auth/tenant failures are test-implementation or product defects; deeper mock-infra fix pending.
- Whether MongoDB Memory Server can support session/transaction flows used by auth registration.

## Next steps

- Complete mock-isolation remediation; re-run affected → full backend suite.
- Add API-level security/authorization coverage (TP-008/TP-011/TP-012).
- Re-run Quality Reviewer; update final report verdict.
