const licenseChecker = require('./license-checker');
const messages = require('./messages');
const ciNotification = require('./ciNotifications');
const parseLicensesFactory = require('./parseLicenses');

const checkLicenses = async ({
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

  try {
    const licenses = await licenseChecker.findAllLicenses({ start: projectPath });

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
  } catch (err) {
    return createErrorNotification(err);
  }
};

module.exports = checkLicenses;
