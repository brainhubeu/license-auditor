// splits out version, takes scoped packages into account
export function getPackageName(packageName: string): string {
  const atIndex = packageName.lastIndexOf("@");

  if (atIndex > 0) {
    return packageName.slice(0, atIndex);
  }

  return packageName;
}
