# Code Auditor Report

## Task Information

- Task: Investigate payroll basic-salary recalculation defect (`updatePayroll`) and current repository state
- Task Slug: `payroll-update-basic-salary`
- Agent: Code Auditor
- Date: 2026-10-29
- Status: COMPLETE
- Input Reports Reviewed:
  - `.agents/reports/payroll-update-basic-salary/task-context.md`
  - `.agents/reports/payroll-update-basic-salary/code-auditor-report.md`
  - `.agents/reports/payroll-update-basic-salary/test-planner-report.md`
  - `.agents/reports/payroll-update-basic-salary/test-writer-report.md`
  - `.agents/reports/payroll-update-basic-salary/test-runner-report.md`
  - `.agents/reports/payroll-update-basic-salary/quality-reviewer-report.md`
  - `.agents/reports/README.md`
  - `.agents/reports/templates/code-auditor-report-template.md`

Note: The copies of the above task reports were present at git HEAD (`1af8cf8`) but were deleted in the current working tree (unstaged deletions). They were inspected via git history. The task-context candidate was unconfirmed at intake and has since been addressed.

## Summary

The reported issue concerns payroll salary recalculation on the payroll update workflow: `updatePayroll()` was suspected of recalculating `basicSalary` as `presentDays * dailyWage`, thereby ignoring the worker's `salaryType` / `monthlySalary` and half-day attendance.

Investigation outcome:

- **Confirmed defect (CA-001): `backend/src/services/payroll.service.js` `updatePayroll()` did use the simplified formula `payroll.presentDays * dailyWage`, ignoring `MONTHLY` workers' `monthlySalary` and half days.** The defect was confirmed in code and by the prior test run (TP-002 and TP-003 failed pre-fix, passed post-fix).
- **Fix already present at HEAD:** commit `1af8cf8` ("fix: align payroll update salary calculation") added a worker lookup (`workerRepository.findById`) and replaced the formula with the same logic as `calculatePayrollFromAttendance()` (`worker?.salaryType === 'MONTHLY' ? worker?.monthlySalary || 30000 : dailyWage * (payroll.presentDays + (payroll.halfDays / 2))`).
- **Current-state verification (updated 2026-10-30):** the fix is present in the current working-tree source of `backend/src/services/payroll.service.js` (lines 472–504). The Jest setup syntax error previously described here as current (CA-002) was subsequently repaired during the QA system upgrade; the regression tests were executed and passed post-fix (TP-002, TP-003), confirming the CA-001 fix behavior. Historical evidence preserved.

Overall confidence: High that the original payroll calculation defect existed and was fixed at HEAD; High that the current test-setup syntax error is real and reproducible.

## Implementation Map

### Backend

| File | Role | Relevant Lines |
|------|------|----------------|
| `backend/src/services/payroll.service.js` | Business logic; `calculatePayrollFromAttendance` (22–97), `createPayroll` (103–201), `recalculatePayroll` (207–305), `updatePayroll` (434–538) | basic salary logic 75–78 / 171–181 / 261–269 / 501–504; worker lookup in `updatePayroll` 472–477 |
| `backend/src/repositories/payroll.repository.js` | `findById` (18–52), `update` (130–175) — tenant + soft-delete scoping | tenant scoping 24–26 / 141–143 |
| `backend/src/repositories/worker.repository.js` | `findById` (18–37) — tenant scoping | tenant scoping 24–26 |
| `backend/src/models/Payroll.js` | Payroll schema: `halfDays` (48–52), `presentDays` (36–40), `dailyWage` (72–76), `basicSalary` (84–88) | — |
| `backend/src/models/Worker.js` | Worker schema: `salaryType` (184–188), `dailyWage` (190–194), `monthlySalary` (196–200) | — |
| `backend/src/validators/payroll.validator.js` | `updatePayrollSchema` (52–72) — accepts dailyWage/overtimeRate/bonus/deduction/advanceDeduction/remarks only | — |
| `backend/src/controllers/payroll.controller.js` | `updatePayroll` controller (79–95) | — |
| `backend/src/routes/payroll.routes.js` | `PUT /:id` route (143–150) with auth/tenant/subscription/authorize/validate chain | — |
| `backend/src/middlewares/tenant.middleware.js`, `backend/src/common/utils/tenant.util.js` | Tenant context handling | — |

### Frontend

