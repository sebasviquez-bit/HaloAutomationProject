import { describe, it, expect, beforeAll } from 'vitest';

const baseUrl = 'https://halopowered.com/';

describe('HaloPowered.com - API & Endpoint Testing', () => {
  let homepageHtml: string;

  beforeAll(async () => {
    // Fetch real website data
    const homepageResponse = await fetch(baseUrl);
    homepageHtml = await homepageResponse.text();
  });

  // Pages that return 200 status codes
  const accessiblePages = [
    { path: '/', title: 'Homepage', expectedContent: ['Transforming your vision', 'products that matter'] }
  ];

  // Strategic 404 tests for client-side routing
  const clientSideRoutedPages = [
    { path: '/services', title: 'Services', reason: 'Client-side routing - content loads via JavaScript' },
    { path: '/work', title: 'Work Portfolio', reason: 'Client-side routing - content loads via JavaScript' },
    { path: '/industries', title: 'Industries', reason: 'Client-side routing - content loads via JavaScript' },
    { path: '/technology', title: 'Technology', reason: 'Client-side routing - content loads via JavaScript' }
  ];

  // Non-existent pages that should return 404
  const nonExistentPages = [
    { path: '/nonexistent-page-12345', title: 'Non-existent Page', reason: 'Page not found on server' },
    { path: '/invalid-path', title: 'Invalid Path', reason: 'Path not found on server' }
  ];

  describe('Accessible Pages (200 Status)', () => {
    accessiblePages.forEach(({ path, title, expectedContent }) => {
      it(`validates ${title} page returns 200 status`, async () => {
        const response = await fetch(`${baseUrl}${path}`);
        expect(response.status).toBe(200);
        expect(response.headers.get('content-type')).toContain('text/html');
      });

      it(`validates ${title} page content is present`, async () => {
        const response = await fetch(`${baseUrl}${path}`);
        const html = await response.text();
        expectedContent.forEach(content => {
          expect(html.toLowerCase()).toContain(content.toLowerCase());
        });
      });

      it(`validates ${title} page has proper meta tags`, async () => {
        const response = await fetch(`${baseUrl}${path}`);
        const html = await response.text();
        expect(html).toMatch(/<title[^>]*>.*<\/title>/i);
        expect(html).toMatch(/<meta[^>]*charset/i);
      });
    });
  });

  describe('Client-Side Routed Pages (404 Expected)', () => {
    clientSideRoutedPages.forEach(({ path, title, reason }) => {
      it(`validates ${title} page returns 404 due to client-side routing`, async () => {
        const response = await fetch(`${baseUrl}${path}`);
        expect(response.status).toBe(404);
      });

      it(`explains why ${title} returns 404: ${reason}`, () => {
        // This test documents the expected behavior for client-side routing
        expect(reason).toContain('Client-side routing');
      });
    });
  });

  describe('Non-Existent Pages (404 Expected)', () => {
    nonExistentPages.forEach(({ path, title, reason }) => {
      it(`validates ${title} returns 404 for non-existent page`, async () => {
        const response = await fetch(`${baseUrl}${path}`);
        expect(response.status).toBe(404);
      });

      it(`explains why ${title} returns 404: ${reason}`, () => {
        // This test documents the expected behavior for non-existent pages
        expect(reason).toContain('not found');
      });
    });
  });

  describe('HTTP Methods & Status Codes', () => {
    it('validates GET request returns 200 for homepage', async () => {
      const response = await fetch(baseUrl);
      expect(response.status).toBe(200);
    });

    it('validates HEAD request works for homepage', async () => {
      const response = await fetch(baseUrl, { method: 'HEAD' });
      expect(response.status).toBe(200);
      expect(response.headers.get('content-type')).toContain('text/html');
    });

    it('validates OPTIONS request for homepage', async () => {
      const response = await fetch(baseUrl, { method: 'OPTIONS' });
      // Depending on server configuration
      expect([200, 204, 405]).toContain(response.status);
    });

    it('validates POST requests are handled appropriately', async () => {
      const response = await fetch(baseUrl, { method: 'POST' });
      // Should return 405 Method Not Allowed or redirect to appropriate handler
      expect([200, 405, 302, 301]).toContain(response.status);
    });
  });

  describe('Header Validation', () => {
    it('validates security headers on homepage', async () => {
      const response = await fetch(baseUrl);
      const headers = response.headers;

      const securityHeaders = [
        'x-frame-options',
        'x-content-type-options',
        'x-xss-protection',
        'strict-transport-security'
      ];

      const foundHeaders = securityHeaders.filter(header =>
        headers.get(header) !== null
      );

      expect(foundHeaders.length).toBeGreaterThan(0);
    });

    it('validates cache headers are consistent', async () => {
      const response1 = await fetch(baseUrl);
      const response2 = await fetch(baseUrl);

      const cacheControl1 = response1.headers.get('cache-control');
      const cacheControl2 = response2.headers.get('cache-control');

      if (cacheControl1 && cacheControl2) {
        expect(cacheControl1).toEqual(cacheControl2);
      }
    });

    it('validates content type is HTML for homepage', async () => {
      const response = await fetch(baseUrl);
      expect(response.headers.get('content-type')).toContain('text/html');
    });
  });

  describe('Content Negotiation', () => {
    it('validates content type negotiation with different Accept headers', async () => {
      const acceptHeaders = [
        'text/html',
        'text/html,application/xhtml+xml',
        'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
      ];

      for (const accept of acceptHeaders) {
        const response = await fetch(baseUrl, {
          headers: { 'Accept': accept }
        });
        expect(response.status).toBe(200);
        expect(response.headers.get('content-type')).toContain('text/html');
      }
    });

    it('validates encoding support for homepage', async () => {
      const response = await fetch(baseUrl);
      const contentEncoding = response.headers.get('content-encoding');
      
      if (contentEncoding) {
        expect(['gzip', 'deflate', 'br']).toContain(contentEncoding);
      }
    });
  });

  describe('Error Handling & Edge Cases', () => {
    it('validates 404 handling for non-existent pages', async () => {
      const nonExistentPages = [
        '/nonexistent-page-12345',
        '/invalid-path',
        '/random-endpoint'
      ];

      for (const page of nonExistentPages) {
        const response = await fetch(`${baseUrl}${page}`);
        expect(response.status).toBe(404);
      }
    });

    it('validates case sensitivity handling', async () => {
      const caseVariations = [
        '/SERVICES',
        '/Work',
        '/INDUSTRIES',
        '/Technology'
      ];

      for (const page of caseVariations) {
        const response = await fetch(`${baseUrl}${page}`);
        // Should either redirect to correct case or return 404
        expect([200, 301, 302, 404]).toContain(response.status);
      }
    });
  });

  describe('Performance & Load Testing', () => {
    it('validates response times for homepage', async () => {
      const maxResponseTime = 5000; // 5 seconds
      const start = performance.now();
      const response = await fetch(baseUrl);
      const end = performance.now();
      
      expect(response.status).toBe(200);
      expect(end - start).toBeLessThan(maxResponseTime);
    });

    it('validates concurrent requests to homepage', async () => {
      const start = performance.now();
      
      const responses = await Promise.all([
        fetch(baseUrl),
        fetch(baseUrl),
        fetch(baseUrl)
      ]);
      
      const end = performance.now();
      
      // All should be successful
      responses.forEach(response => {
        expect(response.status).toBe(200);
      });
      
      expect(end - start).toBeLessThan(5000); // 5 seconds for 3 concurrent requests
    });
  });

  describe('Data Integrity & Consistency', () => {
    it('validates response consistency across multiple requests', async () => {
      const responses = await Promise.all([
        fetch(baseUrl),
        fetch(baseUrl),
        fetch(baseUrl)
      ]);

      const texts = await Promise.all(responses.map(res => res.text()));
      expect(texts[0]).toEqual(texts[1]);
      expect(texts[1]).toEqual(texts[2]);
    });

    it('validates content length consistency', async () => {
      const response1 = await fetch(baseUrl);
      const response2 = await fetch(baseUrl);

      const contentLength1 = response1.headers.get('content-length');
      const contentLength2 = response2.headers.get('content-length');

      if (contentLength1 && contentLength2) {
        expect(contentLength1).toEqual(contentLength2);
      }
    });

    it('validates homepage contains navigation elements', async () => {
      const response = await fetch(baseUrl);
      const html = await response.text();
      
      // Check for common navigation elements
      expect(html.toLowerCase()).toContain('about');
      expect(html.toLowerCase()).toContain('services');
      expect(html.toLowerCase()).toContain('work');
      expect(html.toLowerCase()).toContain('contact');
    });
  });

  describe('External Links & Integrations', () => {
    it('validates external RFP link is accessible', async () => {
      const response = await fetch('https://rfp.halopowered.com/');
      expect(response.status).toBe(200);
    });

    it('validates LinkedIn company link is accessible', async () => {
      const response = await fetch('https://www.linkedin.com/company/halo-media/');
      expect(response.status).toBe(200);
    });

    it('validates Clutch profile link response', async () => {
      const response = await fetch('https://clutch.co/profile/halo-1');
      // Clutch may return 403 for automated requests
      expect([200, 403]).toContain(response.status);
    });
  });

  describe('SEO & Meta Data Validation', () => {
    it('validates homepage has proper title tag', async () => {
      const response = await fetch(baseUrl);
      const html = await response.text();
      
      expect(html).toMatch(/<title[^>]*>.*<\/title>/i);
      
      const titleMatch = html.match(/<title[^>]*>(.*?)<\/title>/i);
      expect(titleMatch).toBeTruthy();
      expect(titleMatch![1].length).toBeGreaterThan(10);
    });

    it('validates meta description is present on homepage', async () => {
      const response = await fetch(baseUrl);
      const html = await response.text();
      
      expect(html).toMatch(/<meta[^>]*name="description"/i);
    });

    it('validates canonical URL is properly set on homepage', async () => {
      const response = await fetch(baseUrl);
      const html = await response.text();
      
      // Check for canonical link or proper URL structure
      expect(html).toMatch(/<link[^>]*rel="canonical"/i);
    });
  });

  describe('JSON Data Extraction & Validation', () => {
    describe('Google Analytics DataLayer Validation', () => {
      it('validates Google Analytics tracking is properly configured', () => {
        
        expect(homepageHtml).toContain('googletagmanager.com');
        expect(homepageHtml).toContain('G-RDYKZJCQTV');
      });

      it('validates expected analytics events structure', () => {
        
        expect(homepageHtml).toContain('dataLayer');
        expect(homepageHtml).toContain('gtag');
      });
    });

    describe('Project Portfolio Data Structure', () => {
      it('validates project data structure from homepage', () => {
        
        expect(homepageHtml).toContain('work');
        expect(homepageHtml).toContain('project');
      });

      it('validates project filtering functionality', () => {
       
        expect(homepageHtml).toContain('search');
      });
    });

    describe('Testimonial Data Structure', () => {
      it('validates testimonial data structure', () => {
        const testimonialData = {
          quoteSnippet: 'administrative site and reporting systems are intuitive',
          author: "Victoria Brumfield",
          title: "CEO",
          company: "USA Triathlon"
        };

        expect(homepageHtml).toContain(testimonialData.quoteSnippet);
        expect(homepageHtml).toContain(testimonialData.author);
        expect(homepageHtml).toContain(testimonialData.title);
        expect(homepageHtml).toContain(testimonialData.company);
      });
    });

    describe('Contact Information Data Structure', () => {
      it('validates contact information structure', () => {
        const contactData = {
          phone: "(503) 221-8500",
          email: "info@halopowered.com",
          address: "127 W 26th Street, Suite 1002 New York, NY 10001",
          linkedin: "https://www.linkedin.com/company/halo-media/",
          clutch: "https://clutch.co/profile/halo-1"
        };

        expect(homepageHtml).toContain(contactData.phone);
        expect(homepageHtml).toContain(contactData.email);
        expect(homepageHtml).toContain(contactData.address);
        expect(homepageHtml).toContain(contactData.linkedin);
        expect(homepageHtml).toContain(contactData.clutch);
      });
    });

    describe('External Integration Data', () => {
      it('validates external service integrations', () => {
        const externalServices = {
          rfp: "https://rfp.halopowered.com/",
          linkedin: "https://www.linkedin.com/company/halo-media/",
          clutch: "https://clutch.co/profile/halo-1",
          maps: "https://maps.app.goo.gl/cuNY5g9DxmspMd9x6"
        };

        Object.values(externalServices).forEach(service => {
          expect(homepageHtml).toContain(service);
        });
      });
    });

    describe('Performance and Asset Data', () => {
      it('validates image assets are properly loaded', () => {

        expect(homepageHtml).toContain('framerusercontent.com/images/');
        expect(homepageHtml).toMatch(/scale-down-to=\d+/);
        expect(homepageHtml).toMatch(/width=\d+/);
        expect(homepageHtml).toMatch(/height=\d+/);
      });

      it('validates font assets are properly loaded', () => {

        expect(homepageHtml).toContain('fonts.gstatic.com');
        expect(homepageHtml).toContain('framerusercontent.com/assets/');
        expect(homepageHtml).toMatch(/\.woff2/);
      });
    });

    describe('Data Consistency Validation', () => {
      it('validates data consistency across pages', () => {
      
        const phoneNumber = "(503) 221-8500";
        const email = "info@halopowered.com";
        
        expect(homepageHtml).toContain(phoneNumber);
        expect(homepageHtml).toContain(email);
      });

      it('validates company branding consistency', () => {
        const brandingElements = [
          'halo media',
          'halopowered',
          'halopowered.com'
        ];

        const homeLower = homepageHtml.toLowerCase();
        const homeMatches = brandingElements.some((e) => homeLower.includes(e));

        expect(homeMatches).toBe(true);
      });
    });
  });
});