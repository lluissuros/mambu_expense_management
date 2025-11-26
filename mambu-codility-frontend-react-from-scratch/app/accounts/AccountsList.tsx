import { api } from "@/lib/api";
import { AccountItem } from "./AccountItem";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  TableContainer,
  Text,
} from "@chakra-ui/react";

export async function AccountsList() {
  let accounts;
  try {
    accounts = await api.getAccounts();
  } catch (error) {
    console.error("Failed to fetch accounts:", error);
    return (
      <Text color="red.500">
        Failed to load accounts. Please try again later.
      </Text>
    );
  }

  if (accounts.length === 0) {
    return (
      <Text color="gray.500" textAlign="center" py={8}>
        No accounts yet. Create your first account to get started.
      </Text>
    );
  }

  return (
    <TableContainer width="100%">
      <Table variant="simple" size="sm" width="100%">
        <Thead>
          <Tr>
            <Th>Name</Th>
            <Th isNumeric>Balance</Th>
            <Th></Th>
          </Tr>
        </Thead>
        <Tbody>
          {accounts.map((account) => (
            <AccountItem key={account.id} account={account} />
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  );
}
