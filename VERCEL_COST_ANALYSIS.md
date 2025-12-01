# Vercel Migration Cost Analysis
**Project:** AI Clothing Finder
**Date:** December 1, 2025

## Current Architecture

### Frontend
- ✅ **Already using Next.js 14** (app router)
- Size: ~35KB
- Components: React with TypeScript, Tailwind CSS
- API calls: 2 endpoints (analyze, search)

### Backend
- ❌ **FastAPI (Python)** - needs conversion
- Size: ~14KB
- Dependencies: `fastapi`, `anthropic`, `google-search-results` (serpapi), `pydantic`
- Endpoints:
  - `POST /api/analyze` - Claude Vision API for image analysis
  - `POST /api/search` - SerpAPI for Google Shopping search

## Conversion Requirements

### 1. Convert Backend to Next.js API Routes (Serverless Functions)

**Changes needed:**
- Convert 2 FastAPI endpoints → 2 Next.js API routes
- Replace Python dependencies with Node.js equivalents:
  - `anthropic` (Python) → `@anthropic-ai/sdk` (Node.js) ✅ Official SDK available
  - `google-search-results` → `serpapi` (Node.js) ✅ Available
  - `pydantic` → TypeScript interfaces ✅ Already using TypeScript
  - `fastapi` → Next.js API routes ✅ Built-in

**Estimated effort:** 2-4 hours
- Straightforward conversion, all libraries have Node.js equivalents
- No complex Python-specific logic to port

### 2. Update Configuration

**Required changes:**
- Remove `backend/` directory structure
- Create `app/api/analyze/route.ts` and `app/api/search/route.ts`
- Update frontend API calls from `http://localhost:8000/api/*` to `/api/*`
- Configure environment variables in Vercel dashboard
- Update `next.config.js` for serverless function settings (optional)

## Usage Analysis & Vercel Limits

### Per User Session Breakdown

**Typical user flow:**
1. Upload image → `/api/analyze` call
2. Click search → `/api/search` call

**Per session metrics:**
- **Function invocations:** 2
- **Execution time:**
  - Analyze: ~2-5 seconds (Claude API latency)
  - Search: ~1-3 seconds (SerpAPI latency)
  - Total: ~5-8 seconds
- **Bandwidth:**
  - Upload: ~500KB - 2MB (image)
  - Response: ~50-70KB (analysis + search results)
  - Total: ~550KB - 2.07MB per session

### Vercel Hobby Plan Limits (FREE)

| Resource | Hobby Limit | Your Usage/Session | Sessions Supported |
|----------|-------------|-------------------|-------------------|
| **Bandwidth** | 100 GB/month | ~1-2 MB | ~50,000 - 100,000 |
| **Function Invocations** | 100,000/month | 2 | **50,000** |
| **Execution Time** | 100 GB-hours/month | ~16 GB-seconds* | **22,500** ⚠️ |
| **Function Duration** | 10 sec (up to 60s) | ~5-8 seconds | ✅ Within limit |
| **Request Body Size** | 4.5 MB | ~0.5-2 MB | ✅ Within limit |

**\*Calculation:** 8 seconds × 2 GB RAM = 16 GB-seconds per session
**100 GB-hours** = 360,000 GB-seconds ÷ 16 = **22,500 sessions/month**

### Limiting Factor: Execution Time (GB-hours)

**Your actual limit: ~22,500 complete user sessions per month**
- **~750 sessions per day**
- **~31 sessions per hour** (averaged)

### Will You Hit the Limits?

**For personal/MVP use:** ✅ **NO - Hobby plan is sufficient**
- 750 daily sessions is generous for initial launch
- You cannot purchase additional usage on Hobby plan
- **Hard cap:** Service stops when limit is reached

**For commercial/production use:** ⚠️ **You'll need Pro plan**
- Hobby plan is restricted to **non-commercial personal use only**
- Any business/commercial use requires Pro plan per Vercel ToS

## Cost Comparison

### Option 1: Hobby Plan (Current Best Fit)
- **Cost:** $0/month
- **Limits:** ~22,500 sessions/month (~750/day)
- **Restrictions:** Non-commercial use only
- **Overage:** ❌ Hard cap, no overage option
- **RAM:** Fixed 2GB / 1 vCPU (cannot upgrade)

