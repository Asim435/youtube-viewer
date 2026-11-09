const puppeteer = require('puppeteer-extra');
const stealthPlugin = require('puppeteer-extra-plugin-stealth');
const { IS_PROD } = require('../utils/constants');

puppeteer.use(stealthPlugin());

// In order to run chromium processes in parallel. https://github.com/puppeteer/puppeteer/issues/594#issuecomment-325919885
process.setMaxListeners(Infinity);

const getChromePath = () => {
  const fs = require('fs');
  const candidates = [
    process.env.PUPPETEER_EXECUTABLE_PATH,
    process.env.CHROME_BIN,
    process.env.CHROMIUM_PATH,
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
    '/usr/bin/google-chrome-stable',
    '/usr/bin/google-chrome',
    '/usr/bin/chromium-browser',
    '/usr/bin/chromium',
  ];
  for (const candidate of candidates) {
    if (candidate && fs.existsSync(candidate)) return candidate;
  }
  return undefined;
};

const getBrowserInstance = async (port) => {
  const browser = await puppeteer.launch({
    args: IS_PROD
      ? ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--disable-gpu', `--proxy-server=socks5://127.0.0.1:${port}`]
      : ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
    headless: IS_PROD ? true : (process.env.HEADLESS === 'false' ? false : true),
    devtools: !IS_PROD && process.env.HEADLESS === 'false',
    executablePath: getChromePath(),
  });
  const incognitoBrowserContext = browser.createIncognitoBrowserContext();
  incognitoBrowserContext.close = browser.close;
  return incognitoBrowserContext;
};

module.exports = {
  getBrowserInstance,
};
