# TLC Canonical Governance Declaration
# Agent Sentinel — Alignment Anomaly Detector

**Governed under:** The Living Constitution 2.0
**Constitution source:** https://github.com/coreyalejandro/the-living-constitution-2.0
**Applicable Articles:** I (Claim Integrity), XIII (AI Governance), XVI (Default Directions Standard)
**Adopted:** 2026-06-19

---

## CANONICAL RULES BINDING THIS REPO

These rules apply to every AI-generated output, every instruction, every recommendation
step, every onboarding document, and every user-facing string in this codebase.
They are not preferences. They are not guidelines. They are governance constraints.

### RULE 1 — ZERO PRIOR KNOWLEDGE (Article XVI Section 16.4.3)

Every instruction, step, and recommendation assumes the user has:
- Never used a terminal, command line, or developer tool
- Never heard any technical term used in the step
- No memory of any previous step or prior session
- No shared context with the author of the instruction

If a step uses a technical term, that term is defined inside that step.
Not above it. Not below it. Inside it.

This rule is non-negotiable. It cannot be overridden by time pressure,
token limits, or "the user probably knows this." The user does not know this.

### RULE 2 — ONE ACTION PER STEP (Article XVI R1)

Each step contains exactly one imperative verb. One physical action.
"Open the file" is one action.
"Open the file and paste the command" is two actions. It is forbidden.

### RULE 3 — SELF-CONTAINED STEPS (Article XVI R2)

Every value, filename, URL, or term a step needs is written inside that step.
If a filename was introduced in Step 3 and is needed in Step 7, Step 7 writes it again.
"Use the value from Step 3" is forbidden.

### RULE 4 — NO BRANCH LANGUAGE (Article XVI R3)

The words "or," "if," "unless," "depending on," "either," "choose," and "select one of"
are forbidden in action lines.

### RULE 5 — COPY-PASTE STRINGS (Article XVI R4)

Every string the user must type exactly is in backticks or a code block.
No exact-type string appears as plain prose.

### RULE 6 — SUCCESS BEFORE ACTION (Article XVI R5)

Every step states what the user will see after the action succeeds,
before asking the user to act. The format is:
"You will see: [exact success description]. [The action.]"

### RULE 7 — NO SPATIAL LANGUAGE (Article XVI R6)

"Upper right," "bottom of the page," "left side," "top corner" are forbidden.
Every UI element is located by its exact visible label.

### RULE 8 — EXACT LABELS (Article XVI R7)

Every button, field, or menu is referenced by its exact visible label.
"The big button" and "the blue link" are forbidden.

### RULE 9 — NO CONFIDENCE LANGUAGE (Article XVI Section 16.4.4)

The words "simply," "just," "easy," "quickly," "obviously," and "of course"
are forbidden in all user-facing text.

### RULE 10 — NO OPEN-ENDED WAITS (Article XVI R9 / Section 16.4.5)

Every step that takes time states:
(a) the maximum number of seconds or minutes to wait, and
(b) the exact text or symbol that signals completion.
"Wait for it to finish" is forbidden.

---

## ENFORCEMENT

Any AI assistant working in this repo must read this file before producing
user-facing output. Any output that violates Rules 1-10 above must be regenerated.

The LLM prompt in `services/analysisService.ts` encodes Rules 1-10 directly.
It must not be modified in any way that weakens or removes these rules.
If the prompt is modified, the modification must be reviewed against this document
before the change is committed.

---

## AMENDMENT

This document may only be amended by the repo operator (Corey Alejandro).
Amendments require:
1. A written rationale stating why the rule change does not harm neurodivergent users.
2. A commit message prefixed: `TLC-CANONICAL:`
3. A corresponding amendment to the AMENDMENT LOG section below.

---

## AMENDMENT LOG

| Date       | Rule     | Change                          | Rationale                          |
|------------|----------|---------------------------------|------------------------------------|
| 2026-06-19 | All      | Initial declaration             | First governance binding for repo  |
