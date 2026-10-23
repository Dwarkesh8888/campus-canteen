# Campus Canteen Management System

A full-stack Campus Canteen Management application built with React, Express, and MongoDB.

## Features & Implementation Overview

- **Task 1 — The Menu**:
  - Interactive menu cards with category badges, rupee formatting (`₹25.00`), portion weight (`g`), calculated energy (`kcal`), and live availability flags.
  - Energy calculation: `Math.round(caloriesPer100g * (weightG ?? 100) / 100)`.
- **Task 2 — The Order**:
  - Client-side routing between Menu, Order, and Specials.
  - Dynamic customer name header (`Order for: <name>`).
  - Strict availability verification (unavailable items cannot be added).
  - Derived totals (Item Count, Total Price, Total Energy) computed dynamically via `useMemo` without redundant state.
  - 1000 kcal limit enforcement with alert message: `Calorie limit of 1000 kcal exceeded`.
- **Task 3 — The Specials Board**:
  - Real-time API consumption from `https://jsonplaceholder.typicode.com/todos?_limit=10`.
  - Available specials listed first, preserving original API order within groups.
  - Live availability counters (`<n> of <total> available`).
  - Graceful error handling and in-place `Retry` button.
- **Task 4 — The Orders Service**:
  - Express REST API with fixed nutritional values.
  - `POST /api/v1/orders` with strict field validation, defaults (`qty=1`, `weightG=100`), and `HTTP 201` response.
  - `GET /api/v1/orders`, `GET /api/v1/orders/:id`, and `DELETE /api/v1/orders/:id`.
  - Request logging middleware: `[METHOD] [PATH] [TIMESTAMP]`.
  - Centralized error-handling middleware (`GET /api/v1/boom` returns `500 {"error":"Something went wrong"}`).
- **Task 5 — The Menu Data**:
  - Mongoose schema with custom validation rules (drink weight limit <= 500g, string trims, category enums).
  - Clean error formatter `formatValidationError(err)`.
  - Robust `seed.js` script with clear database feedback and safe connection teardown.

## Quick Start

### 1. Install Dependencies
```bash
# Frontend
cd frontend && npm install

# Backend
cd ../backend && npm install
```

### 2. Run Applications
```bash
# Start Frontend (Port 3000)
cd frontend
npm run dev -- --host 127.0.0.1 --port 3000

# Start Backend API (Port 5001)
cd ../backend
npm start
```

### 3. Run Automated Tests
```bash
# Run all tests (Orders service + Mongoose schema validation)
npm test
```
