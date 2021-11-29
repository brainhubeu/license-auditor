const messages = require('./messages');

const parseLicenses = ({
  whitelistedLicenses,
  blacklistedLicenses,
  whitelistedModules = {},
  createWarnNotification,
  createErrorNotification,
}) => licenses => {
  licenses.forEach(licenseObj => {
    const whitelistedLicenseForModule = whitelistedModules[licenseObj.name];
    if (whitelistedLicenseForModule === 'any') {
      return;
    }
    const whitelistedLicensesForModule = typeof whitelistedLicenseForModule === 'object'
      ? whitelistedLicenseForModule
      : [whitelistedLicenseForModule];


    const isWhitelisted = typeof licenseObj.licenses === 'object'
      ? licenseObj.licenses.every(license =>
        [...whitelistedLicenses, ...whitelistedLicensesForModule].includes(license),
      )
      : [...whitelistedLicenses, ...whitelistedLicensesForModule].includes(licenseObj.licenses);

    if (isWhitelisted) {
      return;
    }

    const isBlacklisted = typeof licenseObj.licenses === 'object'
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
