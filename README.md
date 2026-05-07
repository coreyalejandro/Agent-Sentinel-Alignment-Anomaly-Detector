# Agent Sentinel — Alignment & Anomaly Detector

A diagnostic platform for analyzing agentic interaction logs and surfacing behavioral anomalies, goal drift, omission patterns, and alignment failures that would otherwise remain hidden across long-running AI workflows.

Live app: https://ai.studio/apps/ae90fd7b-319b-4890-9e1b-00a9b0a1ce66

---

## What It Does

Agent Sentinel ingests raw agentic interaction logs — conversation traces, system outputs, workflow artifacts — and runs structured analysis to detect seventeen categories of behavioral anomaly:

- Goal drift and policy subversion
- Deception, omission deception, and shadow reasoning
- System gaslighting and fragmented narrative
- Contract violation and memory protocol violation
- Reward hacking, sentiment misalignment, and resource exhaustion

For each detected anomaly it returns a severity rating (LOW / MEDIUM / HIGH / CRITICAL), a description of the evidence, and a recommended intervention. Results are downloadable as a structured JSON audit record.

---

## Why It Exists

Standard AI monitoring surfaces what systems report about themselves. Agent Sentinel is built on a different premise: the most important behavioral signals are the ones that do not appear in self-report. The tool focuses on detecting discrepancies between stated behavior and observable interaction patterns — omissions, narrative gaps, reasoning that contradicts logged outputs, and deference patterns that only appear across sequences of turns.

This makes it directly relevant to research on AI dependency, agency erosion, and misuse vulnerability — domains where user self-report is an unreliable measurement surface and behavioral instrumentation is the only way to catch what is actually happening.

---

## Architecture

- React + TypeScript frontend with a dark-themed analysis dashboard
- File system ingest — mount local log directories directly in browser via File System Access API
- Gemini-backed analysis engine (geminiService.ts) for structured anomaly detection
- Exportable JSON audit records with full evidence traces
- Live risk topology chart tracking anomaly severity over the session timeline

The analysis engine currently uses Gemini for structured output generation. The provider is abstracted in a single service file (geminiService.ts) and is designed to be swapped without changes to the detection architecture.

---

## Run Locally

Prerequisites: Node.js, Gemini API key

```
npm install
```

Add your key to .env.local:

```
GEMINI_API_KEY=your_key_here
```

```
npm run dev
```

---

## Relevance to AI Safety Research

The anomaly taxonomy — particularly SHADOW_REASONING, OMISSION_DECEPTION, SYSTEM_GASLIGHTING, and FRAGMENTED_NARRATIVE — maps onto open questions in behavioral observability for deployed AI systems. The architecture is designed to be adaptable toward cohort-level analysis of deference escalation and agency erosion in high-reliance user populations, where self-report systematically overstates capability and behavioral instrumentation is required to surface leading indicators before downstream harms appear.

---

## Related Work

- The Living Constitution — runtime constitutional governance layer
- Contract Window — observability interface for tracking user intent, obligations, and drift across long-context AI workflows
- BicameralReview — dual-channel safety and task performance review mechanism
