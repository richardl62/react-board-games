import { chromium } from 'playwright';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { mkdirSync } from 'fs';

// Base URL of the running Vite dev server (override with E2E_BASE if needed).
export const BASE = process.env.E2E_BASE ?? 'http://localhost:5173';

const here = dirname(fileURLToPath(import.meta.url));
const screenshotDir = join(here, 'screenshots');

// Resolve a screenshot path under e2e/screenshots (created on demand). The
// directory is gitignored.
export function shot(name) {
  mkdirSync(screenshotDir, { recursive: true });
  return join(screenshotDir, name);
}

export function launch() {
  return chromium.launch();
}

// Extract the Plus Minus turn score from the page body text.
export function score(text) {
  const m = text.match(/End Turn\s*\n?\s*(-?\d+)/);
  return m ? parseInt(m[1], 10) : null;
}

// Create a Plus Minus match in debug mode, join Alice then Bob, and return their
// contexts/pages plus the match id and Alice's full URL (which carries her
// pid+credentials). Console errors from both players (and Alice's page errors)
// are pushed onto the supplied array.
export async function joinTwoPlayers(browser, consoleErrors) {
  const ctxA = await browser.newContext();
  const pageA = await ctxA.newPage();
  pageA.on('pageerror', (e) => console.log('[A][pageerror]', e.message));
  pageA.on('console', (msg) => {
    if (msg.type() === 'error') {
      consoleErrors.push(`[A] ${msg.text()}`);
      console.log('[A][console.error]', msg.text());
    }
  });
  await pageA.goto(`${BASE}/?db=1`);
  await pageA.click('text=Plus Minus');
  await pageA.waitForTimeout(600);
  await pageA.click('text=Start Game');
  await pageA.waitForTimeout(1200);
  await pageA.fill('input', 'Alice');
  await pageA.click('text=Join');
  await pageA.waitForTimeout(1200);
  const aliceUrl = pageA.url();
  const mid = new URL(aliceUrl).searchParams.get('mid');

  const ctxB = await browser.newContext();
  const pageB = await ctxB.newPage();
  pageB.on('console', (msg) => {
    if (msg.type() === 'error') {
      consoleErrors.push(`[B] ${msg.text()}`);
    }
  });
  await pageB.goto(`${BASE}/plusminus?mid=${mid}&db=1`);
  await pageB.waitForTimeout(800);
  await pageB.fill('input', 'Bob');
  await pageB.click('text=Join');
  await pageB.waitForTimeout(1200);
  await pageA.waitForTimeout(800);

  return { ctxA, pageA, ctxB, pageB, mid, aliceUrl };
}
