"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Select, FormControl, FormLabel } from "@chakra-ui/react";
import { api } from "@/lib/api";
import type { Account } from "@/types";

interface AccountSelectorProps {
  selectedAccountId?: string | null;
}

export function AccountSelector({
  selectedAccountId: initialAccountId,
}: AccountSelectorProps) {
  const router = useRouter();
  const [accounts, setAccounts] = useState<Account[]>([]);

  const fetchAccounts = () => {
    api
      .getAccounts()
      .then(setAccounts)
      .catch((error) => console.error("Failed to fetch accounts:", error));
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  // Refresh accounts when selectedAccountId changes (page refresh after mutation)
  useEffect(() => {
    fetchAccounts();
  }, [initialAccountId]);

  // Listen for custom event to refresh accounts list
  useEffect(() => {
    const handleRefresh = () => {
      fetchAccounts();
    };

    window.addEventListener("accounts-updated", handleRefresh);
    return () => {
      window.removeEventListener("accounts-updated", handleRefresh);
    };
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const accountId = e.target.value;
    if (accountId) {
      const selectedAccount = accounts.find((acc) => acc.id === accountId);
      const accountName = selectedAccount?.name || "";
      // Include accountName in URL for sharing: ?accountId=9&accountName=Seed%20Account
      const encodedName = encodeURIComponent(accountName);
      router.push(`/?accountId=${accountId}&accountName=${encodedName}`);
    } else {
      router.push("/");
    }
    router.refresh();
  };

  return (
    <FormControl>
      <FormLabel>Select Account</FormLabel>
      <Select
        placeholder="Choose an account"
        value={initialAccountId || ""}
        onChange={handleChange}
      >
        {accounts.map((account) => (
          <option key={account.id} value={account.id}>
            {account.name} ({account.balance.toFixed(2)})
          </option>
        ))}
      </Select>
    </FormControl>
  );
}
