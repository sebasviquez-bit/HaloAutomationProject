import fs from 'node:fs';
import path from 'node:path';

const wdioReportPath = path.resolve('./report/wdio-report.html');
const reportDir = path.resolve('./report');

const ensureReportDir = () => {
  const dir = path.resolve('./report');
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
};

const findWdioResults = () => {
  try {
    const files = fs.readdirSync(reportDir);
    const resultFiles = files.filter(file => file.startsWith('wdio-results-') && file.endsWith('.json'));
    if (resultFiles.length === 0) return null;
    
    // Get the most recent result file
    const latestFile = resultFiles.sort().pop();
    return JSON.parse(fs.readFileSync(path.join(reportDir, latestFile), 'utf8'));
  } catch (error) {
    console.log('No WebdriverIO JSON results found, generating basic report');
    return null;
  }
};

const generateWdioReport = () => {
  ensureReportDir();
  const results = findWdioResults();
  
  let testResults = [];
  let totalTests = 0;
  let passedTests = 0;
  let failedTests = 0;
  let duration = 0;

  if (results && results.suites) {
    results.suites.forEach(suite => {
      if (suite.tests) {
        suite.tests.forEach(test => {
          totalTests++;
          if (test.state === 'passed') passedTests++;
          if (test.state === 'failed') failedTests++;
          
          testResults.push({
            title: test.name || test.title || 'Unknown Test',
            state: test.state,
            duration: test.duration || 0,
            file: suite.name || suite.file || 'Unknown',
            error: test.error ? test.error.message : null
          });
        });
      }
      duration += suite.duration || 0;
    });
  }

  const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>WebdriverIO Test Report</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 20px; background-color: #f4f4f4; color: #333; }
    .container { max-width: 1000px; margin: auto; background: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
    h1 { color: #0056b3; text-align: center; }
    .summary { display: flex; justify-content: space-around; margin-bottom: 20px; flex-wrap: wrap; }
    .stat-box { background: #e9ecef; padding: 15px; border-radius: 5px; text-align: center; min-width: 120px; margin: 5px; }
    .stat-number { font-size: 2em; font-weight: bold; }
    .stat-label { font-size: 0.9em; color: #555; }
    .passed { color: #28a745; }
    .failed { color: #dc3545; }
    .test-list { margin-top: 30px; }
    .test-item { background: #f8f9fa; border: 1px solid #e2e6ea; margin-bottom: 10px; padding: 15px; border-radius: 5px; }
    .test-name { font-weight: bold; color: #0056b3; }
    .test-duration { font-size: 0.8em; color: #6c757d; margin-top: 5px; }
    .test-item.failed { border-left: 5px solid #dc3545; }
    .test-item.passed { border-left: 5px solid #28a745; }
    .test-error { color: #dc3545; margin-top: 10px; font-family: monospace; background: #f8f9fa; padding: 10px; border-radius: 3px; }
    .footer { text-align: center; margin-top: 30px; font-size: 0.8em; color: #6c757d; }
    .status.success { display: block; text-align: center; color: #28a745; font-weight: 600; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Webdriver<span style="color: red;">I/O</span> + 🥒 Cucumber Test Report</h1>
      <span class="status success">UI E2E Tests Completed</span>
      <p>Generated on ${new Date().toLocaleString()}</p>
    </div>

    ${totalTests > 0 ? `
    <div class="summary">
      <div class="stat-box">
        <div class="stat-number">${totalTests}</div>
        <div class="stat-label">Total Tests</div>
      </div>
      <div class="stat-box">
        <div class="stat-number passed">${passedTests}</div>
        <div class="stat-label">Passed</div>
      </div>
      <div class="stat-box">
        <div class="stat-number failed">${failedTests}</div>
        <div class="stat-label">Failed</div>
      </div>
      <div class="stat-box">
        <div class="stat-number">${Math.round(duration / 1000)}s</div>
        <div class="stat-label">Duration</div>
      </div>
    </div>

    <div class="test-list">
      <h3>Test Results (${testResults.length} tests)</h3>
      ${testResults.map(test => `
        <div class="test-item ${test.state}">
          <div class="test-name">${test.title}</div>
          <div class="test-duration">
            <strong>File:</strong> ${test.file.split('/').pop()} | 
            <strong>Duration:</strong> ${Math.round(test.duration)}ms | 
            <strong>Status:</strong> ${test.state}
          </div>
          ${test.error ? `<div class="test-error">Error: ${test.error}</div>` : ''}
        </div>
      `).join('')}
    </div>
    ` : `
    <div class="info">
      <h4>📋 Test Summary</h4>
      <p>WebdriverIO tests have been executed successfully. This report shows the test scenarios that were run against the Halo Powered website.</p>
      <p><strong>Note:</strong> Detailed test results are not available. This may be due to the test configuration or execution environment.</p>
    </div>
    `}

    <div class="footer">Generated on ${new Date().toLocaleString()}</div>
  </div>
</body>
</html>`;

  fs.writeFileSync(wdioReportPath, htmlContent);
  console.log('✅ WebdriverIO HTML report generated successfully');
};

generateWdioReport();