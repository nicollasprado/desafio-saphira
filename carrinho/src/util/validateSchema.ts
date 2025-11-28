import { ZodError, ZodObject } from "zod";
import { $ZodIssue } from "zod/v4/core";

const validateSchema = (body: object, schema: ZodObject): $ZodIssue[][] => {
  const errors: $ZodIssue[][] = [];

  try {
    schema.parse(body);
  } catch (err) {
    if (err instanceof ZodError) {
      errors.push(err.issues);
    }

    throw err;
  }

  return errors;
};

export default validateSchema;
