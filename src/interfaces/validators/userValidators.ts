import { z } from "zod";

export const createUserSchema = z.object({
  body: z.object({
    email: z.string().email("Invalid email format"),
    passwordHash: z.string().min(6, "Password must be at least 6 characters long"),
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    role: z.enum(["ADMIN", "TEACHER", "STUDENT", "PARENT"]).optional(),
    schoolId: z.string().uuid("Invalid School ID format").optional().or(z.literal('')).transform(v => v === '' ? undefined : v),
  }),
});

export const updateUserSchema = z.object({
  body: z.object({
    email: z.string().email("Invalid email format").optional(),
    passwordHash: z.string().min(6).optional(),
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    role: z.enum(["ADMIN", "TEACHER", "STUDENT", "PARENT"]).optional(),
    schoolId: z.string().uuid().optional().or(z.literal('')).transform(v => v === '' ? undefined : v),
  }),
  params: z.object({
    id: z.string().uuid("Invalid User ID format"),
  }),
});

export const userIdParamsSchema = z.object({
  params: z.object({
    id: z.string().uuid("Invalid User ID format"),
  }),
});
