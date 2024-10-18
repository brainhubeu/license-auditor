import zod from "zod";

export const auditLicensesOptions = zod.object({
  verbose: zod.boolean().default(false).describe("Verbose output"),
});

export type AuditLicensesOptions = {
  options: zod.infer<typeof auditLicensesOptions>;
};
