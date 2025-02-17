import { Card, CardDescription, CardHeader, CardTitle } from "./ui/card";

export const Usage = () => {
  return (
    <section className="container py-8 sm:py-32" id="usage">
      <div className="flex flex-col gap-8 place-items-center">
        <h2 className="text-3xl md:text-4xl font-bold">
          Flexible{" "}
          <span className="bg-gradient-to-b from-primary/60 to-primary text-transparent bg-clip-text">
            Integration{" "}
          </span>
          Options
        </h2>

        <div>
          <p className="text-muted-foreground text-xl mt-4 mb-8 max-w-4xl">
            You can use License Auditor in your CI/CD pipeline, in your local
            machine. Be notified when a new dependency with a license risk is
            added to your project.
          </p>
          <p className="text-muted-foreground text-xl mt-4 mb-8">
            Check out the steps below or head to our <a href="https://github.com/brainhubeu/license-auditor/tree/master?tab=readme-ov-file#license-auditor" target="_blank" className="text-primary/90 font-bold hover:text-primary">README</a> file for further details.
          </p>
        </div>

      </div>
      <div className="grid lg:grid-cols-2 gap-8">
        <Card className="transition-all duration-300 hover:shadow-lg hover:shadow-primary/25">
          <CardHeader className="space-y-4">
            <CardTitle className="text-2xl font-bold">Local</CardTitle>
            <CardDescription className="text-md">
              Instantly scan your dependencies and get a detailed report in your
              terminal. Use filtering options to focus on critical issues and
              export results to JSON for further analysis.
            </CardDescription>
            <img src="local_code.svg" alt="Local" className="mt-4" />
          </CardHeader>
        </Card>

        <Card className="transition-all duration-300 hover:shadow-lg hover:shadow-primary/25">
          <CardHeader className="space-y-4">
            <CardTitle className="text-2xl font-bold">CI/CD</CardTitle>
            <CardDescription className="text-md">
              Ensure every commit follows license policies by integrating
              License Auditor into your CI pipeline. Automatically scan
              dependencies during every build.
            </CardDescription>
            <img src="cloud_code.svg" alt="Cloud" className="mt-4" />
          </CardHeader>
        </Card>
      </div>
    </section>
  );
};
