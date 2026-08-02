# Service Booking & Management System

A robust and modern service booking and management system built using Laravel 13, Inertia.js v2, React 18, and Tailwind CSS v3. The system supports customer mobile apps, provider/company apps, and a web-based administration panel.

---

## Key Features

- **Multi-Role Authentication**:
  - **Admins**: Login via web dashboard using password credentials.
  - **Companies**: Login via web dashboard (using passwords) or via the provider app (using passwords or Google Firebase).
  - **Individual Providers**: Authenticate via the provider app using Google Firebase.
  - **Customers**: Authenticate via the mobile app using Google Firebase.
- **Service & Job Management**: Job requests, service category selection, quote submissions, and job assignments.
- **Payments & Payouts**: Support for customer cards, payments, payout accounts, and disputes.
- **Notifications**: System-wide database-driven custom notifications.
- **Inertia SPAs**: Super fast, client-side rendered frontend pages built using React components without traditional SPA complexity.

---

## Tech Stack

- **PHP**: 8.4
- **Laravel Framework**: 13.x (using Sanctum for API token-based requests)
- **Inertia.js**: v2 (React adapter)
- **React**: 18
- **Tailwind CSS**: v3
- **Firebase SDK**: `kreait/laravel-firebase` (v7)

---

## Local Setup

### 1. Prerequisites
Ensure you have PHP 8.4+, Composer, Node.js, and NPM installed locally.

### 2. Installation
Clone the repository and run the setup script:
```bash
composer run setup
```
This command automatically installs composer and npm dependencies, copies `.env.example` to `.env`, generates the application key, runs migrations, and builds frontend assets.

### 3. Running Locally
To launch the development server along with the queue listeners and Vite watcher, run:
```bash
composer run dev
```

---

## Firebase Authentication Setup

The mobile (customer) and provider/company apps authenticate on the client side using the Firebase SDK. Upon a successful login, they receive a Firebase ID Token (JWT) and submit it to the backend's API login/register endpoints.

To verify these tokens on the backend:
1. Upload your Firebase Service Account JSON key (`firebasekeys.json`) to your storage directory (e.g., `storage/app/firebasekeys.json`).
2. Add the path and project ID configuration to your `.env` file:
   ```env
   FIREBASE_CREDENTIALS=storage/app/firebasekeys.json
   FIREBASE_PROJECT_ID=your-firebase-project-id
   ```

### Mocking Firebase in Development & Testing
To facilitate automated testing and offline development without making actual calls to Google's certificate endpoints, you can enable mock mode in your environment configurations:
```env
FIREBASE_MOCK=true
```
When `FIREBASE_MOCK` is active, the [FirebaseTokenVerifier](file:///home/pasindu/projects/personal/service-management/web-app/app/Services/FirebaseTokenVerifier.php) will verify mock tokens (which start with `valid-mock-` prefix followed by base64-encoded user payloads) and extract user profiles directly.

---

## Running Tests

All logic is covered by PHPUnit feature tests. Run tests using:
```bash
vendor/bin/phpunit
```
To run only the Firebase authentication tests:
```bash
vendor/bin/phpunit tests/Feature/Auth/FirebaseAuthenticationTest.php
```
