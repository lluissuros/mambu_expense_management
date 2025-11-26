import { api } from "@/lib/api";
import { TransactionItem } from "./TransactionItem";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Text,
  Box,
} from "@chakra-ui/react";

interface TransactionsListProps {
  accountId: string | null;
}

export async function TransactionsList({ accountId }: TransactionsListProps) {
  if (!accountId) {
    return (
      <Text color="gray.500" textAlign="center" py={8}>
        Select an account to view transactions
      </Text>
    );
  }

  let transactions;
  let account;
  try {
    [transactions, account] = await Promise.all([
      api.getTransactions(accountId),
      api
        .getAccounts()
        .then((accounts) => accounts.find((acc) => acc.id === accountId)),
    ]);
  } catch (error) {
    console.error("Failed to fetch transactions:", error);
    return (
      <Text color="red.500">
        Failed to load transactions. Please try again later.
      </Text>
    );
  }

  if (transactions.length === 0) {
    return (
      <Text color="gray.500" textAlign="center" py={8}>
        No transactions yet. Create your first transaction to get started.
      </Text>
    );
  }

  // Calculate balance from transactions
  const calculatedBalance = transactions.reduce((sum, transaction) => {
    if (transaction.type === "INCOME") {
      return sum + transaction.amount;
    } else {
      return sum - transaction.amount;
    }
  }, account?.initialBalance || 0);

  // Sort by date (newest first)
  const sortedTransactions = [...transactions].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <Box width="100%">
      {account && (
        <Box mb={4} p={3} bg="gray.50" borderRadius="md">
          <Text fontSize="sm" fontWeight="bold" mb={1}>
            Balance Information:
          </Text>
          <Text fontSize="sm">
            Backend Balance:{" "}
            {new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "USD",
            }).format(account.balance)}
          </Text>
          <Text fontSize="sm">
            Calculated from Transactions:{" "}
            {new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "USD",
            }).format(calculatedBalance)}
            {account.balance !== calculatedBalance && (
              <Text as="span" color="red.500" ml={2}>
                ⚠️ Mismatch detected!
              </Text>
            )}
          </Text>
        </Box>
      )}
      <TableContainer width="100%">
        <Table variant="simple" size="sm" width="100%">
          <Thead>
            <Tr>
              <Th>Date</Th>
              <Th>Description</Th>
              <Th>Type</Th>
              <Th isNumeric>Amount</Th>
            </Tr>
          </Thead>
          <Tbody>
            {sortedTransactions.map((transaction) => (
              <TransactionItem key={transaction.id} transaction={transaction} />
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </Box>
  );
}
