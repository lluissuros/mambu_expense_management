"use server";

import { revalidatePath } from "next/cache";
import { api } from "@/lib/api";
import { z } from "zod";

const createTransactionSchema = z.object({
  description: z.string().min(2, "Description must be at least 2 characters"),
  amount: z.number().positive("Amount must be positive"),
  type: z.enum(["INCOME", "EXPENSE"]),
  date: z.string().refine(
    (date) => {
      const d = new Date(date);
      return !isNaN(d.getTime());
    },
    { message: "Invalid date format" }
  ),
});

export async function createTransaction(
  accountId: string,
  formData: FormData
) {
  const rawData = {
    description: formData.get("description") as string,
    amount: Number(formData.get("amount")),
    type: formData.get("type") as "INCOME" | "EXPENSE",
    date: formData.get("date") as string,
  };

  const validation = createTransactionSchema.safeParse(rawData);

  if (!validation.success) {
    return {
      success: false,
      errors: validation.error.flatten().fieldErrors,
    };
  }

  try {
    await api.createTransaction(accountId, validation.data);
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    return {
      success: false,
      errors: {
        _form: [
          error instanceof Error
            ? error.message
            : "Failed to create transaction",
        ],
      },
    };
  }
}

