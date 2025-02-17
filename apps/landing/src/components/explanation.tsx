interface RiskProps {
  key: string;
  description: string;
  additionalText?: string;
}

const risksList: RiskProps[] = [
  {
    key: "Legal Compliance",
    description:
      "Every package has a license that dictates how it can be used, modified, and shared.",
    additionalText:
      "Using a package with the wrong license can lead to legal issues or even lawsuits.",
  },
  {
    key: "Commercial & Distribution Restrictions",
    description:
      "Some licenses, like GPL, may require you to open-source your own code if you use or modify the package. Others, like MIT, offer more flexibility.",
  },
  {
    key: "Security & Trust",
    description:
      "Packages with unclear or restrictive licenses can introduce security risks or complicate maintenance and updates.",
  },
  {
    key: "Community & Ethics",
    description:
      "Respecting open-source licenses fosters a healthy community and encourages continued collaboration.",
  },
];

export const Explanations = () => {
  return (
    <section className="container py-8 sm:py-32" id="explanation">
      <div className="flex flex-col gap-8 place-items-center">
        <h2 className="text-3xl md:text-4xl font-bold">
          Audit licenses,{" "}
          <span className="bg-gradient-to-b from-primary/60 to-primary text-transparent bg-clip-text">
            avoid
          </span>{" "}
          legal pitfalls
        </h2>

        <div className="text-muted-foreground text-xl max-w-4xl">
          <p className="mt-4 mb-8">
            License Auditor scans your project dependencies and identifies
            license risks — helping you stay secure and legally safe with
            minimal effort.
          </p>
          <span className="text-2xl font-bold">Why should you care?</span>
          <ul className="list-disc ml-4 mt-2">
            {risksList.map(({ key, description, additionalText }) => {
              return (
                <li key={key} className="mb-2">
                  <span className="font-bold mr-2">{key}:</span>
                  {description}
                  <span className="ml-1 font-bold">{additionalText}</span>
                </li>
              );
            })}
          </ul>

          <p className="mt-8">
            By checking licenses carefully, you ensure that your project remains
            legally compliant and secure while respecting the work of other
            developers.
          </p>
        </div>
      </div>
    </section>
  );
};
