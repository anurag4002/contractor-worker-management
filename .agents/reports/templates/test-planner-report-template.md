# Test Planner Report

## Task Information

- Task:
- Task Slug:
- Agent: Test Planner
- Date:
- Status: NOT STARTED | IN PROGRESS | COMPLETE | BLOCKED | NEEDS CLARIFICATION | FAILED | NOT APPLICABLE
- Testing mode: FEATURE / REGRESSION | PROJECT-WIDE
- Input Reports Reviewed:

## Summary

Describe the test plan objective, scope, and overall confidence in a few sentences.

## Task Objective and Scope

Describe the feature or workflow being tested, what is in scope, and what is out of scope.

## Requirements and Assumptions

List the requirements being tested and any assumptions made, clearly labeling inferred expectations.

## Relevant Implementation Findings from Code Auditor

Summarize the Code Auditor's findings that influence the test plan, including root causes and affected code paths.

## Test Scenarios and Cases

Use a Markdown table with these columns:

| Test ID | Scenario | Priority | Preconditions | Test Data | Steps | Expected Result | Test Level | Coverage Status |

Each test case must be independently understandable and actionable. Test ID format: `TP-001`, `TP-002`, etc.

### Example scenario

| TP-001 | Valid attendance submission is saved with correct worker, site, date, and status | P1 | Authenticated user with PAYROLL_WRITE permission; worker and site exist | Worker ID, site ID, attendance date, status | POST /api/v1/attendance with valid payload | Response status 201; saved record matches input | Backend | Existing coverage: not found |

## Preconditions and Test Data

Describe required test accounts and roles, tenant setup, required records and relationships, input data and boundary values, environment prerequisites, and setup/cleanup considerations. Use fictional test data only.

## Negative Cases and Boundary Conditions

Include important invalid inputs, access-control failures, edge values, missing records, and relevant API or UI failure cases.

## Regression Scope

List the existing workflows most likely to be affected by a change and explain why they should be rechecked.

## Existing Test Coverage and Gaps

Describe which test files were inspected, what coverage was actually found, what appears missing, and anything that could not be verified.

## Execution Recommendations

Recommend the logical order for running the tests and the applicable existing commands. Include environment prerequisites and distinguish automated tests from manual checks.

## Handoff to the Next Agent

- Next Agent: Test Writer
- Reports to Read: `.agents/reports/<task-slug>/code-auditor-report.md`, `.agents/reports/<task-slug>/test-planner-report.md`
- Required Action: Implement automated tests based on the planned scenarios and expected results.
- Relevant Files:
- Tests or Reproduction Steps:
- Blockers:
