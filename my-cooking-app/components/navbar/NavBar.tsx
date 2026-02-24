// components/nav/NavBar.tsx
"use client";

import Navigation from "@/components/navbar/Navigation";
import { useEffect, useMemo, useState } from "react";
import { LessonPageType } from "@/types/cms";
import { usePathname, useRouter } from "next/navigation";

type SubNavItem = { label: string; href: string };

export type NavItem = {
  label: string;
  href: string;
  subnav?: SubNavItem[];
};

export default function NavBar() {
  const router = useRouter();
  const pathname = usePathname();

  const [learnPages, setLearnPages] = useState<LessonPageType[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Spinner overlay state (same pattern as recipe/lesson cards)
  const [loadingHref, setLoadingHref] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/lesson-page`);
        if (!res.ok) throw new Error(`Failed to fetch: ${res.status}`);
        const data: LessonPageType[] = await res.json();
        setLearnPages(data);
        setError(null);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to load lesson pages";
        console.error("Error loading lesson pages:", errorMessage);
        setError(errorMessage);
        setLearnPages([]);
      }
    }
    load();
  }, []);

  const NAV_ITEMS: NavItem[] = useMemo(
    () => [
      { label: "Home", href: "/" },
      {
        label: "Cook",
        href: "/cook/upload-recipes",
        subnav: [
          { label: "Upload Recipe", href: "/cook/upload-recipes" },
          { label: "My Recipes", href: "/cook/my-recipes" },
        ],
      },
      {
        label: "Learn",
        href: `/learn/${learnPages.length > 0 ? learnPages[0].slug : "cooking-101"}`,
        subnav: learnPages.map((page) => ({
          label: page.label,
          href: `/learn/${page.slug}`,
        })),
      },
      { label: "Settings", href: "/settings" },
    ],
    [learnPages],
  );

  // Flatten all nav/subnav hrefs for quick lookup
  const allHrefs = useMemo(() => {
    const hrefs: string[] = [];
    for (const item of NAV_ITEMS) {
      hrefs.push(item.href);
      item.subnav?.forEach((s) => hrefs.push(s.href));
    }
    return hrefs;
  }, [NAV_ITEMS]);

  // Clear loader when route actually changes
  useEffect(() => {
    setLoadingHref(null);
  }, [pathname]);

  // Capture clicks anywhere inside Navigation, and if it’s a nav link → show spinner + route
  const handleNavClickCapture = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement | null;
    if (!target) return;

    const anchor = target.closest("a") as HTMLAnchorElement | null;
    if (!anchor) return;

    const hrefAttr = anchor.getAttribute("href");
    if (!hrefAttr) return;

    // Only handle internal links that are part of our nav
    const isInternal = hrefAttr.startsWith("/");
    const isNavHref = allHrefs.includes(hrefAttr);

    if (!isInternal || !isNavHref) return;

    // If already on that page, do nothing (prevents pointless loader)
    if (hrefAttr === pathname) return;

    // Replace default navigation so we can show consistent feedback
    e.preventDefault();
    setLoadingHref(hrefAttr);
    router.push(hrefAttr);

    // Safety: if navigation is very fast or component doesn't unmount, clear shortly
    window.setTimeout(() => setLoadingHref(null), 1200);
  };

  return (
    <div className="relative" onClickCapture={handleNavClickCapture}>
      <Navigation items={NAV_ITEMS} />

      {/* Optional: you can surface error somewhere if you want, but keeping structure unchanged */}
      {error && (
        <span className="sr-only" aria-live="polite">
          {error}
        </span>
      )}

      {/* Spinner overlay (same visual as recipe card overlay) */}
      {loadingHref && (
        <div className="fixed inset-0 z-[9999] flex items-start justify-center pointer-events-none">
          <div className="mt-4 rounded-full bg-white/70 px-4 py-2 shadow-md flex items-center gap-3">
            <div className="w-5 h-5 border-4 border-accent border-t-transparent rounded-full animate-spin" />
            <span className="text-sm font-medium text-primary-text">
              Opening…
            </span>
          </div>
        </div>
      )}
    </div>
  );
}