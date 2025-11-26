import { NextRequest } from "next/server";
import { ZodError, ZodObject } from "zod";
import { $ZodIssue } from "zod/v4/core";

type TField = "body";

const validateSchema = (
  req: NextRequest,
  field: TField,
  schema: ZodObject
): $ZodIssue[][] => {
  const errors: $ZodIssue[][] = [];

  try {
    const finalField = field === "body" ? "json" : field;

    schema.parse(req[finalField]);
  } catch (err) {
    if (err instanceof ZodError) {
      errors.push(err.issues);
    }

    throw new Error("Unexpected error");
  }

  return errors;
};

export default validateSchema;
