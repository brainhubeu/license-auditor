const messages = require('./messages');

const parseLicenses = ({
  whitelistedLicenses,
  blacklistedLicenses,
  createWarnNotification,
  createErrorNotification,
}) => licenses => {
  licenses.forEach(licenseObj => {
    const isWhitelisted
      = typeof licenseObj.license === 'object'
        ? licenseObj.license.every(license =>
          whitelistedLicenses.includes(license),
        )
        : whitelistedLicenses.includes(licenseObj.license);

    if (isWhitelisted) {
      return;
    }

    const isBlacklisted
      = typeof licenseObj.license === 'object'
        ? licenseObj.license.some(license =>
          blacklistedLicenses.includes(license),
        )
        : blacklistedLicenses.includes(licenseObj.license);

    if (!isWhitelisted && !isBlacklisted) {
      return createWarnNotification(messages.moduleInfo(licenseObj));
    }

    if (isBlacklisted) {
      return createErrorNotification(messages.moduleInfo(licenseObj));
    }
  });
};

module.exports = parseLicenses;
