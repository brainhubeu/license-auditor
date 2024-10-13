const handler = (
  str: string,
  options: { first?: true | undefined; separator: string },
) => {
  const limit = options.first ? 1 : undefined;
  const output = str.split(options.separator, limit);
  console.log(output);
};

export { handler };
