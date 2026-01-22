// components/nav/NavBar.tsx
"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import DesktopNavBar from "./DesktopNavBar";
import MobileNavBar from "./MobileNavBar";
import { useAuth } from "@/context/AuthContext";

// Main nav items – keep these as your *entry pages*
export const NAV_ITEMS = [
  { label: "Home", href: "/" },
  { label: "Cook", href: "/cook/smart-filters" },
  { label: "Learn", href: "/learn/cooking-101" },
  { label: "Connect", href: "/connect/community-feed" },
  { label: "Settings", href: "/settings" },
];

// Subnav per section – keys are the *section roots*
export const SUBNAV_ITEMS: Record<string, { label: string; href: string }[]> = {
  "/cook": [
    { label: "Smart Filters", href: "/cook/smart-filters" },
    { label: "Upload Recipe", href: "/cook/upload-recipes" },
    { label: "My Recipes", href: "/cook/my-recipes" },
    { label: "Saved Recipes", href: "/cook/saved-recipes" },
  ],
  "/connect": [
    { label: "Community Feed", href: "/connect/community-feed" },
    { label: "Your Story", href: "/connect/your-story" },
  ],
  "/learn": [
    { label: "Cooking 101", href: "/learn/cooking-101" },
    { label: "Culinary Techniques", href: "/learn/culinary-techniques" },
    { label: "Cuisine Explorer", href: "/learn/cuisine-explorer" },
  ],
};

export default function NavBar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, signOut } = useAuth();
  const router = useRouter();

  if (!user) return null;

  // 1) Determine which section we're in based on SUBNAV_ITEMS keys ("/cook", "/learn", ...)
  const sectionKeys = Object.keys(SUBNAV_ITEMS);

  const currentSection =
    sectionKeys.find((section) => {
      if (pathname === section) return true;
      return pathname.startsWith(section + "/");
    }) ?? null;

  // 2) Which main nav item is active?
  const activeMainHref = (() => {
    if (pathname === "/") return "/";

    if (currentSection) {
      // Find the NAV item whose href belongs to this section
      const navForSection = NAV_ITEMS.find(
        (item) =>
          item.href === currentSection ||
          item.href.startsWith(currentSection + "/")
      );
      return navForSection?.href ?? "/";
    }

    // Fallback: match directly by pathname
    const found = NAV_ITEMS.find(
      (item) => pathname === item.href || pathname.startsWith(item.href + "/")
    );
    return found?.href ?? "/";
  })();

  // 3) Subnav items for this section
  const currentSubnav = currentSection
    ? SUBNAV_ITEMS[currentSection] ?? []
    : [];

  // 4) Which subnav item is active?
  const activeSubHref = (() => {
    if (!currentSection || currentSubnav.length === 0) return null;

    // If we are exactly on the section root (e.g. "/cook"), don't highlight any subnav item
    if (pathname === currentSection) return null;

    const found = currentSubnav.find(
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
        subnavItems={currentSubnav}
        activeMainHref={activeMainHref}
        activeSubHref={activeSubHref}
        userName={user.email?.split("@")[0] || "User"}
        onLogout={handleLogout}
      />

      {/* Mobile */}
      <MobileNavBar
        navItems={NAV_ITEMS}
        subnavItems={currentSubnav}
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
