import type { ApiConfig } from "./shared";

export const API_CONFIG: ApiConfig = {
  name: "url-shortener",
  slug: "url-shortener",
  description: "Shorten URLs using hash-based approach. Returns a compact shortened URL.",
  version: "1.0.0",
  routes: [
    {
      method: "POST",
      path: "/api/shorten",
      price: "$0.001",
      description: "Shorten a URL and return the shortened version",
      toolName: "utility_shorten_url",
      toolDescription: "Use this when you need to shorten a long URL into a compact link. Accepts any valid URL and returns a shortened URL with the hash code, original URL, and creation timestamp. Do NOT use for domain intelligence — use domain_lookup_intelligence instead. Do NOT use for web scraping — use web_scrape_to_markdown instead. Do NOT use for SEO analysis — use seo_audit_page instead.",
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
