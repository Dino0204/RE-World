---
trigger: always_on
---

# RE-World

**Please respond and work in Korean.**
**Do not run Docker Compose if testing is only required in the client environment.**

## Project Overview

- Battle Royale genre FPS game

## Module Structure

- Client: FSD Architecture
- Server: TBC

## Commands

- "dev:client": "cd client && bun dev",
- "dev:server": "cd server && bun dev",
- "dev": "concurrently 'bun run dev:client' 'bun run dev:server'"

## Tech Stack

- Programming Languages: TypeScript
- Frameworks: Next.js, Elysia.js
- Databases: PostgresSQL(Prisma ORM)
- Version Control: Git
- Cloud Services: TBC
- Deployment Tools: Vercel, Docker
- Testing Frameworks: Playwright MCP
- API: TBC
- Other Libraries: Zustand, R3F, Tailwind CSS

## Coding Rules

- When managing states, unless they are strictly limited to two states (true/false), we avoid managing them as boolean states to ensure code extensibility.

- Do not use abbreviations when writing variable names.

- When writing functions, use pure functions whenever possible.

- Do not add comments except for essential ones.
