import {
  FileCode2Icon,
  FilterIcon,
  MapPinIcon,
  RocketIcon,
  SearchIcon,
  SettingsIcon,
  ShieldIcon,
} from "lucide-react";
import { Card, CardDescription, CardHeader, CardTitle } from "./ui/card";

interface ServiceProps {
  title: string;
  description: string;
  parameter: string;
  icon: JSX.Element;
}

const serviceList: ServiceProps[] = [
  {
    title: "Detailed Insights",
    description:
      "Get a complete, detailed report of all scanned licenses to better understand your dependencies.",
    parameter: "--verbose",
    icon: <SearchIcon />,
  },
  {
    title: "Focus on What Matters",
    description:
      "Filter results by license status—whitelist, blacklist, or unknown—to quickly identify issues.",
    parameter: "--filter",
    icon: <MapPinIcon />,
  },
  {
    title: "Save & Share Results",
    description:
      "Export audit results as a JSON file for easy tracking, reporting, or further analysis.",
    parameter: "--json",
    icon: <FileCode2Icon />,
  },
  {
    title: "Production-Ready Scans",
    description:
      "Skip development dependencies and focus only on production-critical packages.",
    parameter: "--production",
    icon: <RocketIcon />,
  },
  {
    title: "Smart Defaults",
    description:
      "Run the audit with a pre-configured whitelist and blacklist to get started instantly.",
    parameter: "--default-config",
    icon: <SettingsIcon />,
  },
  {
    title: "Precision Filtering",
    description:
      "Use custom regex filters to target specific packages and refine your audit results.",
    parameter: "--filter-regex",
    icon: <FilterIcon />,
  },
  {
    title: "Block Risky Licenses",
    description:
      "Automatically stop execution if the number of blacklisted licenses exceeds a set threshold, keeping your project safe.",
    parameter: "--bail",
    icon: <ShieldIcon />,
  },
];

export const Parameters = () => {
  return (
    <section className="container py-8 sm:py-32" id="features">
      <div className="gap-8 place-items-center">
        <div>
          <h2 className="text-3xl md:text-4xl font-bold text-center">
            <span className="bg-gradient-to-b from-primary/60 to-primary text-transparent bg-clip-text">
              Fine-Tune{" "}
            </span>
            Your License Audit
          </h2>

          <p className="text-muted-foreground text-xl mt-4 mb-8 text-center">
            Effortlessly configure License Auditor to match your project’s needs
            and ensure compliance without extra effort 🚀
          </p>

          <div className="grid lg:grid-cols-2 grid-cols-1 gap-8">
            {serviceList.map(
              ({ icon, title, description, parameter }: ServiceProps) => (
                <Card
                  key={title}
                  className="transition-all duration-300 hover:shadow-lg hover:shadow-primary/25"
                >
                  <CardHeader className="space-y-1 flex md:flex-row justify-start items-start gap-4">
                    <span className="hidden md:inline mt-1 bg-primary text-black p-1 rounded-sm">
                      {icon}
                    </span>
                    <div>
                      <CardTitle className="flex items-center gap-2 flex-wrap">
                        <span className="mt-1 mr-2 bg-primary text-black p-1 rounded-sm md:hidden inline">
                          {icon}
                        </span>
                        {title}{" "}
                        <span className="sm:inline">
                          (
                          <span className="bg-muted px-1.5 py-1 rounded font-mono text-base">
                            {parameter}
                          </span>
                          )
                        </span>
                      </CardTitle>
                      <CardDescription className="text-md mt-2">
                        {description}
                      </CardDescription>
                    </div>
                  </CardHeader>
                </Card>
              ),
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
