// components/nav/NavBar.tsx
"use client";

import Navigation from "@/components/navbar/Navigation";
import { useEffect, useState } from "react";
import { LessonPageType } from "@/types/cms";
import { usePathname } from "next/navigation";

type SubNavItem = { label: string; href: string };

export type NavItem = {
  label: string;
  href: string;
  subnav?: SubNavItem[];
};

export default function NavBar() {
  const [learnPages, setLearnPages] = useState<LessonPageType[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loadingHref, setLoadingHref] = useState<string | null>(null);
  const pathname = usePathname();

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

  const NAV_ITEMS: NavItem[] = [
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
      href: `/learn/${
        learnPages.length > 0 ? learnPages[0].slug : "cooking-101"
      }`,
      subnav: learnPages.map((page) => ({
        label: page.label,
        href: `/learn/${page.slug}`,
      })),
    },
    { label: "Settings", href: "/settings" },
  ];

  /* ---------------- BUTTON SIGNIFIERS + FEEDBACK (Norman) ---------------- */
  useEffect(() => {
    const applyButtonStyles = () => {
      const links = document.querySelectorAll(
        'a[href]:not([data-processed="true"])',
      );

      links.forEach((link) => {
        const a = link as HTMLAnchorElement;
        const href = a.getAttribute("href");
        if (!href) return;

        const text = a.textContent?.trim();
        const navLabels = ["Home", "Cook", "Learn", "Settings"];

        if (!text || !navLabels.includes(text)) return;

        a.setAttribute("data-processed", "true");

        // Base button look (strong signifier: clickable button)
        a.classList.add(
          "relative",
          "flex",
          "flex-col",
          "items-center",
          "justify-center",
          "px-4",
          "py-2",
          "rounded-xl",
          "border",
          "border-gray-300",
          "bg-white/70",
          "text-primary-text",
          "font-medium",
          "cursor-pointer",
          "transition-all",
          "duration-200",
          "hover:shadow-md",
          "hover:-translate-y-[1px]",
          "active:scale-95",
          "focus:outline-none",
          "focus-visible:ring-2",
          "focus-visible:ring-accent",
          "focus-visible:ring-offset-2",
          "overflow-hidden",
          "min-w-[90px]",
        );

        // ACTIVE PAGE = ORANGE BACKGROUND (strong visual weight)
        if (href === pathname) {
          a.classList.add(
            "border-accent",
            "bg-accent",
            "text-black",
            "font-semibold",
            "shadow-md",
          );
        }

        // Wrap label for spinner overlay positioning
        if (!a.querySelector(".nav-label")) {
          const span = document.createElement("span");
          span.className = "nav-label relative z-10";
          span.textContent = a.textContent || "";
          a.textContent = "";
          a.appendChild(span);
        }

        // Click feedback: spinner ABOVE label (like recipe & lesson cards)
        a.addEventListener("click", () => {
          setLoadingHref(href);

          // Remove old spinner if exists
          const existing = a.querySelector(".nav-spinner");
          if (existing) existing.remove();

          const spinnerWrapper = document.createElement("div");
          spinnerWrapper.className =
            "nav-spinner absolute inset-0 flex flex-col items-center justify-center bg-white/70 rounded-xl z-20";

          const spinner = document.createElement("div");
          spinner.className =
            "w-6 h-6 border-4 border-accent border-t-transparent rounded-full animate-spin";

          spinnerWrapper.appendChild(spinner);
          a.appendChild(spinnerWrapper);
        });
      });
    };

    // Delay to ensure Navigation has rendered
    const timeout = setTimeout(applyButtonStyles, 50);
    return () => clearTimeout(timeout);
  }, [learnPages, pathname]);

  return <Navigation items={NAV_ITEMS} />;
}