### Option 2: Pro Plan (For Commercial Use)
- **Cost:** $20/month per user
- **Base includes:**
  - 1 TB bandwidth (1000 GB)
  - Uncapped invocations (pay-as-you-go)
  - 400 GB-hours execution
  - 4 GB RAM / 2 vCPU available
- **Overage costs:**
  - Bandwidth: $0.15/GB beyond 1TB
  - Execution: $0.30/GB-hour beyond 400 GB-hours
  - Edge invocations: $0.65/million

**Pro plan supports:**
- Base: ~90,000 sessions/month (400 GB-hours ÷ 16 GB-seconds)
- **~3,000 sessions per day**
- Additional sessions: ~$0.000133 per session ($0.30 per 2,256 sessions)

**Example Pro costs:**
- **50,000 sessions/month:** $20 (within base limits)
- **100,000 sessions/month:** ~$20 + $10 overage = **$30/month**
- **500,000 sessions/month:** ~$20 + $90 overage = **$110/month**

### Option 3: Enterprise Plan
- **Cost:** Starting at $3,500/month
- Only needed for: SCIM, SSO, 99.99% SLA, HIPAA compliance
- **Not recommended** for your use case

## Claude API Plan Limits & Costs ⚡

**CRITICAL:** Your bottleneck will likely be Claude API limits, not Vercel!

### Your Current Usage Per Session

Each image analysis call uses:
- **Input tokens:** ~1,700 tokens (image) + ~200 tokens (prompt) = **~1,900 tokens**
- **Output tokens:** ~150-300 tokens (JSON response)
- **Cost per analysis:** ~$0.0057 - $0.0102

### Claude API Usage Tiers & Monthly Limits

| Tier | Deposit Required | Wait Period | Monthly Spend Limit | Sessions Supported* |
|------|-----------------|-------------|-------------------|---------------------|
| **Free** | $0 | None | **$10** | **~980 - 1,750** ⚠️ |
| **Build Tier 1** | $5 | None | **$100** | **~9,800 - 17,500** |
| **Build Tier 2** | $40 | 7 days | **$500** | **~49,000 - 87,700** |
| **Build Tier 3** | $200 | 7 days | **$1,000** | **~98,000 - 175,400** |
| **Build Tier 4** | $400 | 14 days | **$5,000** | **~490,000 - 877,000** |
| **Scale** | Custom | Contact sales | Unlimited | Unlimited |

**\*Sessions supported** = Monthly spend limit ÷ $0.0057-$0.0102 per analysis

### Rate Limits by Tier

Beyond monthly spending, you also have rate limits:

**Free Tier / Tier 1:**
- **50 requests per minute (RPM)**
- **50,000 input tokens per minute (ITPM)**
- **10,000 output tokens per minute (OTPM)**

With your ~1,900 input tokens per request:
- **Max throughput: ~26 requests/minute** (limited by ITPM: 50k ÷ 1,900 ≈ 26)
- **Max daily: ~37,440 requests** (if sustained 24/7)
- **Realistically: ~1,560 requests/hour** during peak usage

### ⚠️ WILL YOU HIT CLAUDE PLAN LIMITS?

**Free Tier ($10/month limit):**
- ❌ **YES - You'll hit this quickly!**
- Supports only **~980-1,750 sessions/month**
- **~33-58 sessions per day**
- **Not viable for public deployment**

**Build Tier 1 ($100/month limit):**
- ⚠️ **Maybe - Depends on traffic**
- Supports **~9,800-17,500 sessions/month**
- **~327-583 sessions per day**
- Good for MVP/beta testing
- **Costs $5 deposit, up to $100/month usage**

**Build Tier 2 ($500/month limit):**
- ✅ **Probably sufficient for launch**
- Supports **~49,000-87,700 sessions/month**
- **~1,633-2,923 sessions per day**
- Requires $40 deposit + 7 day wait
- **Costs $40 deposit, up to $500/month usage**

### Combined Limits Analysis

Comparing **Vercel Hobby** (~22,500 sessions/month) vs **Claude API tiers**:

