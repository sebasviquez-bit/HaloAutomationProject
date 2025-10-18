import type { Options } from '@wdio/types';

const isHeadless = process.env.WDIO_HEADLESS === '1';

// Configure ts-node for transpilation
process.env.TS_NODE_TRANSPILE_ONLY = 'true';

export const config: Options.Testrunner & { capabilities: any[] } = {
  runner: 'local',
  specs: ['./features/**/*.feature'],
  exclude: [],
  maxInstances: 1,
  capabilities: [
    {
      browserName: 'chrome',
      'goog:chromeOptions': {
        args: isHeadless
          ? ['--headless=new', '--disable-gpu', '--window-size=1366,900']
          : ['--window-size=1366,900'],
      },
    },
  ],
  logLevel: 'info',
  bail: 0,
  baseUrl: 'https://halopowered.com',
  waitforTimeout: 10000,
  connectionRetryTimeout: 120000,
  connectionRetryCount: 3,
  services: [],
  framework: 'cucumber',
  reporters: ['spec', ['json', { outputDir: './report', outputFileFormat: (options: any) => `wdio-results-${options.cid}.json` }]],
  cucumberOpts: {
    require: ['./step-definitions/**/*.ts'],
    backtrace: false,
    requireModule: ['ts-node/register'],
    dryRun: false,
    failFast: false,
    snippets: true,
    source: true,
    strict: true,
    tagExpression: '',
    timeout: 60000,
    ignoreUndefinedDefinitions: false,
  },
};

export default config;


