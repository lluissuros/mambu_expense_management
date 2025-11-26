export interface Account {
  id: string;
  name: string;
  initialBalance: number;
  balance: number;
  createdAt: string;
  updatedAt: string;
}

export interface Transaction {
  id: string;
  accountId: string;
  description: string;
  amount: number;
  type: "INCOME" | "EXPENSE";
  date: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAccountFormData {
  name: string;
  initialBalance: number;
}

export interface CreateTransactionFormData {
  description: string;
  amount: number;
  type: "INCOME" | "EXPENSE";
  date: string;
}

