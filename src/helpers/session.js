const decodePayload = (token) => {
  const part = token?.replace(/^Bearer\s+/i, "").split(".")[1];
  if (!part) return null;
  const base64 = part.replace(/-/g, "+").replace(/_/g, "/");
  try {
    return JSON.parse(atob(base64.padEnd(Math.ceil(base64.length / 4) * 4, "=")));
  } catch {
    return null;
  }
};

// Milliseconds since the epoch, or null when the token carries no `exp` claim.
export const tokenExpiresAt = (token) => {
  const exp = decodePayload(token)?.exp;
  return typeof exp === "number" ? exp * 1000 : null;
};

// Tokens without an `exp` claim are left for the API to reject.
export const isTokenExpired = (token, now = Date.now()) => {
  if (!token) return true;
  const expiresAt = tokenExpiresAt(token);
  return expiresAt !== null && expiresAt <= now;
};
