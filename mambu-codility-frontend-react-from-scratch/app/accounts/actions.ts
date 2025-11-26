"use server";

import { revalidatePath } from "next/cache";
import { api } from "@/lib/api";
import { z } from "zod";

const createAccountSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  initialBalance: z.number(),
});

export async function createAccount(formData: FormData) {
  const rawData = {
    name: formData.get("name") as string,
    initialBalance: Number(formData.get("initialBalance")),
  };

  const validation = createAccountSchema.safeParse(rawData);

  if (!validation.success) {
    return {
      success: false,
      errors: validation.error.flatten().fieldErrors,
    };
  }

  try {
    await api.createAccount(validation.data);
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    return {
      success: false,
      errors: {
        _form: [error instanceof Error ? error.message : "Failed to create account"],
      },
    };
  }
}

export async function deleteAccount(id: string) {
  try {
    await api.deleteAccount(id);
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "Failed to delete account"
    );
  }
}

