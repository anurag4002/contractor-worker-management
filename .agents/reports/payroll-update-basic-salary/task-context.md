# Task Context — Payroll Update Basic Salary Recalculation

## Task Slug
`payroll-update-basic-salary`

## Candidate Under Investigation (NOT YET CONFIRMED)

In `backend/src/services/payroll.service.js`:

- `calculatePayrollFromAttendance()` uses `worker.monthlySalary` for `MONTHLY` salary workers and accounts for half days (`presentDays + halfDays / 2`).
- `recalculatePayroll()` calls `calculatePayrollFromAttendance()` (consistent).
- `updatePayroll()` reportedly recalculates `basicSalary` from `payroll.presentDays * dailyWage`, potentially ignoring monthly salary type and half days.

## Status
Candidate is unconfirmed. Investigation in progress. Code Auditor to inspect current implementation and determine whether the inconsistency is a confirmed defect or a hypothesis.

## Related Files (to be verified during investigation)
- `backend/src/services/payroll.service.js` — `calculatePayrollFromAttendance()`, `recalculatePayroll()`, `updatePayroll()`
- `backend/src/controllers/payroll.controller.js` — `updatePayroll` controller
- `backend/src/routes/payroll.routes.js` — `PUT /:id` route
- `backend/src/validators/payroll.validator.js` — `updatePayrollSchema`
- `backend/src/models/Payroll.js` — payroll schema fields
- `backend/src/models/Worker.js` — `salaryType`, `monthlySalary`, `dailyWage` fields
- `backend/src/repositories/payroll.repository.js` — `update`, `findById`
- `frontend/src/pages/payroll/Payroll.jsx` — payroll edit page
- `frontend/src/components/payroll/EditPayrollModal.jsx` — edit form and submit
- `frontend/src/context/PayrollContext.jsx` — `updatePayroll` context action
- `frontend/src/services/payroll.service.js` — frontend API `updatePayroll`
- `backend/tests/` — existing payroll tests (expected: none)

## Constraints
- Do not modify application code or test files.
- Investigation is read-only.
- Report findings with file paths, severity, and confidence.
