/* Client-safe password strength heuristic (no Node crypto import, so it can
   be used in the browser for the live strength meter). */

export type PasswordStrength = {
  score: number; // 0 (too short) .. 4 (strong)
  label: string; // "", "Weak", "Fair", "Good", "Strong"
  ok: boolean; // meets the minimum length to be accepted
};

export const MIN_PASSWORD_LENGTH = 6;

export function passwordStrength(pw: string): PasswordStrength {
  if (!pw) return { score: 0, label: "", ok: false };
  if (pw.length < MIN_PASSWORD_LENGTH) return { score: 0, label: "Too short", ok: false };

  let s = 1;
  if (pw.length >= 10) s++;
  if (/[a-z]/.test(pw) && /[A-Z]/.test(pw)) s++;
  if (/\d/.test(pw)) s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;
  s = Math.min(s, 4);

  const label = ["", "Weak", "Fair", "Good", "Strong"][s];
  return { score: s, label, ok: true };
}
