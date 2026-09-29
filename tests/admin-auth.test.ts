import { describe, expect, it } from "vitest";
import { scryptSync } from "node:crypto";
import { createSessionToken, verifyPassword, verifySessionToken } from "../src/domain/admin/auth";

describe("admin authentication", () => {
  const secret = "a-secure-test-secret-with-more-than-32-characters";
  it("creates and verifies an expiring signed session", () => {
    const token = createSessionToken("admin@sole.test", secret, 1_000_000);
    expect(verifySessionToken(token, secret, 1_000_000)?.email).toBe("admin@sole.test");
    expect(verifySessionToken(token, secret, 1_000_000 + 8 * 60 * 60 * 1000 + 1000)).toBeNull();
  });
  it("rejects tampered tokens and a different secret", () => {
    const token = createSessionToken("admin@sole.test", secret);
    expect(verifySessionToken(`${token}x`, secret)).toBeNull();
    expect(verifySessionToken(token, `${secret}x`)).toBeNull();
  });
  it("verifies scrypt hashes and rejects malformed hashes", () => {
    const salt = "0123456789abcdef0123456789abcdef";
    const encoded = `scrypt:${salt}:${scryptSync("correct-password", salt, 64).toString("hex")}`;
    expect(verifyPassword("correct-password", encoded)).toBe(true);
    expect(verifyPassword("wrong-password", encoded)).toBe(false);
    expect(verifyPassword("correct-password", "invalid")).toBe(false);
  });
});
