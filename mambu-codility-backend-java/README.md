# Expense Management Backend

Minimal Spring Boot service that manages accounts, transactions (income/expense), and emits SSE updates when data changes. Data is stored in an in-memory H2 database.

## Build / setup / run
- Prereqs: Java 17, Maven 3.9+, port 8080 free.
- Run in dev: `mvn spring-boot:run`
- Build a jar: `mvn clean package && java -jar target/expense-backend-0.0.1-SNAPSHOT.jar`
- H2 console: `http://localhost:8080/h2-console` (JDBC URL `jdbc:h2:mem:expenses`, user `sa`, no password)
- Live changes (SSE): `GET /events/changes` with `Accept: text/event-stream`

## Data model
- Account: `id`, `name`, `balance` (BigDecimal). Balance is derived from transactions and updated on every transaction create/delete.
- Transaction: `id`, `accountId` (FK), `description`, `date` (ISO-8601), `amount` (BigDecimal), `type` (`INCOME` or `EXPENSE`). Incomes increase balance; expenses decrease balance.
- Relationship: one Account has many Transactions.
- Seeding: on startup, creates **Seed Account** with two transactions (expense 2000, income 3000) if the DB is empty.

## Endpoints
- `GET /accounts` — list accounts.
- `POST /accounts` — create account. Body:
  ```json
  {"name": "Main", "initialBalance": 1000.00}
  ```
- `DELETE /accounts/{id}` — delete account and its transactions.
- `GET /accounts/{id}/transactions` — list transactions for the account (newest first).
- `POST /accounts/{id}/transactions` — add a transaction (e.g., `/accounts/1/transactions`). Body:
  ```json
  {"description": "Lunch", "date": "2024-06-01", "amount": 15.50, "type": "EXPENSE"}
  ```
- `DELETE /accounts/{accountId}/transactions/{transactionId}` — delete a transaction for an account.
- `DELETE /transactions/{transactionId}` — delete by transaction id only; balance auto-adjusts.
- `GET /events/changes` — SSE stream with `ready` + `change` events.
- `GET /h2-console` — H2 web console.

## Project decisions (brief)
- Spring Boot + JPA/Hibernate with H2 in-memory for quick setup; schemas auto-created.
- DTOs for request/response + Bean Validation to keep payloads clean and validated.
- Balance logic centralized in `TransactionService` so create/delete always keep totals consistent.
- SSE (`/events/changes`) to notify the FE of data changes without polling.
- Open CORS on controllers for easy local FE integration.
- Startup seeding for quick smoke-testing with a prefilled account and two transactions. 
