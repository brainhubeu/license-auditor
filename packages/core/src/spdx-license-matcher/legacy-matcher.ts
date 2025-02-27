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
  let input = text;
  // Normalize hyphens and dashes
  input = input.replace(/[-‐‑‒–—―]/g, "-");
  // Normalize quotes
  input = input.replace(/[‘’‚‛“”„‟"']/g, '"');
  return text;
}

/**
 * Helper function to remove code comments from the text.
 * Any code comment indicators at the beginning of lines are ignored.
 */
function removeCodeComments(text: string): string {
  return text.replace(/^\s*(\/\/|#|\/\*|\*|<!--|%|;).*$/gm, "");
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
    wilful: "willful",
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
    .replace(/(copyright\s+\d{4,}\s+.+?(\.|$))/gi, "")
    .replace(/(copyright\s+.+?(\.|$))/gi, "");
}

/**
 * Helper function to remove license titles.
 * Ignore the license name or title for matching purposes.
 */
function removeLicenseTitles(text: string): string {
  // Remove the first line if it's all caps or title case
  const lines = text.split("\n");
  if (lines.length > 0 && /^[A-Z\s]+$/.test((lines[0] || "").trim())) {
    lines.shift();
  }
  return lines.join("\n");
}

/**
 * Helper function to remove text after the end of the license.
 * Ignore any text after 'END OF TERMS AND CONDITIONS' or similar markers.
 */
function removeTextAfterLicenseEnd(text: string): string {
  let input = text;
  const patterns = [
    /end of terms and conditions/gi,
    /end of license agreement/gi,
    /end of license/gi,
  ];
  for (const pattern of patterns) {
    const match = input.match(pattern);
    if (match) {
      const index = input.indexOf(match[0]);
      input = input.substring(0, index + match[0].length);
      break;
    }
  }
  return input;
}

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
  input = removeTextAfterLicenseEnd(input);
  input = normalizeWhitespace(input);
  return input.trim();
}

/**
 * Escape special characters in a string to use in a regular expression,
 * and normalize whitespace, hyphens, and quotes.
 */
function escapeAndNormalizeForRegex(string: string): string {
  // Escape special regex characters
  let escaped = string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  // Replace sequences of whitespace with '\s+'
  escaped = escaped.replace(/\s+/g, "\\s*");
  // Replace hyphens and dashes with the hyphen equivalence guideline
  escaped = escaped.replace(/[-]/g, "[-‐‑‒–—―]");
  // Replace quotation marks with quote equivalence
  escaped = escaped.replace(/["]/g, "[\"'‘’‚‛“”„‟]");
  return escaped;
}

/**
 * Template node interface for parsed template elements.
 */
interface TemplateNode {
  type: "text" | "variable" | "optional";
  content?: string; // For text nodes
  name?: string; // For variable nodes
  original?: string; // Original text in variable node
  match?: string; // Match expression in variable node
  nodes?: TemplateNode[]; // For optional nodes, child nodes
}

/**
 * Parse the license template into a structure that can be used for matching.
 */
// biome-ignore lint/complexity/noExcessiveCognitiveComplexity: complexity needed
function parseLicenseTemplate(template: string): TemplateNode[] {
  const nodes: TemplateNode[] = [];
  let index = 0;
  const length = template.length;
  const optionalStack: TemplateNode[] = [];

  while (index < length) {
    const startRule = template.indexOf("<<", index);
    if (startRule < 0) {
      // No more rules, remaining text is a text node
      const textContent = template.substring(index);
      if (optionalStack.length > 0) {
        optionalStack[optionalStack.length - 1]?.nodes?.push({
          type: "text",
          content: textContent,
        });
      } else {
        nodes.push({ type: "text", content: textContent });
      }
      break;
    }
    if (startRule > index) {
      // Text before the rule
      const textContent = template.substring(index, startRule);
      if (optionalStack.length > 0) {
        optionalStack[optionalStack.length - 1]?.nodes?.push({
          type: "text",
          content: textContent,
        });
      } else {
        nodes.push({ type: "text", content: textContent });
      }
    }
    // Now at the start of a rule
    const endRule = template.indexOf(">>", startRule);
    if (endRule < 0) {
      throw new Error(`Unclosed rule starting at position ${startRule}`);
    }
    const ruleContent = template.substring(startRule + 2, endRule);
    const ruleFields = ruleContent.split(";");

    const typeField = ruleFields[0]; // First field is the type

    if (typeField === "var") {
      // Variable rule
      const attributes: { [key: string]: string } = {};
      // Parse the rest of the fields
      for (let i = 1; i < ruleFields.length; i++) {
        const field = ruleFields[i];
        const fieldParts = field?.split("=");
        if (!fieldParts || fieldParts.length !== 2) {
          throw new Error(`Invalid variable rule field: ${field}`);
        }
        const [key, value] = fieldParts;
        attributes[key as string] = value as string;
      }
      // Required fields: name, original, match
      if (
        // biome-ignore lint/complexity/useLiteralKeys: needed to access the attribute
        !(attributes["name"] && attributes["original"] && attributes["match"])
      ) {
        throw new Error(
          `Variable rule missing required attributes at position ${startRule}`,
        );
      }
      const variableNode: TemplateNode = {
        type: "variable",
        // biome-ignore lint/complexity/useLiteralKeys: needed to access the attribute
        name: attributes["name"],
        // biome-ignore lint/complexity/useLiteralKeys: needed to access the attribute
        original: attributes["original"],
        // biome-ignore lint/complexity/useLiteralKeys: needed to access the attribute
        match: attributes["match"],
      };
      if (optionalStack.length > 0) {
        optionalStack[optionalStack.length - 1]?.nodes?.push(variableNode);
      } else {
        nodes.push(variableNode);
      }
      index = endRule + 2;
    } else if (typeField === "beginOptional") {
      // Begin an optional section
      const optionalNode: TemplateNode = {
        type: "optional",
        nodes: [],
      };
      if (optionalStack.length > 0) {
        optionalStack[optionalStack.length - 1]?.nodes?.push(optionalNode);
      } else {
        nodes.push(optionalNode);
      }
      optionalStack.push(optionalNode);
      index = endRule + 2;
    } else if (typeField === "endOptional") {
      // End of an optional section
      if (optionalStack.length === 0) {
        throw new Error(`Unmatched endOptional at position + ${startRule}`);
      }
      optionalStack.pop();
      index = endRule + 2;
    } else {
      throw new Error(
        `Unknown rule type "${typeField}" at position ${startRule}`,
      );
    }
  }
  if (optionalStack.length > 0) {
    throw new Error("Unclosed optional section");
  }
  return nodes;
}

/**
 * Build a regular expression from the license template nodes.
 */
function buildLicenseRegex(nodes: TemplateNode[]): string {
  let pattern = "";

  for (const node of nodes) {
    if (node.type === "text") {
      // biome-ignore lint/style/noNonNullAssertion: needed
      let content = node.content!;
      // Normalize the content similarly to how we normalize the license text
      content = normalizeCase(content);
      content = normalizePunctuation(content);
      content = normalizeSpelling(content);
      content = normalizeCopyrightSymbols(content);
      content = normalizeWhitespace(content);
      content = escapeAndNormalizeForRegex(content);
      pattern += content;
    } else if (node.type === "variable") {
      // Use the match expression
      // biome-ignore lint/style/noNonNullAssertion: needed
      let matchExpr = node.match!;
      // Semicolons are escaped with \; in the match field, unescape them
      matchExpr = matchExpr.replace(/\\;/g, ";");
      // Adjust for whitespace normalization: replace sequences of whitespace with '\s+'
      matchExpr = matchExpr.replace(/\s+/g, "\\s+");
      // Normalize hyphens and quotes in the match expression
      matchExpr = matchExpr.replace(/[-‐‑‒–—―]/g, "[-‐‑‒–—―]");
      matchExpr = matchExpr.replace(/['"‘’‚‛“”„‟]/g, "[\"'‘’‚‛“”„‟]");
      pattern += `(${matchExpr})`;
    } else if (node.type === "optional") {
      // Build the regex pattern for the optional content
      // biome-ignore lint/style/noNonNullAssertion: needed
      const optionalPattern = buildLicenseRegex(node.nodes!);
      // Make it optional
      pattern += `(?:${optionalPattern})?`;
    }
  }
  return pattern;
}

/**
 * The main function to match the license text against the template.
 */
export function matchLicense(
  licenseTemplate: string,
  licenseText: string,
): boolean {
  try {
    // Preprocess the license text
    const processedText = preprocessLicenseText(licenseText);

    // Parse the license template
    const nodes = parseLicenseTemplate(licenseTemplate);

    // Build a regular expression from the template nodes
    const regexPattern = buildLicenseRegex(nodes);

    // Create a RegExp object with 'i' flag for case-insensitive matching
    const licenseRegex = new RegExp(`${regexPattern}`, "i");

    console.dir(nodes, { depth: 10 });
    console.log(licenseRegex);
    console.log(processedText);
    // Attempt to match the processed license text against the regex
    return licenseRegex.test(processedText);
  } catch (error) {
    console.error("Error matching license:", error);
    return false;
  }
}
