# **Expense Management — Fullstack Application (Java + Next.js)**

### **Main README (Project Overview + Personal Note)**

## 👋 Personal Note

When I first read the assignment, I had **close to zero practical experience with Java or Spring Boot**.
So I decided to approach the project with an explicit goal: **test how far I could push AI-assisted development** in a real assignment setting.

The backend was built in a very iterative way — almost “vibe coding” but still grounded in logic:
I wrote code, tested everything quickly with Postman, refined it, refactored, and repeated the cycle.
Once I had a stable backend, I kept the same approach for the frontend: many iterations on validation, server actions, RSC data flows, and UI details.

Even though the workflow leaned heavily on AI-based coding support, I feel confident I can defend what every part of the code does, and how the system works end-to-end.

Below are the detailed READMEs for each part of the system (you can also find them in their respective repos)

---

# **Backend README — Expense Management Backend**

Minimal Spring Boot service that manages accounts, transactions (income/expense), and emits SSE updates when data changes. Data is stored in an in-memory H2 database.

## Build / setup / run

* Prereqs: Java 17, Maven 3.9+, port 8080 free.
* Run in dev: `mvn spring-boot:run`
* Build a jar: `mvn clean package && java -jar target/expense-backend-0.0.1-SNAPSHOT.jar`
* H2 console: `http://localhost:8080/h2-console` (JDBC URL `jdbc:h2:mem:expenses`, user `sa`, no password)
* Live changes (SSE): `GET /events/changes` with `Accept: text/event-stream`

## Data model

* Account: `id`, `name`, `balance` (BigDecimal). Balance is derived from transactions and updated on every transaction create/delete.
* Transaction: `id`, `accountId` (FK), `description`, `date` (ISO-8601), `amount` (BigDecimal), `type` (`INCOME` or `EXPENSE`). Incomes increase balance; expenses decrease balance.
* Relationship: one Account has many Transactions.
* Seeding: on startup, creates **Seed Account** with two transactions (expense 2000, income 3000) if the DB is empty.

## Endpoints

* `GET /accounts` — list accounts.
* `POST /accounts` — create account. Body:

  ```json
  {"name": "Main", "initialBalance": 1000.00}
  ```
* `DELETE /accounts/{id}` — delete account and its transactions.
* `GET /accounts/{id}/transactions` — list transactions for the account (newest first).
* `POST /accounts/{id}/transactions` — add a transaction (e.g., `/accounts/1/transactions`). Body:

  ```json
  {"description": "Lunch", "date": "2024-06-01", "amount": 15.50, "type": "EXPENSE"}
  ```
* `DELETE /accounts/{accountId}/transactions/{transactionId}` — delete a transaction for an account.
* `DELETE /transactions/{transactionId}` — delete by transaction id only; balance auto-adjusts.
* `GET /events/changes` — SSE stream with `ready` + `change` events.
* `GET /h2-console` — H2 web console.

## Project decisions (brief)

* Spring Boot + JPA/Hibernate with H2 in-memory for quick setup; schemas auto-created.
* DTOs for request/response + Bean Validation to keep payloads clean and validated.
* Balance logic centralized in `TransactionService` so create/delete always keep totals consistent.
* SSE (`/events/changes`) to notify the FE of data changes without polling.
* Open CORS on controllers for easy local FE integration.
* Startup seeding for quick smoke-testing with a prefilled account and two transactions.

---

# **Frontend README — Expense Management App**

A clean, minimalistic Next.js 15 App Router application for managing expenses and accounts.

## Setup and Run

### Prerequisites

* Node.js 18+ installed
* npm or yarn package manager
* Backend API running (Spring Boot) on `http://localhost:8080`

### Installation Steps

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Create environment file:**
   `.env.local`:

   ```env
   NEXT_PUBLIC_API_URL=http://localhost:8080
   NEXT_PUBLIC_SSE_URL=http://localhost:8080/events
   ```

3. **Start the development server:**

   ```bash
   npm run dev
   ```

4. **Open the application:**
   [http://localhost:3000](http://localhost:3000)

### Available Scripts

* `npm run dev`
* `npm run build`
* `npm run start`
* `npm run lint`

## Tech Stack

* **Next.js 15** (App Router)
* **React Server Components (RSC)**
* **Server Actions** for mutations
* **TypeScript**
* **Zod** validation
* **Chakra UI**
* **TailwindCSS**
* **ESLint + Prettier**

## Main Components

### Pages

* `app/page.tsx` → global layout + orchestration

### Accounts Module (`app/accounts/`)

* `AccountsList.tsx` (RSC)
* `AccountItem.tsx`
* `CreateAccountForm.tsx`
* `actions.ts` (server actions)

### Transactions Module (`app/transactions/`)

* `TransactionsList.tsx` (RSC)
* `TransactionItem.tsx`
* `CreateTransactionForm.tsx`
* `actions.ts` (server actions)

### Shared Components

* `AccountSelector.tsx`
* `TransactionsSection.tsx`

### Utilities (`lib/`)

* `api.ts` — typed API wrapper
* `useSSE.ts` — optional real-time update listener

### Types (`types/`)

* Shared types for Account and Transaction

## Features

* Create / delete accounts
* Create income / expense transactions
* Automatic UI refresh via RSC revalidation
* Zod form validation
* Minimal UI with Chakra + Tailwind

## Backend Endpoints Used

* `GET /accounts`
* `POST /accounts`
* `DELETE /accounts/{id}`
* `GET /accounts/{id}/transactions`
* `POST /accounts/{id}/transactions`

---

If you want, I can also:

✅ Generate a **project architecture diagram**
✅ Add screenshots / GIFs
✅ Add a “What I Learned” section
✅ Produce a polished **PDF version** for submission
