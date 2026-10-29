# Test Planner Report

## Task Information

- Task: Test plan for payroll update basic-salary recalculation inconsistency
- Task Slug: `payroll-update-basic-salary`
- Agent: Test Planner
- Status: COMPLETE
- Input Reports Reviewed:
  - `.agents/reports/payroll-update-basic-salary/task-context.md`
  - `.agents/reports/payroll-update-basic-salary/code-auditor-report.md`

## A. Test plan overview

**Feature and scope:** Backend payroll edit workflow — `PUT /api/v1/payroll/:id` → `updatePayroll()` service → `payrollRepository.update()`. Scope covers the `basicSalary` recalculation performed during a payroll update, including salary-type handling (`MONTHLY` vs `DAILY`), half-day handling, validation, authorization, tenant isolation, and status-transition guards. Frontend consumption (EditPayrollModal → PayrollContext → API) is in scope for expected-result definition but frontend UI automation is out of scope because `frontend/package.json` has no test script.

**Objective:** Define test scenarios and precise expected results that (a) verify the correct payroll-update behavior and (b) capture the confirmed `updatePayroll()` basic-salary inconsistency (Finding CA-001) as a regression so the Test Writer can implement automated tests and the Test Runner can execute them.

**Requirements and assumptions:**

| ID | Requirement / assumption | Source |
|----|--------------------------|--------|
| R-1 | `updatePayroll()` must reject updates to payrolls with status `PAID` (`PAYROLL_ALREADY_PAID`). | `payroll.service.js` lines 455-460 |
| R-2 | `updatePayroll()` must reject updates to payrolls with status `CANCELLED` (`PAYROLL_ALREADY_CANCELLED`). | `payroll.service.js` lines 463-470 |
| R-3 | `updatePayroll()` must return 404 when the payroll does not exist or is soft-deleted / not owned by the tenant. | `payroll.service.js` lines 441-452; `payroll.repository.js` lines 18-52 |
| R-4 | `updatePayrollSchema` accepts only `dailyWage`, `overtimeRate`, `bonus`, `deduction`, `advanceDeduction`, `remarks`; at least one field is required. | `payroll.validator.js` lines 52-72 |
| R-5 | `updatePayroll()` recalculates `basicSalary`, `overtimeAmount`, `grossSalary`, `netSalary` from submitted/preserved values. | `payroll.service.js` lines 493-510 |
| R-6 | `calculatePayrollFromAttendance()` (the established reference formula) computes `basicSalary` as `monthlySalary` for `MONTHLY` workers and `dailyWage * (presentDays + halfDays / 2)` for `DAILY` workers. | `payroll.service.js` lines 75-78 |
| R-7 (assumption, UNCONFIRMED) | The intended product behavior is for `updatePayroll()` to recalculate `basicSalary` consistently with `calculatePayrollFromAttendance()` — i.e., honor `salaryType`/`monthlySalary` and `halfDays` — rather than blindly `presentDays * dailyWage`. | Code Auditor unresolved question; code-auditor-report.md |
| R-8 (assumption, UNCONFIRMED) | Alternative acceptable behavior: preserve the existing `basicSalary` when only non-calculation fields (e.g., `remarks`) are changed. | Code Auditor unresolved question |

**Out-of-scope behavior:**
- Frontend UI rendering/interaction testing (no frontend test script exists; Playwright installed but not configured).
- `createPayroll`, `generateSalaryFromAttendance`, `processAdvancePayment`, `processSalaryPayment` (separate workflows, not part of this defect).
- `recalculatePayroll` business logic itself (it is already consistent; only the divergence with `updatePayroll` is relevant here).
- Real payment transactions.

**Risks and relevant dependencies:**
- The `Payroll` model has no `salaryType`/`monthlySalary` field, so `updatePayroll()` must look up the `Worker` record (as `recalculatePayroll()` already does) to honor salary type. This is a required code change; tests alone cannot fix it.
- No payroll tests exist anywhere in `backend/tests/`, so there is no baseline to compare against.
- The intended behavior (R-7 vs R-8) is not confirmed by product documentation; tests should be written to the reference formula R-6 and flagged as "expected to fail against current code" until the fix is applied.

## B. Implementation and requirement map

