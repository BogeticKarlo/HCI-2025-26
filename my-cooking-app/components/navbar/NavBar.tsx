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

  useEffect(() => {
    async function load() {
      const data = await getLessonPages();
      setLearnPages(data);
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
