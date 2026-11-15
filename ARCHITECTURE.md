# Architecture (v0.1)
Zero backend until Phase 4. Static page (GitHub Pages) + buyer-owned Google Sheet and Notion.
1. Money logic is deterministic code and formulas. AI never calculates.
2. Rates are data (`rates.json`, Sheet Settings), each with a verified date.
3. Sheet holds money, Notion holds work. No duplicated numbers.
4. Buyer client data stays in the buyer's own accounts.
5. Everything works with AI off.
Flow: Quote -> Contract -> Deposit link -> Track -> Remind -> Net receipts and tax set-aside.
Phase 4: Cloudflare Worker proxy (key as secret), allow-listed tasks, anonymised and consent-gated.
