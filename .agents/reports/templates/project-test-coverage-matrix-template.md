# Project Test Coverage Matrix

## Task Information

- Task:
- Task Slug:
- Agent: Test Planner
- Date:
- Status: NOT STARTED | IN PROGRESS | COMPLETE | BLOCKED | NEEDS CLARIFICATION | FAILED | NOT APPLICABLE
- Testing mode: PROJECT_WIDE
- Input Reports Reviewed:

## Purpose

Map every application module to the testing types that apply, and record the coverage
status for each module / testing-type combination.

## Coverage statuses

Use exactly one of:

- `COVERED`
- `PARTIAL`
- `MISSING`
- `BLOCKED`
- `NOT APPLICABLE`

Each entry must include evidence or a reason.

## Matrix

| Module | Frontend artifacts | Backend artifacts | Testing types | Status | Evidence / notes |

Example rows (to be filled per discovered module):

| Module | Frontend artifacts | Backend artifacts | Testing types | Status | Evidence / notes |
|---|---|---|---|---|---|
| Authentication and session handling | `frontend/src/pages/...`, `frontend/src/context/AuthContext.jsx`, `frontend/src/services/auth.service.js`, `frontend/src/api/axios.js` | `backend/src/routes/auth.routes.js`, `backend/src/middlewares/auth.middleware.js`, `backend/src/controllers/auth.controller.js`, `backend/src/services/auth.service.js`, `backend/src/repositories/auth.repository.js`, `backend/src/models/User.js`, `backend/src/models/Role.js`, `backend/src/validators/auth.validator.js` | API/contract, security, database integration, E2E where possible, smoke | MISSING | No automated auth coverage confirmed for all flows. |

<!-- Add one row per module discovered in project-wide mode. Do not fabricate evidence. -->

## Module inventory

List discovered modules and whether they were reviewed:

1. Authentication and session handling
2. Users, roles, and permissions
3. Tenants, onboarding, and tenant isolation
4. Worker profiles and validation
5. Site and worker assignments
6. Attendance, histories, summaries
7. Payroll generation, editing, recalculation, advances, salary payments
8. Payment history and salary slips
9. Dashboard totals and charts
10. Reports and PDF/Excel exports
11. Notifications
12. Subscription plans, subscriptions, subscription payments
13. Platform and super-admin operations
14. Shared middleware, validation, database handling, API configuration, rate limiting, error handling

## Execution evidence summary

Record which test commands were run, per module or suite, with actual results.

## Open questions

List unresolved requirements or ambiguities that prevent final coverage decisions.
