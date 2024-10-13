import { licenses } from "./mocks.js";

const handler = (options: { verbose?: boolean }) => {
  const processed = licenses.map((license) => {
    if (options.verbose) {
      console.log(license);
    }

    return { ...license, error: license.license !== "MIT" };
  });

  console.log(`Detected ${processed.length} licenses`);
};

export { handler };
