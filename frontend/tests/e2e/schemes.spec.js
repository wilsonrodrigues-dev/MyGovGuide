import {test,expect} from '@playwright/test';
const detail={schemeId:'approved-browser-example',language:'en',requestedLanguage:'en',translationUnavailable:false,eligibilityAvailable:false,explanation:{title:'Reviewed browser example',summary:'Browser contract response; not a real government publication.',whoItMayHelp:'Source-defined audience',benefits:['Verified benefit from the response'],documents:[],howToApply:{steps:['Check the official portal.'],links:[{url:'https://www.india.gov.in/',label:'Official portal'}]},limitations:['Full eligibility and current application window are not verified.']},source:{url:'https://www.india.gov.in/',excerpt:'Recorded browser contract evidence, not a live source.',verifiedAt:'2026-11-18T08:00:00Z',publishedAt:null}};
test('guest scheme discovery and detail render reviewed API responses, fallback and absent documents',async({page})=>{
 await page.route('**/api/content/search?**',route=>route.fulfill({json:{items:[{id:detail.schemeId,title:detail.explanation.title,summary:detail.explanation.summary,language:'en',state:'All India'}]}}));
 await page.route('**/api/content/schemes/approved-browser-example?**',route=>route.fulfill({json:detail}));
 await page.goto('/schemes?q=romanized');await expect(page.getByRole('heading',{name:'Find reviewed schemes'})).toBeVisible();
 await expect(page.getByRole('textbox',{name:'Search schemes'})).toHaveValue('romanized');await page.getByRole('link',{name:'Read scheme details'}).click();
 await expect(page.getByRole('heading',{name:detail.explanation.title})).toBeVisible();await expect(page.getByText('Complete eligibility rules have not been approved.',{exact:false})).toBeVisible();
 await expect(page.getByText('The selected source does not establish a verified document checklist.',{exact:false})).toBeVisible();await expect(page.getByRole('link',{name:'Official portal'})).toHaveAttribute('rel','noopener noreferrer');
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);
 await page.route('**/api/content/schemes/approved-browser-example?**',route=>route.fulfill({json:{...detail,requestedLanguage:'kn',translationUnavailable:true}}));
 await page.getByRole('button',{name:'ಕನ್ನಡ',exact:true}).click();await expect(page.getByText('ಈ ಅನುವಾದ ಲಭ್ಯವಿಲ್ಲ. ಸಂಪಾದಕರು ಪರಿಶೀಲಿಸಿದ ಇಂಗ್ಲಿಷ್ ತೋರಿಸಲಾಗುತ್ತಿದೆ.')).toBeVisible();await expect(page.locator('h1')).toHaveAttribute('lang','en');
});
test('scheme detail never substitutes research after a missing publication and recovers from an API error',async({page})=>{
 await page.route('**/api/content/schemes/not-public?**',route=>route.fulfill({status:404,json:{error:{code:'CONTENT_UNAVAILABLE'}}}));await page.goto('/schemes/not-public');await expect(page.getByRole('heading',{name:'This scheme has no current reviewed publication.'})).toBeVisible();
 await page.route('**/api/content/search?**',route=>route.fulfill({status:503,json:{error:{code:'DATABASE_UNAVAILABLE'}}}));await page.goto('/schemes');await expect(page.getByRole('alert')).toContainText('Scheme information is temporarily unavailable.');
 await page.route('**/api/content/search?**',route=>route.fulfill({json:{items:[]}}));await page.getByRole('button',{name:'Try again',exact:true}).click();await expect(page.getByText('No reviewed schemes match this search.')).toBeVisible();
});
test('catalog next and previous pages retain query filters and filter changes reset the page',async({page})=>{
 await page.route('**/api/content/search?**',route=>{const q=new URL(route.request().url()).searchParams,p=Number(q.get('page')||1);return route.fulfill({json:{items:[{id:'page-'+p,title:'Reviewed page '+p,summary:'Browser pagination contract response only.',language:'en',state:'All India'}],page:p,total:25,totalPages:3,hasNext:p<3}});});
 await page.goto('/schemes?q=farmer&state=Karnataka&category=Farmer');await expect(page.getByRole('heading',{name:'Reviewed page 1'})).toBeVisible();
 await expect(page.getByRole('button',{name:'Previous',exact:true})).toBeDisabled();await page.getByRole('button',{name:'Next',exact:true}).click();await expect(page.getByRole('heading',{name:'Reviewed page 2'})).toBeVisible();expect(new URL(page.url()).searchParams.get('q')).toBe('farmer');expect(new URL(page.url()).searchParams.get('category')).toBe('Farmer');
 await page.getByRole('button',{name:'Previous',exact:true}).click();await expect(page.getByRole('heading',{name:'Reviewed page 1'})).toBeVisible();await page.getByRole('button',{name:'Show all schemes',exact:true}).click();await expect(page).toHaveURL(/\/schemes$/);await expect(page.getByRole('heading',{name:'Reviewed page 1'})).toBeVisible();
});
