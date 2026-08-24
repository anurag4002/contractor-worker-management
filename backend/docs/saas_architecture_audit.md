# MODULE 0 — SAAS ARCHITECTURE AUDIT

> **Scope of this document:** Read-only architecture audit of the existing
> Contractor Worker Management System (CWMS) backend in preparation for a
> multi-tenant SaaS conversion.
>
> **Rule for this module:** No source files were modified. This document only
> inspects and maps the current system. `tenantId` is **not yet implemented**
> anywhere; every reference below is a *planned* change.

---

## 0. Executive Summary

The current system is a **single-tenant** application. Every business record
(Worker, Site, Attendance, Payroll, Payment, Notification) is stored in a
single global namespace, scoped only by soft-delete flags (`isDeleted`). There
is **no tenant identifier** on any business document.

The biggest risk for the SaaS migration is that **uniqueness constraints are
global today** (e.g. `worker.mobileNumber` is unique across the entire
database). Once multiple contractors share the database, these indexes must
become **compound** with `tenantId`, otherwise two different tenants can never
have a worker with the same mobile number, employee code, etc.

The second risk is that **User plays two roles at once**: it is both the
authentication account and the "contractor / application owner". The SaaS model
must split these concerns:
- `User` becomes an authentication/authorization account that *belongs to* a tenant.
- A new `Tenant` (organization) entity becomes the data boundary.
- The "contractor" concept currently stored as `Worker.contractor -> User`
  should be replaced/paralleled by `tenantId`.

A new **tenant-resolution middleware** and **tenant-scoped query layer** must be
introduced so that every repository query and unique check is automatically
restricted to the current tenant.

---

## 1. Current Authentication Flow

**Files:** `src/services/auth.service.js`, `src/controllers/auth.controller.js`,
`src/routes/auth.routes.js`, `src/middlewares/auth.middleware.js`,
`src/repositories/auth.repository.js`, `src/common/utils/jwt.util.js`

Flow:
1. **Public registration** (`POST /api/v1/auth/register`):
   - `auth.service.js:44` `authRepository.countUsers()` — if `> 0`, registration
     is blocked ("Public registration is disabled").
   - Otherwise it finds the `SUPER_ADMIN` role (`auth.service.js:100`) and
     creates the **first and only SUPER_ADMIN** (`auth.service.js:121`).
   - This is the *only* way the system bootstraps a user today.
2. **Login** (`POST /api/v1/auth/login`): email + password → returns
   `accessToken` + `refreshToken`. JWT payload is:
   ```js
   { userId, email, role: user.role._id }   // auth.service.js:246
   ```
   **No tenant field exists in the token.**
3. **Refresh / Logout / Forgot / Reset / Change Password / Profile** — all
   operate on the global `User` collection with no tenant concept.
4. **`auth.middleware.js:65`** re-builds `req.user` from the token:
   ```js
   req.user = { userId, email, role: user.role.code, permissions: [...] }
   ```
   Again, no tenant context.

**SaaS implication:** The `register` flow is hard-wired to "create SUPER_ADMIN".
In SaaS this must be replaced by a **tenant signup** flow that creates a
`Tenant` + its first **Tenant Admin** user, and the public registration gate
(`countUsers() === 0`) must be removed. Platform SUPER_ADMIN provisioning moves
to a bootstrap/seeder only. The JWT payload must carry `tenantId` (null for
platform accounts).

---

## 2. Current User / Role Architecture

**Files:** `src/models/User.js`, `src/models/Role.js`,
`src/models/Permission.js`, `src/services/user.service.js`,
`src/controllers/user.controller.js`, `src/routes/user.routes.js`,
`src/services/role.service.js`, `src/seeders/role.seeder.js`,
`src/seeders/permission.seeder.js`

- `User.role` → `Role` (required, `User.js:38`).
- `Role.permissions` → `[Permission]` (`Role.js:27`).
- Seeded roles (`role.seeder.js:18`): `SUPER_ADMIN`, `ADMIN`, `HR`,
  `SUPERVISOR`. All flagged `isSystemRole: true` and seeded **globally**.
- `Permission` (`permission.seeder.js`) is a flat global list of
  `module_action` codes.
- `User` also carries `createdBy` / `updatedBy` → `User` (audit trail) and
  `notificationsClearedAt`.

