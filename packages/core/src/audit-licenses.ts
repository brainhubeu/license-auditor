import type { ConfigType, LicenseAuditResult } from "@license-auditor/data";
import { getAllLicenses } from "./get-all-licenses.js";
import { mapLicensesToStatus } from "./map-licenses-to-statuses.js";

export async function auditLicenses(
  cwd: string,
  config: ConfigType,
  production?: boolean | undefined,
): Promise<LicenseAuditResult> {
  const allLicenses = await getAllLicenses(cwd, config, production);

  const mappedLiceses = await mapLicensesToStatus(allLicenses.licenses, config);

  // return {
  // 	groupedByStatus: {
  // 		whitelist: [],
  // 		blacklist: [],
  // 		unknown: [],
  // 	},
  // 	notFound: new Map(),
  // 	overrides: {
  // 		notFoundOverrides: [],
  // 	},
  // 	needsUserVerification: new Map(),
  // 	warning: "",
  // };

  return {
    groupedByStatus: mappedLiceses.groupedByStatus,
    notFound: mappedLiceses.notFound,
    overrides: allLicenses.overrides,
    warning: allLicenses.warning,
    needsUserVerification: mappedLiceses.needsUserVerification,
  };

  // const packageManager = await findPackageManager(cwd);
  // const { dependencies: packagePaths, warning } = await findDependencies({
  // 	packageManager,
  // 	projectRoot: cwd,
  // 	production,
  // });

  // const resultMap = new Map<
  // 	string,
  // 	{ packageName: string; licensesWithPath: LicenseFinderType }
  // >();

  // // const groupedByStatus: Record<LicenseStatus, DetectedLicense[]> = {
  // // 	whitelist: [],
  // // 	blacklist: [],
  // // 	unknown: [],
  // // };

  // const notFound = new Map<
  // 	string,
  // 	{ packagePath: string; errorMessage: string }
  // >();

  // const needsUserVerification = new Map<
  // 	string,
  // 	{
  // 		packagePath: string;
  // 		verificationMessage: string;
  // 	}
  // >();

  // const foundPackages: Pick<DetectedLicense, "packageName" | "packagePath">[] =
  // 	packagePaths.map((packagePath) => ({
  // 		packagePath,
  // 		packageName: extractPackageNameFromPath(packagePath),
  // 	}));

  // const { filteredPackages, notFoundOverrides } = filterOverrides({
  // 	foundPackages,
  // 	overrides: config.overrides,
  // });

  // for (const {
  // 	packageName: packageNameFromPath,
  // 	packagePath,
  // } of filteredPackages) {
  // 	const packageJsonResult = readPackageJson(packagePath);
  // 	if (!packageJsonResult.success) {
  // 		notFound.set(packageNameFromPath, {
  // 			packagePath,
  // 			errorMessage: packageJsonResult.errorMessage,
  // 		});
  // 		continue;
  // 	}

  // 	const packageName =
  // 		extractPackageNameWithVersion(packageJsonResult.packageJson) ??
  // 		packageNameFromPath;
  // 	if (
  // 		resultMap.has(packageName) ||
  // 		notFound.has(packageName) ||
  // 		needsUserVerification.has(packageName)
  // 	) {
  // 		continue;
  // 	}

  // 	const licensesWithPath = await findLicenses(
  // 		packageJsonResult.packageJson,
  // 		packagePath,
  // 		// config,
  // 	);

  // 	const packageWithLicense = {
  // 		packageName,
  // 		licensesWithPath,
  // 	};

  // 	resultMap.set(packageName, packageWithLicense);

  // 	// if (
  // 	// 	!licensesWithPath.licensePath
  // 	// 	// ||
  // 	// 	// licensesWithPath.verificationStatus === "licenseNotFound"
  // 	// ) {
  // 	// 	notFound.set(packageName, {
  // 	// 		packagePath,
  // 	// 		errorMessage: `License not found in ${packagePath}`,
  // 	// 	});
  // 	// 	continue;
  // 	// }

  // 	// if (licensesWithPath.verificationStatus !== "ok") {
  // 	//   needsUserVerification.set(packageName, {
  // 	//     packagePath,
  // 	//     verificationMessage: parseVerificationStatusToMessage(
  // 	//       licensesWithPath.verificationStatus,
  // 	//       packageName,
  // 	//       packagePath,
  // 	//     ),
  // 	//   });
  // 	//   continue;
  // 	// }

  // 	// const status = resolveLicenseStatus(licensesWithPath, config);

  // 	// const detectedLicense: DetectedLicense = {
  // 	// 	packageName,
  // 	// 	packagePath,
  // 	// 	status,
  // 	// 	licenses: licensesWithPath.licenses,
  // 	// 	licenseExpression: licensesWithPath.licenseExpression,
  // 	// 	licensePath: licensesWithPath.licensePath,
  // 	// 	// verificationStatus: licensesWithPath.verificationStatus,
  // 	// };

  // 	// groupedByStatus[status].push(detectedLicense);
  // 	// resultMap.set(packageName, detectedLicense);
  // }

  // return {
  // 	// groupedByStatus,
  // 	// notFound,
  // 	overrides: {
  // 		notFoundOverrides,
  // 	},
  // 	licenses: resultMap,
  // 	// needsUserVerification,
  // 	warning,
  // };
}
