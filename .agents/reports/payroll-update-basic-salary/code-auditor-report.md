# Code Auditor Report

## Task Information

- Task: Investigate payroll update basic salary recalculation inconsistency
- Task Slug: `payroll-update-basic-salary`
- Agent: Code Auditor
- Status: COMPLETE
- Input Reports Reviewed: `.agents/reports/payroll-update-basic-salary/task-context.md`

## Summary

Investigated the reported payroll candidate: `updatePayroll()` in `backend/src/services/payroll.service.js` recalculates `basicSalary` as `payroll.presentDays * dailyWage`, which differs from `calculatePayrollFromAttendance()`. Code evidence confirms this is a real inconsistency: `updatePayroll()` ignores both the worker's `salaryType` (MONTHLY workers should use `monthlySalary`, not `presentDays * dailyWage`) and `halfDays` (DAILY workers with half days should use `dailyWage * (presentDays + halfDays / 2)`). The defect is confirmed with High confidence. Severity is Medium because it affects payroll calculation accuracy on the edit workflow for monthly workers and workers with half days. No payroll tests exist to catch this regression.

## Implementation Map

### Backend

| File | Role | Relevant Lines |
|------|------|----------------|
| `backend/src/services/payroll.service.js` | Payroll business logic; contains `calculatePayrollFromAttendance()`, `recalculatePayroll()`, `updatePayroll()` | `calculatePayrollFromAttendance`: 22-97; `recalculatePayroll`: 207-305; `updatePayroll`: 434-530 |
| `backend/src/controllers/payroll.controller.js` | HTTP request handling; `updatePayroll` controller calls service | 79-95 |
| `backend/src/routes/payroll.routes.js` | Route registration; `PUT /:id` → `updatePayroll` with `PAYROLL_UPDATE` authorization | 143-150 |
| `backend/src/validators/payroll.validator.js` | `updatePayrollSchema` allows only `dailyWage`, `overtimeRate`, `bonus`, `deduction`, `advanceDeduction`, `remarks` — NOT `salaryType` or `monthlySalary` | 52-72 |
| `backend/src/models/Payroll.js` | Payroll Mongoose schema; fields include `dailyWage`, `presentDays`, `halfDays`, `basicSalary`, but NOT `salaryType` or `monthlySalary` | 1-244 |
| `backend/src/models/Worker.js` | Worker schema; has `salaryType` (DAILY/MONTHLY), `monthlySalary`, `dailyWage` | 184-200, 144-153 |
| `backend/src/repositories/payroll.repository.js` | `update()` and `findById()` repository methods | 130-175, 18-52 |

### Frontend

| File | Role | Relevant Lines |
|------|------|----------------|
| `frontend/src/pages/payroll/Payroll.jsx` | Payroll management page; opens `EditPayrollModal` on edit click | 95, 117 |
| `frontend/src/components/payroll/EditPayrollModal.jsx` | Edit form; submits `dailyWage`, `overtimeRate`, `bonus`, `deduction`, `advanceDeduction`, `remarks` via `updatePayroll` | 25-69 |
| `frontend/src/context/PayrollContext.jsx` | `updatePayroll` context action calls API then `fetchPayrolls()` to refresh list | 67-79 |
| `frontend/src/services/payroll.service.js` | Frontend API service; `updatePayroll` does `axios.put("/payroll/" + id, payload)` | 29-32 |

### Tests

| File | Role |
|------|------|
| `backend/tests/` | Existing test directory; contains only auth, tenant, subscription-validator tests — **no payroll tests** |

## Investigation Steps and Code Paths Traced

