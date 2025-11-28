import { ZodIssue, ZodTypeAny } from "zod";

const validateSchema = (body: unknown, schema: ZodTypeAny): ZodIssue[] => {
  const result = schema.safeParse(body);
  if (result.success) return [];
  return result.error.issues;
};

export default validateSchema;
