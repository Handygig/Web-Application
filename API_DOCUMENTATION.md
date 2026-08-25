# HandyGig Portal Admin Dashboard API Documentation

## Base URL
- Web Application: `http://localhost:8000`
- REST API Base: `http://localhost:8000/api`

---

## Authentication

### Admin Login
- **URL**: `POST /api/auth/login`
- **Request Body**:
```json
{
  "email": "admin@example.com",
  "password": "password"
}
```

---

## Admin Endpoints (`/api/admin/*`)
Requires header: `Authorization: Bearer <token>`

### Profile
- `GET /api/admin/profile`
- `PUT /api/admin/profile`
- `PUT /api/admin/profile/password`

### Customer Management
- `GET /api/admin/customers?page=1&limit=10&search=john&status=active`
- `GET /api/admin/customers/statistics`
- `GET /api/admin/customers/:id`
- `PUT /api/admin/customers/:id`
- `PATCH /api/admin/customers/:id/suspend`
- `PATCH /api/admin/customers/:id/activate`
- `PATCH /api/admin/customers/:id/ban`

### Provider Management
- `GET /api/admin/providers?page=1&limit=10&search=tech`
- `GET /api/admin/providers/statistics`
- `GET /api/admin/providers/:id`
- `PUT /api/admin/providers/:id`

### KYC / KYB Verification
- `GET /api/admin/kyc-kyb`
- `GET /api/admin/kyc-kyb/statistics`
- `GET /api/admin/kyc-kyb/:id`
- `PATCH /api/admin/kyc-kyb/:id/approve`
- `PATCH /api/admin/kyc-kyb/:id/reject` - `{ "reason": "Illegible ID document" }`

### Banned Accounts
- `GET /api/admin/banned-accounts`
- `GET /api/admin/banned-accounts/:id`
- `PATCH /api/admin/banned-accounts/:id/unban`

### Property Types
- `GET /api/admin/property-types`
- `POST /api/admin/property-types`
- `PUT /api/admin/property-types/:id`
- `PATCH /api/admin/property-types/:id/activate`
- `PATCH /api/admin/property-types/:id/deactivate`
- `DELETE /api/admin/property-types/:id`

### Job Types
- `GET /api/admin/job-types`
- `POST /api/admin/job-types`
- `PUT /api/admin/job-types/:id`
- `PATCH /api/admin/job-types/:id/activate`
- `PATCH /api/admin/job-types/:id/deactivate`
- `DELETE /api/admin/job-types/:id`

### Bookings
- `GET /api/admin/bookings`
- `GET /api/admin/bookings/statistics`
- `GET /api/admin/bookings/:id`
- `PATCH /api/admin/bookings/:id/status` - `{ "status": "confirmed" }`
- `PATCH /api/admin/bookings/:id/cancel`

### Dashboard & Metrics
- `GET /api/admin/dashboard`
- `GET /api/admin/dashboard/booking-analytics`
- `GET /api/admin/dashboard/revenue`
- `GET /api/admin/payouts/pending`
- `GET /api/admin/reviews/recent`
- `GET /api/admin/system/health`

### Audit Logs
- `GET /api/admin/audit-logs`
