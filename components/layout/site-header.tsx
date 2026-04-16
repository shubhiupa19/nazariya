import Link from "next/link";

import { navigationItems } from "@/lib/site";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 px-4 py-4 md:px-6">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 rounded-[2rem] border border-border/70 bg-background/85 px-5 py-3 backdrop-blur-xl md:flex-nowrap">
        <Link href="/" className="flex items-center gap-3">
          <span className="font-serif text-2xl italic tracking-[-0.03em]">
            Nazariya
          </span>
          <span className="hidden text-xs uppercase tracking-[0.24em] text-muted-foreground sm:inline-block">
            Perspective tool
          </span>
        </Link>
        <nav
          aria-label="Primary"
          className="flex w-full items-center gap-5 overflow-x-auto text-sm text-muted-foreground sm:w-auto"
        >
          {navigationItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="whitespace-nowrap rounded-full px-1 py-1 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
