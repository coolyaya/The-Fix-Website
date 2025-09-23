import { z } from "zod";

const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const variantSchema = z.object({
  option: z.string().min(1, "Option label is required"),
  price: z.number().nonnegative({ message: "Price must be a positive number" }),
});

export const modelSchema = z.object({
  model: z.string().min(1, "Model label is required"),
  price: z.number().nonnegative({ message: "Price must be a positive number" }),
});

export const serviceSchema = z
  .object({
    category: z.string().min(1, "Category is required"),
    name: z.string().min(1, "Name is required"),
    variants: z.array(variantSchema).nonempty().optional(),
    models: z.array(modelSchema).nonempty().optional(),
    duration_min: z.number().int().positive(),
    warranty_days: z.number().int().nonnegative(),
    description: z.string().min(1, "Description is required"),
    featured: z.boolean(),
    slug: z
      .string()
      .min(1, "Slug is required")
      .regex(slugRegex, "Slug must be unique kebab-case (lowercase words separated by hyphens)"),
  })
  .superRefine((data, ctx) => {
    if (!!data.variants === !!data.models) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Provide either variants or models (choose one)",
        path: ["variants"],
      });
    }

    const priceSources = data.variants ?? data.models ?? [];
    priceSources.forEach((entry, index) => {
      if (Number.isNaN(entry.price)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Price must be numeric",
          path: [data.variants ? "variants" : "models", index, "price"],
        });
      }
    });
  });

export const servicesSchema = z.array(serviceSchema).superRefine((services, ctx) => {
  const seenSlugs = new Set<string>();
  services.forEach((service, index) => {
    if (seenSlugs.has(service.slug)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Duplicate slug: ${service.slug}`,
        path: [index, "slug"],
      });
    }
    seenSlugs.add(service.slug);
  });
});

export type Service = z.infer<typeof serviceSchema>;
export type Services = z.infer<typeof servicesSchema>;
