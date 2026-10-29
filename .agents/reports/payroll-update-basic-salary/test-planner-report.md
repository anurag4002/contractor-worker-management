# Test Planner Report

## Task Information

- Task: Test plan for the payroll update basic-salary recalculation fix (regression and defect verification)
- Task Slug: `payroll-update-basic-salary`
- Agent: Test Planner
- Date: 2026-10-30
- Status: COMPLETE
- Input Reports Reviewed:
  - `.agents/reports/payroll-update-basic-salary/task-context.md`
  - `.agents/reports/payroll-update-basic-salary/code-auditor-report.md`
  - `.agents/reports/payroll-update-basic-salary/test-planner-report.md` (prior revision, via git HEAD)
  - `.agents/reports/payroll-update-basic-salary/test-runner-report.md`
  - `.agents/reports/payroll-update-basic-salary/quality-reviewer-report.md`
  - `.agents/reports/README.md`
  - `.agents/reports/templates/test-planner-report-template.md`

## A. Test plan overview

**Feature and scope:** Backend payroll edit workflow — `PUT /api/v1/payroll/:id` → `updatePayroll()` service → recalculation of `basicSalary`, `overtimeAmount`, `grossSalary`, `netSalary` → repository update. Regression focus on the confirmed defect (Finding CA-001): the update-time recalculation must be consistent with the established reference logic in `calculatePayrollFromAttendance()`.

**Objective:** Produce an actionable, evidence-based test plan (scenarios, priorities, preconditions, expected results) that verifies the fixed `updatePayroll()` behavior and prevents regression. The plan does not implement tests.

**Requirements and assumptions:**

| ID | Requirement / assumption | Source |
|----|--------------------------|--------|
| R-1 | `updatePayroll()` must reject updates when payroll status is `PAID`. | `payroll.service.js` lines 455-460 |
| R-2 | `updatePayroll()` must reject updates when payroll status is `CANCELLED`. | `payroll.service.js` lines 463-470 |
| R-3 | `updatePayroll()` must return 404 when payroll is missing or soft-deleted / not owned by tenant. | `payroll.service.js` lines 441-452; `payroll.repository.js` lines 18-52 |
| R-4 | `updatePayrollSchema` accepts only `dailyWage`, `overtimeRate`, `bonus`, `deduction`, `advanceDeduction`, `remarks`; requires at least one field. | `payroll.validator.js` lines 52-72 |
| R-5 | `updatePayroll()` recalculates `basicSalary`, `overtimeAmount`, `grossSalary`, `netSalary` from submitted or preserved values. | `payroll.service.js` lines 480-518 (post-fix) |
| R-6 | `calculatePayrollFromAttendance()` computes `basicSalary` as `monthlySalary` for `MONTHLY` workers and `dailyWage * (presentDays + halfDays / 2)` for `DAILY` workers. | `payroll.service.js` lines 75-78 |
| R-7 | Post-fix requirement: `updatePayroll()` must apply the same salary-type/half-day logic as `calculatePayrollFromAttendance()` (implemented at HEAD via worker lookup, lines 472-477 and 501-504). | Code Auditor Finding CA-001; HEAD commit `1af8cf8` |
| R-8 (assumption, UNCONFIRMED) | For remarks-only or otherwise non-calculation edits, preserving the stored `basicSalary` may be the intended behavior; the post-fix implementation recalculates anyway. Tests should encode current implementation behavior and flag product intent for TP-001-style cases. | Code Auditor unresolved question |

**Out of scope:** Frontend UI automation (no frontend test script); `createPayroll`, `generateSalaryFromAttendance`, payment/advance processing; real payment operations; salary-slip PDF generation.

**Risks and relevant dependencies:** Backend Jest setup file is currently syntactically invalid (CA-002), blocking all backend test execution; MongoDB Memory Server availability; expected financial-impact severity of incorrect salary recalculation.

## B. Implementation and requirement map

