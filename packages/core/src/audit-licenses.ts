import { checkLicenseStatus, type LicenseStatus } from "./check-license-status";
import { findLicense } from "./find-license";

interface PackageInfo {
  package: string;
  path: string;
  license: string | undefined;
  licensePath: string | undefined;
  status: LicenseStatus;
}

function auditLicenses(packagePaths: string[]) {
  const resultMap = new Map<string, PackageInfo>();
  const dependencyTree = new Map<string, LicenseStatus>();
  const summary = {
    allowed: 0,
    disallowed: 0,
    unknown: 0,
  };
  function extractPackageName(packagePath: string): string {
    // todo
    return packagePath;
  }

  function getChildDependencies(packagePath: string): string[] {
    // todo
    return [];
  }

  function processPackage(packagePath: string) {
    const packageName = extractPackageName(packagePath);

    if (resultMap.has(packageName)) {
      return;
    }

    const { license, licensePath } = findLicense(packagePath);

    const status = checkLicenseStatus(license);

    const packageInfo: PackageInfo = {
      package: packageName,
      path: packagePath,
      license: license,
      licensePath: licensePath,
      status: status,
    };

    resultMap.set(packageName, packageInfo);
    dependencyTree.set(packageName, status);
    summary[status] += 1;

    // process child dependencies only if the parent package's license is allowed
    if (status === "allowed") {
      const childDependencies = getChildDependencies(packagePath);
      for (const childPath of childDependencies) {
        processPackage(childPath);
      }
    }
  }

  for (const packagePath of packagePaths) {
    processPackage(packagePath);
  }

  return {
    resultMap,
    dependencyTree,
    summary,
  };
}

// hardcoded for now
const packagePaths: string[] = [
  "/Users/angelikajeziorska/Documents/projects/license-auditor/node_modules/@biomejs/biome",
  "/Users/angelikajeziorska/Documents/projects/license-auditor/node_modules/@tsconfig/recommended",
  "/Users/angelikajeziorska/Documents/projects/license-auditor/node_modules/cz-conventional-changelog",
  "/Users/angelikajeziorska/Documents/projects/license-auditor/node_modules/husky",
  "/Users/angelikajeziorska/Documents/projects/license-auditor/node_modules/turbo",
  "/Users/angelikajeziorska/Documents/projects/license-auditor/node_modules/typescript",
  "/Users/angelikajeziorska/Documents/projects/license-auditor/node_modules/@license-auditor/eslint-config",
  "/Users/angelikajeziorska/Documents/projects/license-auditor/node_modules/@total-typescript/ts-reset",
];

const auditResult = auditLicenses(packagePaths);

console.log("Result Map:", auditResult.resultMap);
console.log("Dependency Tree:", auditResult.dependencyTree);
console.log("Summary:", auditResult.summary);