| File | Role | Relevant lines |
|------|------|----------------|
| `backend/src/services/payroll.service.js` | Payroll business logic. `updatePayroll()` recalculates salary; `calculatePayrollFromAttendance()` is the reference formula; `recalculatePayroll()` is the consistent comparator. | `updatePayroll`: 434-530 (basicSalary 494-496); `calculatePayrollFromAttendance`: 22-97 (basicSalary 75-78); `recalculatePayroll`: 207-305 |
| `backend/src/controllers/payroll.controller.js` | `updatePayroll` controller; calls service with `req.params.id`, `req.body`, `req.user.userId`, `req.user.tenantId`. | 79-95 |
| `backend/src/routes/payroll.routes.js` | Route `PUT /:id` → `updatePayroll`; middleware: `authMiddleware`, `requireActiveSubscription`, `authorize('PAYROLL_UPDATE')`, `validate(updatePayrollSchema)`. | 143-150 |
| `backend/src/validators/payroll.validator.js` | `updatePayrollSchema`: allowed fields `dailyWage`, `overtimeRate`, `bonus`, `deduction`, `advanceDeduction`, `remarks`; `.min(1)`. | 52-72 |
| `backend/src/models/Payroll.js` | Payroll schema: fields `dailyWage`, `presentDays`, `halfDays`, `basicSalary`, `overtimeHours`, `overtimeRate`, `bonus`, `deduction`, `advanceDeduction`, `grossSalary`, `netSalary`, `status`, `tenant`; NO `salaryType`/`monthlySalary`. | 1-244 |
| `backend/src/models/Worker.js` | Worker schema: `salaryType` (DAILY/MONTHLY), `monthlySalary`, `dailyWage`. | 144-153, 184-200 |
| `backend/src/repositories/payroll.repository.js` | `update()` and `findById()` enforce `isDeleted: false` and `tenant = tenantId`. | 130-175 (update); 18-52 (findById) |
| `frontend/src/components/payroll/EditPayrollModal.jsx` | Edit form submits `dailyWage`, `overtimeRate`, `bonus`, `deduction`, `advanceDeduction`, `remarks`. | 55-62 |
| `frontend/src/context/PayrollContext.jsx` | `updatePayroll` context action calls API then `fetchPayrolls()` to refresh list. | 67-79 |
| `frontend/src/services/payroll.service.js` | Frontend API: `axios.put("/payroll/" + id, payload)`. | 29-32 |

## C. Preconditions and test data

**Required test accounts and roles:**
- Authenticated user with `PAYROLL_UPDATE` permission (route guard `authorize('PAYROLL_UPDATE')`).
- Super-admin is not required for these scenarios; tenant-scoped user is appropriate.

**Tenant setup:**
- Two tenants (Tenant A, Tenant B) to verify cross-tenant isolation.
- Each tenant has at least one worker and one site.

**Required records and relationships:**
- Worker records with `salaryType`, `monthlySalary`, `dailyWage`.
- Payroll records per tenant, per worker, per month/year, with `status` in `GENERATED` (updatable), `PAID` (blocked), `CANCELLED` (blocked).
- Soft-deleted payroll (`isDeleted: true`) for the 404 case.

**Input data and boundary values:**
- `MONTHLY` worker: `monthlySalary` e.g. 30000, `dailyWage` e.g. 800, `presentDays` e.g. 22, `halfDays` 0.
- `DAILY` worker with half days: `dailyWage` e.g. 800, `presentDays` 20, `halfDays` 4 → expected `basicSalary = 800 * (20 + 4/2) = 17600`.
- `DAILY` worker without half days: `presentDays` 22, `halfDays` 0 → expected `basicSalary = 800 * 22 = 17600`.
- Update payloads: remarks-only, bonus-only, deduction-only, dailyWage-only, invalid/negative values.

**Environment or configuration prerequisites:**
- Backend test command: `cd backend && npm test` (Jest 30, ES modules, MongoDB Memory Server).
- Test setup file: `backend/tests/setup/jest.setup.js` (mocks auth/authorize middlewares, Tenant/User models).
- Test helpers: `backend/tests/helpers/testUtils.js` (`connectTestDB`, `closeTestDB`, `clearTestDB`, `createPermissions`, `createRole`, `createUser`, `generateTestToken`, `getAuthHeaders`, `SUPER_ADMIN_PERMISSIONS`).