| File | Role | Relevant lines |
|------|------|----------------|
| `backend/src/services/payroll.service.js` | Payroll business logic. `updatePayroll()` (434-538), worker lookup (472-477), value preparation (480-498), calculation (500-518), repository update (521-535). `calculatePayrollFromAttendance()` (22-97) is the reference formula (basicSalary 75-78). `recalculatePayroll()` (207-305). | Core |
| `backend/src/controllers/payroll.controller.js` | `updatePayroll` controller; passes `req.params.id`, `req.body`, `req.user.userId`, `req.user.tenantId`. | 79-95 |
| `backend/src/routes/payroll.routes.js` | `PUT /:id` → `updatePayroll`; middleware: `authMiddleware`, `requireActiveSubscription`, `authorize('PAYROLL_UPDATE')`, `validate(updatePayrollSchema)`. | 143-150 |
| `backend/src/validators/payroll.validator.js` | `updatePayrollSchema`: allowed fields and `.min(1)`. | 52-72 |
| `backend/src/repositories/payroll.repository.js` | `findById` (18-52) enforces `isDeleted: false` and `tenant = tenantId`; `update` (130-175). | 18-52, 130-175 |
| `backend/src/repositories/worker.repository.js` | `findById` (18-37) enforces `isDeleted: false` and `tenant = tenantId`; used by update to resolve salary context. | 18-37 |
| `backend/src/models/Payroll.js` | Fields `presentDays`, `halfDays`, `dailyWage`, `basicSalary`, `overtimeHours`, `overtimeRate`, `bonus`, `deduction`, `advanceDeduction`, `grossSalary`, `netSalary`, `status`. | 30-130 |
| `backend/src/models/Worker.js` | `salaryType` (DAILY/MONTHLY), `dailyWage`, `monthlySalary`. | 184-200 |
| `backend/src/middlewares/auth.middleware.js`, `authorize.middleware.js`, `tenant.middleware.js` | Auth, permission, tenant context. | — |
| Frontend: `frontend/src/components/payroll/EditPayrollModal.jsx` (26, 30-41, 51-69), `frontend/src/context/PayrollContext.jsx` (67-79), `frontend/src/services/payroll.service.js` (29-32) | UI submits editable fields; no frontend automation currently available. | — |

## C. Preconditions and test data

- Required test accounts: authenticated user with `PAYROLL_UPDATE` permission (tenant admin / payroll manager); user without the permission for negative authorization case; super-admin where applicable.
- Tenant setup: two tenants (A and B) with isolated worker/payroll data.
- Required records: worker(s) (`DAILY` and `MONTHLY`), site(s), payroll per worker/month (`GENERATED` for update cases; `PAID`; `CANCELLED`; soft-deleted).
- Input data and boundary values:
  - `DAILY` worker: `dailyWage = 800`, `presentDays = 22`, `halfDays = 0`, overtime hours 0 → `basicSalary = 17600`.
  - `DAILY` worker with half days: `presentDays = 20`, `halfDays = 4` → `basicSalary = 800 * (20 + 4/2) = 17600`.
  - `MONTHLY` worker: `monthlySalary = 30000`, `dailyWage = 800`, `presentDays = 22` → `basicSalary = 30000`.
  - Update payloads: `{ remarks }`, `{ bonus }`, `{ deduction }`, `{ dailyWage: 900 }`, `{}`, `{ dailyWage: -100 }`.
- Environment prerequisites: backend Jest run via `npm test` (Jest 30, ES modules, `NODE_OPTIONS=--experimental-vm-modules`); test setup `backend/tests/setup/jest.setup.js` (currently invalid — see CA-002); helpers in `backend/tests/helpers/testUtils.js`; MongoDB Memory Server availability.

## D. Test scenarios and cases

