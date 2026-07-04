# Authentication Design Document

## Project

Contractor Worker Management System

---

# Authentication Strategy

The application uses **JWT (JSON Web Token)** based authentication with **Access Token** and **Refresh Token**.

Authentication is completely stateless except for storing the refresh token in the database.

---

# User Authentication Flow

```text
Login Request

↓

Validate Request

↓

Find User

↓

Verify Password

↓

Verify Account Status

↓

Verify Role

↓

Generate Access Token

↓

Generate Refresh Token

↓

Store Refresh Token

↓

Update Last Login

↓

Return Tokens
```

---

# Registration Strategy

There is **NO Public Registration**.

Only authenticated users with proper permission can create users.

Example:

Super Admin

↓

Admin

↓

HR

↓

Supervisor

↓

Employee

---

# Authentication Method

JWT Authentication

---

# Access Token

Purpose

- Access Protected APIs

Algorithm

- HS256

Expiry

- 15 Minutes

Storage

- Client Memory

Header

Authorization

```http
Authorization: Bearer <AccessToken>
```

---

# Refresh Token

Purpose

Generate new Access Token

Expiry

7 Days

Storage

Database

Field

```text
User.refreshToken
```

---

# Password

Hash Algorithm

bcrypt

Salt Rounds

10

Password is NEVER stored in plain text.

---

# Login Rules

User must exist.

User must not be deleted.

User status must be ACTIVE.

Role must be ACTIVE.

Password must match.

---

# Failed Login Policy

Maximum Failed Attempts

5

After 5 failed attempts

Account will be locked.

Lock Duration

30 Minutes

---

# Logout Strategy

Remove Refresh Token from database.

Client removes Access Token.

---

# Password Reset Flow

User enters Email

↓

Generate Reset Token

↓

Store Reset Token

↓

Send Email

↓

User clicks Link

↓

Reset Password

↓

Delete Reset Token

---

# Email Verification

Future Feature

---

# Mobile Verification

Future Feature

---

# Role Based Access Control (RBAC)

User

↓

Role

↓

Permission

Permission Format

```text
worker:create

worker:update

worker:delete

attendance:mark

attendance:view

payroll:approve
```

---

# Session Strategy

Single Device Login

New Login

↓

Old Refresh Token Invalid

↓

New Refresh Token Generated

---

# Soft Delete Strategy

Records are NEVER physically deleted.

Fields

```text
isDeleted

deletedAt
```

---

# Audit Fields

Every Model Contains

```text
createdAt

updatedAt

createdBy

updatedBy
```

---

# Security

Helmet

Rate Limiter

CORS

Environment Variables

Password Hashing

JWT

Refresh Token

RBAC

Soft Delete

Centralized Error Handling

Request Validation

---

# Authentication Endpoints

POST /api/v1/auth/login

POST /api/v1/auth/logout

POST /api/v1/auth/refresh-token

POST /api/v1/auth/forgot-password

POST /api/v1/auth/reset-password

POST /api/v1/auth/change-password

GET /api/v1/auth/profile

PUT /api/v1/auth/profile

---

# Response Format

Success

```json
{
    "success": true,
    "message": "Success",
    "data": {}
}
```

Error

```json
{
    "success": false,
    "message": "Invalid Credentials",
    "errors": []
}
```

---

# Authentication Architecture

```text
Controller

↓

Service

↓

Repository

↓

MongoDB
```

Business Logic only exists in Service Layer.

Repository only performs Database Operations.

Controller only handles HTTP Request and Response.

---

# Future Improvements

Refresh Token Rotation

Redis Session Store

Multi Device Login

OAuth Login

Two Factor Authentication (2FA)

Device Management

Audit Logging

Login History

Geo Location Tracking

IP Whitelisting