**Dual-purpose User problem:** `User` is *both* the login account *and* the
"contractor / application owner". There is no separate organization/tenant
entity. The worker seeder literally sets `contractor: createdBy`
(`worker.seeder.js:145`) tying a worker to the admin user, not an organization.

**SaaS implication:** `User` gains an optional `tenantId` (null for platform
accounts). Roles/Permissions can remain **platform-level system roles**, but a
tenant may later need custom roles; the data model should allow that. Tenant
Admin users are ordinary `User` rows with a tenant + `ADMIN`/`TENANT_ADMIN`
role.

---

## 3. Current Worker Ownership

**Files:** `src/models/Worker.js`, `src/services/worker.service.js`,
`src/repositories/worker.repository.js`, `src/controllers/worker.controller.js`,
`src/routes/worker.routes.js`, `src/seeders/worker.seeder.js`,
`src/common/utils/worker.util.js`

- `Worker.contractor` → `User` (`Worker.js:166`). This is the *only* ownership
  pointer. **No `tenantId`.**
- `Worker.site` → `Site` (`Worker.js:160`).
- The service has a **commented-out** contractor validation block
  (`worker.service.js:99-119` and `:371-391`) labelled
  *"TODO: Contractor Validation — Uncomment after Contractor module
  implementation."*
- Uniqueness (global today): `employeeCode`, `mobileNumber`, `aadhaarNumber`,
  `panNumber` (`Worker.js:304-325`).
- `worker.util.generateEmployeeCode()` (`worker.util.js:14`) scans the **entire**
  `Worker` collection (`findLatestWorker` in `worker.repository.js:218`) to
  compute the next `EMPxxxxx` code. This is global, not per-tenant.

**SaaS implication:** `Worker` needs `tenantId`. Ownership shifts from
`contractor -> User` to `tenantId`. The `contractor` field becomes redundant
for tenancy (kept only for optional human "contractor" labelling). All unique
indexes must become compound with `tenantId`. `generateEmployeeCode` must be
scoped per tenant.

---

## 4. Current Site Ownership

**Files:** `src/models/Site.js`, `src/services/site.service.js`,
`src/repositories/site.repository.js`, `src/controllers/site.controller.js`,
`src/routes/site.routes.js`, `src/seeders/site.seeder.js`

- **`Site` has NO `tenantId` and NO `contractor` reference.**
- Ownership is only via `createdBy` / `updatedBy` → `User` (`Site.js:113,119`)
  and the embedded `workers: [Worker]` list (`Site.js:135`).
- `siteCode` is **globally unique** (`Site.js:154`).
- `site.service.generateSiteCode()` (`site.service.js:26`) reads the **latest
  global** site to compute the next `SITExxxxx` code (`findLatestSite` in
  `site.repository.js:91`). Global, not per-tenant.

**SaaS implication:** `Site` needs `tenantId`. `siteCode` uniqueness becomes
compound with `tenantId`. Code generation must be tenant-scoped.

---

## 5. Current Attendance Ownership

**Files:** `src/models/Attendance.js`, `src/services/attendance.service.js`,
`src/repositories/attendance.repository.js`,
`src/controllers/attendance.controller.js`,
`src/routes/attendance.routes.js`

- `Attendance.worker` → `Worker`, `Attendance.site` → `Site`
  (`Attendance.js:5,11`). **No `tenantId`.**
- Unique: `{ worker, attendanceDate }` (`Attendance.js:99`).
- Aggregations/filters only check `isDeleted` (`attendance.repository.js`).

**SaaS implication:** `Attendance` needs `tenantId`. The unique index becomes
compound `{ tenantId, worker, attendanceDate }`. Because `worker` and `site`
already belong to a tenant, tenant-scoping is enforced by validating that the
referenced worker/site belongs to the same tenant before write.

---

## 6. Current Payroll Ownership

**Files:** `src/models/Payroll.js`, `src/models/Payment.js`,
`src/services/payroll.service.js`, `src/repositories/payroll.repository.js`,
`src/repositories/payment.repository.js`,
`src/controllers/payroll.controller.js`, `src/routes/payroll.routes.js`

- `Payroll.worker` → `Worker`, `Payroll.site` → `Site` (`Payroll.js:5,11`).
  **No `tenantId`.**
- Unique: `{ worker, attendanceMonth, attendanceYear }` (`Payroll.js:185`).
- `Payment` references `payroll`, `worker`, `site` (`Payment.js:5-21`),
  **no `tenantId`**, no unique index.
