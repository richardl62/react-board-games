// Moves queued while the connection is blocked from reconnecting must apply
// optimistically and then be delivered (once, in order) when reconnection finally
// succeeds - with no divergence and no spurious warnings.

import { launch, joinTwoPlayers, score, shot } from './helpers.mjs';

const browser = await launch();
const consoleErrors = [];
const { pageA } = await joinTwoPlayers(browser, consoleErrors);

const initialScore = score(await pageA.innerText('body'));
console.log(`Initial score: ${initialScore}`);

// Block reconnection for 3s, then close the connection
await pageA.locator('#blockReconnection').fill('3000');
await pageA.click('text=Close Connection');
await pageA.waitForTimeout(300);

// Queue two moves while disconnected
await pageA.click('button:has-text("+1")');
await pageA.click('button:has-text("+1")');

let changedWhileDisconnected = null;
const t1 = Date.now();
for (let i = 0; i < 20; i++) {
  if (score(await pageA.innerText('body')) === initialScore + 2) { changedWhileDisconnected = Date.now() - t1; break; }
  await pageA.waitForTimeout(20);
}
console.log(`Score updated by 2 while disconnected after ${changedWhileDisconnected}ms (expect <300ms): ${changedWhileDisconnected !== null && changedWhileDisconnected < 300 ? 'PASS' : 'FAIL'}`);

// Wait for the reconnection block to lift, reconnection to happen, and both
// queued responses to be processed.
await pageA.waitForTimeout(8000);

const scoreAfterReconnect = score(await pageA.innerText('body'));
console.log(`Score after reconnect (expect ${initialScore + 2}): ${scoreAfterReconnect === initialScore + 2 ? 'PASS' : 'FAIL'} (got ${scoreAfterReconnect})`);

await pageA.screenshot({ path: shot('block-reconnect-after.png') });

// Check matchStatus warnings shown
const bodyText = await pageA.innerText('body');
const hasPredictionWarning = bodyText.includes('Prediction mismatch');
console.log(`No "Prediction mismatch" warning shown: ${!hasPredictionWarning ? 'PASS' : 'FAIL'}`);

const divergenceErrors = consoleErrors.filter((e) => e.includes('diverged') || e.includes('not pending') || e.includes('out of order'));
console.log(`No divergence/order console errors: ${divergenceErrors.length === 0 ? 'PASS' : 'FAIL'}`);
if (divergenceErrors.length > 0) {
  console.log('Divergence errors:', divergenceErrors);
}

// Confirm action still works afterwards
await pageA.click('button:has-text("+1")');
await pageA.waitForTimeout(1000);
const finalScore = score(await pageA.innerText('body'));
console.log(`Can still act after reconnect (expect ${initialScore + 3}): ${finalScore === initialScore + 3 ? 'PASS' : 'FAIL'} (got ${finalScore})`);

await browser.close();
