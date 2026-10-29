# Shared Sub-Agent Report Protocol

This directory contains the shared report convention used by all sub-agents in the
`anurag4002/contractor-worker-management` repository. Every agent that participates
in an investigation, planning, testing, execution, or review workflow writes a
role-specific Markdown report into a shared task directory under `.agents/reports/`.

## Directory structure

```text
.agents/
├── agents/
│   ├── code-auditor/
│   │   └── agent.md
│   ├── test-planner/
│   │   └── agent.md
│   ├── test-writer/
│   │   └── agent.md
│   ├── test-runner/
│   │   └── agent.md
│   ├── quality-reviewer/
│   │   └── agent.md
│   ├── qa-orchestrator/
│   │   └── agent.md
│   └── ... other existing agents
│
└── reports/
    ├── README.md
    ├── templates/
    │   ├── code-auditor-report-template.md
    │   ├── test-planner-report-template.md
    │   ├── test-writer-report-template.md
    │   ├── test-runner-report-template.md
    │   └── quality-reviewer-report-template.md
    │
    └── <task-slug>/
        ├── task-context.md
        ├── test-coverage-matrix.md        (project-wide mode)
        ├── code-auditor-report.md
        ├── test-planner-report.md
        ├── test-writer-report.md
        ├── test-runner-report.md
        ├── test-execution-report.md     (project-wide mode)
        ├── quality-reviewer-report.md
        └── final-summary.md   (only when QA Orchestrator or coordinator exists)
```

## Report naming and task identification

Every investigation or testing task must have its own report directory. Use a clear,
stable, kebab-case task slug derived from the task's subject.

| Task | Report directory |
|---|---|
| Payroll basic salary recalculation | `.agents/reports/payroll-update-basic-salary/` |
| Salary slip PDF formatting | `.agents/reports/salary-slip-pdf-formatting/` |
| Worker skill validation | `.agents/reports/worker-skill-validation/` |
| Attendance worker count | `.agents/reports/attendance-total-workers-count/` |

Use consistent filenames for each agent's report:

- `code-auditor-report.md`
- `test-planner-report.md`
- `test-writer-report.md`
- `test-runner-report.md`
- `quality-reviewer-report.md`
- `security-reviewer-report.md` (if that agent exists)
- `qa-orchestrator-report.md` or `final-summary.md` (when the orchestrator consolidates)
- `task-context.md` (initial problem statement and shared task context)

Use the same naming convention for every task. Never create vague files such as
`report-final-new.md`, `report-updated-2.md`, or `latest-report.md`.

## Report templates

Role-specific templates live in `.agents/reports/templates/`. Each agent should copy
the appropriate template into `.agents/reports/<task-slug>/` and fill it in with
findings, evidence, and results.

Templates must not contain fabricated defect findings, test results, or approval
decisions. They are blank scaffolds for agents to populate during real work.

## Shared report protocol

### A. Read before starting

Before doing its assigned work, every agent must:

1. Identify the correct task slug.
2. Check whether the corresponding report directory already exists.
3. Read `task-context.md` when present.
4. Read all relevant reports from previous agents in that directory.
5. Verify important code references and claims against the current repository when
   necessary.
6. Identify what has already been investigated, what remains unresolved, and what
   the next task requires.

If the task directory is unavailable, the agent should derive the task slug from the
supplied issue or task description and create the directory as needed.

If useful task context already exists in the current conversation, use it. Do not ask
the user to repeat information already provided.

### B. Write a report after completing the assigned work

Every agent must create or update its own role-specific Markdown report before returning
its final response. This requirement applies when the agent's outcome is `COMPLETE`,
`BLOCKED`, `NEEDS CLARIFICATION`, `FAILED`, or partially completed with unresolved
questions. An incomplete task is not a reason to skip report creation.

The agent must not simply print the report in chat and leave the expected file unwritten.
It must actually save the file in the repository whenever it has filesystem write access.
If filesystem write access is unavailable, it must clearly report that limitation rather
than claim that a file was created.

Each agent writes to its own report file:

- Code Auditor writes `.agents/reports/<task-slug>/code-auditor-report.md`
- Test Planner writes `.agents/reports/<task-slug>/test-planner-report.md`
- Test Writer writes `.agents/reports/<task-slug>/test-writer-report.md`
- Test Runner writes `.agents/reports/<task-slug>/test-runner-report.md`
- Quality Reviewer writes `.agents/reports/<task-slug>/quality-reviewer-report.md`

