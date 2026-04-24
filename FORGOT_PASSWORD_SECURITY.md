# Secure Forgot Password Flow - Implementation Guide

## Overview

This refactored forgot password page implements security best practices to prevent unauthorized password resets, account enumeration attacks, and brute force attempts.

---

## Security Architecture

### 3-Step Verification Process

1. **Verify Account** - Email + Date of Birth verification
2. **Verify OTP** - 6-digit OTP sent to registered email
3. **Reset Password** - Create new password with strength validation

---

## Security Features Implemented

### 1. Account Enumeration Prevention

**Problem:**  
Attackers can discover which emails are registered by checking responses.

**Solution:**  
Always show the same message regardless of whether the account exists:

```
"If the account exists, an OTP has been sent to the registered email."
```

**Implementation:**
- Never display "Email not found" or "Account doesn't exist"
- Send OTP only to registered email (real owner receives notification)
- If attacker enters wrong email → still shows same message
- OTP is only valid for the registered email

---

### 2. Identity Verification (Dual Layer)

**Backend Validation Required:**
```
Email + Date of Birth must match database records
```

This two-factor verification prevents attackers from resetting passwords for accounts they don't own.

**Database Check:**
```sql
SELECT user_id 
FROM users 
WHERE email = ? AND date_of_birth = ?
LIMIT 1
```

---

### 3. OTP Security

#### OTP Generation & Storage
```
- Length: 6 digits
- Expiration: 5 minutes
- Max Attempts: 3 failed attempts
- Storage: Hash only (never store plain text)
```

**Backend Implementation:**
```typescript
// Do NOT do this:
const otp = "824915"; // WRONG - never store plain text

// Do this instead:
import bcrypt from 'bcrypt';
const hashedOTP = bcrypt.hashSync("824915", 10);
```

#### OTP Delivery
```
- Send OTP ONLY to registered email
- Display masked email to user: j***.c***@email.com
- Set expiration: 5 minutes from generation
- Track failed attempts per OTP
```

#### OTP Verification
```typescript
// Verify OTP
const isValidOTP = await bcrypt.compare(userInputOTP, hashedOTP);

// Check expiration
if (currentTime > otpExpiredAt) {
  return { success: false, message: "OTP has expired" };
}

// Check attempts
if (failedAttempts >= 3) {
  return { success: false, message: "Max attempts exceeded" };
}

// Check if OTP matches email
if (otpEmail !== requestEmail) {
  return { success: false };
}
```

---

### 4. Rate Limiting (Backend Required)

**Prevent Spam & Brute Force:**

```
Max 5 password reset requests per hour per IP address
```

**Implementation Example:**
```typescript
// Track password reset attempts per IP
async function checkRateLimit(ipAddress: string) {
  const recentRequests = await db.query(
    `SELECT COUNT(*) as count FROM password_reset_logs 
     WHERE ip_address = ? 
     AND created_at > NOW() - INTERVAL 1 HOUR`,
    [ipAddress]
  );

  if (recentRequests[0].count >= 5) {
    return {
      success: false,
      message: "Too many attempts. Try again later.",
      retryAfter: 3600 // 1 hour in seconds
    };
  }

  return { success: true };
}

// Log every password reset attempt
await db.query(
  `INSERT INTO password_reset_logs (email, ip_address, status) 
   VALUES (?, ?, ?)`,
  [email, ipAddress, "initiated"]
);
```

---

### 5. Security Alert Email to Account Owner

**When:** A password reset is requested  
**Purpose:** Warn real owner if someone else is trying to reset password

**Email Template:**
```
Subject: Password Reset Request for Your Account

Hi [Name],

A password reset was requested for your account.

If this was you, you can ignore this email.

Reset Details:
- Time: April 24, 2026 at 2:30 PM EST
- IP Address: 192.168.1.5
- Location: New York, USA

If this wasn't you, your account is secure. 
The person attempting the reset cannot access your account 
without your OTP code.

---
Your Security Team
Golden West Colleges
```

