import { GitHubLogoIcon } from "@radix-ui/react-icons";
import { HeroTerminal } from "./terminals";
import { Button } from "./ui/button";
import { buttonVariants } from "./ui/button";

export const Hero = () => {
  return (
    <section className="container grid lg:grid-cols-[60%_40%] place-items-center py-20 md:py-32 gap-0 2xl:gap-10">
      <div className="text-center lg:text-start space-y-6">
        <main className="text-5xl md:text-6xl font-bold">
          <h1 className="inline text-6xl">
            <span className="inline bg-gradient-to-r from-[#49FFE6]  to-[#39C6B3] text-transparent bg-clip-text">
              Effortless
            </span>{" "}
            License Compliance for Your Project
          </h1>{" "}
        </main>

        <p className="text-xl text-muted-foreground md:w-10/12 mx-auto lg:mx-0">
          Audit, Verify, and Secure Dependencies with{" "}
          <span className="text-black dark:text-white font-bold">
            License Auditor
          </span>
        </p>

        <div className="space-y-4 md:space-y-0 md:space-x-4">
          <a href="#explanation">
            <Button className="w-full md:w-1/3">Discover More</Button>
          </a>

          <a
            rel="noreferrer noopener"
            href="https://github.com/brainhubeu/license-auditor/tree/master"
            target="_blank"
            className={`w-full md:w-1/3 ${buttonVariants({
              variant: "outline",
            })}`}
          >
            Explore Code
            <GitHubLogoIcon className="ml-2 w-5 h-5" />
          </a>
        </div>
      </div>
      <div className="relative w-full md:mt-6">
        <HeroTerminal />
        <div className="shadow" />
      </div>
    </section>
  );
};