- `payroll.service.generateSalaryFromAttendance()`
  (`payroll.service.js:590`) iterates **all** attendance records globally and
  buckets by worker — not tenant-scoped.

**SaaS implication:** `Payroll` and `Payment` need `tenantId`. Unique index
becomes compound `{ tenantId, worker, attendanceMonth, attendanceYear }`. The
generate-salary job and all payment writes must be tenant-scoped.

---

## 7. Current Report Data Flow

**Files:** `src/services/report.service.js`, `src/repositories/report.repository.js`,
`src/controllers/report.controller.js`, `src/routes/report.routes.js`

- `report.service` builds a `filter = { isDeleted: false }` and passes optional
  `search/site/trade/worker/status/month/year` query params to the repository.
- `report.repository` queries `Worker`, `Site`, `Attendance`, `Payroll`
  directly with **no tenant filter** (`report.repository.js:12,39,79,119,151`).
- Cross-tenant leak: a user from tenant A could read tenant B's data simply by
  knowing an id or filtering.

**SaaS implication:** Every report query must inject `tenantId` into its filter.
This is a high-leak-risk area because reports expose aggregated tenant data.

---

## 8. Current Dashboard Data Flow

**Files:** `src/services/dashboard.service.js`,
`src/repositories/dashboard.repository.js`,
`src/controllers/dashboard.controller.js`, `src/routes/dashboard.routes.js`

- `dashboard.repository.getWorkerStats / getSiteStats / getTodayAttendance /
  getPayrollStats / getRecentWorkers / getRecentAttendance / getRecentPayroll`
  all run **global** `countDocuments` / `aggregate` against the whole collection.
- Charts (`getAttendanceChart`, `getPayrollStatusChart`, `getSiteWorkerChart`)
  aggregate globally (`dashboard.repository.js:238,268,305`).
- `getDashboardReport` in `report.repository.js:151` does the same.

**SaaS implication:** Each dashboard query must add `{ tenantId }` to its match
stage. The platform-level SUPER_ADMIN view (all tenants) is a *separate* concern
that must be explicitly opted into, not the default.

---

## 9. Current Authorization Flow

**Files:** `src/middlewares/auth.middleware.js`,
`src/middlewares/authorize.middleware.js`,
`src/common/constants/permissions.constant.js` (empty)

- `auth.middleware` populates `req.user.permissions` (array of permission
  codes) from the user's role.
- `authorize(...required)` (`authorize.middleware.js:6`) checks that
  `req.user.permissions` is a **superset** of the required codes. Returns 403
  otherwise.
- Authorization is **purely permission-based** — there is **no resource
  ownership or tenant check**. Any authenticated user (regardless of tenant)
  with `WORKER_READ` can hit `/workers` and, because the repository returns
  global data, see every tenant's workers.

**SaaS implication:** Tenant isolation must be enforced **in the data layer**
(repository filters), not only in authorization. `authorize` may later gain a
tenant/role context (e.g. tenant-scoped vs platform-scoped), but the
authoritative guard is `tenantId` on every query.

---

## 10. Existing Global Unique Indexes (must become tenant-scoped)

| Model | Index | File:Line | SaaS change |
|-------|-------|-----------|-------------|
| User | `email` | `User.js:143` | compound `{ tenantId, email }` |
| User | `mobileNumber` | `User.js:144` | compound `{ tenantId, mobileNumber }` |
| User | `username` (sparse) | `User.js:145` | compound `{ tenantId, username }` |
| Role | `name` | `Role.js:80` | keep global (platform system roles) |
| Role | `code` | `Role.js:81` | keep global (platform system roles) |
| Permission | `name` | `Permission.js:113` | keep global |
| Permission | `code` | `Permission.js:114` | keep global |
| Worker | `employeeCode` | `Worker.js:304` | compound `{ tenantId, employeeCode }` |
| Worker | `mobileNumber` | `Worker.js:309` | compound `{ tenantId, mobileNumber }` |
| Worker | `aadhaarNumber` | `Worker.js:314` | compound `{ tenantId, aadhaarNumber }` |
| Worker | `panNumber` (sparse) | `Worker.js:319` | compound `{ tenantId, panNumber }` |
| Site | `siteCode` | `Site.js:154` | compound `{ tenantId, siteCode }` |
| Attendance | `{ worker, attendanceDate }` | `Attendance.js:99` | compound `{ tenantId, worker, attendanceDate }` |
| Payroll | `{ worker, attendanceMonth, attendanceYear }` | `Payroll.js:185` | compound `{ tenantId, worker, attendanceMonth, attendanceYear }` |

