const messages = require('./messages');

const parseLicenses = ({
  whitelistedLicenses,
  blacklistedLicenses,
  createWarnNotification,
  createErrorNotification,
}) => licenses => {
  licenses.forEach(licenseObj => {
    const isWhitelisted
      = typeof licenseObj.licenses === 'object'
        ? licenseObj.licenses.every(license =>
          whitelistedLicenses.includes(license),
        )
        : whitelistedLicenses.includes(licenseObj.licenses);

    if (isWhitelisted) {
      return;
    }

    const isBlacklisted
      = typeof licenseObj.licenses === 'object'
        ? licenseObj.licenses.some(license =>
          blacklistedLicenses.includes(license),
        )
        : blacklistedLicenses.includes(licenseObj.licenses);

    if (!isWhitelisted && !isBlacklisted) {
      return createWarnNotification(messages.moduleInfo(licenseObj));
    }

    if (isBlacklisted) {
      return createErrorNotification(messages.moduleInfo(licenseObj));
    }
  });
};

module.exports = parseLicenses;
