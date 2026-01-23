import { z } from "zod";

export const uploadRecipeSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  ingredients: z
    .array(z.string().min(1, "Ingeredient cannot be empty"))
    .min(1, "Add at least one ingredient"),
  steps: z
    .array(z.string().min(1, "Step cannot be empty"))
    .min(1, "Add at least one step"),
  image: z.any().refine((file) => file != null, {
    message: "Please upload an image",
  }),
});
