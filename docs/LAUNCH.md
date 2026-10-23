# Launch and growth plan

## 1. The claim

Lead with the Luna and Haiku results in [README.md](../README.md#results): `live-long-fixtures` (long workflows, 48/48 for Mantis on both models with 22-29% less time and 35-38% fewer input tokens than the tree) and the frozen live-site set `live-v1` v1.7 (success out of 90 for Mantis / tree / screenshots: Luna 89/90/85, Haiku 87/86/89). Per-task changes and disclosures: [bench/live-v1.md](../bench/live-v1.md#changelog-and-disclosures); tables and caveats: [bench/RESULTS.md](../bench/RESULTS.md).
Publish failures and method beside the claim. Lead with agent task results; replay measures
cheap orientation, not reading a whole article.

## 2. Gate: don't launch until all of these are done

- [ ] Freeze the evaluated source version and complete the [planned evaluations](PLAN.md#current-sequence).
- [ ] Make a 30-second side-by-side video of the same task, with a live token counter; export a README GIF.
- [ ] Open the README with the GIF, measured claim, [install](SETUP.md#install) and a 3-line example.
- [ ] Configure npm Trusted Publishing for `perzianhq/mantis` and `.github/workflows/publish-npm.yml`.
- [ ] Publish a matching GitHub release.

## 3. Launch week

| Day | Where | What |
|---|---|---|
| Before launch | Official MCP registry, Smithery, mcp.so, Glama, `awesome-mcp-servers` | Submit listings |
| Launch (Tue–Thu, 8–10am US Eastern) | **Show HN** | Post a first comment; answer comments all day |
| Launch | **X** | Video thread; tag agent/MCP builders |
| Launch +1 | **Reddit**: r/ClaudeAI, r/mcp, r/LocalLLaMA, r/ChatGPTCoding | “I built” with numbers; cheap/open models for LocalLLaMA |
| Launch +2 | **LinkedIn** | What you built and learned |
| Launch +7 to +14 | **Product Hunt** | Landing-page badge |

## 4. Drafts

Fill in measured numbers before posting.

**Show HN title:** `Show HN: Mantis – AI agents browse the web as numbered text, not screenshots`

First comment: problem, a numbered-text example, scoped task results, method/failures, known gaps,
and the install link. X thread: video and claim → problem → example → results/method → install/repo.
LinkedIn: why you built it, measured results and three things learned.

## 5. After launch: becoming the default

- **Ship where agents are installed.** Claude Code plugin, Codex setup docs, integration PRs/guides
  for Cursor, Cline, LangChain, the OpenAI Agents SDK and browser-agent frameworks.
- **Pitch scale.** Publish measured cost per 1,000 tasks.
- **One deep post:** “Why AI agents shouldn't take screenshots”, with the benchmark.
- **Keep benchmarks public and re-runnable.** Invite tasks where Mantis loses; fix them in public.
- Answer issues within a day for the first month.
- Ship small releases with short changelog posts.

## 6. What to measure

Weekly npm downloads, repeat use, merged integrations and outside issues. GitHub stars are a weaker signal.
