// components/nav/NavBar.tsx
"use client";

import { getLessonPages } from "@/fetch/cms";
import Navigation from "@/components/navbar/Navigation";
import { LessonPageType } from "@/types/cms";
import { useEffect, useState } from "react";

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
        const data = await getLessonPages();
        setLearnPages(data);
        setError(null);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Failed to load lesson pages";
        console.error("Error loading lesson pages:", errorMessage);
        setError(errorMessage);
        // Set default empty array so navigation doesn't break
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

  return <Navigation items={NAV_ITEMS} />;
}
