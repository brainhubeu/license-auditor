import type { licenses } from "./src/license/licenses";

declare global {
  type AvailableLicense = (typeof licenses)[number];
  type License = AvailableLicense | AvailableLicense[] | undefined;
  interface LicenseWithPath {
    license: License;
    licensePath: string | undefined;
  }
}
