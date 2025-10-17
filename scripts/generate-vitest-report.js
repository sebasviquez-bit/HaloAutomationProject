import fs from 'node:fs';
import path from 'node:path';

const vitestResultsPath = path.resolve('./report/vitest-results.json');
const vitestReportPath = path.resolve('./report/vitest-report.html');

const generateHTMLReport = (results) => {
  const { testResults, summary } = results || {};
  const totalTests = summary?.total ?? results?.numTotalTests ?? 0;
  const passed = summary?.passed ?? results?.numPassedTests ?? 0;
  const failed = summary?.failed ?? results?.numFailedTests ?? 0;
  const skipped = summary?.skipped ?? results?.numSkippedTests ?? 0;

  const individualTests = [];
  if (Array.isArray(testResults)) {
    testResults.forEach((file) => {
      if (Array.isArray(file.assertionResults)) {
        file.assertionResults.forEach((test) => {
          individualTests.push({
            name: test.title,
            fullName: test.fullName,
            status: test.status,
            duration: test.duration ?? 0,
            file: file.name || 'Unknown file',
            ancestorTitles: test.ancestorTitles || [],
          });
        });
      }
    });
  }

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Vitest Test Report</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 20px; background-color: #f4f4f4; color: #333; }
    .container { max-width: 900px; margin: auto; background: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
    h1 { color: #0056b3; text-align: center; }
    .summary { display: flex; justify-content: space-around; margin-bottom: 20px; flex-wrap: wrap; }
    .stat-box { background: #e9ecef; padding: 15px; border-radius: 5px; text-align: center; min-width: 120px; margin: 5px; }
    .stat-number { font-size: 2em; font-weight: bold; }
    .stat-label { font-size: 0.9em; color: #555; }
    .passed { color: #28a745; }
    .failed { color: #dc3545; }
    .skipped { color: #ffc107; }
    .test-list { margin-top: 30px; }
    .test-item { background: #f8f9fa; border: 1px solid #e2e6ea; margin-bottom: 10px; padding: 15px; border-radius: 5px; }
    .test-name { font-weight: bold; color: #0056b3; }
    .test-duration { font-size: 0.8em; color: #6c757d; margin-top: 5px; }
    .test-item.failed { border-left: 5px solid #dc3545; }
    .test-item.passed { border-left: 5px solid #28a745; }
    .test-item.skipped { border-left: 5px solid #ffc107; }
    .footer { text-align: center; margin-top: 30px; font-size: 0.8em; color: #6c757d; }
  </style>
</head>
<body>
  <div class="container">
    <h1>Vitest Test Report</h1>
    <div class="summary">
      <div class="stat-box"><div class="stat-number">${totalTests}</div><div class="stat-label">Total Tests</div></div>
      <div class="stat-box"><div class="stat-number passed">${passed}</div><div class="stat-label">Passed</div></div>
      <div class="stat-box"><div class="stat-number failed">${failed}</div><div class="stat-label">Failed</div></div>
      <div class="stat-box"><div class="stat-number skipped">${skipped}</div><div class="stat-label">Skipped</div></div>
    </div>

    <div class="test-list">
      <h3>Individual Test Results (${individualTests.length} tests)</h3>
      ${individualTests.length > 0 ? individualTests.map((t) => `
        <div class="test-item ${t.status}">
          <div class="test-name">${t.name}</div>
          <div class="test-duration"><strong>File:</strong> ${t.file.split('/').pop()} | <strong>Duration:</strong> ${Math.round(t.duration)}ms | <strong>Category:</strong> ${t.ancestorTitles.slice(0,2).join(' > ')}</div>
          ${(t.status === 'failed' || t.status === 'error') ? `<div style="color:#dc3545;margin-top:10px;font-family:monospace;background:#f8f9fa;padding:10px;border-radius:3px;">Test failed</div>` : ''}
        </div>
      `).join('') : '<p>✅ All tests passed successfully! Individual test details not available in current format.</p>'}
    </div>

    <div class="footer">Generated on ${new Date().toLocaleString()}</div>
  </div>
</body>
</html>`;
};

const ensureReportDir = () => {
  const dir = path.resolve('./report');
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
};

const generateVitestReport = async () => {
  try {
    ensureReportDir();
    const vitestResultsContent = fs.readFileSync(vitestResultsPath, 'utf8');
    const results = JSON.parse(vitestResultsContent);
    const htmlReport = generateHTMLReport(results);
    fs.writeFileSync(vitestReportPath, htmlReport);
    console.log('✅ Vitest HTML report generated successfully');
  } catch (error) {
    console.error('Error generating Vitest report:', error);
  }
};

generateVitestReport();


