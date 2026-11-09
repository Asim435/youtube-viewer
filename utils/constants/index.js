const fs = require('fs');
const path = require('path');

// Automatically load .env if present
const envPath = path.resolve(process.cwd(), '.env');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf-8');
  envContent.split(/\r?\n/).forEach((line) => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const idx = trimmed.indexOf('=');
      if (idx !== -1) {
        const key = trimmed.substring(0, idx).trim();
        const val = trimmed.substring(idx + 1).trim().replace(/^["']|["']$/g, '');
        if (key && process.env[key] === undefined) {
          process.env[key] = val;
        }
      }
    }
  });
}

const IS_PROD = (process.env.NODE_ENV === 'production');
const SHOULD_FORCE_DEBUG_LOGS = process.env.YOUTUBE_VIEWER_FORCE_DEBUG;
const IP_GETTER_URL = 'https://api.ipify.org/';
const URL_CONTAINER_FILE_NAME = 'urls.txt';

/**
 * START_PORT - Port TOR will start using from for SOCKS proxy.
 * BATCH_COUNT - Number of parallel chromium instances to run.
 * TOTAL_COUNT - Total number of view actions. A single view action comprises of sequential viewing of VIEW_ACTION_COUNT random videos among the list. Ensure this number is exactly divisible by BATCH_COUNT for optimal resource usage.
 * VIEW_ACTION_COUNT - A single browsing session will watch these many videos sequentially.
 * VIEW_DURATION - Max duration of a single view in seconds. Actual view duration will be +/- 16.6% of this number.
 * PAGE_DEFAULT_TIMEOUT - Max duration in seconds to wait for any action in the page.
 */
const START_PORT = 9052;
const BATCH_COUNT = process.env.BATCH_COUNT ? parseInt(process.env.BATCH_COUNT, 10) : (IS_PROD ? 6 : 1);
const TOTAL_COUNT = process.env.TOTAL_COUNT ? parseInt(process.env.TOTAL_COUNT, 10) : (IS_PROD ? 96 : 10);
const VIEW_ACTION_COUNT = process.env.VIEW_ACTION_COUNT ? parseInt(process.env.VIEW_ACTION_COUNT, 10) : (IS_PROD ? 10 : 1);
const VIEW_DURATION = process.env.VIEW_DURATION ? parseInt(process.env.VIEW_DURATION, 10) : (IS_PROD ? 50 : 20);
const PAGE_DEFAULT_TIMEOUT = 600;

module.exports = {
  IS_PROD,
  SHOULD_FORCE_DEBUG_LOGS,
  IP_GETTER_URL,
  URL_CONTAINER_FILE_NAME,

  START_PORT,
  BATCH_COUNT,
  TOTAL_COUNT,
  VIEW_ACTION_COUNT,
  VIEW_DURATION,
  PAGE_DEFAULT_TIMEOUT,
};
