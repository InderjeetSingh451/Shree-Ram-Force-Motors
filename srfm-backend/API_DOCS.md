# Shri Ram Force Motors — Backend API Documentation

Base URL: `http://localhost:4000`

All protected routes require:  
`Authorization: Bearer <token>`

---

## Auth

| Method | Endpoint | Body | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/login` | `{ email, password }` | Admin login — returns JWT token |

**First-time setup:** Run `node seed.js` to create the admin account.  
Default: `admin@srfm.com` / `admin@1234`

---

## Staff

| Method | Endpoint | Body / Query | Description |
|--------|----------|------|-------------|
| GET | `/api/staff/` | — | Get all active staff |
| GET | `/api/staff/:id` | — | Get staff profile + 12-month salary history |
| POST | `/api/staff/add` | multipart/form-data | Add new staff |
| POST | `/api/staff/:id/give-salary` | `{ amountPaid, paymentDate, notes }` | Record a salary payment |
| DELETE | `/api/staff/:id` | — | Soft-delete staff (marks inactive) |

**Add Staff fields:** `name, email, phone, gender, address, joiningDate (YYYY-MM-DD), monthlySalary, imageUrl (file)`

**Give Salary response** updates the current salary period and creates a transaction record.

**Get Staff by ID** returns:
```json
{
  "staff": { ... },
  "salaryPeriods": [
    {
      "periodStart": "...",
      "periodEnd": "...",
      "salaryDue": 10000,
      "remainingFromPrevious": 0,
      "totalPaid": 3000,
      "transactions": [ { "amountPaid": 3000, "paymentDate": "...", "notes": "..." } ]
    }
  ],
  "totalSalaryGiven": 3000,
  "remainingSalary": 7000
}
```

---

## Work

| Method | Endpoint | Body / Query | Description |
|--------|----------|------|-------------|
| GET | `/api/work/` | `?status=Done&search=text` | Get all work (1-year history) |
| GET | `/api/work/pending` | — | Get all pending work |
| POST | `/api/work/add` | `{ workDescription, customerName, customerPhone, customerAddress, vehicleName, vehicleModel }` | Create new work entry |
| PUT | `/api/work/:id/done` | `{ paymentReceived, outsideExpense, remainingPayment, completionDate }` | Mark work as Done |
| PUT | `/api/work/:id/cancel` | `{ cancellationRemarks }` | Mark work as Cancelled |

---

## Dashboard

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/dashboard/` | Monthly analytics — work stats, financial stats, staff stats, recent activity |

---

## Database Schema Summary

### AdminModel
`email, password, name`

### StaffModel  
`name, email, phone, gender, address, joiningDate, monthlySalary, imageUrl, isActive`

### SalaryPeriodModel  
`staff (ref), periodStart, periodEnd, salaryDue, totalPaid, remainingFromPrevious, isSettled`

### SalaryTransactionModel  
`staff (ref), salaryPeriod (ref), amountPaid, paymentDate, notes`

### WorkModel  
`workDescription, customerName, customerPhone, customerAddress, vehicleName, vehicleModel, status (Pending/Done/Cancelled), paymentReceived, outsideExpense, remainingPayment, completionDate, cancellationDate, cancellationRemarks`
