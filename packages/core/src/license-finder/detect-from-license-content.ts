import { type LicenseId, licenses } from "@license-auditor/data";

/**
 * Tokenizes text into words, removes punctuation and whitespaces
 */
const TOKENIZER_PATTERN = /[^A-Za-zА-Яа-я0-9_]+/;
export const tokenize = (text: string): string[] => {
  return text
    .split(TOKENIZER_PATTERN)
    .filter((token) => token || token !== " ");
};

const createSet = (text: string): Set<string> => {
  return new Set(tokenize(text));
};

/**
 * Calculates text similarity using Jaccard similarity coefficient
 * Requires texts to be tokenized and punctuation and whitespaces removed
 */
const compare = (set1: Set<string>, set2: Set<string>): number => {
  const intersection = new Set([...set1].filter((x) => set2.has(x)));
  const union = new Set([...set1, ...set2]);
  const similarity = intersection.size / union.size;
  return similarity;
};
const getCalculateSimilarity =
  (library: Record<string, Set<string>>) =>
  (textToCompare: string): { licenseId: LicenseId; similarity: number }[] => {
    const set = createSet(textToCompare);
    const similarities = Object.entries(library).map(([key, value]) => {
      return {
        licenseId: key as LicenseId,
        similarity: compare(set, value),
      };
    });

    return similarities;
  };
const createLibrary = (
  texts: Record<string, string>,
): Record<string, Set<string>> => {
  return Object.entries(texts).reduce<Record<string, Set<string>>>(
    (library, [key, value]) => {
      library[key] = createSet(value);
      return library;
    },
    {},
  );
};

const licensesLibrary = createLibrary(
  licenses.reduce<Record<string, string>>((acc, license) => {
    if (license.licenseText) {
      acc[license.licenseId as LicenseId] = license.licenseText;
    }
    return acc;
  }, {}),
);
const calculateSimilarity = getCalculateSimilarity(licensesLibrary);

export function detectLicenses(
  licenseContent: string,
): { licenseId: LicenseId; similarity: number }[] {
  const similarities = calculateSimilarity(licenseContent);
  return similarities.sort((a, b) => b.similarity - a.similarity);
}