| Test ID | Scenario | Priority | Preconditions | Test data | Steps | Expected result | Test level | Coverage status |
|---------|----------|----------|---------------|-----------|-------|-----------------|------------|-----------------|
| TP-001 | Update `remarks` only on a `DAILY` worker payroll with no half days | P1 | Authenticated user with `PAYROLL_UPDATE`; payroll `status=GENERATED` | Payload `{ remarks: "updated note" }`; payroll `presentDays=22`, `halfDays=0`, `dailyWage=800`, `basicSalary=17600` | `PUT /api/v1/payroll/:id` | 200; `basicSalary` = `22 * 800 = 17600`; `remarks` updated; `netSalary` recomputed consistently | Backend | Missing |
| TP-002 | Update bonus on a `DAILY` worker payroll with half days; half days must be included | P1 | Authenticated user with `PAYROLL_UPDATE`; payroll `status=GENERATED`; `presentDays=20`, `halfDays=4`, `dailyWage=800` | Payload `{ bonus: 500 }` | `PUT /api/v1/payroll/:id` | 200; `basicSalary` = `800 * (20 + 4/2) = 17600` (not `20 * 800 = 16000`); `grossSalary` = `basicSalary + overtimeAmount + bonus`; `netSalary` consistent | Backend | Missing — core defect regression |
| TP-003 | Update on a `MONTHLY` worker payroll; `basicSalary` must use `monthlySalary` | P1 | Authenticated user with `PAYROLL_UPDATE`; payroll `status=GENERATED`; worker `salaryType=MONTHLY`, `monthlySalary=30000` | Payload `{ deduction: 1000 }` | `PUT /api/v1/payroll/:id` | 200; `basicSalary` = `30000` (monthlySalary), not `22 * 800 = 17600`; `netSalary` = `grossSalary - deduction - advanceDeduction` | Backend | Missing — core defect regression |
| TP-004 | Update `dailyWage` on a `DAILY` worker payroll without half days | P2 | Authenticated user with `PAYROLL_UPDATE`; payroll `status=GENERATED` | Payload `{ dailyWage: 900 }`; payroll `presentDays=22`, `halfDays=0` | `PUT /api/v1/payroll/:id` | 200; `basicSalary` = `22 * 900 = 19800` | Backend | Missing |
| TP-005 | Update payroll with status `PAID` is rejected | P1 | Authenticated user with `PAYROLL_UPDATE`; payroll `status=PAID` | Payload `{ remarks: "x" }` | `PUT /api/v1/payroll/:id` | 400 `BAD_REQUEST`; `PAYROLL_ALREADY_PAID`; payroll unchanged | Backend | Missing |
| TP-006 | Update payroll with status `CANCELLED` is rejected | P1 | Authenticated user with `PAYROLL_UPDATE`; payroll `status=CANCELLED` | Payload `{ remarks: "x" }` | `PUT /api/v1/payroll/:id` | 400 `BAD_REQUEST`; `PAYROLL_ALREADY_CANCELLED`; payroll unchanged | Backend | Missing |
| TP-007 | Update non-existent payroll returns 404 | P1 | Authenticated user with `PAYROLL_UPDATE`; valid tenant | Payload `{ remarks: "x" }`; non-existent id | `PUT /api/v1/payroll/:id` | 404 `NOT_FOUND`; `PAYROLL_MESSAGES.NOT_FOUND` | Backend | Missing |
| TP-008 | Update soft-deleted payroll returns 404 | P1 | Authenticated user with `PAYROLL_UPDATE`; payroll `isDeleted=true` | Payload `{ remarks: "x" }` | `PUT /api/v1/payroll/:id` | 404 `NOT_FOUND` (repository enforces `isDeleted: false`) | Backend | Missing |
| TP-009 | Update with empty body is rejected | P2 | Authenticated user with `PAYROLL_UPDATE`; valid payroll | Payload `{}` | `PUT /api/v1/payroll/:id` | 400 validation error; `updatePayrollSchema.min(1)` | Backend | Missing |
| TP-010 | Update with negative numeric value is rejected | P2 | Authenticated user with `PAYROLL_UPDATE`; valid payroll | Payload `{ dailyWage: -100 }` | `PUT /api/v1/payroll/:id` | 400 validation error; `dailyWage.min(0)` | Backend | Missing |
| TP-011 | Update without `PAYROLL_UPDATE` permission is forbidden | P1 | Authenticated user lacking `PAYROLL_UPDATE`; valid payroll | Payload `{ remarks: "x" }` | `PUT /api/v1/payroll/:id` | 403 `FORBIDDEN` (`authorize('PAYROLL_UPDATE')`) | Backend | Missing |
| TP-012 | Cross-tenant update attempt is not found (tenant isolation) | P0 | Authenticated user Tenant A with `PAYROLL_UPDATE`; payroll owned by Tenant B | Payload `{ remarks: "x" }`; Tenant B payroll id | `PUT /api/v1/payroll/:id` with Tenant A context | 404 `NOT_FOUND` (repository enforces `tenant = tenantId`) | Backend | Missing |
| TP-013 | Recalculate vs update divergence regression for `MONTHLY` worker | P1 | Authenticated user with `PAYROLL_UPDATE`; Tenant A; `MONTHLY` worker payroll generated | Same worker/month/year | Call `recalculatePayroll()` and `updatePayroll()` on equivalent data; compare stored `basicSalary` | Post-fix: both produce `monthlySalary`-based `basicSalary`; pre-fix they diverged — regression guard | Backend service | Missing — regression scenario |

## E. Negative cases and boundary conditions

