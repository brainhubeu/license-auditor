const ciNotifications = ({ warn, fail }) => {
  const createWarnNotification = msg => {
    warn(msg);
  };

  const createErrorNotification = msg => {
    fail(msg);
  };

  return { createWarnNotification, createErrorNotification };
};

module.exports = ciNotifications;
