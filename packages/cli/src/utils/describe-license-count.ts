function pluralize(count: number, singular: string, plural: string): string {
  return count === 1 ? singular : plural;
}

export function describeLicenseCount(count: number): string {
  return `${count} ${pluralize(count, "license is", "licenses are")}`;
}