| File | Role | Relevant Lines |
|------|------|----------------|
| `frontend/src/pages/payroll/Payroll.jsx` | Payroll page; opens `EditPayrollModal` | 117 |
| `frontend/src/components/payroll/EditPayrollModal.jsx` | Edit form; submits dailyWage/overtimeRate/bonus/deduction/advanceDeduction/remarks via `updatePayroll` | form state 26, 30–41; submit 51–69 |
| `frontend/src/context/PayrollContext.jsx` | `updatePayroll` context action → refetch list | 67–79 |
| `frontend/src/services/payroll.service.js` | Axios `PUT /payroll/:id` | 29–32 |
| `frontend/src/hooks/usePayroll.js` | Context hook | 1–10 |

### Tests

| File | Role |
|------|------|
| `backend/tests/payroll/update-payroll.test.js` | Service-level regression tests TP-001…TP-007 + guard (mocked repositories) |
| `backend/tests/setup/jest.setup.js` | Global Jest setup/mocks — **currently syntactically invalid** (see CA-002) |
| `backend/tests/auth/`, `backend/tests/tenant/`, `backend/tests/validators/` | Related suites currently blocked by CA-002 |

## Investigation Steps and Code Paths Traced

1. Read task context (`payroll-update-basic-salary/task-context.md` from git HEAD) — candidate: `updatePayroll()` reportedly recalculates `basicSalary` from `payroll.presentDays * dailyWage`, ignoring monthly salary type and half days.
2. Read the prior agent reports from the task directory at HEAD (code-auditor, test-planner, test-writer, test-runner, quality-reviewer).
3. Read `backend/src/services/payroll.service.js` in full, focusing on `calculatePayrollFromAttendance` (lines 22–97) and `updatePayroll` (lines 434–538).
4. Compared the salary logic:
   - `calculatePayrollFromAttendance` (correct): `worker?.salaryType === 'MONTHLY' ? worker?.monthlySalary || 30000 : dailyWage * (presentDays + (halfDays / 2))`.
   - `updatePayroll` (pre-fix, confirmed at HEAD parent): `payroll.presentDays * dailyWage` — ignored `salaryType`, `monthlySalary`, and `halfDays`.
5. Inspected HEAD commit `1af8cf8` diff: added worker lookup and replaced the formula; current working-tree source contains the fixed version (lines 472–504).
6. Inspected supporting layers: controller (79–95), route PUT /:id (143–150), validator `updatePayrollSchema` (52–72), Payroll/Worker models, payroll & worker repositories (tenant-scoped queries confirmed), tenant util/middleware.
7. Traced frontend path: `Payroll.jsx` → `EditPayrollModal.jsx` (51–69 submit) → `PayrollContext.updatePayroll` (67–79) → `payroll.service.js` `updatePayroll` (29–32) → `PUT /api/v1/payroll/:id`.
8. Inspected related tests and executed checks in the current working tree.

## Findings

Findings are ordered by severity and distinguish confirmed defects from hypotheses.

### CA-001: `updatePayroll()` basic salary ignored worker salary type and half days (CONFIRMED — FIXED AT HEAD)

- **Severity:** Medium (financial calculation inaccuracy on payroll edit)
- **Confidence:** High
- **Affected files:**
  - `backend/src/services/payroll.service.js` — `updatePayroll()` lines 472–477 (worker lookup added by fix), lines 480–504 (calculation, fixed)
  - `backend/src/services/payroll.service.js` — `calculatePayrollFromAttendance()` lines 75–78 (reference/correct logic)
  - `backend/src/models/Worker.js` lines 184–200 (salaryType / dailyWage / monthlySalary)
  - `backend/src/models/Payroll.js` lines 36–88 (presentDays / halfDays / basicSalary)
  - `backend/src/validators/payroll.validator.js` lines 52–72
  - `backend/src/controllers/payroll.controller.js` lines 79–95
  - `backend/src/routes/payroll.routes.js` lines 143–150
  - Frontend: `frontend/src/components/payroll/EditPayrollModal.jsx` lines 26, 30–41, 51–69; `frontend/src/context/PayrollContext.jsx` lines 67–79; `frontend/src/services/payroll.service.js` lines 29–32
- **Evidence:**
  - Pre-fix code (at HEAD parent / prior state): `const basicSalary = payroll.presentDays * dailyWage;`
  - Correct code (`calculatePayrollFromAttendance`): `worker?.salaryType === 'MONTHLY' ? worker?.monthlySalary || 30000 : dailyWage * (presentDays + (halfDays / 2));`
  - HEAD commit `1af8cf8` diff replaced the simplified formula with the worker-aware, half-day-aware formula and added the worker lookup.
