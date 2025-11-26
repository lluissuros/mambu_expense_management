# Expense Management App

A clean, minimalistic Next.js 15 App Router application for managing expenses and accounts.

## Setup and Run

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- Backend API running (Spring Boot) on `http://localhost:8080`

### Installation Steps

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Create environment file:**

   Create a `.env.local` file in the root directory with the following content:

   ```env
   NEXT_PUBLIC_API_URL=http://localhost:8080
   NEXT_PUBLIC_SSE_URL=http://localhost:8080/events
   ```

3. **Start the development server:**

   ```bash
   npm run dev
   ```

4. **Open the application:**
   Navigate to [http://localhost:3000](http://localhost:3000) in your browser.

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Tech Stack

This application is built with modern web technologies:

- **Next.js 15** - React framework with App Router for server-side rendering and routing
- **React Server Components (RSC)** - Server-side components for efficient data fetching
- **Server Actions** - Server-side functions for handling form submissions and mutations
- **TypeScript** - Type-safe JavaScript for better developer experience
- **Zod** - Schema validation library for form and data validation
- **Chakra UI** - Component library for building accessible UI components
- **TailwindCSS** - Utility-first CSS framework for styling
- **ESLint + Prettier** - Code quality and formatting tools

## Main Components

The application is organized into the following main components:

### Pages

- **`app/page.tsx`** - Main landing page (Server Component) that orchestrates the accounts and transactions sections

### Accounts Module (`app/accounts/`)

- **`AccountsList.tsx`** - Server Component that fetches and displays all accounts in a table
- **`AccountItem.tsx`** - Individual account row component with delete functionality
- **`CreateAccountForm.tsx`** - Client component with form validation for creating new accounts
- **`actions.ts`** - Server actions for account-related operations (create, delete)

### Transactions Module (`app/transactions/`)

- **`TransactionsList.tsx`** - Server Component that fetches and displays transactions for a selected account
- **`TransactionItem.tsx`** - Individual transaction row component
- **`CreateTransactionForm.tsx`** - Client component with form validation for creating income/expense transactions
- **`actions.ts`** - Server actions for transaction-related operations

### Shared Components (`app/components/`)

- **`AccountSelector.tsx`** - Client component dropdown for selecting an account to view transactions
- **`TransactionsSection.tsx`** - Wrapper component for the transactions section

### Utilities (`lib/`)

- **`api.ts`** - Typed API wrapper using fetch() for all backend communication
- **`useSSE.ts`** - Optional Server-Sent Events hook for real-time updates

### Types (`types/`)

- **`index.ts`** - Shared TypeScript type definitions for Account and Transaction entities

## Features

- **Accounts Management**: Create and delete accounts with initial balances
- **Transactions Management**: Create income and expense transactions for selected accounts
- **Real-time Updates**: Server-side rendering with automatic revalidation after mutations
- **Form Validation**: Zod schema validation for all forms
- **Modern UI**: Built with Chakra UI and TailwindCSS for a responsive, accessible interface

## Backend API Endpoints

The application expects the following REST API endpoints from the backend:

- `GET /accounts` - Get all accounts
- `POST /accounts` - Create a new account
- `DELETE /accounts/{id}` - Delete an account
- `GET /accounts/{id}/transactions` - Get transactions for an account
- `POST /accounts/{id}/transactions` - Create a transaction

All responses should be in JSON format.

## License

MIT
