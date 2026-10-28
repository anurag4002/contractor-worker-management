# Code Auditor Report

## Task Information

- Task:
- Task Slug:
- Agent: Code Auditor
- Date:
- Status: NOT STARTED | IN PROGRESS | COMPLETE | BLOCKED | NEEDS CLARIFICATION | FAILED | NOT APPLICABLE
- Input Reports Reviewed:

## Summary

Describe the problem, investigation outcome, and overall confidence in a few sentences.

## Implementation Map

List the key files and explain their roles in the relevant execution path. Include exact paths and line numbers where available.

## Investigation Steps and Code Paths Traced

Describe the files inspected, imports followed, middleware/controller/service/repository layers traced, and the execution path from UI to database (or frontend-only path) that was examined.

## Findings

List findings ordered by severity, highest first. Clearly distinguish confirmed defects from unverified hypotheses.

### Finding CA-001

- **Title:**
- **Severity:** Critical | High | Medium | Low
- **Confidence:** High | Medium | Low
- **Affected files:**
- **Evidence:**
- **Expected behavior:**
- **Actual or suspected behavior:**
- **Root cause:**
- **Impact:**
- **Reproduction or verification:**
- **Recommended next action:**
- **Test coverage:**

## Related Tests Inspected and Coverage Gaps

List existing test files reviewed, results of any tests actually executed, and important missing regression scenarios.

## Reproduction or Verification Steps

Concrete steps or checks to reproduce the symptom or verify the fix.

## Files or Environments Not Inspected

State any files, environments, database states, reproduction details, or checks that could not be accessed or verified.

## Recommended Next Action

The smallest useful next action and any specialist handoffs needed.

## Handoff to the Next Agent

- Next Agent: Test Planner
- Reports to Read: `.agents/reports/<task-slug>/code-auditor-report.md`
- Required Action: Create test scenarios and expected results based on the audit findings.
- Relevant Files:
- Tests or Reproduction Steps:
- Blockers:
