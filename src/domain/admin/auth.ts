import { createHmac, scryptSync, timingSafeEqual } from "node:crypto";

export const SESSION_COOKIE = "sole_admin_session";
export const SESSION_DURATION_SECONDS = 60 * 60 * 8;

type SessionPayload = { email: string; exp: number };

function encode(value: string) {
  return Buffer.from(value, "utf8").toString("base64url");
}

function sign(value: string, secret: string) {
  return createHmac("sha256", secret).update(value).digest("base64url");
}

export function createSessionToken(email: string, secret: string, now = Date.now()) {
  const payload = encode(JSON.stringify({ email, exp: Math.floor(now / 1000) + SESSION_DURATION_SECONDS }));
  return `${payload}.${sign(payload, secret)}`;
}

export function verifySessionToken(token: string, secret: string, now = Date.now()): SessionPayload | null {
  const [payload, signature, extra] = token.split(".");
  if (!payload || !signature || extra) return null;
  const expected = Buffer.from(sign(payload, secret));
  const received = Buffer.from(signature);
  if (expected.length !== received.length || !timingSafeEqual(expected, received)) return null;
  try {
    const parsed = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as SessionPayload;
    if (typeof parsed.email !== "string" || !Number.isInteger(parsed.exp) || parsed.exp <= Math.floor(now / 1000)) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function verifyPassword(password: string, encodedHash: string) {
  const [algorithm, salt, hash, extra] = encodedHash.split(":");
  if (algorithm !== "scrypt" || !salt || !hash || extra || !/^[a-f0-9]+$/i.test(salt) || !/^[a-f0-9]{128}$/i.test(hash)) return false;
  const expected = Buffer.from(hash, "hex");
  const received = scryptSync(password, salt, expected.length);
  return timingSafeEqual(expected, received);
}
