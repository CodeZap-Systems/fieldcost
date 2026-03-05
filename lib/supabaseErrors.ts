const SCHEMA_MISSING_CODES = new Set(["PGRST204", "PGRST205"]);

export function isSchemaCacheError(error: unknown) {
  if (!error || typeof error !== "object" || !("code" in error)) return false;
  const code = (error as { code?: string }).code;
  return typeof code === "string" && SCHEMA_MISSING_CODES.has(code);
}

export function describeSchemaError(error: unknown) {
  if (!isSchemaCacheError(error)) return null;
  const code = (error as { code?: string }).code;
  switch (code) {
    case "PGRST204":
      return "PostgREST cache not refreshed for new column";
    case "PGRST205":
      return "PostgREST cache missing table definition";
    default:
      return "PostgREST schema cache error";
  }
}

export { SCHEMA_MISSING_CODES };
