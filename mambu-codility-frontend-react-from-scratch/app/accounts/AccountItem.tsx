"use client";

import { Tr, Td, IconButton, useToast } from "@chakra-ui/react";
import { DeleteIcon } from "@chakra-ui/icons";
import { deleteAccount } from "./actions";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import type { Account } from "@/types";

interface AccountItemProps {
  account: Account;
}

export function AccountItem({ account }: AccountItemProps) {
  const router = useRouter();
  const toast = useToast();
  const [isPending, startTransition] = useTransition();

  const handleRowClick = () => {
    // Navigate to account with accountId and accountName in URL
    const encodedName = encodeURIComponent(account.name);
    router.push(`/?accountId=${account.id}&accountName=${encodedName}`);
    router.refresh();
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent row click when clicking delete button
    if (confirm(`Are you sure you want to delete "${account.name}"?`)) {
      // Check if the account is currently selected BEFORE deletion
      const currentUrl = new URL(window.location.href);
      const currentAccountId = currentUrl.searchParams.get("accountId");
      const isSelected = currentAccountId === account.id;

      // If the account is selected, navigate to home IMMEDIATELY (before deletion)
      // This prevents TransactionsList from trying to fetch transactions for a deleted account
      if (isSelected) {
        router.replace("/");
      }

      startTransition(async () => {
        try {
          await deleteAccount(account.id);

          // Dispatch custom event to refresh accounts list
          window.dispatchEvent(new Event("accounts-updated"));

          // Refresh after deletion
          router.refresh();

          toast({
            title: "Account Deleted",
            description: `"${account.name}" has been successfully deleted.`,
            status: "success",
            duration: 5000,
            isClosable: true,
          });
        } catch (error) {
          toast({
            title: "Error",
            description:
              error instanceof Error
                ? error.message
                : "Failed to delete account",
            status: "error",
            duration: 5000,
            isClosable: true,
          });
        }
      });
    }
  };

  return (
    <Tr
      onClick={handleRowClick}
      cursor="pointer"
      _hover={{ bg: "gray.100" }}
      transition="background-color 0.2s"
    >
      <Td>{account.name}</Td>
      <Td isNumeric>
        {new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(account.balance)}
      </Td>
      <Td onClick={(e) => e.stopPropagation()} textAlign="right">
        <IconButton
          aria-label="Delete account"
          icon={<DeleteIcon />}
          size="sm"
          colorScheme="red"
          onClick={handleDelete}
          isLoading={isPending}
          isDisabled={isPending}
        />
      </Td>
    </Tr>
  );
}
