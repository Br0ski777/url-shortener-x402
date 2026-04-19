import type { Hono } from "hono";
import { createHash } from "crypto";


// ATXP: requirePayment only fires inside an ATXP context (set by atxpHono middleware).
// For raw x402 requests, the existing @x402/hono middleware handles the gate.
// If neither protocol is active (ATXP_CONNECTION unset), tryRequirePayment is a no-op.
async function tryRequirePayment(price: number): Promise<void> {
  if (!process.env.ATXP_CONNECTION) return;
  try {
    const { requirePayment } = await import("@atxp/server");
    const BigNumber = (await import("bignumber.js")).default;
    await requirePayment({ price: BigNumber(price) });
  } catch (e: any) {
    if (e?.code === -30402) throw e;
  }
}

// In-memory URL store (persists for the lifetime of the server process)
const urlStore = new Map<string, { originalUrl: string; createdAt: string; hits: number }>();

function generateHash(url: string): string {
  const hash = createHash("sha256").update(url + Date.now().toString()).digest("base62" as any);
  // Base62-like encoding from hex
  const hexHash = createHash("sha256").update(url + Date.now().toString()).digest("hex");
  const chars = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let result = "";
  let num = BigInt("0x" + hexHash.slice(0, 16));
  while (result.length < 7) {
    result += chars[Number(num % 62n)];
    num = num / 62n;
  }
  return result;
}

function isValidUrl(str: string): boolean {
  try {
    const url = new URL(str);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

function isValidAlias(alias: string): boolean {
  return /^[a-zA-Z0-9]{3,20}$/.test(alias);
}

export function registerRoutes(app: Hono) {
  app.post("/api/shorten", async (c) => {
    await tryRequirePayment(0.001);
    const body = await c.req.json().catch(() => null);
    if (!body?.url) {
      return c.json({ error: "Missing required field: url" }, 400);
    }

    const originalUrl: string = body.url;
    if (!isValidUrl(originalUrl)) {
      return c.json({ error: "Invalid URL. Must start with http:// or https://" }, 400);
    }

    let code: string;

    if (body.custom_alias) {
      const alias = String(body.custom_alias);
      if (!isValidAlias(alias)) {
        return c.json({ error: "Invalid alias. Must be 3-20 alphanumeric characters." }, 400);
      }
      if (urlStore.has(alias)) {
        return c.json({ error: "Alias already taken. Choose a different one." }, 409);
      }
      code = alias;
    } else {
      code = generateHash(originalUrl);
      // Ensure no collision
      while (urlStore.has(code)) {
        code = generateHash(originalUrl + Math.random());
      }
    }

    const entry = {
      originalUrl,
      createdAt: new Date().toISOString(),
      hits: 0,
    };
    urlStore.set(code, entry);

    // Build the short URL using the request host
    const host = c.req.header("host") || "localhost:3000";
    const protocol = c.req.header("x-forwarded-proto") || "https";
    const shortUrl = `${protocol}://${host}/s/${code}`;

    return c.json({
      shortUrl,
      code,
      originalUrl,
      createdAt: entry.createdAt,
      totalUrls: urlStore.size,
    });
  });

  // Redirect endpoint (not behind x402 paywall — free to use)
  app.get("/s/:code", (c) => {
    const code = c.req.param("code");
    const entry = urlStore.get(code);
    if (!entry) {
      return c.json({ error: "Short URL not found" }, 404);
    }
    entry.hits++;
    return c.redirect(entry.originalUrl, 302);
  });
}