**Implementation:**
```typescript
// After successful OTP request, send alert email
async function sendSecurityAlert(email: string, ipAddress: string) {
  await emailService.send({
    to: email,
    template: 'password_reset_alert',
    data: {
      timestamp: new Date(),
      ipAddress: ipAddress,
      location: getLocationFromIP(ipAddress) // Optional: IP geolocation
    }
  });
}
```

---

### 6. Password Strength Requirements

**Minimum Requirements:**
- ✓ At least 8 characters
- ✓ Contains letters AND numbers
- ✓ Contains special characters (!@#$%^&*)

**JavaScript Validation (Frontend):**
```typescript
function isPasswordValid(password: string): boolean {
  const lengthValid = password.length >= 8;
  const lettersAndNumbers = /[a-zA-Z]/.test(password) && /[0-9]/.test(password);
  const specialChar = /[^a-zA-Z0-9]/.test(password);
  return lengthValid && lettersAndNumbers && specialChar;
}
```

**Backend Validation (REQUIRED):**
```typescript
// Always validate on backend - never trust frontend validation
function validatePassword(password: string): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push("Password must be at least 8 characters");
  }
  if (!/[a-zA-Z]/.test(password)) {
    errors.push("Password must contain letters");
  }
  if (!/[0-9]/.test(password)) {
    errors.push("Password must contain numbers");
  }
  if (!/[^a-zA-Z0-9]/.test(password)) {
    errors.push("Password must contain special characters");
  }

  return {
    valid: errors.length === 0,
    errors
  };
}
```

---

### 7. Password Storage

**Hashing Algorithm:**  
Use `bcrypt` or `argon2` (NOT MD5, SHA-1, SHA-256 alone)

```typescript
import bcrypt from 'bcrypt';

async function resetPassword(email: string, newPassword: string) {
  // Validate password
  const validation = validatePassword(newPassword);
  if (!validation.valid) {
    return { success: false, errors: validation.errors };
  }

  // Hash password with salt
  const hashedPassword = await bcrypt.hash(newPassword, 12);

  // Update database
  await db.query(
    'UPDATE users SET password_hash = ? WHERE email = ?',
    [hashedPassword, email]
  );

  // Invalidate all existing sessions
  await db.query(
    'DELETE FROM user_sessions WHERE user_id = ?',
    [userId]
  );

  // Send confirmation email
  await sendPasswordResetConfirmation(email);

  return { success: true };
}
```

---

## Required Backend Endpoints

### 1. Send OTP Endpoint

**Route:** `POST /api/student_auth/send-otp`

**Request:**
```json
{
  "email": "juan.cruz@email.com",
  "dob": "2000-05-15"
}
```

**Response - Success:**
```json
{
  "success": true,
  "message": "OTP sent to registered email"
}
```

**Response - Error (Same message for security):**
```json
{
  "success": false,
  "message": "If the account exists, an OTP has been sent to the registered email."
}
```

**Backend Logic:**
```typescript
async function sendOTP(email: string, dob: string) {
  // Check rate limit
  const rateLimitCheck = await checkRateLimit(req.ip);
  if (!rateLimitCheck.success) {
    return { success: false, message: "Too many attempts" };
  }

  // Verify email + DOB combination
  const user = await db.query(
    'SELECT id, email, date_of_birth FROM users WHERE email = ? AND date_of_birth = ?',
    [email, dob]
  );

  // ALWAYS return same message (prevents account enumeration)
  if (!user) {
    // Log attempt
    await logSecurityEvent('failed_password_reset_attempt', { email, ip: req.ip });
    return {
      success: false,
      message: "If the account exists, an OTP has been sent to the registered email."
    };
  }

  // Generate OTP
  const otp = generateOTP(6); // 6 random digits
  const hashedOTP = await bcrypt.hash(otp, 10);

  // Store OTP (with 5-minute expiration)
  await db.query(
    `INSERT INTO password_reset_otps (user_id, otp_hash, expires_at, attempts_remaining)
     VALUES (?, ?, DATE_ADD(NOW(), INTERVAL 5 MINUTE), 3)`,
    [user.id, hashedOTP]
  );

  // Send OTP to email
  await emailService.send({
    to: email,
    template: 'password_reset_otp',
    data: { otp }
  });

  // Send security alert
  await sendSecurityAlert(email, req.ip);

  // Log successful OTP request
  await logSecurityEvent('otp_requested', { user_id: user.id, ip: req.ip });

  return { success: true };
}
```

---

### 2. Verify OTP Endpoint

**Route:** `POST /api/student_auth/verify-otp`

**Request:**
```json
{
  "email": "juan.cruz@email.com",
  "otp": "824915"
}
```

**Response - Success:**
```json
{
  "success": true,
  "message": "OTP verified",
  "token": "reset_session_token_xyz"
}
```

**Response - Error:**
```json
{
  "success": false,
  "message": "Invalid OTP"
}
```

**Backend Logic:**
```typescript
async function verifyOTP(email: string, otp: string) {
  // Get user
  const user = await db.query(
    'SELECT id FROM users WHERE email = ?',
    [email]
  );

  if (!user) {
    return { success: false, message: "Invalid OTP" };
  }

  // Get OTP record
  const otpRecord = await db.query(
    `SELECT * FROM password_reset_otps 
     WHERE user_id = ? AND expires_at > NOW()
     ORDER BY created_at DESC LIMIT 1`,
    [user.id]
  );

  if (!otpRecord) {
    return { success: false, message: "OTP expired or not found" };
  }

  // Check attempts
  if (otpRecord.attempts_remaining <= 0) {
    return { success: false, message: "Too many attempts. Request new OTP." };
  }

  // Verify OTP hash
  const isValid = await bcrypt.compare(otp, otpRecord.otp_hash);

  if (!isValid) {
    // Decrement attempts
    await db.query(
      'UPDATE password_reset_otps SET attempts_remaining = attempts_remaining - 1 WHERE id = ?',
      [otpRecord.id]
    );

    return { success: false, message: "Invalid OTP" };
  }

  // Mark OTP as used
  await db.query(
    'UPDATE password_reset_otps SET verified_at = NOW() WHERE id = ?',
    [otpRecord.id]
  );

  // Create reset session token (expires in 15 minutes)
  const resetToken = generateSecureToken();
  await db.query(
    `INSERT INTO password_reset_sessions (user_id, token, expires_at)
     VALUES (?, ?, DATE_ADD(NOW(), INTERVAL 15 MINUTE))`,
    [user.id, resetToken]
  );

  return {
    success: true,
    token: resetToken
  };
}
```

---

### 3. Reset Password Endpoint

**Route:** `POST /api/student_auth/reset-password`

**Request:**
```json
{
  "email": "juan.cruz@email.com",
  "newPassword": "SecurePass123!",
  "resetToken": "reset_session_token_xyz"
}
```

**Response - Success:**
```json
{
  "success": true,
  "message": "Password reset successful"
}
```

**Response - Error:**
```json
{
  "success": false,
  "message": "Failed to reset password"
}
```

**Backend Logic:**
```typescript
async function resetPassword(email: string, newPassword: string, resetToken: string) {
  // Validate reset token
  const session = await db.query(
    `SELECT user_id FROM password_reset_sessions 
     WHERE token = ? AND expires_at > NOW()`,
    [resetToken]
  );

  if (!session) {
    return { success: false, message: "Invalid or expired reset token" };
  }

  // Get user
  const user = await db.query(
    'SELECT id FROM users WHERE email = ?',
    [email]
  );

  if (!user || user.id !== session.user_id) {
    return { success: false, message: "Authorization failed" };
  }

  // Validate password
  const validation = validatePassword(newPassword);
  if (!validation.valid) {
    return { success: false, errors: validation.errors };
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(newPassword, 12);

  // Update password
  await db.query(
    'UPDATE users SET password_hash = ? WHERE id = ?',
    [hashedPassword, user.id]
  );

  // Invalidate all sessions
  await db.query(
    'DELETE FROM user_sessions WHERE user_id = ?',
    [user.id]
  );

  // Mark reset session as completed
  await db.query(
    'UPDATE password_reset_sessions SET completed_at = NOW() WHERE token = ?',
    [resetToken]
  );

  // Clean up OTPs
  await db.query(
    'DELETE FROM password_reset_otps WHERE user_id = ?',
    [user.id]
  );

  // Send confirmation email
  await sendPasswordResetConfirmation(email);

  // Log event
  await logSecurityEvent('password_reset_completed', { user_id: user.id });

  return { success: true };
}
```

---

## Integration Steps

### 1. Update the Handler Import

In your page routing file, import and initialize the handler:

```typescript
import { renderForgotPasswordPage } from './pages/login/forgot_password_page'
import './pages/login/forgot_password_handler'

// When rendering the page
const html = renderForgotPasswordPage()
```

### 2. Configure API Endpoints

Update the API endpoints in `forgot_password_handler.ts`:

```typescript
const API_BASE = '/api/student_auth'

async sendOTP(email: string, dob: string) {
  const response = await fetch(`${API_BASE}/send-otp`, {
    // ... existing code
  })
}
```

### 3. Backend Database Schema

```sql
-- Users table
ALTER TABLE users ADD COLUMN date_of_birth DATE;

-- OTP storage
CREATE TABLE password_reset_otps (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  otp_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  expires_at TIMESTAMP NOT NULL,
  verified_at TIMESTAMP NULL,
  attempts_remaining INT DEFAULT 3,
  FOREIGN KEY (user_id) REFERENCES users(id),
  INDEX idx_user_expires (user_id, expires_at)
);

-- Reset sessions
CREATE TABLE password_reset_sessions (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  token VARCHAR(255) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  expires_at TIMESTAMP NOT NULL,
  completed_at TIMESTAMP NULL,
  FOREIGN KEY (user_id) REFERENCES users(id),
  INDEX idx_token_expires (token, expires_at)
);

-- Security logs
CREATE TABLE security_event_logs (
  id INT PRIMARY KEY AUTO_INCREMENT,
  event_type VARCHAR(50) NOT NULL,
  user_id INT,
  ip_address VARCHAR(45),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  data JSON,
  INDEX idx_user_time (user_id, created_at),
  INDEX idx_event_time (event_type, created_at)
);

-- Password reset attempt logs
CREATE TABLE password_reset_logs (
  id INT PRIMARY KEY AUTO_INCREMENT,
  email VARCHAR(255),
  ip_address VARCHAR(45),
  status VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_ip_time (ip_address, created_at),
  INDEX idx_time (created_at)
);
```

---

## Testing Checklist

- [ ] Email + DOB verification works
- [ ] OTP expires after 5 minutes
- [ ] OTP fails after 3 attempts
- [ ] Rate limiting prevents spam (5 attempts per hour)
- [ ] Doesn't reveal if email exists
- [ ] Security alert email sent to account owner
- [ ] OTP sent only to registered email
- [ ] Password strength validation works
- [ ] Confirmation email sent after reset
- [ ] All sessions invalidated after password reset

---

## Security Best Practices Summary

✅ **DO:**
- Send OTP to registered email only
- Show same message for existing/non-existing accounts
- Expire OTP after 5 minutes
- Limit OTP attempts to 3
- Hash passwords with bcrypt/argon2
- Validate on backend (don't trust frontend)
- Log all security events
- Implement rate limiting
- Send confirmation emails
- Invalidate all sessions after password reset

❌ **DON'T:**
- Store OTP in plain text
- Display "Email not found"
- Allow unlimited OTP attempts
- Reuse same password reset link
- Store passwords as MD5/SHA-1/SHA-256 (use bcrypt/argon2)
- Trust frontend validation alone
- Send password in email
- Allow password reset without OTP verification

---
