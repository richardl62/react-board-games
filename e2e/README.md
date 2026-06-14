# End-to-end verification scripts

Playwright scripts that drive two real browsers against the live dev servers to
verify online match-play behaviour under network problems (optimistic updates,
reconnection, queued moves, connection warnings). They are pass/fail smoke tests,
not a formal test suite — each prints `PASS`/`FAIL` lines and saves a screenshot to
`e2e/screenshots/` (gitignored).

All scripts use the **Plus Minus** game in debug mode (`?db=1`), whose debug panel
exposes *Close Connection*, *Block reconnections (ms)*, and a server *response
delay* — the levers the scripts use to simulate network conditions.

## Prerequisites (first time only)

Playwright's browser binary must be installed once:

```
npx playwright install chromium
```

## Running

1. Build the server if `server/` or `shared/` changed since the last build:

   ```
   npm run buildServer
   ```

2. Start both dev servers, each in its own terminal, and leave them running:

   ```
   npm run serve     # WebSocket + HTTP server (port 8000)
   npm run dev       # Vite client (port 5173)
   ```

3. Run all verification scripts:

   ```
   npm run verify
   ```

   …or run one at a time:

   ```
   node e2e/verify-multi-move.mjs
   node e2e/verify-block-reconnect.mjs
   node e2e/verify-other-player-connection.mjs
   node e2e/verify-reconnect-given-up.mjs
   ```

Override the client URL with `E2E_BASE` if the dev server isn't on
`http://localhost:5173`.

## The scripts

| Script | Checks |
| --- | --- |
| `verify-multi-move.mjs` | Multiple optimistic actions in flight (rapid clicks, mixed `+1`/`-1`, moves queued while disconnected) apply instantly and settle correctly. |
| `verify-block-reconnect.mjs` | Moves queued while reconnection is blocked are delivered once, in order, on reconnect — no divergence. |
| `verify-other-player-connection.mjs` | Another player connecting/disconnecting doesn't disturb this player's pending action. |
| `verify-reconnect-given-up.mjs` | When reconnection is abandoned with a move pending, the player is warned ("Recent moves may not have been saved.") and the optimistic move isn't rolled back. |

Shared setup (`joinTwoPlayers`, `score`, screenshot paths) lives in `helpers.mjs`.
