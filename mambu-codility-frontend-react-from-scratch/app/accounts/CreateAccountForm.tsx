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
  Button,
  VStack,
  Text,
  useToast,
} from "@chakra-ui/react";
import { createAccount } from "./actions";

export function CreateAccountForm() {
  const router = useRouter();
  const toast = useToast();
  const [isPending, startTransition] = useTransition();
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});
    setSuccess(false);

    const form = e.currentTarget;
    const formData = new FormData(form);

    startTransition(async () => {
      const result = await createAccount(formData);

      if (result.success) {
        setSuccess(true);
        form.reset();
        setTimeout(() => setSuccess(false), 3000);
        router.refresh();
        // Dispatch custom event to refresh account selector
        window.dispatchEvent(new Event("accounts-updated"));
        toast({
          title: "Account Created",
          description: "The account has been successfully created.",
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
            description: formError[0] || "Failed to create account",
            status: "error",
            duration: 5000,
            isClosable: true,
          });
        }
      }
    });
  };

  return (
    <Card width="100%">
      <CardHeader>
        <Heading size="md">Create Account</Heading>
      </CardHeader>
      <CardBody>
        <form onSubmit={handleSubmit}>
          <VStack spacing={4} align="stretch">
            <FormControl isInvalid={!!errors.name}>
              <FormLabel>Account Name</FormLabel>
              <Input
                name="name"
                type="text"
                placeholder="e.g., Savings Account"
                required
              />
              {errors.name && (
                <Text color="red.500" fontSize="sm" mt={1}>
                  {errors.name[0]}
                </Text>
              )}
            </FormControl>

            <FormControl isInvalid={!!errors.initialBalance}>
              <FormLabel>Initial Balance</FormLabel>
              <Input
                name="initialBalance"
                type="number"
                step="0.01"
                placeholder="0.00"
                defaultValue="0"
                required
              />
              {errors.initialBalance && (
                <Text color="red.500" fontSize="sm" mt={1}>
                  {errors.initialBalance[0]}
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
                Account created successfully!
              </Text>
            )}

            <Button
              type="submit"
              colorScheme="blue"
              isLoading={isPending}
              isDisabled={isPending}
            >
              Create Account
            </Button>
          </VStack>
        </form>
      </CardBody>
    </Card>
  );
}
