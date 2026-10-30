# Security Reviewer Report

## Task Information

- Task:
- Task Slug:
- Agent: Security Reviewer
- Date:
- Status: NOT STARTED | IN PROGRESS | COMPLETE | BLOCKED | NEEDS CLARIFICATION | FAILED | NOT APPLICABLE
- Testing mode: FEATURE / REGRESSION | PROJECT_WIDE
- Input Reports Reviewed:

## Summary

Independent security review scope, method, and outcome.

## Security-sensitive scope reviewed

- Authentication and JWT handling.
- Authorization and permissions.
- Tenant isolation.
- IDOR and insecure direct object access.
- Data exposure.
- Input validation.
- Session/token handling.
- Sensitive logs.
- Payment authorization and financial operation boundaries.

## Findings

List findings by severity, highest first. Use the required finding format (ID, severity,
confidence, type, affected file/line, evidence, impact, reproduction, remediation).

### Finding SR-001

- **Title:**
- **Severity:** Critical | High | Medium | Low
- **Confidence:** High | Medium | Low
- **Type:** Confirmed vulnerability | Potential vulnerability | Security test gap | Maintainability concern | Style suggestion
- **Affected file and line:**
- **Evidence:**
- **Impact:**
- **Recommended action:**

## Security test coverage

- Which security scenarios from the Test Planner were implemented/executed.
- JWT verification coverage: mocked tokens must not bypass signature validation; real
  signature verification with test-only secrets required.

## Checks performed

- Read-only inspection only; no destructive testing, no production access, no real payments.

## Handoff to the Next Agent

- Next agent: Quality Reviewer (or QA Orchestrator).
- Report paths to read: this report, `.agents/reports/<task-slug>/test-runner-report.md`,
  `.agents/reports/<task-slug>/code-auditor-report.md`.
- What remains: final independent security-aware review and consolidated QA decision.
