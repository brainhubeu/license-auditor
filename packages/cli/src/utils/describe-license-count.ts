export function describeLicenseCount(
  count: number,
  singular: string,
  plural: string,
): string {
  const phrase = count === 1 ? singular : plural;
  return `${count} ${phrase}`;
}
