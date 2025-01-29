/**
 * Helper function to normalize whitespace in the text.
 * All whitespace should be treated as a single space.
 */
function normalizeWhitespace(text: string): string {
  return text.replace(/\s+/g, " ");
}

/**
 * Helper function to normalize case.
 * All letters should be treated as lowercase.
 */
function normalizeCase(text: string): string {
  return text.toLowerCase();
}

/**
 * Helper function to normalize punctuation.
 * Hyphens, dashes, en dashes, em dashes are considered equivalent.
 * Various types of quotes are considered equivalent.
 */
function normalizePunctuation(text: string): string {
  // Normalize hyphens and dashes
  const hypehenNormalized = text.replace(/[-‐‑‒–—―]/g, "-");
  // Normalize quotes
  const dashNormalized = hypehenNormalized.replace(/[‘’‚‛“”„‟"']/g, '"');
  return dashNormalized;
}

/**
 * Helper function to remove code comments from the text.
 * Any code comment indicators at the beginning of lines are ignored.
 */
function removeCodeComments(text: string): string {
  return text
    .replace(/^\s*\/\/.*$/gm, "") // Remove C++ style comments
    .replace(/^\s*#.*$/gm, "") // Remove shell style comments
    .replace(/^\s*\/\*.*\*\/\s*$/gm, "") // Remove C style comments
    .replace(/^\s*\*.*$/gm, "") // Remove leading asterisks
    .replace(/^\s*<!--.*-->$/gm, "") // Remove HTML comments
    .replace(/^\s*%\s*.*$/gm, ""); // Remove LaTeX comments
}

/**
 * Helper function to remove bullets and numbering.
 * Bullets and numbering at the beginning of lines are ignored.
 */
function removeBulletsAndNumbering(text: string): string {
  return text
    .replace(/^\s*[\d\w]+[\.\)]\s+/gm, "") // Remove numbers or letters followed by '.' or ')'
    .replace(/^\s*[-*•]\s+/gm, ""); // Remove bullets
}

/**
 * Helper function to normalize spelling variations.
 * Words in the list of equivalent words are considered interchangeable.
 */
function normalizeSpelling(text: string): string {
  const equivalents: { [key: string]: string } = {
    // Add common equivalents per SPDX Appendix: equivalentwords.txt
    acknowledgment: "acknowledgement",
    analogue: "analog",
    artefact: "artifact",
    authorisation: "authorization",
    authorise: "authorize",
    catalogue: "catalog",
    centre: "center",
    emphasised: "emphasized",
    favour: "favor",
    favourite: "favorite",
    fulfil: "fulfill",
    fulfilment: "fulfillment",
    initialise: "initialize",
    judgment: "judgement",
    labelling: "labeling",
    labour: "labor",
    licence: "license",
    maximise: "maximize",
    modelled: "modeled",
    modelling: "modeling",
    organisation: "organization",
    organise: "organize",
    practise: "practice",
    programme: "program",
    realise: "realize",
    recognise: "recognize",
    signalling: "signaling",
    "sub-license": "sublicense",
    "sub license": "sublicense",
    utilisation: "utilization",
    whilst: "while",
    wilful: "wilfull",
    "non-commercial": "noncommercial",
    "per cent": "percent",
  };

  const pattern = new RegExp(
    `\\b(${Object.keys(equivalents).join("|")})\\b`,
    "gi",
  );
  return text.replace(
    pattern,
    (match) => equivalents[match.toLowerCase()] as string,
  );
}

/**
 * Helper function to normalize copyright symbols.
 * "©", "(c)", or "Copyright" should be considered equivalent.
 */
function normalizeCopyrightSymbols(text: string): string {
  return text.replace(/©|\(c\)/gi, "copyright");
}

/**
 * Helper function to remove copyright notices
 */
function removeCopyrightNotices(text: string): string {
  return text
    .replace(/(copyright\s+\d{4,}(.+?)(\.|$))/gi, "")
    .replace(/(copyright(.+?)(\.|$))/gi, "");
}

/**
 * Helper function to remove license titles.
 * Ignore the license name or title for matching purposes.
 */
function removeLicenseTitles(text: string): string {
  // Titles are usually on the first line, remove any line in all caps or title case
  const lines = text.split("\n");
  const body = lines.filter((line) => {
    const trimmed = line.trim();
    return !(
      trimmed &&
      (trimmed === trimmed.toUpperCase() ||
        /^[A-Z][a-z]+(\s+[A-Z][a-z]+)+$/.test(trimmed))
    );
  });
  return body.join("\n");
}

// /**
//  * Helper function to remove text after the end of the license.
//  * Ignore any text after 'END OF TERMS AND CONDITIONS' or similar markers.
//  */
// function removeTextAfterLicenseEnd(text: string): string {
//   const patterns = [
//     /end of terms and conditions/gi,
//     /end of license agreement/gi,
//     /end of license/gi,
//   ];
//   for (const pattern of patterns) {
//     const index = text.search(pattern);
//     if (index >= 0) {
//       text = text.substring(0, index + text.match(pattern)![0].length);
//       break;
//     }
//   }
//   return text;
// }

/**
 * Process the license text according to the guidelines.
 */
function preprocessLicenseText(text: string): string {
  let input = text;
  input = normalizeWhitespace(input);
  input = normalizeCase(input);
  input = normalizePunctuation(input);
  input = removeCodeComments(input);
  input = removeBulletsAndNumbering(input);
  input = normalizeSpelling(input);
  input = normalizeCopyrightSymbols(input);
  input = removeCopyrightNotices(input);
  input = removeLicenseTitles(input);
  // text = removeTextAfterLicenseEnd(text);
  return text.trim();
}

/**
 * Parse the license template into a structure that can be used for matching.
 */
interface TemplateNode {
  type: "text" | "alt" | "optional" | "bullet";
  content: string;
  match?: string; // For alt nodes
}
// biome-ignore lint/complexity/noExcessiveCognitiveComplexity: complexity required here
function parseLicenseTemplate(template: string): TemplateNode[] {
  const nodes: TemplateNode[] = [];

  const regex = /<([^>]+)>/g;
  let match: RegExpExecArray | null;
  let lastIndex = 0;

  // biome-ignore lint/suspicious/noAssignInExpressions: idk
  while ((match = regex.exec(template)) !== null) {
    const tagContent = match[1] as string; // Content inside <>
    const start = match.index;
    const end = regex.lastIndex;

    if (start > lastIndex) {
      // Text before the tag
      nodes.push({
        type: "text",
        content: template.substring(lastIndex, start),
      });
    }

    if (tagContent.startsWith("alt ")) {
      // Handle <alt match="regex" name="...">text</alt>
      const closingTag = "</alt>";
      const closingIndex = template.indexOf(closingTag, end);
      if (closingIndex >= 0) {
        const innerContent = template.substring(end, closingIndex);
        const attributes = parseTagAttributes(tagContent);
        // biome-ignore lint/complexity/useLiteralKeys: needed to access the attribute
        if (!attributes["match"]) {
          console.log(
            "Warning: match attribute is missing in <alt> tag",
            tagContent,
          );
          throw new Error("match attribute is missing in <alt> tag");
        }
        nodes.push({
          type: "alt",
          content: innerContent,
          // biome-ignore lint/complexity/useLiteralKeys: needed to access the attribute
          match: attributes["match"] || "",
        });
        lastIndex = closingIndex + closingTag.length;
        regex.lastIndex = lastIndex;
      } else {
        throw new Error("Unclosed <alt> tag in template");
      }
    } else if (tagContent.startsWith("optional")) {
      // Handle <optional>text</optional>
      const closingTag = "</optional>";
      const closingIndex = template.indexOf(closingTag, end);
      if (closingIndex >= 0) {
        const innerContent = template.substring(end, closingIndex);
        nodes.push({
          type: "optional",
          content: innerContent,
        });
        lastIndex = closingIndex + closingTag.length;
        regex.lastIndex = lastIndex;
      } else {
        throw new Error("Unclosed <optional> tag in template");
      }
    } else if (tagContent.startsWith("bullet")) {
      // Handle <bullet>text</bullet>
      const closingTag = "</bullet>";
      const closingIndex = template.indexOf(closingTag, end);
      if (closingIndex >= 0) {
        const innerContent = template.substring(end, closingIndex);
        nodes.push({
          type: "bullet",
          content: innerContent,
        });
        lastIndex = closingIndex + closingTag.length;
        regex.lastIndex = lastIndex;
      } else {
        throw new Error("Unclosed <bullet> tag in template");
      }
    } else {
      // Other tags, treat as regular text (e.g., <copyrightText>, <titleText>)
      nodes.push({
        type: "text",
        content: "", // Ignore the content inside these tags for matching
      });
      lastIndex = end;
    }
  }

  if (lastIndex < template.length) {
    // Text after the last tag
    nodes.push({
      type: "text",
      content: template.substring(lastIndex),
    });
  }

  return nodes;
}

function parseTagAttributes(tagContent: string): { [key: string]: string } {
  const attributes: { [key: string]: string } = {};
  const regex = /(\w+)="([^"]*)"/g;
  let match: RegExpExecArray | null;
  // biome-ignore lint/suspicious/noAssignInExpressions: idk
  while ((match = regex.exec(tagContent)) !== null) {
    const attributeName = match[1];
    if (!attributeName) {
      throw new Error(`Invalid tag attribute: ${match[0]}`);
    }
    if (!match[2]) {
      throw new Error(
        `Missing value for tag attribute: ${attributeName}, in tag: ${tagContent}`,
      );
      // console.warn(`WARNING: Missing value for tag attribute: ${attributeName}, in tag: ${tagContent}`);
    }
    attributes[attributeName] = match[2] || "";
  }
  return attributes;
}

