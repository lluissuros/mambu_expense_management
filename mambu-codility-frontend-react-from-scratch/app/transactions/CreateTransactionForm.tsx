"use client";

import { useTransition, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardBody,
  CardHeader,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Select,
  Button,
  VStack,
  Text,
  useToast,
} from "@chakra-ui/react";
import { createTransaction } from "./actions";

interface CreateTransactionFormProps {
  accountId: string | null;
}

export function CreateTransactionForm({
  accountId,
}: CreateTransactionFormProps) {
  const router = useRouter();
  const toast = useToast();
  const [isPending, startTransition] = useTransition();
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});
    setSuccess(false);

    if (!accountId) {
      setErrors({
        _form: ["Please select an account first"],
      });
      return;
    }

    const form = e.currentTarget;
    const formData = new FormData(form);

    startTransition(async () => {
      const result = await createTransaction(accountId, formData);

      if (result.success) {
        setSuccess(true);
        form.reset();
        setTimeout(() => setSuccess(false), 3000);
        router.refresh();
        toast({
          title: "Transaction Created",
          description: "The transaction has been successfully created.",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
      } else {
        setErrors(result.errors || {});
        const formError =
          result.errors && "_form" in result.errors
            ? result.errors._form
            : undefined;
        if (formError) {
          toast({
            title: "Error",
            description: formError[0] || "Failed to create transaction",
            status: "error",
            duration: 5000,
            isClosable: true,
          });
        }
      }
    });
  };

  if (!accountId) {
    return (
      <Card width="100%">
        <CardHeader>
          <Heading size="md">Create Transaction</Heading>
        </CardHeader>
        <CardBody>
          <Text color="gray.500">
            Please select an account to create a transaction
          </Text>
        </CardBody>
      </Card>
    );
  }

  // Set default date to today
  const today = new Date().toISOString().split("T")[0];

  return (
    <Card width="100%">
      <CardHeader>
        <Heading size="md">Create Transaction</Heading>
      </CardHeader>
      <CardBody>
        <form onSubmit={handleSubmit}>
          <VStack spacing={4} align="stretch">
            <FormControl isInvalid={!!errors.description}>
              <FormLabel>Description</FormLabel>
              <Input
                name="description"
                type="text"
                placeholder="e.g., Grocery shopping"
                required
              />
              {errors.description && (
                <Text color="red.500" fontSize="sm" mt={1}>
                  {errors.description[0]}
                </Text>
              )}
            </FormControl>

            <FormControl isInvalid={!!errors.amount}>
              <FormLabel>Amount</FormLabel>
              <Input
                name="amount"
                type="number"
                step="0.01"
                min="0.01"
                placeholder="0.00"
                required
              />
              {errors.amount && (
                <Text color="red.500" fontSize="sm" mt={1}>
                  {errors.amount[0]}
                </Text>
              )}
            </FormControl>

            <FormControl isInvalid={!!errors.type}>
              <FormLabel>Type</FormLabel>
              <Select name="type" required>
                <option value="EXPENSE">Expense</option>
                <option value="INCOME">Income</option>
              </Select>
              {errors.type && (
                <Text color="red.500" fontSize="sm" mt={1}>
                  {errors.type[0]}
                </Text>
              )}
            </FormControl>

            <FormControl isInvalid={!!errors.date}>
              <FormLabel>Date</FormLabel>
              <Input name="date" type="date" defaultValue={today} required />
              {errors.date && (
                <Text color="red.500" fontSize="sm" mt={1}>
                  {errors.date[0]}
                </Text>
              )}
            </FormControl>

            {errors._form && (
              <Text color="red.500" fontSize="sm">
                {errors._form[0]}
              </Text>
            )}

            {success && (
              <Text color="green.500" fontSize="sm">
                Transaction created successfully!
              </Text>
            )}

            <Button
              type="submit"
              colorScheme="blue"
              isLoading={isPending}
              isDisabled={isPending}
            >
              Create Transaction
            </Button>
          </VStack>
        </form>
      </CardBody>
    </Card>
  );
}
