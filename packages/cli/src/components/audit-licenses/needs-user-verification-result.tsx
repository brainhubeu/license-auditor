import type { LicenseAuditResult } from "@license-auditor/data";
import figures from "figures";
import { Box, Text } from "ink";
import { describeLicenseCount } from "./result-messages.js";

export default function NeedsUserVerificationResult({
	needsUserVerification,
}: Omit<LicenseAuditResult, "notFound" | "groupedByStatus">) {
	const describePackagesCount = describeLicenseCount(
		needsUserVerification.size,
		"package is",
		"packages are",
	);

	return (
		<Box flexDirection="column">
			<Box>
				<Text color="yellow">{figures.warning}</Text>
				<Text>{describePackagesCount} requires manual checking:</Text>
			</Box>
			<Box flexDirection="column" marginLeft={2}>
				{Array.from(needsUserVerification).map(
					([packageName, { verificationMessage }]) => (
						<Box key={packageName}>
							<Text color="gray">{figures.pointerSmall}</Text>
							<Text>{verificationMessage}</Text>
						</Box>
					),
				)}
			</Box>
		</Box>
	);
}
