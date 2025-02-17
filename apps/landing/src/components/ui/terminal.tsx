import type { PropsWithChildren } from "react";

export const TermButtons = () => {
  return (
    <div className="flex flex-row gap-1 py-4 px-4 border-b dark:border-zinc-800 border-zinc-200">
      <div className="h-3 w-3 rounded-full bg-[#40FFE6]" />
      <div className="h-3 w-3 rounded-full bg-[#39C6B3]" />
      <div className="h-3 w-3 rounded-full bg-transparent border-2" />
    </div>
  );
};

export const Terminal = ({ children }: PropsWithChildren) => {
  return (
    <div className="bg-background rounded-md">
      <TermButtons />
      <pre className="p-4 overflow-y-auto">{children}</pre>
    </div>
  );
};
