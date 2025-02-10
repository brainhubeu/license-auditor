export const Explanations = () => {
  return (
    <section className="container py-8 sm:py-32">
      <div className="flex flex-col gap-8 place-items-center">
        <h2 className="text-3xl md:text-4xl font-bold">
          Audit licenses,{" "}
          <span className="bg-gradient-to-b from-primary/60 to-primary text-transparent bg-clip-text">
            avoid
          </span>{" "}
          legal pitfalls
        </h2>

        <p className="text-muted-foreground text-xl mt-4 mb-8 max-w-4xl">
          License Auditor scans your project dependencies and identifies license
          risks — helping you stay secure and legally safe with minimal effort.
        </p>
      </div>
    </section>
  );
};
