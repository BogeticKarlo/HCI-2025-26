// components/nav/NavBar.tsx
"use client";

import Navigation from "@/components/navbar/Navigation";
import { useEffect, useState } from "react";
import { LessonPageType } from "@/types/cms";

type SubNavItem = { label: string; href: string };

export type NavItem = {
  label: string;
  href: string;
  subnav?: SubNavItem[];
};

export default function NavBar() {
  const [learnPages, setLearnPages] = useState<LessonPageType[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        // Fetch from your Next.js server-side API, not the external CMS
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
      href: `/learn/${learnPages.length > 0 ? learnPages[0].slug : "cooking-101"}`,
      subnav: learnPages.map((page) => ({
        label: page.label,
        href: `/learn/${page.slug}`,
      })),
    },
    { label: "Settings", href: "/settings" },
  ];

  return <Navigation items={NAV_ITEMS} />;
}
