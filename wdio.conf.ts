import type { Config } from '@wdio/types';

const isHeadless = process.env.WDIO_HEADLESS === '1';

export const config: Config = {
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
  reporters: ['spec'],
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


