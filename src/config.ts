import type { ApiConfig } from "./shared";

export const API_CONFIG: ApiConfig = {
  name: "url-shortener",
  slug: "url-shortener",
  description: "Shorten long URLs into compact links -- hash-based, custom alias support, instant redirect.",
  version: "1.0.0",
  routes: [
    {
      method: "POST",
      path: "/api/shorten",
      price: "$0.001",
      description: "Shorten a URL and return the shortened version",
      toolName: "utility_shorten_url",
      toolDescription: `Use this when you need to shorten a long URL into a compact link. Returns the shortened URL data in JSON.

Returns: 1. shortUrl (the compact link) 2. hash (unique code) 3. originalUrl 4. createdAt (ISO 8601 timestamp) 5. custom_alias if provided.

Example output: {"shortUrl":"https://x402.dev/s/a1b2c3","hash":"a1b2c3","originalUrl":"https://example.com/very/long/path?with=params","createdAt":"2026-04-13T14:30:00Z"}

Use this FOR sharing links in character-limited contexts, creating trackable URLs, generating clean links for marketing campaigns, and embedding short URLs in QR codes.

Do NOT use for domain intelligence -- use domain_lookup_intelligence instead. Do NOT use for web scraping -- use web_scrape_to_markdown instead. Do NOT use for QR code generation -- use utility_generate_qr_code instead.`,
      inputSchema: {
        type: "object",
        properties: {
          url: { type: "string", description: "The URL to shorten" },
          custom_alias: { type: "string", description: "Optional custom alias for the short URL (3-20 alphanumeric chars)" },
        },
        required: ["url"],
      },
    },
  ],
};
