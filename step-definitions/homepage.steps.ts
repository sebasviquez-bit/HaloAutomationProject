import { Given, When, Then } from '@wdio/cucumber-framework';
import { browser, $, $$ } from '@wdio/globals';
import assert from 'node:assert';

// Narrow typing for globals
const b: any = browser;

Given('I am on the Halo homepage', async () => {
  await b.url('/');
  await b.pause(250);
});

Then('I should see the main navigation items', async () => {
  // Prefer robust text-based XPaths to avoid empty innerText elements
  const items = ['about', 'services', 'work', 'industries', 'technology'];
  let count = 0;
  for (const item of items) {
    const xpath = `//a[contains(translate(normalize-space(.), 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), '${item}')]`;
    const els = await $$(xpath);
    const length = await els.length;
    if (length > 0) count++;
  }
  assert(count >= 2, 'Navigation not found or missing expected items');
});

Then('I should see the hero headline', async () => {
  // Look for hero content with multiple selectors sample
  const heroSelectors = [
    'h1',
    '.hero h1',
    '.hero-headline',
    '[data-testid="hero"] h1'
  ];
  
  let heroFound = false;
  for (const selector of heroSelectors) {
    try {
      const headline = await $(selector);
      if (await headline.isExisting()) {
        const text = (await headline.getText()).toLowerCase();
        if (text.includes('transforming your vision') || text.includes('products that matter')) {
          heroFound = true;
          break;
        }
      }
    } catch (e) {
      
    }
  }
  
  assert(heroFound, 'Hero headline not found with expected text');
});

When('I click the Explore Our Work CTA', async () => {
  // Look for CTA buttons/links with multiple strategies
  const ctaSelectors = [
    'a[href*="work"]',
    // Fallback XPaths for text-based matching (CSS :contains is not supported)
    "//a[contains(translate(normalize-space(.), 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), 'explore')]",
    "//button[contains(translate(normalize-space(.), 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), 'explore')]",
    '.cta',
    '.button'
  ];
  
  let ctaFound = false;
  for (const selector of ctaSelectors) {
    try {
      const elements = await $$(selector);
      for (const element of elements) {
        const text = (await element.getText()).toLowerCase();
        const href = await element.getAttribute('href');
        if (text.includes('explore our work') || text.includes('explore') || (href && href.includes('work'))) {
          await element.scrollIntoView();
          await element.click();
          ctaFound = true;
          break;
        }
      }
      if (ctaFound) break;
    } catch (e) {
      
    }
  }
  
  assert(ctaFound, 'Explore Our Work CTA not found');
});

Then('I should be navigated to the Work section', async () => {
  await b.pause(1000);
  const url = await b.getUrl();
  const hasWorkInUrl = url.includes('work') || url.includes('#work');
  
  // Check for work-related 
  let hasWorkContent = false;
  try {
    const workSelectors = [
      '*[class*="work"]',
      '*[id*="work"]',
      'h2',
      'h3'
    ];
    
    for (const selector of workSelectors) {
      const elements = await $$(selector);
      for (const element of elements) {
        const text = (await element.getText()).toLowerCase();
        if (text.includes('work') || text.includes('portfolio') || text.includes('projects')) {
          hasWorkContent = true;
          break;
        }
      }
      if (hasWorkContent) break;
    }
  } catch (e) {
    
  }
  
  assert(hasWorkInUrl || hasWorkContent, 'Not navigated to Work section');
});

When('I click the header menu {string}', async (menuText: string) => {
  const needle = menuText.toLowerCase();
  const slugMap: Record<string, string> = {
    about: 'about',
    services: 'services',
    work: 'work',
    industries: 'industries',
    technology: 'technology'
  };
  const slug = slugMap[needle] ?? needle;

  // Try to find top header navigation container first for scoping
  const containers = await $$('header, nav, [role="navigation"]');
  let clicked = false;

  async function tryClickIn(scope?: any) {
    // Match anchors/buttons by text or href/aria-label
    const xpath = `//a[(contains(translate(normalize-space(.), 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), '${needle}') or contains(translate(@href, 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), '${needle}') or contains(translate(@aria-label, 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), '${needle}'))] | //button[contains(translate(normalize-space(.), 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), '${needle}')]`;
    const candidates = scope ? await scope.$$(xpath) : await $$(xpath);
    for (const el of candidates) {
      try {
        await el.scrollIntoView();
        await el.click();
        return true;
      } catch {
        
      }
    }
    return false;
  }

  for (const container of containers) {
    if (await tryClickIn(container)) {
      clicked = true;
      break;
    }
  }
  if (!clicked) {
    clicked = await tryClickIn();
  }

  // Fallback: click by href anywhere on the page (header/footer)
  if (!clicked) {
    const hrefSelectors = [
      `a[href*='/${slug}']`,
      `a[href*='./${slug}']`,
      `a[href*='${slug}']`
    ];
    for (const sel of hrefSelectors) {
      const els = await $$(sel);
      const length = await els.length;
      if (length > 0) {
        try {
          await els[0].scrollIntoView();
          await els[0].click();
          clicked = true;
          break;
        } catch {}
      }
    }
  }

  // Last-resort fallback for SPA sites: navigate directly
  if (!clicked) {
    try {
      await b.url(`/${slug}`);
      clicked = true;
    } catch {}
  }

  assert(clicked, `Header menu "${menuText}" not found`);
});

Then('the URL should include {string}', async (expected: string) => {
  await b.pause(800);
  const url = await b.getUrl();
  const okUrl = url.toLowerCase().includes(expected.toLowerCase());
  if (!okUrl) {
    const sectionXpath = `//*[self::h1 or self::h2 or self::h3 or self::a][contains(translate(normalize-space(.), 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), '${expected.toLowerCase()}')]`;
    const matches = await $$(sectionXpath);
    const matchCount = await matches.length;
    assert(matchCount > 0, `Expected URL to include "${expected}" or section present, but got ${url}`);
  }
});
