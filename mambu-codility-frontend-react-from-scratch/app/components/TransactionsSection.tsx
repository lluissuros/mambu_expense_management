"use client";

import { VStack, Heading } from "@chakra-ui/react";
import { AccountSelector } from "./AccountSelector";
import { CreateTransactionForm } from "../transactions/CreateTransactionForm";

interface TransactionsSectionProps {
  accountId: string | null;
}

export function TransactionsSection({ accountId }: TransactionsSectionProps) {
  return (
    <VStack spacing={4} align="stretch">
      <Heading as="h2" size="lg">
        Transactions
      </Heading>
      <AccountSelector selectedAccountId={accountId} />
      <CreateTransactionForm accountId={accountId} />
    </VStack>
  );
}
