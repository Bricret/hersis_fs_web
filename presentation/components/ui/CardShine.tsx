import { cn } from "@/infraestructure/lib/utils";

export function CardBackgroundShine({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "w-full max-w-[350px] shine items-center justify-center rounded-xl border",
        "bg-quaternary-background-color bg-[length:400%_100%] border-zinc-200 shadow-sm",
        "px-4 py-5 text-sm transition-colors"
      )}
    >
      {children}
    </div>
  );
}
