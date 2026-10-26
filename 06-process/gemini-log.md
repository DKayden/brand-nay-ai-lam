# Gemini log — Poster Nghé 3D (Task 11)

- Model: `gemini-3.1-flash-image` (fallback `gemini-2.5-flash-image` if 404/permission)
- Price (checked 2026-10-26): image output $60 / 1M tokens ≈ **$0.067 per 1K image**; input $0.50 / 1M tokens (reference image + prompt ≈ <$0.001). Source: https://ai.google.dev/pricing (Gemini API pricing page), cross-checked https://www.getmaxim.ai/bifrost/llm-cost-calculator/provider/gemini/model/gemini-3.1-flash-image
- Budget estimate used here: **$0.07 per successful call** (conservative); failed calls counted at $0 cost but still count toward the cap.
- Hard caps: ≤ 15 calls (every attempt, including errors), ≤ 2.00 USD estimated.

## Calls

- call 1: error — model gemini-3.1-flash-image — HTTP 429: {   "error": {     "code": 429,     "message": "You exceeded your current quota, please check your plan and billing details. For more information on this error, head to: https://ai.google.dev/gemini-api/docs/rate-limits. To monitor your current usage, head to: https://ai.dev/rate-limit. \n* Quota ex — est. total 0.00 USD
- call 2: error — model gemini-2.5-flash-image — HTTP 429: {   "error": {     "code": 429,     "message": "You exceeded your current quota, please check your plan and billing details. For more information on this error, head to: https://ai.google.dev/gemini-api/docs/rate-limits. To monitor your current usage, head to: https://ai.dev/rate-limit. \n* Quota exceeded for metric: generativelanguage.googleapis.com/generate_content_free_tier_requests, limit: 0, model: gemini-2.5-flash-preview-image, description: Generate content requests per day limit exceeded on Free Tier. See https://ai.google.dev/gemini-api/docs/rate-limits.\n* Quota exceeded for metric: generativelanguage.googleapis.com/generate_content_free_tier_requests, limit: 0, model: gemini-2.5-flash-preview-image, description: Generate content requests per minute limit exceeded on Free Tier. See https://ai.google.dev/gemini-api/docs/rate-limits.\n* Quota exceeded for metric: generativelangua — est. total 0.00 USD

## Outcome
- Both models return HTTP 429 `generate_content_free_tier_requests, limit: 0`: this API key is on the **Free Tier with zero image-generation quota** (billing not enabled on the Google Cloud project). It is not a transient rate limit, so retrying would only burn the call cap.
- Calls used: 2/15 (both errors, no image billed). Estimated cost: **0.00 USD**.
- **Dùng poster SVG phẳng** (`board/poster-nghe-phang.png`). To retry later: enable billing on the key's project, then `python -I src/gemini_poster.py` (13 calls left in the budget).