- **Expected behavior:** Editing a payroll should recalculate `basicSalary` consistently with `calculatePayrollFromAttendance()` — `monthlySalary` for MONTHLY workers, `dailyWage * (presentDays + halfDays / 2)` for DAILY workers.
- **Actual or suspected behavior (pre-fix):** After editing any payroll, `basicSalary` was overwritten with `presentDays * dailyWage`, ignoring salary type and half days; downstream `grossSalary` / `netSalary` were therefore wrong for MONTHLY workers and half-day cases.
- **Root cause:** Simplified recalculation in `updatePayroll()` lacked access to the worker's salary context and did not account for half days; the fix added a tenant-scoped worker lookup and aligned the formula.
- **Impact:** Incorrect payroll financial values on the edit workflow (financial data integrity); monthly workers and workers with half days affected.
- **Reproduction or verification:** `PUT /api/v1/payroll/:id` with an existing payroll; prior targeted test run showed TP-002 (`Expected: 17600, Received: 16000`) and TP-003 (`Expected: 30000, Received: 17600`) failing pre-fix and passing post-fix; all 8 tests in `backend/tests/payroll/update-payroll.test.js` passed after the fix (per prior test-runner report).
- **Recommended next action:** Resolved at HEAD; no further application-code change required unless regression appears.
- **Test coverage:** `backend/tests/payroll/update-payroll.test.js` (TP-001 remarks-only preservation, TP-002 half days, TP-003 monthly salary, TP-004 dailyWage update, TP-005/006 status guards, TP-007 404, update-not-called guard).

### CA-002: Backend Jest setup file is syntactically invalid — all backend test suites currently fail to load (CONFIRMED)

- **Severity:** High (blocks the entire backend regression suite and verification of the CA-001 fix)
- **Confidence:** High
- **Affected files:**
  - `backend/tests/setup/jest.setup.js` (working-tree version) — malformed `mongoose` mock block around lines 70–92; ESLint parse error at line 91:3 (`Unexpected token }`)
- **Evidence:**
  - `npx eslint tests/setup/jest.setup.js` → `1 problem (1 error, 0 warnings)` — `91:3 error Parsing error: Unexpected token }`.
  - `npx jest --runInBand tests/payroll/update-payroll.test.js` → `FAIL ... SyntaxError: Unexpected token '}'`, suite failed to run, 0 tests executed.
  - Full backend suite run → all 5 test suites failed with the same `SyntaxError: Unexpected token '}'`; `Tests: 0 total`.
  - The git-HEAD version of the same file passes ESLint cleanly (exit code 0), confirming the defect was introduced by the current uncommitted working-tree edit.
- **Expected behavior:** Global Jest setup file parses and suites load normally.
- **Actual or suspected behavior:** Setup file fails to parse; every backend suite using `setupFilesAfterEnv` fails before any test executes.
- **Root cause:** Mangled/misplaced braces and duplicated mock fragments in the `mongoose` `jest.mock(...)` factory in the working-tree version of `backend/tests/setup/jest.setup.js`.
- **Impact:** No backend regression tests can currently run (including the payroll fix verification suite); CI/dev test workflow is broken.
- **Reproduction or verification:** `cd backend && NODE_OPTIONS=--experimental-vm-modules npx jest --runInBand tests/payroll/update-payroll.test.js`
- **Recommended next action:** Repair the syntax error in `backend/tests/setup/jest.setup.js` (restore a valid `mongoose` mock factory), then re-run the targeted payroll suite; expect the previously passing post-fix behavior (8/8) to be reconfirmed.
- **Test coverage:** This defect prevents execution of `backend/tests/payroll/update-payroll.test.js`; no test coverage conclusion can be drawn from the current run.

### CA-003: `updatePayroll()` silently falls back to DAILY basic-salary calculation when worker lookup fails (POTENTIAL / LOW)

- **Severity:** Low
- **Confidence:** Medium
- **Affected files:** `backend/src/services/payroll.service.js` lines 472–504 (`worker?.salaryType === 'MONTHLY' ? ... : ...`).
- **Evidence:** Optional chaining means a missing worker resolves to the DAILY branch (`dailyWage * (presentDays + halfDays / 2)`).
- **Expected behavior:** A missing worker should produce a not-found/invalid-state error rather than silently compute a DAILY salary.
- **Actual behavior:** Silent fallback possible for stale/deleted worker references.
- **Root cause:** No explicit worker-existence guard in the update path (create/recalculate paths validate worker presence).
- **Impact:** Minor; only for inconsistent data states.

