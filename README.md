# URL Shortener API

[![MCP Server](https://img.shields.io/badge/MCP-server-blue)](https://url-shortener.api.klymax402.com/mcp)
[![x402](https://img.shields.io/badge/payments-x402-6E56CF)](https://x402.org)
[![License: MIT](https://img.shields.io/badge/license-MIT-green)](LICENSE)

Shorten URLs using hash-based approach. Returns a compact shortened URL. Pay-per-call via [x402](https://x402.org) (USDC on Base L2) -- no API key, no signup, no rate-limit wall.

Part of the [klymax402](https://klymax402.com) marketplace -- 100 x402 micropayment APIs for AI agents, one wallet, USDC on Base.

## Quickstart -- MCP

Add to your MCP client config (Claude Desktop, Cursor, ElizaOS, etc.):

```json
{
  "mcpServers": {
    "url-shortener": {
      "url": "https://url-shortener.api.klymax402.com/mcp"
    }
  }
}
```

## Quickstart -- HTTP (x402)

```bash
curl -X POST "https://url-shortener.api.klymax402.com/api/shorten" \
  -H "Content-Type: application/json" \
  -d '{"url":"https://example.com"}'
# -> 402 Payment Required, with an x402 payment challenge in the response body
```

Any x402-aware client ([`@x402/fetch`](https://www.npmjs.com/package/@x402/fetch), [`x402-agent-tools`](https://www.npmjs.com/package/x402-agent-tools), ATXP) handles the 402 -> sign -> retry cycle automatically.

## Tools

| Tool | Method | Path | Price | Description |
|---|---|---|---|---|
| `utility_shorten_url` | POST | `/api/shorten` | $0.001 | Shorten a URL and return the shortened version |

### `utility_shorten_url`

Use this when you need to shorten a long URL into a compact link. Accepts any valid URL and returns a shortened URL with the hash code, original URL, and creation timestamp. Do NOT use for domain intelligence — use domain_lookup_intelligence instead. Do NOT use for web scraping — use web_scrape_to_markdown instead. Do NOT use for SEO analysis — use seo_audit_page instead.

**Parameters**

| Name | Type | Required | Description |
|---|---|---|---|
| `url` | string | yes | The URL to shorten |
| `custom_alias` | string | no | Optional custom alias for the short URL (3-20 alphanumeric chars) |

## Example agent prompts

- "Shorten a long URL into a compact link"

## Payment

- Protocol: [x402](https://x402.org) -- HTTP-native pay-per-call, no signup, no API key
- Network: Base L2 (`eip155:8453`)
- Asset: USDC
- Facilitator: Coinbase CDP (primary), PayAI (fallback)

## Part of klymax402

100 x402 micropayment APIs for AI agents -- one wallet, USDC on Base, zero signup.

- Catalog: https://klymax402.com/llms.txt
- Full API reference: https://klymax402.com/llms-full.txt
- Live stats: https://klymax402.com/stats

## License

MIT
