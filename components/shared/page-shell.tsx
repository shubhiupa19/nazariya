import { cn } from "@/lib/utils";

export function PageShell({
  className,
  children
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("px-4 md:px-6", className)}>
      <div className="mx-auto flex max-w-6xl flex-col">{children}</div>
    </div>
  );
}
