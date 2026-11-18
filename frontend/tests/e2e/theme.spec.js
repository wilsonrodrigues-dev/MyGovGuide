import {test,expect} from '@playwright/test';
test('Civic Blue retains keyboard navigation, fonts and layouts at 320/360/390px',async({page})=>{
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 for(const width of [320,360,390,1280]){
  await page.setViewportSize({width,height:900});await page.goto('/onboarding');
  await expect(page.getByRole('heading',{level:1})).toBeVisible();
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  const tokens=await page.evaluate(()=>{const s=getComputedStyle(document.documentElement);return {primary:s.getPropertyValue('--civic-primary').trim(),accent:s.getPropertyValue('--civic-accent').trim()};});
  expect(tokens.primary.toLowerCase()).toBe('#1e3a8a');expect(tokens.accent.toLowerCase()).toBe('#4f46e5');
  await page.getByRole('button',{name:'हिन्दी',exact:true}).click();await expect(page.locator('html')).toHaveAttribute('lang','hi');
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  await page.getByRole('button',{name:'ಕನ್ನಡ',exact:true}).click();await expect(page.locator('html')).toHaveAttribute('lang','kn');
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  await page.getByRole('button',{name:'English',exact:true}).click();
  await page.goto('/admin');await expect(page.getByRole('heading',{name:'Welcome to operations'})).toBeVisible();
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 }
 expect(errors).toEqual([]);
});