**Setup and cleanup considerations:**
- Connect/disconnect test DB per suite; clear collections between tests to ensure isolation.
- Use deterministic fixtures and predictable assertions; no real payment operations.

## D. Test scenarios and cases

| Test ID | Scenario | Priority | Preconditions | Test data | Steps | Expected result | Test level | Coverage status |
|---------|----------|----------|---------------|-----------|-------|-----------------|------------|-----------------|
| TP-001 | Update `remarks` only on a `DAILY` worker payroll (no half days); `basicSalary` preserved per reference formula | P1 | Authenticated user with `PAYROLL_UPDATE`; Tenant A; `DAILY` worker payroll `status=GENERATED`, `presentDays=22`, `halfDays=0`, `dailyWage=800`, `basicSalary=17600` | Payload: `{ remarks: "updated note" }` | Call `PUT /api/v1/payroll/:id` with remarks-only payload | 200; `basicSalary` remains `17600` (= `800 * 22`); `netSalary` recalculated from preserved `basicSalary` + submitted fields | Backend service/API | Not covered — no payroll tests exist |
| TP-002 | Update `bonus` on a `DAILY` worker payroll with half days; `basicSalary` includes half days | P1 | Authenticated user with `PAYROLL_UPDATE`; Tenant A; `DAILY` worker payroll `status=GENERATED`, `presentDays=20`, `halfDays=4`, `dailyWage=800` | Payload: `{ bonus: 500 }` | Call `PUT /api/v1/payroll/:id` with bonus payload | 200; `basicSalary` = `800 * (20 + 4/2)` = `17600`; `grossSalary` = `17600 + overtimeAmount + 500`; `netSalary` reflects bonus | Backend service/API | Not covered — defect: current code uses `presentDays * dailyWage` = 16000, drops half days |
| TP-003 | Update on a `MONTHLY` worker payroll; `basicSalary` uses `monthlySalary`, not day rate | P1 | Authenticated user with `PAYROLL_UPDATE`; Tenant A; `MONTHLY` worker payroll `status=GENERATED`, `monthlySalary=30000`, `dailyWage=800`, `presentDays=22` | Payload: `{ deduction: 1000 }` | Call `PUT /api/v1/payroll/:id` with deduction payload | 200; `basicSalary` = `30000` (monthlySalary), NOT `22 * 800 = 17600`; `netSalary` = `30000 + overtimeAmount + bonus - deduction - advanceDeduction` | Backend service/API | Not covered — defect: current code overwrites with `presentDays * dailyWage` |
| TP-004 | Update `dailyWage` on a `DAILY` worker payroll without half days | P2 | Authenticated user with `PAYROLL_UPDATE`; Tenant A; `DAILY` worker payroll `status=GENERATED`, `presentDays=22`, `halfDays=0`, `dailyWage=800` | Payload: `{ dailyWage: 900 }` | Call `PUT /api/v1/payroll/:id` with new dailyWage | 200; `basicSalary` = `22 * 900 = 19800`; `overtimeRate` recalculated if not supplied (per `dailyWage / 8`? note: `updatePayroll` uses `payroll.overtimeRate ?? updateData.overtimeRate`, not recalculated) | Backend service/API | Not covered — no payroll tests exist |
| TP-005 | Update payroll with `status=PAID` → rejected | P1 | Authenticated user with `PAYROLL_UPDATE`; payroll `status=PAID` | Payload: `{ remarks: "x" }` | Call `PUT /api/v1/payroll/:id` | 400 `BAD_REQUEST`; `PAYROLL_ALREADY_PAID`; payroll unchanged | Backend service/API | Not covered — no payroll tests exist |
| TP-006 | Update payroll with `status=CANCELLED` → rejected | P1 | Authenticated user with `PAYROLL_UPDATE`; payroll `status=CANCELLED` | Payload: `{ remarks: "x" }` | Call `PUT /api/v1/payroll/:id` | 400 `BAD_REQUEST`; `PAYROLL_ALREADY_CANCELLED`; payroll unchanged | Backend service/API | Not covered — no payroll tests exist |
| TP-007 | Update non-existent payroll → 404 | P1 | Authenticated user with `PAYROLL_UPDATE`; valid tenant | Payload: `{ remarks: "x" }`; non-existent payrollId | Call `PUT /api/v1/payroll/:id` | 404 `NOT_FOUND`; `PAYROLL_MESSAGES.NOT_FOUND` | Backend service/API | Not covered — no payroll tests exist |
| TP-008 | Update soft-deleted payroll → 404 | P1 | Authenticated user with `PAYROLL_UPDATE`; payroll `isDeleted=true` | Payload: `{ remarks: "x" }` | Call `PUT /api/v1/payroll/:id` | 404 `NOT_FOUND` (repository `findById` enforces `isDeleted: false`) | Backend service/API | Not covered — no payroll tests exist |
| TP-009 | Update with empty payload → validation error | P2 | Authenticated user with `PAYROLL_UPDATE`; valid payroll | Payload: `{}` | Call `PUT /api/v1/payroll/:id` | 400 validation error; `updatePayrollSchema.min(1)` "At least one field is required to update" | Backend service/API | Not covered — no payroll tests exist |
| TP-010 | Update with invalid/negative numeric field → validation error | P2 | Authenticated user with `PAYROLL_UPDATE`; valid payroll | Payload: `{ dailyWage: -100 }` | Call `PUT /api/v1/payroll/:id` | 400 validation error; `dailyWage.min(0)` | Backend service/API | Not covered — no payroll tests exist |
| TP-011 | Update without `PAYROLL_UPDATE` permission → 403 | P1 | Authenticated user WITHOUT `PAYROLL_UPDATE` permission; valid payroll | Payload: `{ remarks: "x" }` | Call `PUT /api/v1/payroll/:id` | 403 `FORBIDDEN` (route `authorize('PAYROLL_UPDATE')`) | Backend service/API | Not covered — no payroll tests exist |
| TP-012 | Cross-tenant update → 404 (tenant isolation) | P0 | Authenticated user Tenant A with `PAYROLL_UPDATE`; payroll belongs to Tenant B | Payload: `{ remarks: "x" }`; Tenant B payrollId | Call `PUT /api/v1/payroll/:id` with Tenant A token | 404 `NOT_FOUND` (repository enforces `tenant = tenantId`; payroll not found for Tenant A) | Backend service/API | Not covered — no payroll tests exist |
| TP-013 | `recalculatePayroll` vs `updatePayroll` divergence for same `MONTHLY` worker | P1 | Authenticated user; Tenant A; `MONTHLY` worker payroll generated | Same worker/month/year; call service methods directly | Call `recalculatePayroll()` then `updatePayroll()` on equivalent data; compare `basicSalary` | `recalculatePayroll` yields `monthlySalary`-based `basicSalary`; `updatePayroll` yields `presentDays * dailyWage`; results differ → confirms defect | Backend service | Not covered — defect exposure |

