import { Statistics } from "./Statistics";

export const About = () => {
  return (
    <section id="about" className="container py-24 sm:py-32">
      <div className="bg-muted/50 border rounded-lg py-12">
        <div className="px-6 flex flex-col-reverse md:flex-row gap-8 md:gap-12">
          <div>
            <a
              href="https://brainhub.eu"
              className="w-[300px] h-full flex items-center justify-center"
            >
              <img src="/brainhub_logo.svg" alt="" />
            </a>
          </div>

          <div className="bg-green-0 flex flex-col justify-between">
            <div className="pb-6">
              <h2 className="text-3xl md:text-4xl font-bold">
                <span className="bg-gradient-to-b from-primary/60 to-primary text-transparent bg-clip-text">
                  About{" "}
                </span>
                Company
              </h2>
              <p className="text-xl text-muted-foreground mt-4">
                Since 2015, we’ve helped 80+ fast-growing companies in over 20
                different industries build web, mobile and desktop apps that
                make an impact.
              </p>
              <p className="text-xl text-muted-foreground mt-4">
                Our applicant-to-hire ratio for software engineers is 1.36%.
                Through years of iterations, we've developed a process that
                allows us to consistently find and retain top engineering
                talent.
              </p>
            </div>

            <Statistics />
          </div>
        </div>
      </div>
    </section>
  );
};
