"""
GET /repo/{owner}/{repo}/docs-tests

Evaluates how well a GitHub repository is documented and tested.

Documentation (50 pts)
    README quality (30): presence, length, install/usage/config sections,
    code blocks, structure, visuals.
    Project docs (20): LICENSE, CONTRIBUTING, docs/ folder, CHANGELOG,
    CODE_OF_CONDUCT, SECURITY.

Testing (50 pts)
    Test files (15), test-to-source ratio (10), framework detection (7),
    runnable test command (5), tests running in CI (8), coverage tooling (5).

GitHub calls: repo info + recursive tree + README, plus up to 6 manifest
files and up to 6 CI config files (max ~15 requests, fetched concurrently).

  test coverage is *estimated* from the test-to-source file ratio. It is
a heuristic, not measured line coverage.
"""