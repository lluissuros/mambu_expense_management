import { AccountsList } from "./accounts/AccountsList";
import { CreateAccountForm } from "./accounts/CreateAccountForm";
import { TransactionsList } from "./transactions/TransactionsList";
import { CreateTransactionForm } from "./transactions/CreateTransactionForm";
import { Container, Heading, VStack, Stack, Box } from "@chakra-ui/react";
import { api } from "@/lib/api";

interface HomePageProps {
  searchParams: Promise<{ accountId?: string; accountName?: string }>;
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const params = await searchParams;
  const accountId = params.accountId || null;
  let accountName = params.accountName || null;

  // If accountId exists but accountName is not in URL, fetch it
  if (accountId && !accountName) {
    try {
      const accounts = await api.getAccounts();
      const account = accounts.find((acc) => acc.id === accountId);
      accountName = account?.name || null;
    } catch (error) {
      console.error("Failed to fetch account name:", error);
    }
  }

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={8} align="stretch">
        <Heading as="h1" size="xl" textAlign="center">
          Expense Management
        </Heading>

        {/* Accounts Section */}
        <Box width="100%">
          <VStack spacing={4} align="stretch" width="100%">
            <Heading as="h2" size="lg">
              Accounts
            </Heading>
            <Stack
              direction={{ base: "column", md: "row" }}
              spacing={8}
              align="start"
              width="100%"
            >
              <Box flex={1} width="100%">
                <AccountsList />
              </Box>
              <Box flex={1} width="100%">
                <CreateAccountForm />
              </Box>
            </Stack>
          </VStack>
        </Box>

        {/* Transactions Section */}
        <Box width="100%">
          <VStack spacing={4} align="stretch" width="100%">
            <Heading as="h2" size="lg">
              Transactions
              {accountName
                ? ` for ${accountName}`
                : accountId
                  ? ` for Account ${accountId}`
                  : ""}
            </Heading>
            <Stack
              direction={{ base: "column", md: "row" }}
              spacing={8}
              align="start"
              width="100%"
            >
              <Box flex={1} width="100%">
                <TransactionsList accountId={accountId} />
              </Box>
              <Box flex={1} width="100%">
                <CreateTransactionForm accountId={accountId} />
              </Box>
            </Stack>
          </VStack>
        </Box>
      </VStack>
    </Container>
  );
}