> Payment and Notification have **no** unique index today. If tenant-scoped
> uniqueness is later required, compound indexes will be added then.

Additional **compound (non-unique)** indexes that also must include `tenantId`
to stay selective: `User` `{email,isDeleted}`, `{mobileNumber,isDeleted}`,
`{username,isDeleted}`; `Attendance` `{site,attendanceDate,isDeleted}`;
`Payroll` `{site:1}`, `{attendanceMonth,attendanceYear}`; plus the many
single-field indexes (`role`, `status`, `isDeleted`, etc.).

---

## 11. Existing Contractor / User References

**Direct `User` references in business models (foreign keys):**
- `Worker.contractor` → `User` (`Worker.js:166`)
- `Worker.createdBy` / `updatedBy` → `User`
- `Site.createdBy` / `updatedBy` → `User`
- `Attendance.createdBy` / `updatedBy` → `User`
- `Payroll.createdBy` / `updatedBy` → `User`
- `Payment.createdBy` → `User`
- `Notification.recipient` → `User`, plus `createdBy` / `updatedBy`
- `Role.createdBy` / `updatedBy` → `User`
- `Permission.createdBy` / `updatedBy` → `User`
- `User.role` → `Role`; `Role.permissions` → `[Permission]`
- `Site.workers` → `[Worker]`

**Where "contractor == User" is used as a proxy for ownership:**
- `worker.service.js:99-119, 371-391` — commented contractor validation.
- `worker.seeder.js:145` — `contractor: createdBy` (admin user used as owner).
- `payroll.service.js` derives `site` from `worker.site`, never from a tenant.

**Conclusion:** Today the "contractor" is just the creating `User`. The SaaS
boundary is the **Tenant**, not the User. `tenantId` replaces the
`Worker.contractor` ownership semantics and is added alongside (not instead of)
the existing `createdBy`/`updatedBy` audit fields.

---

## 12. Files That Will Need `tenantId`

> "Needs `tenantId`" means: the document/model gains a `tenantId` field, **and**
> every read/write path automatically scopes to it. Items marked *(new)* are
> supporting infrastructure that does not exist yet.

### Models (add `tenantId` field + compound indexes)
- `src/models/Worker.js` *(tenant-level)*
- `src/models/Site.js` *(tenant-level)*
- `src/models/Attendance.js` *(tenant-level)*
- `src/models/Payroll.js` *(tenant-level)*
- `src/models/Payment.js` *(tenant-level)*
- `src/models/Notification.js` *(tenant-level)*
- `src/models/User.js` *(optional `tenantId`, null for platform accounts)*
- `src/models/Tenant.js` *(new — the organization entity)*

### Repositories (inject `tenantId` into every query/filter)
- `src/repositories/worker.repository.js`
- `src/repositories/site.repository.js`
- `src/repositories/attendance.repository.js`
- `src/repositories/payroll.repository.js`
- `src/repositories/payment.repository.js`
- `src/repositories/notification.repository.js`
- `src/repositories/dashboard.repository.js`
- `src/repositories/report.repository.js`
- `src/repositories/export.repository.js`
- `src/repositories/user.repository.js` (scope tenant users)
- `src/repositories/auth.repository.js` (resolve by tenant during login)

### Services (accept/propagate `tenantId`, tenant-scoped uniqueness)
- `src/services/worker.service.js`
- `src/services/site.service.js`
- `src/services/attendance.service.js`
- `src/services/payroll.service.js`
- `src/services/dashboard.service.js`
- `src/services/report.service.js`
- `src/services/notification.service.js`
- `src/services/export.service.js`
- `src/services/user.service.js`
- `src/services/auth.service.js` (tenant signup + tenant resolution)

### Controllers (pass `req.tenant.tenantId`, not just `req.user.userId`)
- `src/controllers/worker.controller.js`
- `src/controllers/site.controller.js`
- `src/controllers/attendance.controller.js`
- `src/controllers/payroll.controller.js`
- `src/controllers/dashboard.controller.js`
- `src/controllers/report.controller.js`
- `src/controllers/notification.controller.js`
- `src/controllers/export.controller.js`
- `src/controllers/user.controller.js`
- `src/controllers/auth.controller.js` (handles tenant signup)

