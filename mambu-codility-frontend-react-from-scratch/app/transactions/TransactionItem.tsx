import { Tr, Td, Badge } from "@chakra-ui/react";
import type { Transaction } from "@/types";

interface TransactionItemProps {
  transaction: Transaction;
}

export function TransactionItem({ transaction }: TransactionItemProps) {
  const formattedDate = new Date(transaction.date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  const formattedAmount = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(transaction.amount);

  return (
    <Tr>
      <Td>{formattedDate}</Td>
      <Td>{transaction.description}</Td>
      <Td>
        <Badge
          colorScheme={transaction.type === "INCOME" ? "green" : "red"}
        >
          {transaction.type}
        </Badge>
      </Td>
      <Td isNumeric>{formattedAmount}</Td>
    </Tr>
  );
}

