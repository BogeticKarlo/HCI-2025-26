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

  // Only top-level items (Home/Cook/Learn/Settings)
  const topLevelHrefs = useMemo(() => new Set(NAV_ITEMS.map((i) => i.href)), [NAV_ITEMS]);

  // Clear loader when route changes
  useEffect(() => {
    setLoadingHref(null);
  }, [pathname]);

  const getSectionRoot = (href: string) => {
    if (href === "/") return "/";
    const parts = href.split("/").filter(Boolean);
    return parts.length ? `/${parts[0]}` : "/";
  };

  // Active rules:
  // - subnav active only on exact match
  // - top-level active on section match (Cook for /cook/* etc.)
  // - Learn stays active on /learn/* AND /lesson/*
  const isActiveHref = (href: string) => {
    const isTopLevel = topLevelHrefs.has(href);

    if (!isTopLevel) return href === pathname;

    const root = getSectionRoot(href);

    if (root === "/") return pathname === "/";

    if (root === "/learn") {
      return pathname.startsWith("/learn") || pathname.startsWith("/lesson");
    }

    return pathname.startsWith(root);
  };

  // Add button-like styles + spinner overlay (CENTERED)
  useEffect(() => {
    const applyButtonStyles = () => {
      const navRoot = document.querySelector("[data-nav-root]") || document;
      const anchors = Array.from(navRoot.querySelectorAll("a")) as HTMLAnchorElement[];

      anchors.forEach((a) => {
        const href = a.getAttribute("href") || "";
        const isNavHref = href.startsWith("/") && allHrefs.includes(href);
        if (!isNavHref) return;

        const active = isActiveHref(href);

        // Base styles
        a.classList.add(
          "relative",
          "inline-flex",
          "items-center",
          "justify-center",
          "px-3",
          "py-2",
          "rounded-xl",
          "border",
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
          "overflow-hidden",
        );

        // Ensure label wrapper exists
        let labelWrap = a.querySelector("[data-nav-label]") as HTMLSpanElement | null;
        if (!labelWrap) {
          labelWrap = document.createElement("span");
          labelWrap.setAttribute("data-nav-label", "true");
          labelWrap.className = "relative z-10";

          const existingSpinner = a.querySelector("[data-nav-spinner-overlay]");
          const nodes = Array.from(a.childNodes);

          nodes.forEach((node) => {
            if (
              existingSpinner &&
              node instanceof HTMLElement &&
              node.hasAttribute("data-nav-spinner-overlay")
            ) {
              return;
            }
            labelWrap!.appendChild(node);
          });

          a.innerHTML = "";
          a.appendChild(labelWrap);
          if (existingSpinner) a.appendChild(existingSpinner);
        }

        // Ensure spinner overlay exists
        let overlay = a.querySelector("[data-nav-spinner-overlay]") as HTMLSpanElement | null;
        if (!overlay) {
          overlay = document.createElement("span");
          overlay.setAttribute("data-nav-spinner-overlay", "true");
          overlay.className =
            "hidden absolute inset-0 z-20 flex items-center justify-center bg-white/70";

          const spinner = document.createElement("span");
          spinner.setAttribute("data-nav-spinner", "true");
          spinner.className =
            "w-10 h-10 border-4 border-accent border-t-transparent rounded-full animate-spin";

          overlay.appendChild(spinner);
          a.appendChild(overlay);
        }

        // ---- ACTIVE vs INACTIVE (FIX: inactive should be WHITE, not tinted) ----
        // Clear conflicting classes first
        a.classList.remove(
          "bg-accent",
          "bg-white",
          "bg-white/60",
          "text-black",
          "text-primary-text",
          "border-accent",
          "border-gray-200",
          "font-semibold",
        );

        if (active) {
          a.classList.add("bg-accent", "border-accent", "text-black", "font-semibold");
        } else {
          // Make inactive solid white so non-active subnav (e.g. Cooking 101) stays white
          a.classList.add("bg-white", "border-gray-200", "text-primary-text");
        }

        // Loading overlay (centered)
        const isLoading = loadingHref === href;

        if (isLoading) {
          overlay.classList.remove("hidden");
          a.setAttribute("aria-busy", "true");
          labelWrap.classList.add("opacity-50");
        } else {
          overlay.classList.add("hidden");
          a.removeAttribute("aria-busy");
          labelWrap.classList.remove("opacity-50");
        }
      });
    };

    applyButtonStyles();
  }, [allHrefs, loadingHref, pathname, topLevelHrefs]);

  // Click capture: show spinner overlay + navigate
  const handleNavClickCapture = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement | null;
    if (!target) return;

    const anchor = target.closest("a") as HTMLAnchorElement | null;
    if (!anchor) return;

    const href = anchor.getAttribute("href") || "";
    const isNavHref = href.startsWith("/") && allHrefs.includes(href);

    if (!isNavHref) return;
    if (href === pathname) return;

    e.preventDefault();
    setLoadingHref(href);
    router.push(href);

    window.setTimeout(() => setLoadingHref(null), 1200);
  };

  return (
    <div className="relative" onClickCapture={handleNavClickCapture}>
      <Navigation items={NAV_ITEMS} />

      {error && (
        <span className="sr-only" aria-live="polite">
          {error}
        </span>
      )}
    </div>
  );
}