### Routes (new tenant signup route; tenant context wired via middleware)
- `src/routes/auth.routes.js` *(add tenant registration endpoint)*
- `src/routes/worker.routes.js`, `site.routes.js`, `attendance.routes.js`,
  `payroll.routes.js`, `dashboard.routes.js`, `report.routes.js`,
  `notification.routes.js`, `export.routes.js`, `user.routes.js`
  *(unchanged structurally; tenant enforced by middleware/repo)*

### Middleware (new + modified)
- `src/middlewares/tenant.middleware.js` *(new — resolve tenant from JWT /
  subdomain / header, set `req.tenant`)*
- `src/middlewares/auth.middleware.js` *(add `tenantId` to JWT payload & `req.user`)*
- `src/middlewares/authorize.middleware.js` *(optional tenant/role context)*

### Utils
- `src/common/utils/worker.util.js` (`generateEmployeeCode` → tenant-scoped)
- `src/common/utils/jwt.util.js` (token payload includes `tenantId`)

### Validators
- `src/validators/auth.validator.js` *(new tenant signup schema)*
- `src/validators/worker.validator.js`, `site.validator.js`, etc.
  *(tenant comes from context, but validation may assert tenant-scoped refs)*

### Seeders (tag seed data with a tenant)
- `src/seeders/site.seeder.js`
- `src/seeders/worker.seeder.js`
- `src/seeders/payroll.seeder.js`
- `src/seeders/attendance.seeder.js`
- `src/seeders/notification.seeder.js`
- `src/seeders/user.seeder.js` *(tenant admin users)*
- `src/seeders/tenant.seeder.js` *(new)*

---

## 13. Files That Must Remain Platform-Level

These are **not** tenant-scoped. They operate across all tenants or define the
system itself.

### Platform / global
- `src/models/Role.js` — system roles (`SUPER_ADMIN`, `ADMIN`, `HR`,
  `SUPERVISOR`) remain global, shared definitions.
- `src/models/Permission.js` — global permission catalog.
- `src/models/User.js` — platform authentication accounts (SUPER_ADMIN) have
  `tenantId: null`; tenant users carry their `tenantId`.
- `src/seeders/admin.seeder.js` — bootstraps the platform SUPER_ADMIN.
- `src/seeders/role.seeder.js` — seeds global system roles.
- `src/seeders/permission.seeder.js` — seeds global permissions.
- `src/seeders/user.seeder.js` — platform/admin user seeding (kept, but
  extended to create tenant admin when seeding a demo tenant).
- `src/middlewares/authorize.middleware.js` — permission logic is platform-wide.
- `src/common/constants/permissions.constant.js` — global permission map.
- `src/database/mongodb.js`, `src/config/*`, `src/app.js` — infrastructure.

### Deferred to later modules (out of scope for this audit)
- **Subscription plans** — `Plan` model, plan catalog (platform-level).
- **Subscriptions** — `Subscription` model linking Tenant ↔ Plan (tenant-level
  record, but managed from platform).
- **Platform statistics** — cross-tenant aggregation endpoints for SUPER_ADMIN
  only (e.g. total tenants, MRR, per-tenant usage). Implemented *after*
  tenancy exists.

---

## PLATFORM-LEVEL vs TENANT-LEVEL (explicit separation)

### PLATFORM-LEVEL (global, not tenant-scoped)
- `SUPER_ADMIN` account & role
- `Role` catalog (system roles) and `Permission` catalog
- Subscription **plans** (plan definitions)
- **Subscriptions** (tenant → plan linkage)
- **Platform statistics** (cross-tenant dashboards for SUPER_ADMIN)
- Authentication core (login, refresh, logout, password reset) — but tokens now
  carry `tenantId`

### TENANT-LEVEL (every record scoped by `tenantId`)
- Tenant admins (`ADMIN`/`TENANT_ADMIN` users within a tenant)
- `Worker`
- `Site`
- `Attendance`
- `Payroll` + `Payment`
- `Report` data (tenant-scoped reports)
- `Notification`
- Tenant-specific roles/permissions (future, optional)

---

## SAAS MIGRATION DEPENDENCY GRAPH

