"""
GET /repo/{owner}/{repo}/architecture

Infers the architecture style of a GitHub repository (monolith, monorepo,
microservices, client-server split), detects layout patterns (MVC, layered,
feature-based, ...) and scores the folder structure from 0-100.

Uses only two GitHub API calls (repo info + recursive git tree), plus one
optional call for the root package.json to detect npm/yarn workspaces.
"""