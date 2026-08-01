import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

export const ADMIN_COOKIE = "conecta_admin";
export const ADMIN_MAX_AGE = 60 * 60 * 24 * 7;

function password() {
  if (process.env.ADMIN_PASSWORD) return process.env.ADMIN_PASSWORD;
  return process.env.NODE_ENV === "development" ? "admin123" : "";
}

function secret() {
  return process.env.ADMIN_SESSION_SECRET || password();
}

function equal(a: string, b: string) {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  return left.length === right.length && timingSafeEqual(left, right);
}

export function verifyPassword(candidate: string) {
  const expected = password();
  return Boolean(expected) && equal(candidate, expected);
}

export function createAdminToken() {
  const issuedAt = Math.floor(Date.now() / 1000).toString();
  const signature = createHmac("sha256", secret()).update(issuedAt).digest("hex");
  return `${issuedAt}.${signature}`;
}

export function verifyAdminToken(token?: string) {
  if (!token || !secret()) return false;
  const [issuedAt, signature] = token.split(".");
  if (!issuedAt || !signature) return false;
  const age = Math.floor(Date.now() / 1000) - Number(issuedAt);
  if (!Number.isFinite(age) || age < 0 || age > ADMIN_MAX_AGE) return false;
  const expected = createHmac("sha256", secret()).update(issuedAt).digest("hex");
  return equal(signature, expected);
}

export async function isAdmin() {
  const store = await cookies();
  return verifyAdminToken(store.get(ADMIN_COOKIE)?.value);
}