| Plan Combination | Limiting Factor | Max Sessions/Month | Cost/Month |
|-----------------|----------------|-------------------|------------|
| Vercel Hobby + Claude Free | **Claude** | **~1,750** | **$10** |
| Vercel Hobby + Claude Tier 1 | **Claude** | **~17,500** | **$100** |
| Vercel Hobby + Claude Tier 2 | **Vercel** | **~22,500** | **$500** |
| Vercel Pro + Claude Tier 2 | **Claude** | **~87,700** | **$20 + $500** |
| Vercel Pro + Claude Tier 3 | **Equal** | **~90,000** | **$20 + $1,000** |

**🎯 Recommended Starting Point:**
- **Vercel:** Hobby (free)
- **Claude:** Build Tier 1 ($5 deposit, $100/month max)
- **Supported:** ~17,500 sessions/month (~583/day)
- **Total cost:** $5 deposit + pay-as-you-go up to $100/month

### External API Costs Summary

**Anthropic Claude API (Required):**
- Model: `claude-3-5-sonnet-20241022`
- Pricing: $3/million input tokens, $15/million output tokens
- Vision images: ~1,600 tokens each (~$0.0048/image)
- **Per session cost:** ~$0.0057 - $0.0102

**SerpAPI (Required for search functionality):**
- Free plan: 100 searches/month (not viable)
- Paid plans: Starting at $50/month for 5,000 searches
- **For 17,500 sessions:** Need $175-350/month plan

**⚠️ Total monthly API costs at 17,500 sessions:**
- Claude: ~$100
- SerpAPI: ~$175-350
- **Total: $275-450/month in API costs alone**

## Recommendations

### For Testing/MVP (Non-Commercial)
✅ **Use Vercel Hobby Plan (FREE)**
- Sufficient for 750 sessions/day
- Zero hosting costs
- Easy deployment and CI/CD
- Focus budget on Claude API and SerpAPI

### For Commercial Launch
✅ **Start with Pro Plan ($20/month)**
- Legally compliant (commercial use allowed)
- 3,000 sessions/day base
- Pay-as-you-go for growth
- Better performance (4GB RAM option)

### Cost Optimization Strategies

1. **Implement caching:**
   - Cache Claude analysis results for identical images
   - Cache search results temporarily
   - Could reduce API calls by 30-50%

2. **Use Edge Functions for static responses:**
   - Move non-AI logic to edge (faster, cheaper)
   - Only use serverless for AI/external API calls

3. **Implement rate limiting:**
   - Prevent abuse and runaway costs
   - 10 requests/hour per IP is reasonable

4. **Optimize Claude prompts:**
   - Shorter, more specific prompts = lower token usage
   - Current prompt is 167 words, could reduce to ~100 words

5. **Consider SerpAPI alternatives:**
   - Direct Google Shopping scraping (free, but against ToS)
   - Bing Product Search API (potentially cheaper)
   - Build affiliate partnerships for product data

## Migration Complexity: LOW ✅

**Why it's easy:**
- Frontend already uses Next.js
- Python → Node.js conversion is straightforward
- Official SDKs available for all services
- No database migration needed
- No complex business logic

**Estimated timeline:**
- Development: 2-4 hours
- Testing: 1-2 hours
- Deployment: 30 minutes
- **Total: 4-7 hours**

## Conclusion

### Direct Answer to Your Questions

**Q: Will you hit current plan usage limits?**

**A: YES - Claude API limits will be your bottleneck, not Vercel!**

**If you're on Claude Free Tier:**
- ❌ **You'll hit the $10/month limit at just ~1,750 sessions** (~58/day)
- You need to upgrade immediately for any real usage

**If you're on Claude Build Tier 1 ($100/month):**
- ⚠️ **You can handle ~17,500 sessions/month** (~583/day)
- This is sufficient for MVP/beta testing
- Vercel Hobby plan won't be the limiting factor

**If you're on Claude Build Tier 2 ($500/month):**
- ✅ **You can handle ~87,700 sessions/month** (~2,923/day)
- Vercel Hobby becomes the bottleneck at ~22,500 sessions
- Need to upgrade to Vercel Pro for full Claude tier utilization

