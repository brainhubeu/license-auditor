import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useState } from "react";

import { GitHubLogoIcon } from "@radix-ui/react-icons";
import { Menu } from "lucide-react";
import { ModeToggle } from "./mode-toggle";
import { buttonVariants } from "./ui/button";

interface RouteProps {
  href: string;
  label: string;
}

const routeList: RouteProps[] = [
  {
    href: "#usage",
    label: "Usage",
  },
  {
    href: "#features",
    label: "Features",
  },
  {
    href: "#packageManagers",
    label: "Package Managers",
  },
];

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  return (
    <header className="sticky border-b-[1px] top-0 z-40 w-full bg-white dark:border-b-slate-700 dark:bg-background">
      <NavigationMenu className="mx-auto">
        <NavigationMenuList className="container h-14 px-4 w-screen flex justify-between ">
          <NavigationMenuItem className="font-bold flex">
            <a
              rel="noreferrer noopener"
              href="/"
              className="ml-2 font-bold text-xl flex text-black dark:text-white"
            >
              <svg
                width="48"
                height="auto"
                viewBox="0 0 129 57"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="mr-2"
                aria-label="License Auditor"
                role="img"
              >
                <rect
                  x="2"
                  y="2"
                  width="125"
                  height="53"
                  rx="13"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <mask
                  id="path-2-outside-1_12_15"
                  maskUnits="userSpaceOnUse"
                  x="16"
                  y="9.5"
                  width="99"
                  height="37"
                  fill="background"
                >
                  <rect
                    fill="background"
                    x="16"
                    y="9.5"
                    width="99"
                    height="37"
                  />
                  <path d="M17.4452 44.5V11.572H22.0052V40.516H38.3732V44.5H17.4452ZM44.1876 44.5L57.1956 11.572H63.1956L76.2516 44.5H71.3076L68.0916 36.34H52.0596L48.8916 44.5H44.1876ZM53.5476 32.452H66.5556L62.5716 22.132C62.4756 21.844 62.3316 21.444 62.1396 20.932C61.9476 20.42 61.7396 19.86 61.5156 19.252C61.2916 18.612 61.0676 17.972 60.8436 17.332C60.6196 16.66 60.4116 16.052 60.2196 15.508H59.9316C59.7076 16.148 59.4516 16.884 59.1636 17.716C58.8756 18.548 58.5876 19.364 58.2996 20.164C58.0116 20.932 57.7716 21.588 57.5796 22.132L53.5476 32.452ZM98.9529 45.076C95.5929 45.076 92.7449 44.468 90.4089 43.252C88.0729 42.004 86.2809 40.132 85.0329 37.636C83.8169 35.108 83.2089 31.908 83.2089 28.036C83.2089 22.308 84.6009 18.036 87.3849 15.22C90.1689 12.404 94.0409 10.996 99.0009 10.996C101.817 10.996 104.313 11.46 106.489 12.388C108.665 13.284 110.361 14.66 111.577 16.516C112.825 18.34 113.449 20.644 113.449 23.428H108.841C108.841 21.508 108.425 19.924 107.593 18.676C106.793 17.428 105.657 16.5 104.185 15.892C102.713 15.252 100.985 14.932 99.0009 14.932C96.6969 14.932 94.7129 15.38 93.0489 16.276C91.3849 17.172 90.1209 18.564 89.2569 20.452C88.3929 22.308 87.9609 24.708 87.9609 27.652V28.66C87.9609 31.572 88.3929 33.956 89.2569 35.812C90.1209 37.636 91.3689 38.98 93.0009 39.844C94.6649 40.708 96.6649 41.14 99.0009 41.14C101.049 41.14 102.809 40.836 104.281 40.228C105.785 39.62 106.937 38.692 107.737 37.444C108.569 36.164 108.985 34.564 108.985 32.644H113.449C113.449 35.492 112.809 37.828 111.529 39.652C110.281 41.476 108.569 42.836 106.393 43.732C104.217 44.628 101.737 45.076 98.9529 45.076Z" />
                </mask>
                <path
                  d="M17.4452 44.5V11.572H22.0052V40.516H38.3732V44.5H17.4452ZM44.1876 44.5L57.1956 11.572H63.1956L76.2516 44.5H71.3076L68.0916 36.34H52.0596L48.8916 44.5H44.1876ZM53.5476 32.452H66.5556L62.5716 22.132C62.4756 21.844 62.3316 21.444 62.1396 20.932C61.9476 20.42 61.7396 19.86 61.5156 19.252C61.2916 18.612 61.0676 17.972 60.8436 17.332C60.6196 16.66 60.4116 16.052 60.2196 15.508H59.9316C59.7076 16.148 59.4516 16.884 59.1636 17.716C58.8756 18.548 58.5876 19.364 58.2996 20.164C58.0116 20.932 57.7716 21.588 57.5796 22.132L53.5476 32.452ZM98.9529 45.076C95.5929 45.076 92.7449 44.468 90.4089 43.252C88.0729 42.004 86.2809 40.132 85.0329 37.636C83.8169 35.108 83.2089 31.908 83.2089 28.036C83.2089 22.308 84.6009 18.036 87.3849 15.22C90.1689 12.404 94.0409 10.996 99.0009 10.996C101.817 10.996 104.313 11.46 106.489 12.388C108.665 13.284 110.361 14.66 111.577 16.516C112.825 18.34 113.449 20.644 113.449 23.428H108.841C108.841 21.508 108.425 19.924 107.593 18.676C106.793 17.428 105.657 16.5 104.185 15.892C102.713 15.252 100.985 14.932 99.0009 14.932C96.6969 14.932 94.7129 15.38 93.0489 16.276C91.3849 17.172 90.1209 18.564 89.2569 20.452C88.3929 22.308 87.9609 24.708 87.9609 27.652V28.66C87.9609 31.572 88.3929 33.956 89.2569 35.812C90.1209 37.636 91.3689 38.98 93.0009 39.844C94.6649 40.708 96.6649 41.14 99.0009 41.14C101.049 41.14 102.809 40.836 104.281 40.228C105.785 39.62 106.937 38.692 107.737 37.444C108.569 36.164 108.985 34.564 108.985 32.644H113.449C113.449 35.492 112.809 37.828 111.529 39.652C110.281 41.476 108.569 42.836 106.393 43.732C104.217 44.628 101.737 45.076 98.9529 45.076Z"
                  fill="currentColor"
                  mask="url(#path-2-outside-1_12_15)"
                />
              </svg>
              License Auditor
            </a>
          </NavigationMenuItem>

          {/* mobile */}
          <span className="flex md:hidden">
            <ModeToggle />

            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger className="px-2">
                <Menu
                  className="flex md:hidden h-5 w-5"
                  onClick={() => setIsOpen(true)}
                >
                  <span className="sr-only">Menu Icon</span>
                </Menu>
              </SheetTrigger>

              <SheetContent side={"left"}>
                <SheetHeader>
                  <SheetTitle className="font-bold text-xl">
                    License Auditor
                  </SheetTitle>
                </SheetHeader>
                <nav className="flex flex-col justify-center items-center gap-2 mt-4">
                  {routeList.map(({ href, label }: RouteProps) => (
                    <a
                      rel="noreferrer noopener"
                      key={label}
                      href={href}
                      onClick={() => setIsOpen(false)}
                      className={buttonVariants({ variant: "ghost" })}
                    >
                      {label}
                    </a>
                  ))}
                  <a
                    rel="noreferrer noopener"
                    href="https://github.com/brainhubeu/license-auditor/tree/master"
                    target="_blank"
                    className={`w-[110px] border ${buttonVariants({
                      variant: "secondary",
                    })}`}
                  >
                    <GitHubLogoIcon className="mr-2 w-5 h-5" />
                    Github
                  </a>
                </nav>
              </SheetContent>
            </Sheet>
          </span>

          {/* desktop */}
          <nav className="hidden md:flex gap-2">
            {routeList.map((route: RouteProps) => (
              <a
                rel="noreferrer noopener"
                href={route.href}
                key={route.label}
                className={`text-[17px] ${buttonVariants({
                  variant: "ghost",
                })}`}
              >
                {route.label}
              </a>
            ))}
          </nav>

          <div className="hidden md:flex gap-2">
            <a
              rel="noreferrer noopener"
              href="https://github.com/brainhubeu/license-auditor/tree/master"
              target="_blank"
              className={`border ${buttonVariants({ variant: "secondary" })}`}
            >
              <GitHubLogoIcon className="mr-2 w-5 h-5" />
              Github
            </a>

            <ModeToggle />
          </div>
        </NavigationMenuList>
      </NavigationMenu>
    </header>
  );
};
