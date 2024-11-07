import cliTruncate from "cli-truncate";

const cache: Record<string, string> = {};

export const truncateText = (text: string): string => {
  const cachedText = cache[text];

  if (cachedText) {
    return cachedText;
  }

  const truncatedText = cliTruncate(text, 20, {
    position: "start",
  });

  cache[text] = truncatedText;

  return truncatedText;
};
