import { describe, expect, test } from "vitest";

import { isTokenExpired, tokenExpiresAt } from "./session";
import { makeToken } from "test/fixtures";

describe("session tokens", () => {
  test("reads the exp claim from a Bearer JWT", () => {
    const expiresAt = tokenExpiresAt(makeToken(60));
    expect(expiresAt).toBeGreaterThan(Date.now());
    expect(expiresAt).toBeLessThanOrEqual(Date.now() + 60_000);
  });

  test("treats a past exp as expired", () => {
    expect(isTokenExpired(makeToken(-1))).toBe(true);
    expect(isTokenExpired(makeToken(60))).toBe(false);
  });

  test("treats a missing token as expired and an opaque one as unknown", () => {
    expect(isTokenExpired(null)).toBe(true);
    expect(isTokenExpired("Bearer not-a-jwt")).toBe(false);
    expect(tokenExpiresAt("Bearer a.%%%.c")).toBeNull();
  });
});
