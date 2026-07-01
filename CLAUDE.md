# babynamer — AI Baby Name Suggester

## Product
- User answers 10 questions about preferences
- Stripe Checkout $5 one-time
- GPT generates 50 personalized baby names with meanings
- Results displayed immediately + emailed

## Architecture (Simplest Possible)
- Next.js 14 (App Router) on Vercel
- No database needed (results stored in Stripe metadata + URL param)
- No auth needed
- Payments: Stripe Checkout Sessions (one-time, $5)
- AI: OpenAI GPT-4o-mini (cheap, fast)
- Email: Resend for results delivery

## User Flow
1. Landing page → "Find your baby's perfect name"
2. Quiz page — 10 questions (multi-choice)
3. Stripe Checkout → $5
4. Success page → GPT generates names in background (5-10 sec)
5. Results page — grid of 50 names with meanings, filterable
6. Email delivered with results link

## Quiz Questions
1. Preferred style (Classic, Modern, Unique, Nature-inspired, Vintage)
2. Gender (Boy, Girl, Gender-neutral, Surprise me)
3. First letter preference (Any, pick one)
4. Syllable count (1, 2, 3, 4+, Any)
5. Cultural/ethnic origin (Any, English, Irish, Italian, Japanese, Hebrew, Arabic, Indian, African, Nordic, Latin)
6. Name meaning (Strength, Wisdom, Joy, Nature, Love, Any)
7. Sibling's name (text input — optional)
8. Last name (text input — for flow)
9. Names to avoid (text input — comma separated, optional)
10. Personality vibe (Adventurous, Creative, Thoughtful, Charming, Bold)

## Tech Rules
- TypeScript STRICT mode — ALL parameters explicitly typed, no implicit any
- One page for quiz + results (SPA-like with state)
- GPT prompt built from quiz answers, returns JSON array
- No cookies, no sessions, no middleware needed
- Environment variables: never hardcode URLs, use Vercel auto-detection
- Rate limiting from day one (simple token bucket per IP)
- Loading states: spinner during GPT generation
- Error states: graceful fallback if GPT fails

## API Routes
- POST /api/generate-names — takes quiz answers, calls GPT, returns { names: [{name, meaning, origin, vibe}] }
- POST /api/create-checkout — creates Stripe Checkout Session ($5)
- GET /api/verify-session?session_id=xxx — verifies payment, triggers name generation

## Stripe
- $5 one-time payment
- Mode: payment
- Collect: email (for delivery)
- Success URL: /success?session_id={CHECKOUT_SESSION_ID}
- Cancel URL: /

## No Database Design
- Names generated and stored in URL state (passed via query params or stored temporarily in memory)
- Results page accessible via /results?session_id=xxx
- Email contains direct link to results
- No RLS, no storage buckets, no auth tables

## Design
- Soft, warm theme (cream/beige background, warm accents — not dark)
- Rounded corners, gentle typography
- Mobile-first
- Quiz feels like a conversation, not a form
- Results: beautiful grid of name cards with meanings
- Print-friendly results page