## E. Negative cases and boundary conditions

- TP-005 / TP-006: Paid or cancelled payroll cannot be edited (status-transition guard).
- TP-007: Non-existent payroll ID returns 404, not 500.
- TP-008: Soft-deleted payroll is not updatable (repository `isDeleted: false` filter).
- TP-009: Empty update body rejected by schema `.min(1)`.
- TP-010: Negative `dailyWage`/`bonus`/etc. rejected by schema `.min(0)`.
- TP-011: Missing `PAYROLL_UPDATE` permission returns 403.
- TP-012: Cross-tenant payroll ID is not found (tenant isolation via repository `tenant = tenantId`).
- Boundary: `halfDays` odd number (e.g., 1) → `halfDays / 2` = 0.5; verify `basicSalary` arithmetic handles fractional days.
- Boundary: `presentDays = 0`, `halfDays = 0` → `basicSalary = 0` for DAILY; `monthlySalary` for MONTHLY.

## F. Regression scope

Workflows most likely affected by a fix to `updatePayroll()`:
1. Payroll edit flow on `frontend/src/pages/payroll/Payroll.jsx` via `EditPayrollModal` — any field change currently rewrites `basicSalary`; after fix, monthly/half-day workers see correct values.
2. `PayrollContext.updatePayroll()` → `fetchPayrolls()` refresh — list displays recalculated `netSalary`/`basicSalary`.
3. `recalculatePayroll()` (attendance-payroll sync) — must remain consistent with the fixed `updatePayroll()`; both should use `calculatePayrollFromAttendance()`.
4. Payroll summary (`getSummary`) — aggregates `netSalary` by status; incorrect `netSalary` from bad `basicSalary` corrupts summary totals.
5. Worker payroll history (`getWorkerPayrollHistory`) — historical records show corrected values after re-edit.