The report must contain enough evidence and context for the next agent to continue
from the saved file without starting the investigation again.

### C. Never overwrite another agent's report

Each agent owns its own report file. It may read previous reports, but must not
replace another agent's findings with its own summary.

When the same agent repeats work for the same task:

- Update its own report if it is clearly the same ongoing task.
- Include a revision date and summarize meaningful changes.
- Preserve important earlier findings and test results.
- Do not claim a previous failure is resolved without evidence.
- If the new task is materially different, create a separate task directory.

Do not create duplicate folders for the same task just because another agent is starting.

### D. Separate verified facts from assumptions

Each report must explicitly distinguish:

- Confirmed findings.
- Hypotheses requiring verification.
- Unverified assumptions.
- Test results actually observed.
- Checks not run.
- Environment limitations.
- Unresolved questions.

Never fabricate code locations, line numbers, test logs, execution outcomes, or agent
handoffs.

### E. Pass findings forward explicitly

At the end of each report, include a section called **Handoff to the Next Agent**.

It must describe:

- The next agent's role.
- The report paths the next agent should read.
- Findings and evidence already available.
- What remains to be completed.
- The exact requested action.
- Relevant test commands or reproduction steps.
- Known assumptions and limitations.

The next agent must be able to continue without starting the entire investigation again.

## Report statuses

Use these statuses consistently:

- `NOT STARTED`
- `IN PROGRESS`
- `COMPLETE`
- `BLOCKED`
- `NEEDS CLARIFICATION`
- `FAILED`
- `NOT APPLICABLE`

For test execution, also record actual result categories such as `PASS`, `FAIL`,
`SKIPPED`, `BLOCKED`, and `NOT RUN`.

A report marked `COMPLETE` means the agent completed its assigned task, not
necessarily that the application passed all checks. A Test Runner report can be
complete while its test outcome is `FAIL`. A Quality Reviewer report can be complete
with the recommendation `REQUEST CHANGES`. Do not equate agent task completion with
successful verification.

## Coverage statuses

The shared coverage matrix uses these statuses for module/test-type coverage entries:

- `COVERED` — test implemented and executed (or otherwise verified) with supporting evidence.
- `PARTIAL` — some scenarios covered; meaningful gaps remain.
- `MISSING` — no coverage found for the module or testing type.
- `BLOCKED` — coverage cannot be established in the current environment.
- `NOT APPLICABLE` — testing type not applicable to the module or scope, with reason.

Project-wide reporting adds these task documents:

- `task-context.md`
- `test-coverage-matrix.md`
- `code-auditor-report.md`
- `test-planner-report.md`
- `test-writer-report.md`
- `test-execution-report.md`
- `quality-reviewer-report.md`
- `final-summary.md` (when QA Orchestrator or coordinator exists)

## Restrictions

- Do not create or modify anything under a `skills/` directory.
- Do not create or modify any `SKILL.md` files.
- Do not modify application code, production configuration, package dependencies, or
  test files as part of setting up this report system.
- Do not create actual issue-specific reports or fake test results during setup. The
  report directory structure is for future agent use.
- Do not populate example report directories with fabricated findings.

## Automatic handoff workflow

The report system supports this sequence whenever the relevant agents exist:

```text
Task received
    ↓
Create or locate task-context.md
    ↓
Code Auditor → code-auditor-report.md
    ↓
Test Planner reads audit report → test-planner-report.md
    ↓
Test Writer reads audit + test plan reports → test-writer-report.md
    ↓
Test Runner reads prior reports and runs tests → test-runner-report.md
    ↓
Quality Reviewer reads all relevant reports → quality-reviewer-report.md
    ↓
QA Orchestrator consolidates (when available) → final-summary.md
```

This is a preferred workflow, not an unconditional chain for every issue. The task
scope determines which specialists are required. For example, a test-plan-only request
may not require Test Writer or Test Runner. Security Reviewer must be involved when
relevant security risks warrant it.

Every agent must communicate the report file paths in its handoff. If the runtime
supports real agent delegation, pass the relevant report paths and task context to the
next agent. If it does not, provide a handoff message that explicitly names the next
agent and the reports it should read.

**Never claim that a sub-agent was called just because a report was saved.** File-based
handoff and actual agent invocation are separate capabilities.
