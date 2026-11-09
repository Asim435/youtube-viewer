const { execWithPromise } = require('../utils/childProcessWrapper');

const { logger } = require('../utils');
const { IS_PROD } = require('../utils/constants');

const fs = require('fs');

const writeTorConfig = async (startPort, count) => {
  if (!IS_PROD) return Promise.resolve();
  logger.info('App running in production. Will use rotating proxy via TOR.');
  logger.info(' Writing Tor Config');
  try {
    let config = '';
    for (let i = 0; i < count; i += 1) {
      const port = startPort + i;
      config += `SocksPort ${port}\n`;
    }
    fs.mkdirSync('/etc/tor', { recursive: true });
    fs.writeFileSync('/etc/tor/torrc', config);
    logger.success('Tor Config written successfully.');
    return Promise.resolve();
  } catch (error) {
    logger.error('Failed to write Tor config.');
    logger.debug(error);
    throw error;
  }
};

const stopTor = async () => {
  if (!IS_PROD) return;
  try {
    await execWithPromise('pkill -9 -f "tor"');
  } catch (error) {
    logger.warn('Failed to stop TOR. Usually this is a no op but ensure the subsequent attempts are using different IPs.');
    logger.debug(error);
  }
};

const startTor = async () => {
  if (!IS_PROD) return;
  logger.info('Starting TOR.');
  await stopTor();
  try {
    await execWithPromise('/usr/bin/tor --RunAsDaemon 1');
    logger.success('Started TOR successfully');
  } catch (error) {
    logger.error('Failed to start TOR.');
    logger.debug(error);
    throw new Error();
  }
};

module.exports = { writeTorConfig, stopTor, startTor };