## Related Tests Inspected and Coverage Gaps

**Tests inspected:**
- `backend/tests/payroll/update-payroll.test.js` — service-level tests for `updatePayroll` (mocked repositories). Reviewed TP-001 through TP-007 and the not-found guard test.
- `backend/tests/setup/jest.setup.js` — global setup (currently invalid).
- `backend/tests/auth/multi-tenant-auth.test.js`, `backend/tests/tenant/tenant.test.js`, `backend/tests/tenant/tenant.service.test.js`, `backend/tests/validators/subscriptionPlan.validator.test.js` — related suites blocked by CA-02-equivalent setup error.

**Results actually observed in this investigation:**
- `npx eslint tests/setup/jest.setup.js tests/payroll/update-payroll.test.js src/services/payroll.service.js` → 1 error, all in `tests/setup/jest.setup.js`; payroll service and payroll tests lint clean.
- `NODE_OPTIONS=--experimental-vm-modules npx jest --runInBand tests/payroll/update-payroll.test.js` → FAIL: suite failed to run (`SyntaxError: Unexpected token '}'`).
- Full backend suite → 5/5 suites failed to run, 0 tests executed.

**Previously observed (from existing reports at HEAD; not re-run in this session):**
- Pre-fix: TP-002 and TP-003 failed (half-days dropped; MONTHLY salary ignored).
- Post-fix: all 8 targeted tests passed; no regressions attributed to the fix (broader suite failures were environment-related).

**Coverage gaps:**
- API-level Supertest tests (TP-008–TP-013: soft-delete 404, empty-body validation, negative dailyWage, missing permission, cross-tenant, recalculate-vs-update divergence) were not implemented (MongoDB Memory Server unavailable).
- Frontend tests: none (no test script in `frontend/package.json`).

## Reproduction or Verification Steps

1. Confirm fix present: `backend/src/services/payroll.service.js` lines ~472–504 now use worker-aware calculation.
2. Repair `backend/tests/setup/jest.setup.js`.
3. Run: `cd backend && NODE_OPTIONS=--experimental-vm-modules npx jest --runInBand tests/payroll/update-payroll.test.js` — expect 8/8 pass.
4. Full backend suite: `cd backend && NODE_OPTIONS=--experimental-vm-modules npx jest --runInBand` — expect all suites to load.

## Files or Environments Not Inspected

- Live MongoDB data/state; production environment.
- Full frontend build/lint execution.
- Details of `frontend/src/utils/wageCalculator.js` and `reportCalculator.js` (frontend-side gross salary calculations; noted to also use `MONTHLY` vs day-rate logic and status strings that differ from backend enums — inspected, but deemed out of primary scope for this task).

## Recommended Next Action

1. Fix the syntax error in `backend/tests/setup/jest.setup.js` (highest priority — blocks all backend test verification).
2. Re-run `backend/tests/payroll/update-payroll.test.js` to reconfirm the CA-001 fix behavior (8/8 expected pass).
3. Optionally add explicit worker-not-found handling in `updatePayroll` (CA-003).

## Handoff to the Next Agent

- **Next Agent:** Test Runner (primary), then Test Writer/Fix Owner as needed.
- **Reports to Read:** `.agents/reports/payroll-update-basic-salary/code-auditor-report.md` (this report), `.agents/reports/payroll-update-basic-salary/test-runner-report.md`, `.agents/reports/payroll-update-basic-salary/quality-reviewer-report.md`, `.agents/reports/payroll-update-basic-salary/task-context.md`.
- **Required Action:** Repair `backend/tests/setup/jest.setup.js` syntax error and re-run the backend payroll regression suite; confirm CA-001 fix status.
- **Relevant Files:** `backend/tests/setup/jest.setup.js`, `backend/tests/payroll/update-payroll.test.js`, `backend/src/services/payroll.service.js`.
- **Tests or Reproduction Steps:** `cd backend && NODE_OPTIONS=--experimental-vm-modules npx jest --runInBand tests/payroll/update-payroll.test.js`
- **Blockers:** Backend test infrastructure currently broken (CA-002); MongoDB Memory Server previously unavailable for API-level tests.
- **Unresolved questions:** Intended product behavior for remarks-only edits (preserve vs recalculate basicSalary) — prior task context flagged this as unresolved.
