import { Card, CardHeader, CardTitle } from "./ui/card";

interface PackageManagersType {
  url: string;
  title: string;
}

const packageManagers: PackageManagersType[] = [
  {
    url: "npm_icon.svg",
    title: "npm",
  },
  {
    url: "pnpm_icon.svg",
    title: "pnpm",
  },
  {
    url: "yarn_icon.svg",
    title: "yarn",
  },
];

export const PackageManagers = () => {
  return (
    <section
      id="packageManagers"
      className="container text-center py-8 sm:py-32"
    >
      <h2 className="text-3xl md:text-4xl font-bold ">
        <span className="bg-gradient-to-b from-primary/60 to-primary text-transparent bg-clip-text">
          Supported{" "}
        </span>
        Package Managers
      </h2>
      <p className="md:w-3/4 mx-auto mt-4 mb-8 text-xl text-muted-foreground">
        License Auditor supports the most popular package managers, ensuring
        smooth integration into your workflow. Whether you use npm, yarn (2+,
        for projects with node_modules), or pnpm, you can easily audit your
        dependencies and stay compliant.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {packageManagers.map(({ url, title }: PackageManagersType) => (
          <Card key={title} className="bg-muted/50">
            <CardHeader>
              <CardTitle className="grid gap-4 place-items-center">
                <img src={url} alt={title} className="w-24 h-24" />
                {title}
              </CardTitle>
            </CardHeader>
          </Card>
        ))}
      </div>
    </section>
  );
};