These should be rechecked after the fix because `basicSalary` feeds `grossSalary` and `netSalary`, which feed payments, balances, summary, and exports.

## G. Existing test coverage and gaps

**Existing test files inspected:**
- `backend/tests/auth/multi-tenant-auth.test.js` — auth only; no payroll coverage.
- `backend/tests/tenant/tenant.test.js` — tenant only; no payroll coverage.
- `backend/tests/tenant/tenant.service.test.js` — tenant service only; no payroll coverage.
- `backend/tests/validators/subscriptionPlan.validator.test.js` — validator only; no payroll coverage.

**Result:** Zero payroll tests exist. There is no test coverage for `createPayroll`, `updatePayroll`, `recalculatePayroll`, `calculatePayrollFromAttendance`, or the `PUT /api/v1/payroll/:id` route. All scenarios TP-001 through TP-013 are **not covered**.

**Coverage gaps:** Every scenario listed in section D is a gap. The highest-priority gaps are TP-002 (half days), TP-003 (MONTHLY salary), TP-005/TP-006 (status guards), TP-011 (authorization), and TP-012 (tenant isolation).

## H. Execution recommendations

**Logical order:**
1. TP-005, TP-006, TP-007, TP-008, TP-009, TP-010 (validation/guards — quick to implement, isolate service behavior).
2. TP-011, TP-012 (authorization/tenant isolation — P0 security-relevant).
3. TP-001, TP-002, TP-003, TP-004 (calculation correctness — the core defect).
4. TP-013 (divergence exposure between `recalculatePayroll` and `updatePayroll`).

**Commands:**
- Full backend suite: `cd backend && npm test`
- Targeted (once test files exist): `cd backend && npm test -- --runInBand backend/tests/payroll/update-payroll.test.js` (suggested path; Test Writer decides exact file)
- Coverage: `cd backend && npm run test:coverage`

**Automated vs manual:** All scenarios TP-001 to TP-013 are suitable for backend automated tests (Jest + Supertest + MongoDB Memory Server). Frontend verification of the EditPayrollModal is currently manual only (no frontend test script); recommend adding Playwright coverage if frontend test infrastructure is enabled later.

**Note:** Tests written against R-6/R-7 are expected to **fail** against the current (unfixed) `updatePayroll()` implementation for TP-002 and TP-003. This is intentional — the failures demonstrate the defect. Do not treat pre-fix failures as test defects.

## I. Handoff

- Next Agent: Test Writer
- Reports to Read:
  - `.agents/reports/payroll-update-basic-salary/code-auditor-report.md` (defect evidence, root cause, affected lines)
  - `.agents/reports/payroll-update-basic-salary/test-planner-report.md` (this plan)
- Required Action: Implement automated backend tests for scenarios TP-001 through TP-013, prioritizing P0/P1, following the repository's Jest/ES module conventions and reusing `backend/tests/helpers/testUtils.js`. Mark TP-002 and TP-003 as expected-to-fail against current code until `updatePayroll()` is fixed.
- Relevant Files: `backend/src/services/payroll.service.js` (lines 494-496 defective; 75-78 reference), `backend/src/validators/payroll.validator.js` `updatePayrollSchema` (lines 52-72), `backend/src/models/Payroll.js`, `backend/src/models/Worker.js`
- Tests or Reproduction Steps: Backend service/API tests for `updatePayroll` with MONTHLY and half-day workers; status guards; authorization; tenant isolation. No existing payroll tests to build on.
- Blockers: None.
- Unresolved questions: Intended behavior is R-7 (recalculate per `calculatePayrollFromAttendance`) vs R-8 (preserve `basicSalary` on non-calculation edits). Tests assume R-7; confirm with product before finalizing expected results for remarks-only edits (TP-001).
