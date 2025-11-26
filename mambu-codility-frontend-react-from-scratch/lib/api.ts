import type { Account, Transaction } from "@/types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

async function fetchAPI<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `API Error: ${response.status} ${response.statusText} - ${errorText}`
    );
  }

  // Handle empty responses (e.g., DELETE requests with 204 No Content)
  const contentType = response.headers.get("content-type");
  const contentLength = response.headers.get("content-length");

  if (
    !contentType?.includes("application/json") ||
    contentLength === "0" ||
    response.status === 204
  ) {
    return undefined as T;
  }

  const text = await response.text();
  if (!text || text.trim() === "") {
    return undefined as T;
  }

  try {
    return JSON.parse(text) as T;
  } catch (error) {
    // If parsing fails, return undefined for void types
    if (text.trim() === "") {
      return undefined as T;
    }
    throw error;
  }
}

export const api = {
  // Accounts
  getAccounts: (): Promise<Account[]> => {
    return fetchAPI<Account[]>("/accounts");
  },

  createAccount: (data: {
    name: string;
    initialBalance: number;
  }): Promise<Account> => {
    return fetchAPI<Account>("/accounts", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  deleteAccount: (id: string): Promise<void> => {
    return fetchAPI<void>(`/accounts/${id}`, {
      method: "DELETE",
    });
  },

  // Transactions
  getTransactions: (accountId: string): Promise<Transaction[]> => {
    return fetchAPI<Transaction[]>(`/accounts/${accountId}/transactions`);
  },

  createTransaction: (
    accountId: string,
    data: {
      description: string;
      amount: number;
      type: "INCOME" | "EXPENSE";
      date: string;
    }
  ): Promise<Transaction> => {
    return fetchAPI<Transaction>(`/accounts/${accountId}/transactions`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  },
};
