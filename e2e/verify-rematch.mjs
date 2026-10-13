// Game controls and rematches in an online match:
// - The game controls are hidden until 'Show game controls' is ticked.
// - A rematch proposal can be declined, withdrawn or accepted.
// - Once both players want a rematch the match restarts, and the game controls are
//   still available.
// - If the match is created without support for game controls, neither player is
//   offered them.

import { launch, joinTwoPlayers, shot } from './helpers.mjs';

function report(description, pass, detail = '') {
  console.log(`${description}: ${pass ? 'PASS' : 'FAIL'}${detail && ` (${detail})`}`);
}

// Extract the Plus Minus shared count from the page.
async function sharedCount(page) {
  const m = (await page.innerText('body')).match(/Shared Count\s*\+1\s*-1\s*(-?\d+)/);
  return m ? parseInt(m[1], 10) : null;
}

// Add one to the shared count.
async function addToSharedCount(page) {
  await page.locator('button:has-text("+1")').nth(1).click();
  await page.waitForTimeout(800);
}

const visible = (page, text) => page.getByText(text, { exact: true }).isVisible();
const showControls = (page) => page.getByLabel('Show game controls');

const browser = await launch();
const consoleErrors = [];

// ---- A match that supports game controls (the default) ----
{
  const { pageA, pageB } = await joinTwoPlayers(browser, consoleErrors);

  report(
    'Game controls checkbox is shown, and is unticked',
    (await showControls(pageA).isVisible()) && !(await showControls(pageA).isChecked()),
  );
  report('Propose Rematch is hidden to start with', !(await visible(pageA, 'Propose Rematch')));

  await showControls(pageA).check();
  report('Ticking the checkbox shows Propose Rematch', await visible(pageA, 'Propose Rematch'));

  // Make a move, so that a restart can be detected.
  const initialCount = await sharedCount(pageA);
  await addToSharedCount(pageA);
  const movedCount = await sharedCount(pageA);
  report(
    'Move applied',
    initialCount !== null && movedCount === initialCount + 1,
    `got ${movedCount}`,
  );

  // Propose, then decline.
  await pageA.click('text=Propose Rematch');
  await pageA.waitForTimeout(800);
  report(
    'Proposer is told who they are waiting for',
    await visible(pageA, 'Rematch proposed: waiting for Bob'),
  );
  report('Proposer can withdraw', await visible(pageA, 'Withdraw Rematch'));
  report('Other player sees the proposal', await visible(pageB, 'Rematch proposed by Alice'));

  await pageB.click('text=Decline');
  await pageA.waitForTimeout(800);
  report(
    'Decline cancels the proposal for both players',
    !(await visible(pageA, 'Rematch proposed: waiting for Bob')) &&
      !(await visible(pageB, 'Rematch proposed by Alice')) &&
      (await visible(pageA, 'Propose Rematch')),
  );

  // Propose, then withdraw.
  await pageA.click('text=Propose Rematch');
  await pageA.waitForTimeout(800);
  await pageA.click('text=Withdraw Rematch');
  await pageA.waitForTimeout(800);
  report(
    'Withdrawal cancels the proposal for both players',
    !(await visible(pageB, 'Rematch proposed by Alice')) &&
      (await visible(pageA, 'Propose Rematch')),
  );
  report(
    'Match not restarted by a cancelled proposal',
    (await sharedCount(pageA)) === movedCount,
  );

  // Propose, then accept.
  await pageA.click('text=Propose Rematch');
  await pageA.waitForTimeout(800);
  await pageB.click('text=Accept');
  await pageA.waitForTimeout(1000);

  const restartedCountA = await sharedCount(pageA);
  const restartedCountB = await sharedCount(pageB);
  report(
    'Match restarted once both players want a rematch',
    restartedCountA === initialCount && restartedCountB === initialCount,
    `got ${restartedCountA} and ${restartedCountB}`,
  );
  report(
    'No proposal is pending after the restart',
    !(await visible(pageA, 'Rematch proposed: waiting for Bob')) &&
      !(await visible(pageB, 'Rematch proposed by Alice')),
  );
  report(
    'Game controls are still available after the restart',
    (await visible(pageA, 'Propose Rematch')) && (await showControls(pageB).isVisible()),
  );

  await addToSharedCount(pageA);
  report('Can still move after the restart', (await sharedCount(pageA)) === initialCount + 1);

  await pageA.screenshot({ path: shot('rematch-final.png') });
}

// ---- A match that does not support game controls ----
{
  const { pageA, pageB } = await joinTwoPlayers(browser, consoleErrors, async (page) => {
    await page.getByLabel('Show debug options').check();
    await page.getByLabel('Support game controls').uncheck();
  });

  report(
    'No game controls for the player who created the match',
    (await visible(pageA, 'End Turn')) && (await showControls(pageA).count()) === 0,
  );
  report(
    'No game controls for the other player',
    (await visible(pageB, 'End Turn')) && (await showControls(pageB).count()) === 0,
  );

  await pageA.screenshot({ path: shot('rematch-no-controls.png') });
}

report('No console errors', consoleErrors.length === 0);
if (consoleErrors.length > 0) {
  console.log('Console errors:', consoleErrors);
}

await browser.close();
