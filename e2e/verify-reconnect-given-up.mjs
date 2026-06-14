// When reconnection has been abandoned (a code 4000-4999 close, which sets
// reconnecting=false immediately - no need to exhaust the 30 backoff attempts)
// while an optimistic action is still pending, the connection warning must tell
// the player their recent moves may not have been saved, and the
// optimistically-applied move must remain on the board (not be rolled back).
//
// Trigger: Alice makes a move with a long server response delay (so it stays
// pending), then a second page opens Alice's URL (pid+cred are in the URL, so it
// connects as the SAME Alice). The server closes Alice's first socket with code
// 4000 "player connected elsewhere" -> first page: reconnecting=false, move still
// pending.

import { launch, joinTwoPlayers, score, shot } from './helpers.mjs';

const browser = await launch();
const consoleErrors = [];
const { ctxA, pageA, aliceUrl } = await joinTwoPlayers(browser, consoleErrors);

const initialScore = score(await pageA.innerText('body'));
console.log(`Initial score: ${initialScore}`);

// Delay all server responses by 10s, so Alice's move stays pending (and its
// response can't arrive and clear the queue before we assert).
await pageA.locator('#delay').fill('10000');
await pageA.click('text=Apply');
await pageA.waitForTimeout(100);

// Alice makes a move - sent immediately (she's connected), response delayed.
await pageA.click('button:has-text("+1")');
await pageA.waitForTimeout(150);

const scoreAfterClick = score(await pageA.innerText('body'));
console.log(
  `Move applied optimistically (expect ${initialScore + 1}): ${scoreAfterClick === initialScore + 1 ? 'PASS' : 'FAIL'} (got ${scoreAfterClick})`,
);

// Open Alice's URL in a fresh page. pid+cred are in the URL, so this connects as
// the SAME Alice; the server closes the first socket with code 4000 "player
// connected elsewhere", and the first page stops reconnecting.
const ctxA2 = await browser.newContext();
const pageA2 = await ctxA2.newPage();
await pageA2.goto(aliceUrl);

// Wait past the warning's 2s appear-debounce for the closed-connection message.
await pageA.waitForTimeout(4000);

const body = await pageA.innerText('body');

const hasMovesNote = body.includes('Recent moves may not have been saved');
console.log(
  `Warning shows "Recent moves may not have been saved.": ${hasMovesNote ? 'PASS' : 'FAIL'}`,
);

const stillReconnecting = body.includes('attempting reconnection');
console.log(
  `Not still "attempting reconnection" (reconnection given up): ${!stillReconnecting ? 'PASS' : 'FAIL'}`,
);

const scoreAfterClose = score(body);
console.log(
  `Optimistic move still on board, not rolled back (expect ${initialScore + 1}): ${scoreAfterClose === initialScore + 1 ? 'PASS' : 'FAIL'} (got ${scoreAfterClose})`,
);

// Show the actual connection warning line for the record.
const warningLine = body.split('\n').find((l) => l.includes('No connection to server'));
console.log(`Connection warning shown: ${warningLine ? warningLine.trim() : '(none)'}`);

await pageA.screenshot({ path: shot('reconnect-given-up.png') });

await ctxA.close();
await browser.close();
