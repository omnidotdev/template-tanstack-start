---
"@omnidotdev/template-tanstack-start": patch
---

Pin `@tanstack/react-router-devtools` to the release matching the router (1.157.6). The `^1.166.11` range resolved to devtools that need a newer router, so the Router devtools panel threw `pendingMatchesSnapshot` and rendered empty in every app scaffolded from this template.