1. Read `backend/src/services/payroll.service.js` in full (1,110 lines).
2. Compared `calculatePayrollFromAttendance()` (lines 22-97) with `updatePayroll()` (lines 434-530).
3. Read `backend/src/models/Payroll.js` to confirm which fields exist on payroll records.
4. Read `backend/src/models/Worker.js` to confirm `salaryType`, `monthlySalary`, `dailyWage` fields on workers.
5. Read `backend/src/validators/payroll.validator.js` `updatePayrollSchema` to confirm which fields can be sent in an update request.
6. Read `backend/src/controllers/payroll.controller.js` and `backend/src/routes/payroll.routes.js` to confirm the route and middleware chain.
7. Traced frontend: `Payroll.jsx` → `EditPayrollModal.jsx` → `PayrollContext.jsx` → `payroll.service.js` → `PUT /api/v1/payroll/:id`.
8. Confirmed no payroll test files exist under `backend/tests/`.

## Findings

### Finding CA-001: `updatePayroll()` recalculates basicSalary inconsistently with `calculatePayrollFromAttendance()`

- **Severity:** Medium
- **Confidence:** High
- **Affected files:**
  - `backend/src/services/payroll.service.js` lines 494-496 (`updatePayroll`)
  - `backend/src/services/payroll.service.js` lines 75-78 (`calculatePayrollFromAttendance`, correct reference implementation)
- **Evidence:**
  - `calculatePayrollFromAttendance()` line 75-78:
    ```js
    const basicSalary =
        worker?.salaryType === 'MONTHLY'
            ? worker?.monthlySalary || 30000
            : dailyWage * (presentDays + (halfDays / 2));
    ```
    This correctly handles `MONTHLY` salary type (uses `monthlySalary`) and half days (`presentDays + halfDays / 2`).
  - `updatePayroll()` lines 494-496:
    ```js
    const basicSalary =
        payroll.presentDays *
        dailyWage;
    ```
    This uses only `presentDays * dailyWage`, ignoring both `salaryType` and `halfDays`.
  - `updatePayroll()` does not fetch the worker record (unlike `recalculatePayroll()` which calls `workerRepository.findById()` at lines 255-259), so it has no access to `salaryType` or `monthlySalary`.
  - The `Payroll` model (`backend/src/models/Payroll.js`) has no `salaryType` or `monthlySalary` field, so the payroll record itself cannot supply the missing context.
  - `updatePayrollSchema` (`backend/src/validators/payroll.validator.js` lines 52-72) does not accept `salaryType` or `monthlySalary`, so the frontend cannot supply them either.
  - Frontend `EditPayrollModal` (`frontend/src/components/payroll/EditPayrollModal.jsx` lines 55-62) sends only `dailyWage`, `overtimeRate`, `bonus`, `deduction`, `advanceDeduction`, `remarks`.
- **Expected behavior:** Editing a payroll should recalculate `basicSalary` consistently with how it was originally generated — i.e., using `monthlySalary` for `MONTHLY` workers and `dailyWage * (presentDays + halfDays / 2)` for `DAILY` workers with half days.
- **Actual or suspected behavior:** After editing any payroll, `basicSalary` is overwritten with `presentDays * dailyWage`. For a `MONTHLY` worker, this replaces `monthlySalary` with a day-rate calculation. For a `DAILY` worker with half days, the half-day component is dropped. The resulting `netSalary` and displayed balance are therefore incorrect.
- **Root cause:** `updatePayroll()` uses a simplified day-rate formula (`presentDays * dailyWage`) that does not account for salary type or half days, unlike `calculatePayrollFromAttendance()`. The service also does not look up the worker to obtain `salaryType`/`monthlySalary`.
- **Impact:** Users editing a payroll (e.g., adjusting bonus/deduction/remarks) will see the `basicSalary`, `grossSalary`, and `netSalary` silently recalculated incorrectly. Monthly workers and workers with half days are affected. This is a financial data-integrity issue on the payroll edit workflow.
- **Reproduction or verification:**
  1. Generate a payroll for a `MONTHLY` worker via attendance sync (or create one directly).
  2. Open the Payroll page (`frontend/src/pages/payroll/Payroll.jsx`), click Edit on that payroll.
  3. Change only `remarks` (or any editable field) and submit.
  4. Observe that `basicSalary` changes from `monthlySalary` to `presentDays * dailyWage` in the refreshed list.
