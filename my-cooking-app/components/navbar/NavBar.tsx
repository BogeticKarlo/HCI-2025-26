// components/nav/NavBar.tsx
"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import DesktopNavBar from "./DesktopNavBar";
import MobileNavBar from "./MobileNavBar";
import { useAuth } from "@/context/AuthContext";

type SubNavItem = { label: string; href: string };

type NavItem = {
  label: string;
  href: string;
  subnav?: SubNavItem[];
};

export const NAV_ITEMS: NavItem[] = [
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
    href: "/learn/cooking-101",
    subnav: [
      { label: "Cooking 101", href: "/learn/cooking-101" },
      { label: "Culinary Techniques", href: "/learn/culinary-techniques" },
      { label: "Cuisine Explorer", href: "/learn/cuisine-explorer" },
    ],
  },

  { label: "Settings", href: "/settings" },
];

export default function NavBar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, signOut } = useAuth();
  const router = useRouter();

  if (!user) return null;

  const isRecipePage = pathname.startsWith("/recipes/");

  const activeMainHref = (() => {
    if (isRecipePage) return null;

    for (const item of NAV_ITEMS) {
      if (!item.subnav) continue;

      const subMatch = item.subnav.find(
        (sub) => pathname === sub.href || pathname.startsWith(sub.href + "/")
      );

      if (subMatch) return item.href;
    }

    const mainMatch = NAV_ITEMS.find(
      (item) => pathname === item.href || pathname.startsWith(item.href + "/")
    );

    return mainMatch?.href ?? null;
  })();

  const activeSubHref = (() => {
    if (isRecipePage) return null;

    const activeMain = NAV_ITEMS.find((item) => item.href === activeMainHref);

    if (!activeMain?.subnav) return null;

    const found = activeMain.subnav.find(
      (item) => pathname === item.href || pathname.startsWith(item.href + "/")
    );

    return found?.href ?? null;
  })();

  const handleLogout = async () => {
    try {
      await signOut();
      router.push("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <header className="bg-navbar-bg text-secondary-text shadow-sm font-playfair">
      {/* Desktop */}
      <DesktopNavBar
        navItems={NAV_ITEMS}
        activeMainHref={activeMainHref}
        activeSubHref={activeSubHref}
        userName={user.email?.split("@")[0] || "User"}
        onLogout={handleLogout}
      />

      <MobileNavBar
        navItems={NAV_ITEMS}
        activeMainHref={activeMainHref}
        activeSubHref={activeSubHref}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
        userName={user.email?.split("@")[0] || "User"}
        onLogout={handleLogout}
      />
    </header>
  );
}
