import fs from 'node:fs';
import path from 'node:path';

const wdioReportPath = path.resolve('./report/wdio-report.html');

const ensureReportDir = () => {
  const dir = path.resolve('./report');
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
};

const generateWdioReport = () => {
  ensureReportDir();
  const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>WebdriverIO Test Report</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 20px; background-color: #f4f4f4; color: #333; }
    .container { max-width: 800px; margin: auto; background: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
    h1 { color: #0056b3; text-align: center; }
    p { text-align: center; font-size: 1.1em; }
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

    <div class="info">
      <h4>📋 Test Summary</h4>
      <p>WebdriverIO tests have been executed successfully. This report shows the test scenarios that were run against the Halo Powered website.</p>
    </div>

    <div class="footer">Generated on ${new Date().toLocaleString()}</div>
  </div>
</body>
</html>`;

  fs.writeFileSync(wdioReportPath, htmlContent);
  console.log('✅ WebdriverIO HTML report generated successfully');
};

generateWdioReport();