- TP-005: PAID payroll update → 400, no mutation.
- TP-006: CANCELLED payroll update → 400, no mutation.
- TP-007: Missing payroll → 404.
- TP-008: Soft-deleted payroll → 404.
- TP-009: Empty body → 400 validation.
- TP-010: Negative values → 400 validation.
- TP-011: Unauthorized → 403.
- TP-012: Cross-tenant → 404.
- TP-013: Pre-fix divergence confirmed; post-fix consistency expected (negative-control style regression).
- Boundary TP-014: `DAILY` worker with `presentDays = 0` and `halfDays = 0` → post-fix `basicSalary = 0`; `MONTHLY` worker → `basicSalary = monthlySalary`.
- Boundary TP-015: Odd `halfDays` value (e.g., 1) → fractional day arithmetic (`dailyWage * (presentDays + halfDays / 2)`); verify numeric result.

## F. Regression scope

Workflows that must be rechecked after the `updatePayroll()` fix:

1. Payroll edit flow end-to-end (`EditPayrollModal` → context → API → response) to confirm updated `basicSalary`/`grossSalary`/`netSalary` are displayed after refresh.
2. Payroll list/summary (`getSummary`) totals, since incorrect `netSalary` previously propagated into aggregates.
3. Worker payroll history and payment/advance balance calculations that consume `grossSalary`/`netSalary`.
4. `generateSalaryFromAttendance()` and `recalculatePayroll()` consistency with the fixed `updatePayroll()` calculation.
5. Frontend wage calculations (`frontend/src/utils/wageCalculator.js` `calculateGrossSalary`) as a related-but-separate implementation that may also diverge (out of scope for this plan's automation, in scope for QA review).

## G. Existing test coverage and gaps

- Inspected: `backend/tests/payroll/update-payroll.test.js` (service-level, mocked repositories — TP-001…TP-007 equivalents already drafted by prior plan), plus auth/tenant/validator suites (no payroll coverage).
- Findings: No payroll API/service coverage existed before this task; the highest-risk calculation paths (TP-002, TP-003) were uncovered.
- Current blocker: `backend/tests/setup/jest.setup.js` invalid syntax prevents any backend suite from running (CA-002) — so all planned scenarios remain unexecuted in the current tree.
- Missing scenarios: TP-008–TP-013 (guards, validation, auth, tenant isolation, divergence) not previously planned in code.

## H. Execution recommendations

1. Repair `backend/tests/setup/jest.setup.js` syntax error.
2. Run backend targeted suite: `cd backend && NODE_OPTIONS=--experimental-vm-modules npx jest --runInBand tests/payroll/update-payroll.test.js`.
3. Run full backend suite: `cd backend && NODE_OPTIONS=--experimental-vm-modules npx jest --runInBand`.
4. Execute planned scenarios in priority order: TP-011/TP-012 (P0 security) → TP-005–TP-008, TP-009–TP-010 (guards/validation) → TP-002, TP-003, TP-013 (core financial regression) → TP-001, TP-004 (supporting).
5. Frontend scenarios (EditPayrollModal success/error refresh) are manual/Playwright-gated (no frontend test script).

## I. Handoff

- Next Agent: Test Writer
- Reports to Read:
  - `.agents/reports/payroll-update-basic-salary/code-auditor-report.md`
  - `.agents/reports/payroll-update-basic-salary/test-planner-report.md` (this report)
  - `.agents/reports/payroll-update-basic-salary/test-runner-report.md`
- Required Action: Implement automated backend tests for TP-001–TP-013 (plus boundary TP-014/TP-015) using repository mocks/service-level approach consistent with the existing draft in `backend/tests/payroll/update-payroll.test.js`; expected pre-fix failures for TP-002/TP-003, post-fix green.
- Relevant Files: `backend/src/services/payroll.service.js`, `backend/src/validators/payroll.validator.js`, `backend/src/models/Payroll.js`, `backend/src/models/Worker.js`, `backend/tests/payroll/update-payroll.test.js`.
- Tests or Reproduction Steps: `cd backend && NODE_OPTIONS=--experimental-vm-modules npx jest --runInBand tests/payroll/update-payroll.test.js`
- Blockers: Backend test setup syntax error (CA-002); unresolved product intent for remarks-only edits (R-8).
- Unresolved questions: R-7 vs R-8 for non-calculation updates; whether frontend `wageCalculator.js` should be aligned.
