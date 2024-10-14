declare global {
  type AvailableLicense = (typeof licenses)[number];
  type License = AvailableLicense | AvailableLicense[] | undefined;
}

export {};