**Q: Conversion cost to Next.js + Vercel?**

**A: Low effort, but ongoing API costs are significant:**
- **Development time:** 4-7 hours (straightforward conversion)
- **Vercel hosting:** $0 (Hobby) or $20/month (Pro)
- **Claude API:** $100-500/month (depending on tier)
- **SerpAPI:** $50-350/month (depending on volume)
- **Total monthly:** $150-870/month at scale

### Which Plan Should You Be On?

| Your Expected Traffic | Claude Plan | Vercel Plan | Est. Monthly Cost |
|----------------------|-------------|-------------|-------------------|
| Testing/Development (<50/day) | Free | Hobby | **$10** |
| Small MVP (100-500/day) | **Tier 1** | **Hobby** | **$100-150** |
| Growing product (500-2000/day) | **Tier 2** | **Hobby** | **$500-550** |
| Scaling (2000-3000/day) | Tier 2 | **Pro** | **$520-570** |
| High traffic (>3000/day) | Tier 3+ | Pro | **$1,000+** |

### Action Plan

1. **✅ Determine your current Claude API tier**
   - Check your Anthropic Console usage dashboard
   - Verify monthly spend limit

2. **⚡ Start with this setup:**
   - **Vercel:** Hobby (free) - sufficient for most scenarios
   - **Claude:** Tier 1 ($5 deposit, $100/month cap)
   - Supports ~583 sessions/day

3. **🔨 Convert backend to Next.js** (4-7 hours)
   - Migrate 2 FastAPI endpoints to Next.js API routes
   - Replace Python SDKs with Node.js equivalents
   - Deploy to Vercel

4. **📊 Monitor usage closely:**
   - **Claude Console:** Track API spend and rate limits
   - **Vercel Dashboard:** Track function invocations and bandwidth
   - Set up alerts at 80% of limits

5. **📈 Upgrade when needed:**
   - Hit $80/month on Claude? Deposit $40 for Tier 2
   - Exceeding 20,000 Vercel sessions? Upgrade to Pro ($20/month)

6. **💰 Optimize costs:**
   - Implement caching for duplicate images
   - Add rate limiting per IP (prevent abuse)
   - Consider cheaper alternatives to SerpAPI
   - Optimize Claude prompts for lower token usage

### Most Likely Scenario

**For typical startup/side project:**
- **Month 1-2 (Testing):** Claude Free + Vercel Hobby = **$10/month**
- **Month 3-6 (MVP):** Claude Tier 1 + Vercel Hobby = **$100-150/month**
- **Month 6+ (Growth):** Claude Tier 2 + Vercel Hobby = **$500-550/month**

**The real question isn't "Can I afford Vercel?" (yes, it's free/cheap) but rather "Can I afford the AI API costs?" ($100-500+/month)**

---

## Sources

### Vercel Resources
- [Vercel Pricing](https://vercel.com/pricing)
- [Breaking down Vercel's 2025 pricing plans quotas and hidden costs](https://flexprice.io/blog/vercel-pricing-breakdown)
- [Vercel Hobby Plan Documentation](https://vercel.com/docs/accounts/plans/hobby)
- [Manage and optimize usage for Serverless Functions](https://vercel.com/docs/pricing/serverless-functions)
- [How to bypass Vercel body size limit](https://vercel.com/kb/guide/how-to-bypass-vercel-body-size-limit-serverless-functions)

### Claude API Resources
- [Anthropic API Pricing](https://www.anthropic.com/pricing)
- [Claude API Rate Limits Documentation](https://docs.claude.com/en/api/rate-limits)
- [Our approach to rate limits for the Claude API](https://support.claude.com/en/articles/8243635-our-approach-to-rate-limits-for-the-claude-api)
- [Claude Vision API Documentation](https://docs.claude.com/en/docs/build-with-claude/vision)
- [Anthropic API Pricing: Complete Guide and Cost Optimization Strategies (2025)](https://www.finout.io/blog/anthropic-api-pricing)
- [Claude 3.5 Sonnet Pricing Calculator](https://www.helicone.ai/llm-cost/provider/anthropic/model/claude-3-5-sonnet-20241022)