```
[1] Tenant Model + tenantId field
        │
        ├── [2] JWT payload gains tenantId (jwt.util, auth.middleware)
        │        │
        │        ├── [3] tenant.middleware (resolve req.tenant)
        │        │        │
        │        ├── [4] Add tenantId to User model (null for platform)
        │        │
        │        ├── [5] Tenant signup flow (auth.service/controller/route/validator)
        │        │        └── creates Tenant + Tenant Admin user
        │        │
        │        ├── [6] Repository query layer: inject tenantId into ALL filters
        │        │        ├── worker.repository
        │        │        ├── site.repository
        │        │        ├── attendance.repository
        │        │        ├── payroll.repository
        │        │        ├── payment.repository
        │        │        ├── notification.repository
        │        │        ├── dashboard.repository
        │        │        ├── report.repository
        │        │        └── export.repository
        │        │
        │        ├── [7] Convert UNIQUE indexes to compound {tenantId, ...}
        │        │        └── (must run with data backfill; highest risk)
        │        │
        │        ├── [8] Services propagate tenantId + tenant-scoped uniqueness
        │        │        (worker/site code generation, dup checks)
        │        │
        │        ├── [9] Controllers pass req.tenant.tenantId
        │        │
        │        └── [10] Seeders tag data with tenantId
        │
        └── [11] Authorization: keep permission checks; tenant isolation is
                 enforced in data layer (repo), not in authorize()

[12] (LATER MODULES — not this audit) Subscription Plans
        └── [13] Subscriptions (Tenant ↔ Plan)
                └── [14] Platform Statistics / SUPER_ADMIN cross-tenant view
```

**Critical-path note:** Step [7] (unique index conversion) depends on [1] and
[6]; it is the riskiest, non-reversible change and must be done with a
backfill/migration script. Steps [6]→[9] can be implemented behind a single
`tenantId` resolution so that once the repo layer scopes correctly, all
controllers/services inherit isolation.

---

## SAFE IMPLEMENTATION ORDER

1. **Introduce `Tenant` model** + add nullable `tenantId` to `User`
   (platform accounts = `null`). No behavior change yet.
2. **Extend JWT + `auth.middleware`** to carry `tenantId` (null for platform).
   Backward compatible because payload only gains a field.
3. **Add `tenant.middleware`** to resolve `req.tenant` from token
   (subdomain/header later). Mount globally *after* `auth.middleware`.
4. **Add `tenantId` to tenant-level models** (`Worker`, `Site`, `Attendance`,
   `Payroll`, `Payment`, `Notification`) with a **default/nullable** field
   first (no index change yet) so existing code still runs.
5. **Backfill** existing single-tenant data: assign all current rows to a
   single "legacy" tenant (or the seeded SUPER_ADMIN's tenant).
6. **Repository layer**: thread `tenantId` into every query/filter. Do this
   per-module behind the existing function signatures (add `tenantId` param or
   read from a request-scoped context). Verify with tests that cross-tenant
   reads return nothing.
7. **Convert unique indexes to compound `{tenantId, ...}`** (Step [7] of graph).
   Ship with a migration/backfill script; this is the only destructive/risky
   step — do it in its own release with a rollback plan. Include
   `tenantId` in all supporting compound indexes too.
8. **Tenant code generation**: scope `generateEmployeeCode` and
   `generateSiteCode` to the tenant.
9. **Services/Controllers**: pass `req.tenant.tenantId` explicitly; add
   tenant-scoped duplicate checks.
10. **Tenant signup flow**: new `POST /auth/tenant-signup` (or similar) that
    creates a `Tenant` + first Tenant Admin. Remove the
    `countUsers()===0` public-registration gate from `auth.service.register`;
    keep SUPER_ADMIN bootstrap in `admin.seeder` only.
11. **Seeders**: tag demo data with the demo tenant's `tenantId`.
12. **Authorization hardening**: confirm tenant isolation is enforced in the
    data layer; `authorize()` remains permission-based. Optionally add
    platform-only routes guarded by `SUPER_ADMIN`.
13. **(Next modules, not here)** Subscription plans → subscriptions → platform
    statistics. Payment/subscription logic is explicitly **not** implemented in
    this module.

> **Do NOT implement subscription/payment logic in this module.** The only
> payment work touched is ensuring `Payment.tenantId` exists for data
> isolation; no billing/plan enforcement is added yet.
