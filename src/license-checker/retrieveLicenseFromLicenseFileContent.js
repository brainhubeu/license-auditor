const retrieveLicenseFromLicenseFileContent = (content, licenseMap, templates) => {
  const lines = content.split('\n');
  const license = lines.find(line => /license/i.test(line));
  const mapped = licenseMap[(license || '').trim()];
  if (mapped) {
    return mapped;
  }
  const withoutFirstLine = lines.slice(1).filter(line => line.length).join('\n');
  return templates[withoutFirstLine] || content;
};

module.exports = retrieveLicenseFromLicenseFileContent;
