import {test,expect} from '@playwright/test';
test('editor reviews synthetic trilingual artifacts, publishes test indexes and queries Kannada',{tag:'@content-fixture'},async({page},info)=>{
 test.setTimeout(60000);test.skip(!process.env.MYGOVGUIDE_E2E_CONTENT_FIXTURE,'Run node frontend/scripts/e2e.mjs content.spec.js for isolated mock artifacts');
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('/admin');await page.getByLabel('Username').fill('admin@example.test');await page.getByLabel('Password',{exact:true}).fill(process.env.MYGOVGUIDE_E2E_ADMIN_PASSWORD);await page.getByRole('button',{name:'Sign in securely'}).click();
 await page.getByRole('link',{name:'AI processing',exact:true}).click();await expect(page.getByRole('heading',{name:'AI preparation workspace'})).toBeVisible();
 await page.getByLabel('Scheme for content preparation').selectOption('synthetic-ai-scheme');
 await expect(page.locator('.ad-artifact-card')).toHaveCount(3);await expect(page.locator('.ad-artifact-grid')).toContainText('MOCK_OFFLINE');
 await page.getByRole('button',{name:'Queue preparation'}).click();await expect(page.getByRole('status').first()).toContainText('queued');
 for(const lang of ['en','hi','kn']){
  const card=page.locator('.ad-artifact-card').filter({has:page.locator('.ad-badge').filter({hasText:new RegExp(`^${lang}$`)})});
  if((await card.textContent()).includes('APPROVED')){
   await card.getByRole('button',{name:'Inspect / edit / review'}).click();await page.getByLabel('Editor decision evidence').fill('Synthetic mobile editor requests a separate draft revision for review.');
   await page.getByRole('button',{name:'Save as a new draft revision'}).click();
  }
  const pending=page.locator('.ad-artifact-card').filter({has:page.locator('.ad-badge').filter({hasText:new RegExp(`^${lang}$`)})}).filter({hasText:'REVIEW_PENDING'}).first();
  await pending.getByRole('button',{name:'Inspect / edit / review'}).click();await page.getByLabel('Editor decision evidence').fill('Synthetic browser editor checked source facts, language and keywords; not real government verification.');
  await page.getByRole('button',{name:'Approve stored artifact'}).click();
  await page.getByRole('radio',{name:`Select ${lang} for publication`}).first().check();
  if(lang==='en'){
   await page.getByLabel('Publication decision evidence').fill('Synthetic English-first publication; unreviewed or unselected translations stay hidden.');
   await page.getByRole('button',{name:'Publish selected versions'}).click();await expect(page.getByRole('status').first()).toContainText('Publication decision recorded');
   const pendingTranslation=await page.request.get('/api/admin/content/search-preview?language=hi&q='+encodeURIComponent('छात्रवृत्ति'));expect((await pendingTranslation.json()).items).toEqual([]);
  }
 }
 await page.getByLabel('Publication decision evidence').fill('Synthetic fixture publication inside the isolated test database only.');await page.getByRole('button',{name:'Publish selected versions'}).click();await expect(page.getByRole('status').first()).toContainText('Publication decision recorded');
 await page.getByLabel('Search reviewed keywords').fill('ವಿದ್ಯಾರ್ಥಿವೇತನ');await page.getByLabel('Preview language').selectOption('kn');await page.getByRole('button',{name:'Search index',exact:true}).click();
 await expect(page.locator('pre').filter({hasText:'"rankingScore"'})).toContainText('synthetic-ai-scheme');
 const publicResult=await page.request.get('/api/content/search?q=scholarship&language=en');expect((await publicResult.json()).items).toEqual([]);
 await page.setViewportSize({width:320,height:900});expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 await page.screenshot({path:`reports/phase36-ai-workspace-${info.project.name}.png`,fullPage:true});expect(errors).toEqual([]);
});
