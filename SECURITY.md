# Security Policy

## Reporting a vulnerability

Please report vulnerabilities through a [private GitHub security advisory](https://github.com/perzianhq/mantis/security/advisories/new) for `perzianhq/mantis`. Do not open a public issue for a suspected vulnerability.

## Supported versions

The supported release line is **0.1.x beta**. Security fixes are made against the latest 0.1.x beta release.

## Threat model

Mantis automates a browser for an agent. It reduces page content to text, but it is not a security boundary around that content.

- Page text is untrusted input that reaches the agent. Prompt injection is possible: Mantis does not sanitise page text or mark it as untrusted.
- `upload` resolves and reads local paths, then attaches the selected files to the current page. It accepts existing regular files from any location; it rejects missing paths and directories, but it does not restrict uploads to a working-directory allowlist. Only upload files you intend to disclose to that page.
- Site memory is stored locally. By default it is in `~/.cache/mantis/sites` (or `MANTIS_MEMORY_DIR`) and persists hashes of rendered regions, item counts, and timestamps per origin; it does not persist page text, names, values, or URLs. Set `MANTIS_MEMORY=0` to disable it.
- `ask_human` opens a headed browser window and requires a display. CAPTCHA, 2FA, payment, login, and comparable confirmation steps are handed to the human; Mantis does not solve CAPTCHAs.
- OCR downloads English language data on its first use and caches it locally. Use `MANTIS_TESSDATA` with a pre-provisioned data directory when network download is not appropriate.
