// A wsClientConnection broadcast caused by ANOTHER player connecting/disconnecting
// must not disturb this player's own pending action: no "Last action unconfirmed"
// warning, the move still confirms correctly, and play continues.

import { launch, joinTwoPlayers, score, shot } from './helpers.mjs';

const browser = await launch();
const consoleErrors = [];
const { pageA, pageB } = await joinTwoPlayers(browser, consoleErrors);

const initialScore = score(await pageA.innerText('body'));
console.log(`Initial score: ${initialScore}`);

// Delay Alice's own move response by 5s, so it's still pending when Bob's
// connection broadcast arrives.
await pageA.locator('#delay').fill('5000');
await pageA.click('text=Apply');
await pageA.waitForTimeout(100);

// Alice makes a move - sent immediately (she's connected), response delayed.
await pageA.click('button:has-text("+1")');
await pageA.waitForTimeout(100);

const scoreRightAfterClick = score(await pageA.innerText('body'));
console.log(
  `Alice's move applied optimistically (expect ${initialScore + 1}): ${scoreRightAfterClick === initialScore + 1 ? 'PASS' : 'FAIL'} (got ${scoreRightAfterClick})`,
);

// Reset the response delay to 0, so Bob's connection broadcast (below) arrives
// promptly, well before Alice's delayed move response.
await pageA.locator('#delay').fill('0');
await pageA.click('text=Apply');
await pageA.waitForTimeout(300);

// Bob disconnects and (quickly) reconnects - this broadcasts wsClientConnection
// with Bob's playerId to every connected player, including Alice, while Alice's
// own move response is still pending.
await pageB.click('text=Close Connection');

// Give Bob's disconnect + reconnect broadcasts time to reach Alice, while her
// own response (5s delay) is still outstanding.
await pageA.waitForTimeout(2500);

const midBodyText = await pageA.innerText('body');
const hasUnconfirmedMid = midBodyText.includes('Last action unconfirmed');
console.log(
  `[Mid] No "Last action unconfirmed" warning while Bob's connection broadcast arrives: ${!hasUnconfirmedMid ? 'PASS' : 'FAIL'}`,
);

// Wait for Alice's delayed move response to arrive.
await pageA.waitForTimeout(3500);

const finalScore = score(await pageA.innerText('body'));
console.log(
  `Score after delayed response (expect ${initialScore + 1}): ${finalScore === initialScore + 1 ? 'PASS' : 'FAIL'} (got ${finalScore})`,
);

const finalBodyText = await pageA.innerText('body');
const hasUnconfirmedFinal = finalBodyText.includes('Last action unconfirmed');
console.log(`[Final] No "Last action unconfirmed" warning: ${!hasUnconfirmedFinal ? 'PASS' : 'FAIL'}`);

const hasPredictionWarning = finalBodyText.includes('Prediction mismatch');
console.log(`No "Prediction mismatch" warning shown: ${!hasPredictionWarning ? 'PASS' : 'FAIL'}`);

const divergenceErrors = consoleErrors.filter((e) => e.includes('diverged') || e.includes('out of order'));
console.log(`No divergence/order console errors: ${divergenceErrors.length === 0 ? 'PASS' : 'FAIL'}`);
if (divergenceErrors.length > 0) {
  console.log('Divergence errors:', divergenceErrors);
}

// Confirm Alice can still act normally afterwards.
await pageA.click('button:has-text("+1")');
await pageA.waitForTimeout(1000);
const scoreAfterFurtherMove = score(await pageA.innerText('body'));
console.log(
  `Can still act afterwards (expect ${initialScore + 2}): ${scoreAfterFurtherMove === initialScore + 2 ? 'PASS' : 'FAIL'} (got ${scoreAfterFurtherMove})`,
);

await pageA.screenshot({ path: shot('other-player-connection-final.png') });

await browser.close();
