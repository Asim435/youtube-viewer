/* eslint-disable no-restricted-syntax */
const _random = require('lodash/random');

const { logger } = require('../utils');

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const dismissConsentModal = async (page) => {
  try {
    const consentSelectors = [
      'button[aria-label*="Accept"]',
      'button[aria-label*="Agree"]',
      'button[aria-label*="Reject"]',
      'form[action*="consent"] button',
      'ytd-button-renderer#button button[aria-label*="Accept"]',
    ];
    for (const sel of consentSelectors) {
      const btn = await page.$(sel);
      if (btn) {
        await btn.click().catch(() => {});
        await sleep(1000);
        break;
      }
    }
  } catch (_) {}
};

const triggerVideoPlay = async (page) => {
  try {
    await page.evaluate(() => {
      const video = document.querySelector('video');
      if (video) {
        video.muted = true;
        video.play().catch(() => {});
      }
    });
  } catch (_) {}

  try {
    const playButton = await page.$('.ytp-play-button, button.ytp-large-play-button');
    if (playButton) {
      await playButton.click().catch(() => {});
    }
  } catch (_) {}
};

const watchVideosInSequence = async (page, ipAddr, targetUrlsList, durationInSeconds) => {
  for (const url of targetUrlsList) {
    try {
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
      await sleep(2000);

      // Handle cookie consent dialogs if present
      await dismissConsentModal(page);

      // Ensure video plays
      await triggerVideoPlay(page);

      const duration = Math.round(durationInSeconds + _random(-(durationInSeconds / 6), (durationInSeconds / 6), true));
      await sleep(Math.max(5000, duration * 1000));

      await logger.logCount(page, url, ipAddr, duration);
    } catch (err) {
      logger.debug(err);
      logger.logFailedAttempt(url, ipAddr);
    }
  }
};

module.exports = { watchVideosInSequence };
