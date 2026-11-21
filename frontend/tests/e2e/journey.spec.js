import { test, expect } from '@playwright/test';
import fs from 'node:fs/promises';
import path from 'node:path';
async function onboard(page, { state = 'Karnataka', category = 'Student' } = {}) {
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Government information');
  await page.getByRole('button',{name:'Choose English',exact:true}).click();
  await page.locator('#state').selectOption(state);
  await page.locator('.category-option').filter({ hasText: category }).first().click();
  await page.getByRole('button', { name: 'Continue to my home' }).click();
  await expect(page).toHaveURL(/\/home$/);
  await expect.poll(async () => {
    const response = await page.request.get('/api/profile');
    return response.ok() ? (await response.json()).profile?.category : null;
  }).toBe(category);
}
test.afterEach(async ({ page }) => {
  try {
    const response = await page.request.get('/api/session');
    if (response.ok()) await page.request.delete('/api/session');
  } catch { /* page may deliberately test an unavailable service */ }
});
test('onboarding validation, profile persistence and safe personalized Home', async ({ page }, info) => {
  const errors = []; page.on('pageerror', error => errors.push(error.message));
  await page.goto('/home'); await expect(page).toHaveURL(/\/onboarding$/);
  await page.getByRole('button',{name:'Choose English',exact:true}).click();
  await page.getByRole('button', { name: 'Continue to my home' }).click();
  await expect(page.locator('#state-error')).toBeVisible(); await expect(page.locator('#category-error')).toBeVisible();
  await page.locator('#state').selectOption('Karnataka'); await page.locator('.category-option').filter({ hasText: /^Student$/ }).click();
  await page.getByRole('button', { name: 'Continue to my home' }).click();
  await expect(page.getByRole('heading', { name: 'A little clarity. A more confident next step.' })).toBeVisible();
  await expect(page.locator('.profile-meta')).toContainText('Karnataka'); await expect(page.locator('.profile-meta')).toContainText('Student');
  await expect(page.getByText('Good information is worth getting right.')).toBeVisible();
  await expect(page.locator('.scheme-preview')).toHaveCount(0);
  await page.reload(); await expect(page).toHaveURL(/\/home$/); await expect(page.locator('.profile-meta')).toContainText('Student');
  const stored = await page.evaluate(() => JSON.parse(localStorage.getItem('mygovguide.preferences.v1')));
  expect(stored.profile).toEqual({ state: 'Karnataka', category: 'Student', language: 'en' }); expect(stored.pending).toBe(false);
  expect(Object.keys(stored).sort()).toEqual(['pending', 'profile']);
  expect(await page.evaluate(() => document.cookie)).not.toContain('mygovguide_session');
  expect((await page.context().cookies()).find(c => c.name === 'mygovguide_session').httpOnly).toBe(true);
  await page.evaluate(() => document.fonts.ready); await fs.mkdir('reports/screenshots', { recursive: true });
  await page.screenshot({ path: path.join('reports/screenshots', `home-en-${info.project.name}.png`), fullPage: true });
  expect(errors).toEqual([]);
});
test('state/category edits and Hindi/Kannada switching persist securely', async ({ page }, info) => {
  await onboard(page); await page.goto('/settings');
  await page.locator('#state').selectOption('Kerala'); await page.locator('.category-option').filter({ hasText: /^Farmer$/ }).click();
  await page.getByRole('button', { name: 'Save preferences' }).click();
  await expect(page.locator('.profile-meta')).toContainText('Kerala'); await expect(page.locator('.profile-meta')).toContainText('Farmer');
  await page.getByRole('button', { name: 'हिन्दी', exact: true }).click();
  await expect(page.locator('html')).toHaveAttribute('lang', 'hi'); await expect(page.locator('.profile-meta')).toContainText('किसान');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('थोड़ी स्पष्टता');
  await page.evaluate(() => document.fonts.ready);
  await fs.mkdir('reports/screenshots', { recursive: true }); await page.screenshot({ path: `reports/screenshots/home-hi-${info.project.name}.png`, fullPage: true });
  await page.getByRole('button', { name: 'ಕನ್ನಡ', exact: true }).click();
  await expect(page.locator('html')).toHaveAttribute('lang', 'kn'); await expect(page.locator('.profile-meta')).toContainText('ರೈತ');
  await expect.poll(async () => (await (await page.request.get('/api/profile')).json()).profile.language).toBe('kn');
  await page.reload(); await expect(page.locator('html')).toHaveAttribute('lang', 'kn');
  await expect(page.locator('.profile-meta')).toContainText('ಕೇರಳ');
  await page.evaluate(() => document.fonts.ready);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1)).toBe(true);
  await fs.mkdir('reports/screenshots', { recursive: true }); await page.screenshot({ path: `reports/screenshots/home-kn-${info.project.name}.png`, fullPage: true });
});
test('all six actions, search and future routes are honest and navigable', async ({ page }) => {
  await onboard(page);
  const actions = ['/schemes', '/eligibility', '/notices', '/alerts', '/forms', '/centers'];
  for (const route of actions) {
    await page.locator(`.actions-grid a[href="${route}"]`).click(); await expect(page).toHaveURL(new RegExp(`${route}$`));
    if(route==='/schemes'){await expect(page.getByRole('heading',{name:'Find reviewed schemes'})).toBeVisible();await expect(page.getByText('No reviewed schemes match this search.')).toBeVisible();await page.goto('/home');}
    else if(route==='/eligibility'||route==='/notices'){await expect(page.locator('.assistant-page h1')).toBeVisible();await page.goto('/home');}
    else if(route==='/alerts'){await expect(page.getByRole('heading',{name:'Scam awareness',exact:true})).toBeVisible();await expect(page.getByRole('heading',{name:'Official awareness and reporting resources',exact:true})).toBeVisible();await page.goto('/home');}
    else if(route==='/forms'){await expect(page.getByRole('heading',{name:'Forms, made a little clearer.'})).toBeVisible();await page.goto('/home');}
    else{await expect(page.getByText('Coming in a later phase', { exact: true })).toBeVisible();await page.getByRole('link', { name: 'Back to home' }).click();}
  }
  await page.getByRole('textbox', { name: 'Search government information' }).fill('student support');
  await page.getByRole('button', { name: 'Search', exact: true }).click();
  await expect(page).toHaveURL(/schemes\?q=student%20support/); await expect(page.getByRole('textbox',{name:'Search schemes'})).toHaveValue('student support');
  await page.goto('/schemes/example');await expect(page.getByRole('heading',{name:'This scheme has no current reviewed publication.'})).toBeVisible();
  await page.goto('/forms/example');await expect(page.getByRole('heading',{name:'Forms are temporarily unavailable. Please retry.'})).toBeVisible();
  for (const route of ['/notifications', '/bookmarks', '/login']) {
    await page.goto(route); await expect(page.getByText('Coming in a later phase', { exact: true })).toBeVisible();
  }
});
test('keyboard category selection, skip link, responsive layout and language rendering', async ({ page }, info) => {
  await page.goto('/onboarding'); await page.getByRole('button',{name:'Choose English',exact:true}).click(); await expect(page.locator('#state')).toBeVisible();
  await page.locator('.skip-link').focus(); await expect(page.locator('.skip-link')).toBeFocused();
  await page.keyboard.press('Enter'); await expect(page.locator('#main-content')).toBeFocused();
  await page.locator('#category-0').focus(); await page.keyboard.press('ArrowRight');
  await expect(page.locator('#category-1')).toBeChecked();
  await page.getByRole('button', { name: 'ಕನ್ನಡ', exact: true }).click(); await expect(page.locator('html')).toHaveAttribute('lang', 'kn');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('ಸರ್ಕಾರಿ ಮಾಹಿತಿ');
  await page.evaluate(() => document.fonts.ready);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1)).toBe(true);
  await fs.mkdir('reports/screenshots', { recursive: true }); await page.screenshot({ path: `reports/screenshots/onboarding-kn-${info.project.name}.png`, fullPage: true });
  for (const width of [360, 320]) {
    await page.setViewportSize({ width, height: 800 });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1)).toBe(true);
  }
});
test('unavailable and loading states are visible and recovery works', async ({ page }) => {
  await onboard(page); await page.goto('/settings');
  let release; const gate = new Promise(resolve => { release = resolve; });
  await page.route('**/api/schemes/preview', async route => { await gate; await route.fulfill({ status: 503, contentType: 'application/json', body: JSON.stringify({ error: { code: 'UNAVAILABLE' } }) }); });
  await page.goto('/home'); await expect(page.locator('.skeleton-panel')).toBeVisible(); release();
  await expect(page.getByText('This information is temporarily unavailable. Please try again.')).toBeVisible();
  await page.unroute('**/api/schemes/preview'); await page.getByRole('button', { name: 'Try again' }).click();
  await expect(page.getByText('Good information is worth getting right.')).toBeVisible();
});
test('local preferences remain usable when secure sync is temporarily unavailable', async ({ page }) => {
  await page.route('**/api/session', route => route.abort());
  await page.route('**/api/profile', route => route.abort());
  await page.goto('/'); await expect(page.getByText('Secure preference syncing is temporarily unavailable. You can continue on this browser.')).toBeVisible();
  await page.getByRole('button',{name:'Choose English',exact:true}).click();
  await page.locator('#state').selectOption('Karnataka'); await page.locator('.category-option').filter({ hasText: /^General$/ }).click();
  await page.getByRole('button', { name: 'Continue to my home' }).click();
  await expect(page).toHaveURL(/\/home$/); await expect(page.locator('.profile-meta')).toContainText('General');
  await expect(page.getByText('Saved on this browser. Secure syncing is temporarily unavailable.')).toBeVisible();
  const stored = await page.evaluate(() => JSON.parse(localStorage.getItem('mygovguide.preferences.v1'))); expect(stored.pending).toBe(true);
  await page.unroute('**/api/session'); await page.unroute('**/api/profile');
  await page.reload();
  await expect.poll(async () => (await (await page.request.get('/api/profile')).json()).profile?.category).toBe('General');
  await expect(page.getByText('Saved on this browser. Secure syncing is temporarily unavailable.')).toHaveCount(0);
});
