# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Working preferences

- Favour simplicity and clarity over performance.
- Aim for robustness: make good use of TypeScript, avoid unnecessary `any`. New games are likely to be added, so future-proofing is worthwhile.
- If something is unclear, ask — don't hide confusion.
- If a simpler or cleaner approach exists, say so and push back when warranted.
- Match existing code style even if you'd do it differently.
- If you notice unrelated dead code or other problems, mention them but don't fix them automatically.

## Coding conventions

- Use `sAssert` (from `shared/utils/assert.ts`) for runtime invariant checks — prefer it over ad-hoc `if (!x) throw` patterns.
- When an invariant is violated, throw explicitly rather than silently skipping. Prefer `sAssert(x, "reason"); use(x)` over `if (x) { use(x) }` when `x` should always be present.

## Commands

```bash
npm run dev                  # Vite client dev server (port 5173)
npm run buildAndRunServer    # Compile and start Express/WS server (port 8000)
npm run serve                # Run server from already-built dist/

npm run lint                 # ESLint across client, server, shared
npm run type-check           # tsc --noEmit (all tsconfig references)
npm run validate             # type-check + lint (run before reporting work done)
npm run format               # Prettier format

npm run build                # Full build: client (Vite) + server (tsc)
npm run deploy               # Push to Heroku

npm run verify               # Run all Playwright E2E tests (requires servers running)
npx vitest <path-to-test>    # Run a single unit test file
```

Unit tests (`.test.ts` files) use Vitest. E2E tests in `e2e/*.mjs` use Playwright and require `npm run buildAndRunServer` and `npm run dev` to be running first.

## Path Aliases

```
@/*          → client/*
@shared/*    → shared/*
@utils/*     → client/utils/*
@game-control/* → shared/game-control/*
@lobby/*     → shared/lobby/*
```

## Architecture

The codebase has three top-level directories: `client/` (React/Vite), `server/` (Express + WebSocket), and `shared/` (game logic shared between both). The design is influenced by boardgame.io, which this project originally used before replacing it with home-grown code.

### Game definition: GameControl + AppGame

Every game is defined in two layers:

- **`shared/game-control/games/<game>/`** — `GameControl`: the authoritative game rules (moves, setup, turn context). This code runs on both the server and client (for optimistic predictions).
- **`client/app-games/<game>/`** — `AppGame`: extends `GameControl` with a React board component and setup options. Client-only.

A game's `moves` object maps move names to functions with signature `(context, arg) => void`. The context provides `G` (game state), `ctx` (turn/game-over), `events` (endTurn/endMatch), `random` (seeded PRNG), and `setPlayerData`/`getPlayerData` (per-player data). Moves mutate `G` and `ctx` directly (Immer-style).

Out-of-sequence moves (in `game-control/move-fn.ts`) can be executed by any player regardless of whose turn it is — used for actions like conceding.

### Match lifecycle and WebSocket protocol

1. **Lobby** (HTTP): Players create/join matches via POST to `/lobby`. Returns `matchID`, `playerID`, `credentials`.
2. **Play** (WebSocket): Client connects with those credentials. Server broadcasts full `MatchState` to all players on every state change.

Message types are defined in `shared/ws-*.ts`. The client sends `WsClientRequest` (includes a per-player `requestID` for idempotency). The server sends `WsServerResponse` containing the updated `MatchState` plus a trigger field indicating what caused the update.

Private close codes (4000–4999) signal the client not to reconnect (e.g. invalid credentials, unrecognised match).

### MatchState shape

```ts
{
  ctxData: { playOrder, playOrderPos, matchOver }  // turn order and game-over flag
  state: unknown                                    // game-specific state
  prngState: number                                 // PRNG seed (kept in sync)
  playerData: PublicPlayerMetadata[]               // connection status + per-player game data
  errorInLastAction: string | null
}
```

### Optimistic updates

The client applies moves locally before the server responds, using the same `GameControl` move logic. `use-pending-requests.ts` manages a queue of in-flight requests and reconciles against server responses. If the connection drops mid-flight, queued requests are re-sent on reconnect. `apply-action-locally.ts` mirrors the server's `match-action.ts` execution path.

### Networking reliability

- Server pings clients every 25 s (configurable via `KEEPALIVE_MS` env var); unresponsive connections are closed.
- Idle timeout: 60 minutes of no user actions.
- Client reconnects with exponential backoff + jitter (1 s–20 s, up to 30 attempts).

### TypeScript config

The project uses monorepo-style `tsconfig` project references: `tsconfig.app.json` (client), `tsconfig.server.json` (server), `tsconfig.node.json` (Vite config). Strict mode is on throughout.
