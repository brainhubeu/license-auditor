const licenseChecker = require('./license-checker');
const messages = require('./messages');
const ciNotification = require('./ciNotifications');
const parseLicensesFactory = require('./parseLicenses');

const checkLicenses = ({
  whitelistedLicenses,
  blacklistedLicenses,
  projectPath,
  ciManager,
}) => {
  const { createWarnNotification, createErrorNotification } = ciNotification(
    ciManager,
  );

  if (!projectPath) {
    return createErrorNotification(messages.noPathSpecified);
  }

  licenseChecker.init({ start: projectPath }, (err, result) => {
    if (err) {
      return createErrorNotification(err);
    }

    const licenses = Object.values(result);

    if (!licenses || licenses.length <= 0) {
      return createWarnNotification(messages.noLicenses);
    }

    const parse = parseLicensesFactory({
      whitelistedLicenses,
      blacklistedLicenses,
      createWarnNotification,
      createErrorNotification,
    });

    parse(licenses);
  });
};

module.exports = checkLicenses;
