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

  // which nav link is “loading”
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

  const allHrefs = useMemo(() => {
    const hrefs: string[] = [];
    for (const item of NAV_ITEMS) {
      hrefs.push(item.href);
      item.subnav?.forEach((s) => hrefs.push(s.href));
    }
    return hrefs;
  }, [NAV_ITEMS]);

  // Clear loader when route changes
  useEffect(() => {
    setLoadingHref(null);
  }, [pathname]);

  // 1) Add “button-like” styles to nav links (border + padding)
  // 2) If the link is the one being navigated to, show a spinner INSIDE it
  useEffect(() => {
    // Run after Navigation renders
    const applyButtonStyles = () => {
      const navRoot = document.querySelector("[data-nav-root]") || document;
      const anchors = Array.from(navRoot.querySelectorAll("a")) as HTMLAnchorElement[];

      anchors.forEach((a) => {
        const href = a.getAttribute("href") || "";
        const isNavHref = href.startsWith("/") && allHrefs.includes(href);

        if (!isNavHref) return;

        // Button-like base styles (Tailwind classes)
        a.classList.add(
          "relative",
          "inline-flex",
          "items-center",
          "justify-center",
          "gap-2",
          "px-3",
          "py-2",
          "rounded-xl",
          "border",
          "border-gray-200",
          "bg-white/60",
          "shadow-sm",
          "transition-all",
          "duration-200",
          "cursor-pointer",
          "hover:shadow-md",
          "hover:-translate-y-[1px]",
          "active:scale-[0.98]",
          "focus-visible:outline-none",
          "focus-visible:ring-2",
          "focus-visible:ring-accent",
          "focus-visible:ring-offset-2",
        );


        // Ensure we have a spinner element inside
        let spinner = a.querySelector("[data-nav-spinner]") as HTMLSpanElement | null;
        if (!spinner) {
          spinner = document.createElement("span");
          spinner.setAttribute("data-nav-spinner", "true");
          spinner.className =
            "hidden w-4 h-4 border-4 border-accent border-t-transparent rounded-full animate-spin";
          a.appendChild(spinner);
        }

        // Toggle spinner visibility + soften text while loading
        const isLoading = loadingHref === href;
        if (isLoading) {
          spinner.classList.remove("hidden");
          a.classList.add("opacity-80");
          a.setAttribute("aria-busy", "true");
        } else {
          spinner.classList.add("hidden");
          a.classList.remove("opacity-80");
          a.removeAttribute("aria-busy");
        }
      });
    };

    applyButtonStyles();
  }, [allHrefs, loadingHref, pathname]);

  // Capture clicks and route with spinner-in-button feedback
  const handleNavClickCapture = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement | null;
    if (!target) return;

    const anchor = target.closest("a") as HTMLAnchorElement | null;
    if (!anchor) return;

    const href = anchor.getAttribute("href") || "";
    const isInternal = href.startsWith("/");
    const isNavHref = isInternal && allHrefs.includes(href);

    if (!isNavHref) return;
    if (href === pathname) return;

    // prevent default so we can set loading state first
    e.preventDefault();
    setLoadingHref(href);
    router.push(href);

    // Safety clear
    window.setTimeout(() => setLoadingHref(null), 1200);
  };

  return (
    <div className="relative" onClickCapture={handleNavClickCapture}>
      {/* If you can, add data-nav-root on the root element inside Navigation.
          If not, this still works using document-level query. */}
      <Navigation items={NAV_ITEMS} />

      {/* Keep error accessible without extra UI */}
      {error && (
        <span className="sr-only" aria-live="polite">
          {error}
        </span>
      )}
    </div>
  );
}