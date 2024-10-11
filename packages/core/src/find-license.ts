export function findLicense(packagePath: string): {
  license: string | undefined;
  licensePath: string | undefined;
} {
  // todo - find license in:
  //   - package.json
  //   - license file
  //   - readme file
  return { license: "MIT", licensePath: "./license.md" };
}
