## Halo Automation Project

This repository contains two comprehensive automation suites targeting `https://halopowered.com`:

- **WebdriverIO + Cucumber (TypeScript)** for UI E2E scenarios
- **Vitest (TypeScript)** for fast unit, content and API testing

These demonstrate different automation approaches: browser-based UI testing and lightweight content/API validation.

### Tech Stack & Rationale

- **WebdriverIO v9 + Cucumber**: Preference-aligned UI automation with readable Gherkin scenarios
- **Vitest**: Fast, modern testing framework for unit tests, API validation, and content checks
- **TypeScript**: Type safety and better developer experience
- **Chrome/Chromedriver**: Reliable browser automation

### Repository Structure

```
src/                      # TypeScript source code
└── utils/               # Utility functions for validation
features/                 # Cucumber feature files
step-definitions/         # Step definitions for features  
tests/                    # Vitest test suites
├── unit.test.ts         # Business logic unit tests with real website data
└── api.test.ts          # API and HTTP testing with real website data
scripts/                  # Report generation scripts
├── generate-vitest-report.js  # Vitest HTML report generator
└── generate-wdio-report.js    # WebdriverIO HTML report generator
report/                   # Generated test reports
├── index.html           # Report dashboard
├── vitest-report.html   # Vitest HTML report
├── wdio-report.html     # WebdriverIO HTML report
└── vitest-results.json  # Vitest JSON results
wdio.conf.ts              # WebdriverIO configuration
vitest.config.ts          # Vitest configuration
```

### Automated Scenarios

#### WebdriverIO + Cucumber (UI E2E)
- **Navigation validation**: Verify primary navigation and hero content are visible
- **CTA interaction**: Click "Explore Our Work" CTA and confirm navigation to Work section
- **Header navigation**: Click top header menus (About, Services, Work, Industries, Technology) and verify navigation

**Rationale**: These test critical user flows that are stable and high-signal. Uses robust text-based assertions with multiple fallback strategies.

#### Vitest Test Suites
1. **Business Logic Unit Tests**: Real website data validation, testimonial content, contact information, company branding, SEO metadata
2. **API Testing**: HTTP methods, headers, error handling, data integrity, performance metrics, external integrations
3. **Data Extraction & Validation**: Google Analytics tracking, project portfolio data, testimonial data, contact information, external service integrations, performance and asset data

**Rationale**: Vitest excels at fast, parallel testing of real website data, API validation, and content processing without browser overhead. Tests use actual data from `https://halopowered.com` for authentic validation.

### Prerequisites

- **Node.js 20+** ([Download here](https://nodejs.org/))
- **Chrome browser** (latest version)
- **Git** (for cloning the repository)

### Quick Setup (3 steps)

#### 1. Clone the repository
```bash
git clone <repository-url>
cd HaloAutomationProject
```

#### 2. Install dependencies
```bash
npm install
```

#### 3. Run tests
```bash
npm test
```

That's it! 🎉 The project will automatically:
- Install all required dependencies (WebdriverIO, Vitest, TypeScript, etc.)
- Download ChromeDriver for browser automation
- Run both test suites
- Generate HTML reports

### Running Tests

#### Run all tests
```bash
npm test
```

#### Run individual suites
```bash
# Vitest (fast content/API tests)
npm run test:vitest

# WebdriverIO headless (UI E2E)
npm run test:wdio:headless

# WebdriverIO headed (UI E2E with visible browser)
npm run test:wdio
```

#### Generate and view test reports
```bash
# Run all tests and view reports
npm run test:report

# Or run individually
npm run test:vitest    # Generates Vitest HTML report
npm run test:wdio      # Generates WebdriverIO HTML report

# Open report dashboard
npm run report:open

### Test Results Summary

✅ **Vitest**: 74 tests covering business logic with real website data, API testing, and data extraction validation  
✅ **WebdriverIO**: 21 Cucumber scenarios with robust selectors and error handling  
✅ **Real Data Testing**: Tests use actual data from `https://halopowered.com` for authentic validation  
✅ **Both frameworks working**: Demonstrates different automation approaches effectively

### Key Features

- **Real Data Testing**: Tests use actual data from `https://halopowered.com` for authentic validation
- **Resilient selectors**: Multiple fallback strategies for element location
- **Comprehensive coverage**: From unit tests to full E2E scenarios  
- **Fast feedback**: Vitest provides quick validation, WebdriverIO ensures UI functionality
- **Production-ready**: Proper error handling, timeouts, and retry logic
- **Client-side routing awareness**: Tests handle 404 responses for client-side routed pages with clear explanations
- **HTML Reports**: Beautiful, detailed HTML reports for both test suites with screenshots and metrics

### Test Reports

After running tests, you can view detailed HTML reports:

1. **Report Dashboard**: Open `report/index.html` in your browser for a comprehensive overview
2. **WebdriverIO Reports**: Detailed UI test execution with screenshots and step-by-step results
3. **Vitest Reports**: Unit test results with coverage and performance metrics

**Quick Access:**
```bash
# Run tests and automatically open report dashboard
npm run test:report

# Or manually open the report
open report/index.html  # macOS
xdg-open report/index.html  # Linux
start report/index.html  # Windows
```

### Troubleshooting

#### Common Issues & Solutions

**Chrome/ChromeDriver Issues:**
```bash
# If ChromeDriver fails to start
npm run test:wdio:headless  # Try headless mode first
```

**Network/Firewall Issues:**
```bash
# If behind corporate firewall
export HTTPS_PROXY=your-proxy-url
npm test
```

**Permission Issues:**
```bash
# If report generation fails
chmod +x scripts/*.js
npm test
```

**Node.js Version Issues:**
```bash
# Check Node.js version
node --version  # Should be 20+

# If using nvm
nvm use 20
```

**Dependencies Issues:**
```bash
# Clean install if issues persist
rm -rf node_modules package-lock.json
npm install
```

#### What Each Command Does

- `npm install` - Installs all dependencies (WebdriverIO, Vitest, TypeScript, etc.)
- `npm test` - Runs both test suites and generates reports
- `npm run test:vitest` - Fast unit/API tests only
- `npm run test:wdio` - UI tests with visible browser
- `npm run test:wdio:headless` - UI tests in background
- `npm run test:report` - Runs tests + opens report dashboard




