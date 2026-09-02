import "server-only";

export type TestimonialFields = {
  firstName: string;
  lastName: string;
  date: string;
  text: string;
};

/** Normalizes and validates the editor payload. All four fields are required. */
export function readTestimonialInput(body: Record<string, unknown>) {
  const str = (v: unknown) => (typeof v === "string" ? v.trim() : "");
  const fields: TestimonialFields = {
    firstName: str(body.firstName),
    lastName: str(body.lastName),
    date: str(body.date),
    text: typeof body.text === "string" ? body.text.replace(/\r\n/g, "\n").trim() : "",
  };
  const errors: string[] = [];
  if (!fields.firstName) errors.push("First name is required.");
  if (!fields.lastName) errors.push("Last name is required.");
  if (!/^\d{4}-\d{2}-\d{2}$/.test(fields.date)) errors.push("A review date is required.");
  if (!fields.text) errors.push("The review text is required.");
  return { fields, errors };
}
