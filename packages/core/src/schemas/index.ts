import z from "zod";

export const packageJsonSchema = z.object({
  name: z.string().optional(),
  license: z.string().optional(),
  licenses: z.array(z.string()).optional(),
});

export type PackageJsonType = z.infer<typeof packageJsonSchema>;
