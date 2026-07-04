"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const DISCOVER_ROUTE = "/";
const CREATE_ROUTE = "/recipes/new";

export function BottomNav({
  labels,
}: {
  labels: { nav: string; discover: string; create: string; mine: string };
}) {
  const pathname = usePathname();
  const isDiscoverActive = pathname === DISCOVER_ROUTE;
  const isCreateActive = pathname === CREATE_ROUTE;

  return (
    <nav
      className="dock dock-md border-t border-base-300 bg-base-100/95 backdrop-blur"
      aria-label={labels.nav}
    >
      <Link
        href={DISCOVER_ROUTE}
        aria-label={labels.discover}
        aria-current={isDiscoverActive ? "page" : undefined}
        className={cn(isDiscoverActive && "dock-active")}
      >
        <span aria-hidden="true">⌂</span>
        <span className="dock-label">{labels.discover}</span>
      </Link>
      <Link
        href={CREATE_ROUTE}
        aria-label={labels.create}
        aria-current={isCreateActive ? "page" : undefined}
        className={cn("focus-visible:outline-2 focus-visible:outline-primary", isCreateActive && "dock-active")}
      >
        <span aria-hidden="true">＋</span>
        <span className="dock-label">{labels.create}</span>
      </Link>
      <button type="button" disabled aria-label={labels.mine}>
        <span aria-hidden="true">☰</span>
        <span className="dock-label">{labels.mine}</span>
      </button>
    </nav>
  );
}