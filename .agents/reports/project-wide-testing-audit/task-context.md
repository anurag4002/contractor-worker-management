# Task Context — QA Agent System Upgrade for Comprehensive Full-Project Testing

## Task

Upgrade the QA sub-agent system for the Contractor Worker Management application so it can support comprehensive full-project testing across unit, service, API, integration, component, E2E, acceptance, regression, security, performance, accessibility, reliability, data-integrity, and manual testing types.

## Objective

Audit and improve all existing QA sub-agents; create a QA orchestrator; create a shared testing strategy; update reporting protocol and templates; establish FEATURE / REGRESSION and PROJECT-WIDE testing modes; add a project-wide coverage matrix.

## Modes

- Feature / Regression mode: used for specific bug fixes or features.
- Project-wide mode: used when auditing/testing the entire application.

## Scope of this task

- Agent definitions under `.agents/agents/`.
- Shared strategy at `.agents/TESTING-STRATEGY.md`.
- Reports/templates under `.agents/reports/`.
- New project-wide reporting artifacts under `.agents/reports/project-wide-testing-audit/`.

## Constraints

- No `skills/` or `SKILL.md` changes.
- No application source code or production configuration changes.
- No destructive commands, real payments, or production database access.
- No push, merge, or PR creation.
- Local commit only: `chore: expand QA agents for full-stack testing`.

## Current working-tree context at task start

- Branch: `chore/expand-advanced-qa-testing` (created from `main`).
- Backend production fix for payroll update basic-salary recalculation already present at HEAD (`1af8cf8`).
- Regression tests added under `backend/tests/payroll/` and validator tests under `backend/tests/validators/`.
- Jest setup file repaired so backend suites can load.
- Targeted backend payroll/validator suites executed: 38/38 passed.
- Full backend suite: 2 suites failed (auth, tenant service) — likely test-implementation/mock issues, unrelated to payroll.

## Unresolved questions

- Whether the QA orchestrator should also own final consolidated approval in this environment.
- How the project-wide coverage matrix should be maintained as new modules are added.

## Status

IN PROGRESS — agent and documentation updates being applied.