- **Recommended next action:** Modify `updatePayroll()` to look up the worker and apply the same salary-type and half-day logic as `calculatePayrollFromAttendance()`, or preserve the existing `basicSalary` when only non-calculation fields (e.g., `remarks`) are changed.
- **Test coverage:** No payroll tests exist in `backend/tests/`. This defect is not covered by any existing test.

## Related Tests Inspected and Coverage Gaps

**Existing tests inspected:**
- `backend/tests/auth/multi-tenant-auth.test.js` — auth only, no payroll coverage
- `backend/tests/tenant/tenant.test.js` — tenant only, no payroll coverage
- `backend/tests/tenant/tenant.service.test.js` — tenant service only, no payroll coverage
- `backend/tests/validators/subscriptionPlan.validator.test.js` — validator only, no payroll coverage

**Result:** No payroll tests exist. Zero test coverage for `createPayroll`, `updatePayroll`, `recalculatePayroll`, or `calculatePayrollFromAttendance`.

**Coverage gaps (recommended regression scenarios):**
1. Backend service test: `updatePayroll` for a `MONTHLY` worker should preserve `monthlySalary`-based `basicSalary`, not overwrite with `presentDays * dailyWage`.
2. Backend service test: `updatePayroll` for a `DAILY` worker with `halfDays > 0` should include `halfDays / 2` in the basic salary calculation.
3. Backend API test: `PUT /api/v1/payroll/:id` should return consistent `basicSalary`/`netSalary` after edit.
4. Backend service test: `recalculatePayroll` (which correctly uses `calculatePayrollFromAttendance`) should produce different results than `updatePayroll` for the same monthly/half-day worker — exposing the divergence.
5. Frontend test (if infrastructure added): Edit payroll modal submit should not alter `basicSalary` for non-calculation field changes.

## Files or Environments Not Inspected

- Frontend `PayrollTable`/`SalaryTable` components do not expose an "Edit" action on the Salary page (`frontend/src/pages/salary/`); editing exists only on the dedicated Payroll page (`frontend/src/pages/payroll/Payroll.jsx`). This was confirmed by reading both pages and their table components.
- The `Payroll` model lacks `salaryType`/`monthlySalary` fields, so `updatePayroll` cannot determine the worker's salary type without an additional worker lookup. This was confirmed by reading `backend/src/models/Payroll.js`.
- No payroll tests were executed because none exist. No test execution results are claimed.

## Recommended Next Action

Fix `updatePayroll()` in `backend/src/services/payroll.service.js` to recalculate `basicSalary` consistently with `calculatePayrollFromAttendance()` — looking up the worker for `salaryType`/`monthlySalary` and accounting for `halfDays` — or preserve the existing `basicSalary` when only non-calculation fields are updated. Then add backend regression tests for monthly and half-day payroll edits. Handoff to Test Planner to define scenarios.

## Handoff to the Next Agent

- Next Agent: Test Planner
- Reports to Read: `.agents/reports/payroll-update-basic-salary/code-auditor-report.md`
- Required Action: Create test scenarios and expected results based on the audit findings, focusing on the `updatePayroll` basic-salary inconsistency for MONTHLY workers and workers with half days.
- Relevant Files: `backend/src/services/payroll.service.js` (lines 494-496, 75-78), `backend/src/validators/payroll.validator.js` `updatePayrollSchema`, `backend/src/models/Payroll.js`, `backend/src/models/Worker.js`
- Tests or Reproduction Steps: Backend service/API tests for `updatePayroll` with MONTHLY and half-day workers; no existing payroll tests to build on.
- Blockers: None.
- Unresolved questions: Whether the intended product behavior is to preserve `basicSalary` on non-calculation edits (e.g., remarks-only changes) rather than recalculating it at all.
