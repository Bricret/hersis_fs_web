import { cn } from "@/infraestructure/lib/utils";
import { ReactNode } from "react";

interface CardBackgroundShineProps {
  className?: string;
  children?: ReactNode;
}

export function CardGradient({
  className,
  children,
}: CardBackgroundShineProps) {
  return (
    <div
      className={cn(
        "w-full max-w-[350px] shine items-center justify-center rounded-xl border relative overflow-hidden",
        "border-gray-200 bg-white bg-[length:400%_100%]",
        "px-4 text-sm transition-colors shadow-inner py-6",
        "before:absolute before:inset-0 before:bg-[radial-gradient(circle_at_top_right,rgba(120,119,198,0.15),transparent_50%)]",
        "dark:bg-gray-950 dark:border-white/10 shadow-sm ",
        className
      )}
    >
      {children}
    </div>
  );
}
