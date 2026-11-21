import {test,expect} from '@playwright/test';
test('editor reviews synthetic trilingual artifacts, publishes test indexes and queries Kannada',{tag:'@content-fixture'},async({page},info)=>{
 test.setTimeout(60000);test.skip(!process.env.MYGOVGUIDE_E2E_CONTENT_FIXTURE,'Run node frontend/scripts/e2e.mjs content.spec.js for isolated mock artifacts');
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('/admin');await page.getByLabel('Username').fill('admin@example.test');await page.getByLabel('Password',{exact:true}).fill(process.env.MYGOVGUIDE_E2E_ADMIN_PASSWORD);await page.getByRole('button',{name:'Sign in securely'}).click();await page.getByText('Advanced / Operations',{exact:true}).click();
 await page.getByRole('link',{name:'AI processing',exact:true}).click();await expect(page.getByRole('heading',{name:'AI preparation workspace'})).toBeVisible();
 await page.getByLabel('Scheme for content preparation').selectOption('synthetic-ai-scheme');
 await expect(page.locator('.ad-artifact-card')).toHaveCount(3);await expect(page.locator('.ad-artifact-grid')).toContainText('MOCK_OFFLINE');
 await page.getByRole('button',{name:'Queue preparation'}).click();await expect(page.getByRole('status').first()).toContainText('queued');
 for(const lang of ['en','hi','kn']){
  const card=page.locator('.ad-artifact-card').filter({has:page.locator('.ad-badge').filter({hasText:new RegExp(`^${lang}$`)})});
  if((await card.textContent()).includes('APPROVED')){
   await card.getByRole('button',{name:'Inspect / edit / review'}).click();await page.getByLabel('Optional editor note').fill('Synthetic mobile editor requests a separate draft revision for review.');
   await page.getByRole('button',{name:'Save as a new draft revision'}).click();
  }
  const pending=page.locator('.ad-artifact-card').filter({has:page.locator('.ad-badge').filter({hasText:new RegExp(`^${lang}$`)})}).filter({hasText:'REVIEW_PENDING'}).first();
  if(lang==='en')await expect(pending.getByRole('checkbox',{name:'Select inspected en artifact'})).toBeDisabled();
  await pending.getByRole('button',{name:'Inspect / edit / review'}).click();await page.getByLabel('Optional editor note').fill('Synthetic browser editor checked source facts, language and keywords; not real government verification.');
  if(lang==='en'){
   const selected=pending.getByRole('checkbox',{name:'Select inspected en artifact'});await expect(selected).toBeEnabled();await selected.check();
   await page.getByText('Record selected editorial decisions',{exact:true}).click();
   const batchApprove=page.getByRole('button',{name:'Approve 1 selected inspected artifacts',exact:true});await expect(batchApprove).toBeDisabled();
   await page.getByLabel('Optional selected-artifact note').fill('Synthetic selected-revision review evidence; no real approval.');await expect(batchApprove).toBeDisabled();
   const attestation=page.getByRole('checkbox',{name:'I have personally reviewed every selected language revision, keyword and source caveat.'});await attestation.check();await expect(batchApprove).toBeEnabled();await attestation.uncheck();await expect(batchApprove).toBeDisabled();await selected.uncheck();
  }
  await page.getByRole('button',{name:'Approve stored artifact'}).click();
  await page.getByRole('radio',{name:`Select ${lang} for publication`}).first().check();
  if(lang==='en'){
   await page.getByLabel('Optional publication note').fill('Synthetic English-first publication; unreviewed or unselected translations stay hidden.');
   await page.getByRole('button',{name:'Publish selected versions'}).click();await expect(page.getByRole('status').first()).toContainText('Publication decision recorded');
   const pendingTranslation=await page.request.get('/api/admin/content/search-preview?language=hi&q='+encodeURIComponent('छात्रवृत्ति'));expect((await pendingTranslation.json()).items.some(item=>item.id==='synthetic-ai-scheme')).toBe(false);
  }
 }
 await page.getByLabel('Optional publication note').fill('Synthetic fixture publication inside the isolated test database only.');await page.getByRole('button',{name:'Publish selected versions'}).click();await expect(page.getByRole('status').first()).toContainText('Publication decision recorded');
 await page.getByLabel('Search reviewed keywords').fill('ವಿದ್ಯಾರ್ಥಿವೇತನ');await page.getByLabel('Preview language').selectOption('kn');await page.getByRole('button',{name:'Search index',exact:true}).click();
 await expect(page.locator('pre').filter({hasText:'"rankingScore"'})).toContainText('synthetic-ai-scheme');
 const publicResult=await page.request.get('/api/content/search?q=scholarship&language=en');expect((await publicResult.json()).items).toEqual([]);
 await page.setViewportSize({width:320,height:900});expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 await page.screenshot({path:`reports/phase36-ai-workspace-${info.project.name}.png`,fullPage:true});expect(errors).toEqual([]);
});

test('consolidated review keeps blocked schemes pending and requires one explicit inspected decision',{tag:'@content-fixture'},async({page},info)=>{
 test.skip(!process.env.MYGOVGUIDE_E2E_CONTENT_FIXTURE,'Requires isolated mock content fixture');
 await page.goto('/admin');await page.getByLabel('Username').fill('admin@example.test');await page.getByLabel('Password',{exact:true}).fill(process.env.MYGOVGUIDE_E2E_ADMIN_PASSWORD);await page.getByRole('button',{name:'Sign in securely'}).click();await page.getByText('Advanced / Operations',{exact:true}).click();await page.getByRole('link',{name:'Review & publish',exact:true}).click();
 const region=page.getByRole('region',{name:'Consolidated editorial review'});await expect(region.getByRole('heading',{name:'All pending schemes — one editorial review'})).toBeVisible();
 const title='SYNTHETIC Consolidated '+info.project.name,card=region.locator('details.ad-panel').filter({has:page.locator('summary > strong').filter({hasText:new RegExp('^'+title+'$')})});
 await card.locator('summary').first().click();await expect(card).toContainText('Original evidence');await expect(card).toContainText('Factual uncertainties');await expect(card.getByRole('heading',{name:'EN · REVIEW_PENDING',exact:true})).toBeVisible();await expect(card.getByRole('heading',{name:'HI · REVIEW_PENDING',exact:true})).toBeVisible();await expect(card.getByRole('heading',{name:'KN · REVIEW_PENDING',exact:true})).toBeVisible();
 await card.getByRole('checkbox',{name:'Select reviewed scheme '+title,exact:true}).check();const approve=region.getByRole('button',{name:'Approve and publish 1 selected reviewed schemes'});await expect(approve).toBeDisabled();await expect(approve).toBeDisabled();
 const blocked=region.locator('details.ad-panel').filter({has:page.locator('summary > strong').filter({hasText:'SYNTHETIC Consolidated blocked'})});await blocked.locator('summary').first().click();await expect(blocked).toContainText('Blocked: current evidence required');await expect(blocked.getByRole('checkbox',{name:'Select reviewed scheme SYNTHETIC Consolidated blocked',exact:true})).toBeDisabled();
 await region.getByRole('checkbox',{name:/I personally reviewed every selected scheme/}).check();await expect(approve).toBeEnabled();await approve.click();await expect(region.getByRole('status')).toContainText('1 explicitly selected schemes published');await expect(card).toHaveCount(0);await expect(blocked).toBeVisible();
 const publicData=await(await page.request.get('/api/content/search?q=synthetic')).json();expect(publicData.items).toEqual([]);await page.screenshot({path:'reports/consolidated-review-'+info.project.name+'.png',fullPage:true});expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);
});
