# Test Runner Report

## Task Information

- Task:
- Task Slug:
- Agent: Test Runner
- Date:
- Status: NOT STARTED | IN PROGRESS | COMPLETE | BLOCKED | NEEDS CLARIFICATION | FAILED | NOT APPLICABLE
- Testing mode: FEATURE / REGRESSION | PROJECT-WIDE
- Input Reports Reviewed:

## Summary

State what was tested, why it was tested, and the overall result.

## Commands Executed

List the exact commands, working directories, and actual execution outcomes.

| Command | Working Directory | Exit Status | Outcome |

## Test Results

Report actual counts when available:

- Passed:
- Failed:
- Skipped or pending:
- Blocked:
- Not run:

If the test runner does not provide reliable counts, say so instead of estimating.

## Failure Analysis

For each significant failure, provide:

### Failure TR-001

- **Failing test or command:**
- **Failure category:** Application behavior | Test implementation | Requirement ambiguity | Environment/infrastructure | Security-sensitive | Quality/coverage
- **Expected behavior:**
- **Actual behavior:**
- **Evidence supporting classification:**
- **Reproduced:** Yes | No | Not attempted
- **Confidence in diagnosis:** High | Medium | Low

## Relevant Logs and Stack Traces

Include important failure messages and stack traces, with secrets removed.

## Original Results and Rerun Results

Keep original and rerun results distinct. A passing rerun does not erase the original failure.

## Environment Limitations and Unresolved Issues

Explain any tests that could not be run, missing environment requirements, or incomplete logs.

## Specialist Routing

Identify the receiving specialist, reason, and handoff status. Distinguish clearly between an agent that was actually called and a handoff packet prepared for later processing.

- Suspected application defect → Code Auditor
- Incorrect test or assertion → Test Writer
- Ambiguous expected behavior → Test Planner
- Security-sensitive issue → Security Reviewer (if available)
- Environment problem → report blocker and required prerequisite

## Handoff to the Next Agent

- Next Agent: Quality Reviewer
- Reports to Read: `.agents/reports/<task-slug>/code-auditor-report.md`, `.agents/reports/<task-slug>/test-planner-report.md`, `.agents/reports/<task-slug>/test-writer-report.md`, `.agents/reports/<task-slug>/test-runner-report.md`
- Required Action: Independently review the final diff, tests, and execution evidence; produce a quality assessment.
- Relevant Files:
- Tests or Reproduction Steps:
- Blockers:
