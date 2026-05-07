const EMAIL_PATTERN = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

export function normalizeOptionalEmail(value: unknown) {
  if (typeof value !== "string") return null;
  const email = value.trim();
  return email.length > 0 ? email : null;
}

export function isValidEmail(value: string) {
  return EMAIL_PATTERN.test(value);
}
