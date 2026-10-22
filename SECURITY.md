# Security Policy

## Supported Versions

Project Analyzer is under active development. Security fixes are applied to the latest version on the default branch only.

| Version            | Supported |
| ------------------ | --------- |
| Latest (`main`)    | Yes       |
| Older commits/tags | No        |

## Reporting a Vulnerability

**Please do not report security vulnerabilities through public GitHub issues, discussions, or pull requests.**

Report them privately using one of these options:

1. **GitHub private vulnerability reporting (preferred):** open the repository's **Security** tab and choose **Report a vulnerability**.
2. **Email:** send details to `arnoldkk422@gmail.com`.

Please include as much of the following as you can:

- A description of the issue and its potential impact
- Steps to reproduce, or a proof of concept
- The affected endpoint, file, or component
- Any suggested fix or mitigation

### What to expect

- **Acknowledgement** within 3 business days
- **An initial assessment** within 7 days
- **Updates** as we work on a fix, and credit in the release notes if you'd like it

Please give us a reasonable amount of time to fix the issue before disclosing it publicly.

## Scope

Reports we are especially interested in:

- **Server-side request forgery (SSRF)** through the live link analyzer (`GET /live/analyze?url=...`), for example requests to localhost, private network ranges, or cloud metadata endpoints
- **Leakage of secrets**: the GitHub token, or unmasked secret values returned by the security scanner
- **Injection or XSS** via data from analyzed repositories or websites that is rendered in the frontend
- **Authentication or rate-limit bypass** that lets someone abuse the server's GitHub token
- Denial of service through unbounded requests, very large responses, or expensive scans

Out of scope:

- Findings reported by the scanner for the repositories being analyzed (those are results, not vulnerabilities in this project)
- Vulnerabilities in third-party dependencies with no demonstrated impact on this project (please report those upstream)
- Issues that require physical access to a user's device
- Missing security headers on the local development server

## Security Design Notes

- **The GitHub token stays on the server.** It is read from `back/.env` and is never sent to or required from the frontend.
- **Scanner output is masked.** Secret values found in analyzed repositories are masked (first 4 and last 4 characters only), and the API never returns the full value.
- **Scans are bounded.** The scanner reads a limited number of files and enforces a per-file size cap.
- **Read-only access.** The tool uses the `public_repo` scope and only reads public repository data.

## Guidance for Self-Hosting

- Never commit `.env` files. Keep them in `.gitignore`.
- Use a token with the minimum scope needed (`public_repo`) and rotate it regularly.
- If a token is ever exposed, revoke it immediately at **GitHub Settings → Developer Settings → Personal Access Tokens** and create a new one.
- Restrict CORS to your own frontend origin in production rather than allowing all origins.
- Run the backend behind HTTPS and consider adding rate limiting to protect your GitHub token's quota.
- Keep Python and Node.js dependencies up to date.

## Thank You

Responsible disclosure helps keep Project Analyzer and its users safe, and we appreciate it.