/**
 * Build a regular expression from the license template nodes.
 */
function buildLicenseRegex(nodes: TemplateNode[]): RegExp {
  let pattern = "";

  for (const node of nodes) {
    if (node.type === "text") {
      const content = escapeRegExp(node.content);
      pattern += `${content}\\s*`;
    } else if (node.type === "alt") {
      // Replaceable text
      if (node.match) {
        pattern += `(${node.match})\\s*`;
      } else {
        const content = escapeRegExp(node.content);
        pattern += `(${content})\\s*`;
      }
    } else if (node.type === "optional") {
      // Optional text
      const content = escapeRegExp(node.content);
      pattern += `(${content})?\\s*`;
    } else if (node.type === "bullet") {
      // Ignore bullets
      pattern += "\\s*";
    }
  }

  // Global flags: ignore case and dot matches newline
  return new RegExp(`${pattern}`, "i");
}

/**
 * Escape special characters in a string to use in a regular expression.
 */
function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&").replace(/\n/g, "\\s*");
}

/**
 * The main function to match the license text against the template.
 */
export function matchLicense(
  licenseTemplate: string,
  licenseText: string,
): boolean {
  // Preprocess the license text
  const processedText = preprocessLicenseText(licenseText);

  // Parse the license template
  const nodes = parseLicenseTemplate(licenseTemplate);

  // Build a regular expression from the template
  const licenseRegex = buildLicenseRegex(nodes);

  console.log(licenseTemplate);
  // Attempt to match the processed license text against the regex
  return licenseRegex.test(processedText);
}
