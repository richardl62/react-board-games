// Multiple optimistic actions in flight: rapid moves, a mixed sequence, and moves
// queued while disconnected should all apply instantly and settle to the correct
// server-confirmed state.

import { launch, joinTwoPlayers, score, shot } from './helpers.mjs';

const browser = await launch();
const consoleErrors = [];
const { pageA, pageB } = await joinTwoPlayers(browser, consoleErrors);

// ── Test 1: multiple rapid moves with a server delay ──────────────────────
await pageA.locator('#delay').fill('3000');
await pageA.click('text=Apply');
await pageA.waitForTimeout(200);

const t0 = Date.now();
await pageA.click('button:has-text("+1")');
await pageA.click('button:has-text("+1")');
await pageA.click('button:has-text("+1")');
let changedTo3 = null;
for (let i = 0; i < 20; i++) {
  if (score(await pageA.innerText('body')) === 3) { changedTo3 = Date.now() - t0; break; }
  await pageA.waitForTimeout(20);
}
console.log(`[Test 1] Score->3 after 3 rapid clicks took ${changedTo3}ms (expect <300ms): ${changedTo3 !== null && changedTo3 < 300 ? 'PASS' : 'FAIL'}`);

// Wait for all 3 responses (3s delay each, processed in order -> ~9s worst case for last)
await pageA.waitForTimeout(10000);
const scoreAfterConfirm = score(await pageA.innerText('body'));
console.log(`[Test 1] Score after all confirmations (expect 3): ${scoreAfterConfirm === 3 ? 'PASS' : 'FAIL'} (got ${scoreAfterConfirm})`);

// Confirm B sees the same score
const scoreB = score(await pageB.innerText('body'));
console.log(`[Test 1] Bob also sees score 3: ${scoreB === 3 ? 'PASS' : 'FAIL'} (got ${scoreB})`);

await pageA.screenshot({ path: shot('multi-1-after-confirm.png') });

// ── Test 2: mixed +1/-1 sequence, no delay ─────────────────────────────────
await pageA.locator('#delay').fill('0');
await pageA.click('text=Apply');
await pageA.waitForTimeout(300);

await pageA.click('button:has-text("+1")');
await pageA.click('button:has-text("-1")');
await pageA.click('button:has-text("+1")');
await pageA.waitForTimeout(1500);
const scoreAfterMixed = score(await pageA.innerText('body'));
console.log(`[Test 2] Score after +1,-1,+1 from 3 (expect 4): ${scoreAfterMixed === 4 ? 'PASS' : 'FAIL'} (got ${scoreAfterMixed})`);

// ── Test 3: disconnect, queue 2 moves while offline, reconnect ─────────────
await pageA.click('text=Close Connection');
await pageA.waitForTimeout(200);

await pageA.click('button:has-text("+1")');
await pageA.click('button:has-text("+1")');
let changedWhileDisconnected = null;
const t1 = Date.now();
for (let i = 0; i < 20; i++) {
  if (score(await pageA.innerText('body')) === 6) { changedWhileDisconnected = Date.now() - t1; break; }
  await pageA.waitForTimeout(20);
}
console.log(`[Test 3] Score->6 while disconnected (2 queued moves) after ${changedWhileDisconnected}ms (expect <300ms): ${changedWhileDisconnected !== null && changedWhileDisconnected < 300 ? 'PASS' : 'FAIL'}`);

await pageA.waitForTimeout(12000); // reconnect + flush + confirm
const scoreAfterReconnect = score(await pageA.innerText('body'));
console.log(`[Test 3] Score after reconnect (expect 6): ${scoreAfterReconnect === 6 ? 'PASS' : 'FAIL'} (got ${scoreAfterReconnect})`);
await pageA.screenshot({ path: shot('multi-2-after-reconnect.png') });

// Confirm not stuck - end turn works
await pageA.click('button:has-text("End Turn")');
await pageA.waitForTimeout(1500);
const bodyAfterEndTurn = await pageA.innerText('body');
console.log(`[Test 3] Player can act after reconnect (expect Bob's turn): ${bodyAfterEndTurn.includes("Bob (you)") || bodyAfterEndTurn.includes('Current player: Bob') ? 'PASS' : 'FAIL'}`);

// ── Console error / divergence check ───────────────────────────────────────
const divergenceErrors = consoleErrors.filter((e) => e.includes('diverged') || e.includes('out of order'));
console.log(`[Final] No divergence/order console errors: ${divergenceErrors.length === 0 ? 'PASS' : 'FAIL'}`);
if (divergenceErrors.length > 0) {
  console.log('Divergence errors:', divergenceErrors);
}
if (consoleErrors.length > 0) {
  console.log('All console errors:', consoleErrors);
}

await browser.close();
