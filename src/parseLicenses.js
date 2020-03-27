const parseLicenses = ({
  whitelistedLicenses,
  blacklistedLicenses,
  createWarnNotification,
  createErrorNotification,
}) => licenses => {
  licenses.forEach(licenseObj => {
    const isWhitelisted = whitelistedLicenses.includes(licenseObj.licenses);

    if (isWhitelisted) {
      return;
    }

    const isBlacklisted = blacklistedLicenses.includes(licenseObj.licenses);

    if (!isWhitelisted && !isBlacklisted) {
      return createWarnNotification(`MODULE : ${licenseObj.repository} | LICENSE : ${licenseObj.licenses}`);
    }

    if (isBlacklisted) {
      return createErrorNotification(`MODULE : ${licenseObj.repository} | LICENSE : ${licenseObj.licenses}`);
    }
  });
};

module.exports = parseLicenses;
