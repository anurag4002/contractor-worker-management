# Project-Wide Test Coverage Matrix

## Task Information

- Task: QA Agent System Upgrade for Comprehensive Full-Project Testing
- Task Slug: `project-wide-testing-audit`
- Agent: Test Planner
- Date: 2026-10-30
- Status: COMPLETE
- Testing mode: PROJECT_WIDE
- Input Reports Reviewed: code-auditor, test-planner, test-writer, test-runner, quality-reviewer reports for `payroll-update-basic-salary`

## Purpose

Map application modules to testing types and record coverage status for the full application audit.

## Coverage statuses

`COVERED`, `PARTIAL`, `MISSING`, `BLOCKED`, `NOT APPLICABLE`.

## Matrix

| Module | Frontend artifacts | Backend artifacts | Testing types | Status | Evidence / notes |
|---|---|---|---|---|---|
| Authentication and session handling | `frontend/src/context/AuthContext.jsx`, `frontend/src/services/auth.service.js`, `frontend/src/api/axios.js` | `backend/src/routes/auth.routes.js`, `auth.middleware.js`, `auth.controller.js`, `auth.service.js`, `auth.repository.js`, `User.js`, `Role.js`, `auth.validator.js` | API/contract, security, DB integration, E2E where possible | MISSING | Only payroll suites executed green in this session; auth/tenant suites not yet passing due to test-implementation issues. |
| Users, roles, permissions | `frontend/src/pages/users`, `frontend/src/context/AuthContext.jsx` | `backend/src/routes/user.routes.js`, `role.routes.js`, `user.controller.js`, `user.service.js`, `role.service.js`, `User.js`, `Role.js`, `Permission.js` | API/contract, security | PARTIAL | No dedicated automated coverage confirmed for all user/role flows. |
| Tenants, onboarding, tenant isolation | `frontend/src/pages/tenants`, `frontend/src/context/AuthContext.jsx` | `backend/src/routes/tenant.routes.js`, `tenant.middleware.js`, `tenant.controller.js`, `tenant.service.js`, `tenant.repository.js`, `Tenant.js`, `User.js` | API/contract, DB integration, security | PARTIAL | Tenant suites failing in full run (mock issues); isolation scenarios partially covered by auth tests. |
| Worker profiles and validation | `frontend/src/pages/workers`, `frontend/src/components/workermodal/*`, `frontend/src/utils/wageCalculator.js` | `backend/src/routes/worker.routes.js`, `worker.controller.js`, `worker.service.js`, `worker.repository.js`, `Worker.js`, `worker.validator.js` | Unit, service, API/contract, security | PARTIAL | Worker skill/salary logic reviewed; dedicated automated coverage not confirmed for full set. |
| Site and worker assignments | `frontend/src/pages/sites`, `frontend/src/components/workertable/*` | `backend/src/routes/site.routes.js`, `worker.service.js` (assign), `site.repository.js` | API/contract, DB integration | MISSING | Not confirmed automated. |
| Attendance | `frontend/src/pages/attendance`, `frontend/src/components/attendancetable/*`, `frontend/src/utils/wageCalculator.js` | `backend/src/routes/attendance.routes.js`, `attendance.controller.js`, `attendance.service.js`, `attendance.repository.js`, `Attendance.js`, `attendance.validator.js` | Unit, service, API/contract, DB integration | PARTIAL | Payroll/attendance sync relationship under test indirectly via payroll tests. |
| Payroll generation, editing, recalculation, advances, salary payments | `frontend/src/pages/payroll`, `frontend/src/components/payroll/*`, `frontend/src/context/PayrollContext.jsx`, `frontend/src/services/payroll.service.js` | `backend/src/routes/payroll.routes.js`, `payroll.controller.js`, `payroll.service.js`, `payroll.repository.js`, `Payroll.js`, `Worker.js`, `payroll.validator.js` | Service, API/contract, DB integration, security, regression, data integrity/financial | PARTIAL | Service-level regression tests implemented and executed green for update calculation (TP-001…TP-007, TP-013); API-level authz/tenant/soft-delete scenarios not yet implemented. |
| Payment history and salary slips | `frontend/src/pages/payroll`, `frontend/src/components/payroll/WorkerPayrollHistoryModal.jsx`, `frontend/src/utils/reportCalculator.js`, export components | `backend/src/routes/payroll.routes.js`, `payment.repository.js`, `export.repository.js`, `report.service.js`, PDF/export services | API/contract, data integrity/financial, manual | MISSING | Not executed. |
| Dashboard totals and charts | `frontend/src/pages/dashboard`, `frontend/src/components/dashboard/*`, `frontend/src/services/dashboard.service.js` | `backend/src/routes/dashboard.routes.js`, `dashboard.service.js`, `dashboard.repository.js` | API/contract, component, E2E where possible | MISSING | Not executed. |
| Reports and PDF/Excel exports | `frontend/src/pages/reports`, `frontend/src/components/report*`, `frontend/src/utils/reportCalculator.js` | `backend/src/routes/report.routes.js`, `report.service.js`, `export.service.js`, export repository | API/contract, data integrity/financial, manual | MISSING | Not executed. |
| Notifications | `frontend/src/pages/notifications`, `frontend/src/context/NotificationContext.jsx`, `frontend/src/services/notification.service.js` | `backend/src/routes/notification.routes.js`, `notification.service.js`, `notification.repository.js`, `Notification.js` | API/contract, DB integration | MISSING | Not executed. |
| Subscription plans, subscriptions, subscription payments | `frontend/src/pages/subscriptions`, `frontend/src/context/SubscriptionContext.jsx`, `frontend/src/services/subscription*.service.js` | `backend/src/routes/subscription*.routes.js`, `subscription*.controller.js`, `subscription*.service.js`, `Subscription*.js`, `subscription*.validator.js` | API/contract, DB integration, security | PARTIAL | Validator suite executed green; subscription behavior not fully covered. |
| Platform and super-admin operations | `frontend/src/pages/platform`, `frontend/src/services/platform.service.js` | `backend/src/routes/platform.routes.js`, `platform.controller.js`, `platform.service.js`, `Tenant.js`, `superadmin.middleware.js` | API/contract, security | MISSING | Not executed. |
| Shared middleware, validation, DB handling, API config, rate limiting, error handling | `backend/src/middlewares/*`, `backend/src/common/*` | `backend/src/app.js`, `backend/src/routes/index.js`, validators, error middleware | API/contract, security, unit | PARTIAL | Auth/tenant/middleware suites partially executed; shared coverage incomplete. |

## Per-module status summary

- Covered (executed green in this session): payroll service regression + validator suites.
- Partially covered: auth/tenant/worker/subscription areas (some executed, some failing/mocked).
- Missing: dashboard, reports/exports, notifications, platform, several integration paths.

## Execution evidence summary

- Targeted: `cd backend && NODE_OPTIONS=--experimental-vm-modules npx jest --runInBand tests/payroll tests/validators` → 38/38 passed.
- Full backend: `cd backend && NODE_OPTIONS=--experimental-vm-modules npx jest --runInBand` → 2 suites failed (auth, tenant service), 4 passed; payroll suites green.

## Open questions

- Whether remaining failing suites indicate product defects or test defects.
- Whether frontend automation can be authorized to fill UI/E2E gaps.

## Next steps

- Route full-suite failures to Test Writer for mock isolation.
- Add API-level coverage for TP-008, TP-011, TP-012.
