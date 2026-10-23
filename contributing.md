# Contributing to Project Analyzer

Thanks for your interest in contributing! This guide explains how to set up the project, the conventions we follow, and how to submit changes.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Ways to Contribute](#ways-to-contribute)
- [Development Setup](#development-setup)
- [Project Layout](#project-layout)
- [Coding Conventions](#coding-conventions)
- [Adding a New Analysis Feature](#adding-a-new-analysis-feature)
- [Commit Messages](#commit-messages)
- [Pull Request Process](#pull-request-process)
- [Reporting Bugs](#reporting-bugs)
- [Security Issues](#security-issues)

## Code of Conduct

Be respectful and constructive. Assume good intent, give feedback on the code rather than the person, and help newcomers. Harassment or discrimination of any kind is not tolerated.

## Ways to Contribute

- Report bugs or suggest features by opening an issue
- Improve documentation
- Add detection patterns (secret types, frameworks, architecture patterns)
- Pick up an item from the Roadmap in the README
- Write tests

For larger changes, please open an issue first so we can agree on the approach before you invest time.

## Development Setup

**Prerequisites:** Python 3.10+, Node.js 18+, and a GitHub Personal Access Token with the `public_repo` scope.

### Backend

```bash
cd back
python -m venv venv
source venv/bin/activate        # Linux/macOS
venv\Scripts\activate           # Windows
pip install -r requirements.txt

# Create back/.env and add your token
echo "GITHUB_TOKEN=ghp_yourtokenhere" > .env

uvicorn main:app --reload
```

The API runs at `http://127.0.0.1:8000`, with interactive docs at `/docs`.

### Frontend

```bash
cd front
npm install
npm run dev
```

The app runs at `http://localhost:3000`.

> **Never commit your `.env` file or your GitHub token.** If a token is ever pushed by accident, revoke it immediately.

## Project Layout

```
back/
  main.py          FastAPI app, middleware, router registration
  routers/         One file per repo analysis endpoint (repo, security, techstack, architecture)
  services/        Logic that isn't a plain route (live link analysis, AI footprint)
front/app/
  analyse/         Main analyze page
  components/      UI components (one per analysis feature)
  hooks/           React hooks (loading / error / data state)
  lib/             Raw API fetch functions
  types/           Shared TypeScript types
```

## Coding Conventions

### Backend (Python / FastAPI)

- Follow PEP 8 and use type hints.
- Use `async` functions and `httpx.AsyncClient` for network calls.
- Reuse `get_headers()` and `GITHUB_API` from the shared dependencies module rather than building GitHub requests by hand.
- Handle errors explicitly: return meaningful `HTTPException` status codes (404 for missing repos, 429 for rate limits, 502/504 for upstream failures).
- Keep new endpoints inside the existing router pattern, and register them in `main.py`.
- Never return secret values. Mask anything sensitive before it leaves the API.
- Be mindful of the GitHub API rate limit. Prefer one recursive tree call over many per-directory calls.

### Frontend (TypeScript / Next.js)

- TypeScript throughout. Avoid `any`.
- Style with Tailwind CSS and use `lucide-react` for icons.
- Every feature follows the same three layers:

  ```
  lib/feature.ts          raw fetch function (calls the API)
  hooks/useFeature.ts     React hook exposing { data, loading, error, analyze }
  components/Feature.tsx  UI component that renders the data
  ```

- Components should handle their own loading, error, and empty states.

## Adding a New Analysis Feature

1. **Backend:** add `back/routers/<feature>.py` with a `GET /repo/{owner}/{repo}/<feature>` route and register the router in `main.py`.
2. **Frontend lib:** add a typed fetch function in `front/app/lib/`.
3. **Frontend hook:** add `useFeature` returning `{ data, loading, error, analyze }`.
4. **Frontend component:** add the UI component in `front/app/components/`.
5. **Page:** add the hook to `front/app/analyse/page.tsx`, include its `analyze` call in the `Promise.all`, and add an accordion item for it.
6. **Docs:** document the endpoint and response shape in the README's API Reference.

## Commit Messages

We use [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(optional scope): short summary in the imperative mood
```

Common types: `feat`, `fix`, `docs`, `refactor`, `test`, `chore`.

Examples:

```
feat: add architecture analysis to repository tab
fix(security): mask database URL credentials in findings
docs: add CONTRIBUTING and SECURITY policies
```

## Pull Request Process

1. Fork the repository and create a branch: `git checkout -b feature/your-feature-name` (or `fix/...`, `docs/...`).
2. Make your changes, keeping each PR focused on a single concern.
3. Test manually against a few different repositories (for example a small repo, a monorepo, and a repo with no tests) and confirm the backend and frontend both still run.
4. Make sure `npm run lint` passes in `front/`.
5. Push and open a Pull Request describing what changed, why, and how you tested it. Include screenshots for UI changes.
6. Respond to review feedback. A maintainer will merge once everything looks good.

## Reporting Bugs

Open an issue and include:

- What you did (the URL you analyzed, which tab, which section)
- What you expected and what actually happened
- Any error message from the UI, browser console, or backend logs
- Your OS, Python version, and Node.js version

## Security Issues

Please **do not** open public issues for security vulnerabilities. See [SECURITY.md](SECURITY.md) for how to report them privately.

## License

By contributing, you agree that your contributions will be licensed under the project's MIT License.