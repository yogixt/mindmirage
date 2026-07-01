import { scryptSync, randomBytes, timingSafeEqual } from "crypto";

/* Password hashing with Node's built-in scrypt — no external dependency.
   Stored form: "scrypt$<saltHex>$<derivedHex>". */

export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const derived = scryptSync(password, salt, 64).toString("hex");
  return `scrypt$${salt}$${derived}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  const parts = stored.split("$");
  if (parts.length !== 3 || parts[0] !== "scrypt") return false;
  const [, salt, derived] = parts;
  try {
    const a = scryptSync(password, salt, 64);
    const b = Buffer.from(derived, "hex");
    return a.length === b.length && timingSafeEqual(a, b);
  } catch {
    return false;
  }
}
