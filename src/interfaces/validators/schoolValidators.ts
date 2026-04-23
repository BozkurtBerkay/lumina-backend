import { z } from "zod";

export const createSchoolSchema = z.object({
  body: z.object({
    name: z
      .string({
        message: "School name is required",
      })
      .min(3, "School name must be at least 3 characters long"),
    city: z.string().optional(),
    district: z.string().optional(),
    address: z.string().optional(),
    phoneNumber: z.string().optional(),
  }),
});

export const updateSchoolSchema = z.object({
  body: z.object({
    name: z.string().min(3).optional(),
    city: z.string().optional(),
    district: z.string().optional(),
    address: z.string().optional(),
    phoneNumber: z.string().optional(),
  }),
  params: z.object({
    id: z.string().uuid("Invalid School ID format"),
  }),
});

export const schoolIdParamsSchema = z.object({
  params: z.object({
    id: z.string().uuid("Invalid School ID format"),
  }),
});
