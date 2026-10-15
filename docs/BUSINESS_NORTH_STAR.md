# BUSINESS NORTH STAR — AI 자율운영 수익 사업

**Effective:** 2026-10-15. Owner-defined objective. This document applies to NEW business discovery and experiments; it does **not** change the existing WordPress DevelopWhale_AGENTS.md, production publishing/schedules, original Sites deployment, or WordPress settings.

## Always begin every task with this sentence

> **우리의 목표는 AI 직원이 사람의 반복 노동 없이 운영하며, 추가 승인 없는 지출 없이, 실제 검증된 월 순수익 100만 원을 창출하는 사업이다.**

## Priority order (do not reverse)

1. **Real collectable revenue path:** who pays, for what, under which verified ads/affiliate/customer terms? Revenue is observed from actual provider/settlement/payment data, not an assumption, site deployment, impressions, or fictional metrics.
2. **Acquisition/distribution:** which *allowed* channels can reach the actual target users without Google indexing, spam, unauthorized account actions, or recurring manual outreach?
3. **Unit economics:** expected revenue per real visit/lead/order, costs, update and moderation work, support burden. All assumptions labelled as assumptions.
4. **Market evidence:** official monthly search demand or observed users, competing alternatives, unmet problem, country/language choice based on data—not on developer familiarity or a language preference.
5. **Product/build & automation:** only after the above. Build the smallest valid test and stop if gates fail. CI/deployment/content counts are means, not outcomes.

## Operator preflight for each new initiative

- State intended effect on verified net profit and by when it could first be measured.
- Identify a real monetization instrument and its eligibility constraints; mark "unverified" without approved provider data.
- Identify at least one discoverable/consent-respecting *non-search* acquisition method and its platform policy.
- Identify what would falsify the hypothesis with a low-cost experiment.
- Check whether there is already a similar free product, distribution advantage or distinctive information.
- If not, return **HOLD / NO BUILD / NO POST** with the missing evidence, rather than creating an app, blog post, marketing agent, website, or scheduler.

## Money scoreboard (the only ultimate north-star KPI)

- Verified gross receipts by provider (KRW), fees/taxes/infra/advertising cost where known, verified **net** receipts (KRW), and ongoing owner intervention (hours/month).
- Leading indicators: **external real users by source** -> activated actual uses -> earnings-generating events -> verified payment. Explicitly label anonymous opt-in events as incomplete lower bound; do not interpret QA traffic as users.
- Stages: **Discover -> Prove distribution -> Prove revenue -> Small release -> Scale**. Every stage has STOP/PIVOT/HOLD decisions; no arbitrary forced daily release quotas.
- Do not use revenue=0 in demo analytics as evidence that a real payment system was tested.
- Monthly goal 1,000,000 KRW **net**, not guaranteed, not a plan-specific spending budget. No spending or plan upgrades without owner approval.

## Current state as of 2026-10-15

- Webhook Retry Lab: successful original-source import, independent Worker & D1 production-like deployment, Chromium QA PASS. **User demand, attributable traffic and revenue unproven**. Maintain but do not expand solely because the system is technically complete.
- DevelopWhale English technical articles: 22 published, site-health indexedPass 0 (the sensor may lag). Not a reason to endlessly recrawl or bulk-publish.
- Moving-quote comparison (Korean): **HYPOTHESIS ONLY / HOLD—NO BUILD**. Market size is not proven keyword search volume. Existing comparison aids and affiliate-style promotional pages exist, but no verified partner account/payment, user intent-to-use, allowed acquisition placements, or absolute search counts.
- Other candidates (DIY material, seller margin, etc.) similarly unvalidated.
- The answer to "what should AI build next?" can legitimately be **NOTHING** until a distribution and monetization hypothesis meets gates.

## Independent evidence and access limitations

- Naver DataLab Search Trend delivers relative 0-100, not monthly absolute searches: https://developers.naver.com/products/service-api/datalab/datalab.md
- NAVER Search Ads Keyword Tool shows monthly PC/mobile search counts with an authenticated ad account: https://ads.naver.com/help/faq/1406
- Since 2026-07-31 new registration for Naver Search/Search Trend/Shopping Insight moves to NAVER API HUB; legacy unregistered DevCenter signup instructions are outdated: https://developers.naver.com/notice/article/32530
- Google warns scaled unoriginal content primarily for rankings may be spam: https://developers.google.com/search/docs/essentials/spam-policies

**Never convert keyword suggestion, article count, market-size headline, competitor existence or mock analytics into projected customers without a documented method.**

## Owner permission boundaries

Autonomous: public research, comparative scoring, source verification, GitHub documentation/experiments, non-production test scripts, planning, test QA, reports.

Require prior approval: new paid subscription/spend, actual commercial terms, ad/account integration, DNS/production WordPress/n8n changes, public platform posting or outreach (unless previously authorized and allowed by provider), new unattended schedules, credential exposure, captcha or policy bypass.

## Required report format

1. **Goal: month net 1,000,000 KRW with minimal owner labor.**
2. **Verified money so far / actual user source / operator hours** (write UNKNOWN rather than invent).
3. **Decision:** SCALE / TEST / HOLD / STOP, and why based on evidence.
4. **One next highest-EV experiment**, cost, risk, measurable conversion, stop condition.
5. **What was actually executed** vs. what's blocked.

This charter constrains new business-planning decisions only and doesn't override existing operational Site policies for unrelated production jobs.