// components/nav/NavBar.tsx
"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import DesktopNavBar from "./DesktopNavBar";
import MobileNavBar from "./MobileNavBar";
import { useAuth } from "@/context/AuthContext";
import { Button } from "../button/Button";
import { CloseIcon } from "@/assets/CloseIcon";
import { CheckIcon } from "@/assets/CheckIcon";

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
  const [isModalOpen, setIsModalOpen] = useState(false);
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

  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isModalOpen]);

  const handleLogoutModal = () => {
    setIsModalOpen(true);
  };

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
        onLogout={handleLogoutModal}
      />

      <MobileNavBar
        navItems={NAV_ITEMS}
        activeMainHref={activeMainHref}
        activeSubHref={activeSubHref}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
        userName={user.email?.split("@")[0] || "User"}
        onLogout={handleLogoutModal}
      />

      {isModalOpen && (
        <div className="w-screen h-screen bg-black/60 top-0 left-0 fixed z-100 flex items-center justify-center">
          <div className="flex flex-col bg-section-bg border border-input-border rounded-2xl p-10 items-center justify-center gap-10">
            <h3 className="text-primary-text">
              Are you sure you want to exit?
            </h3>
            <div className="flex gap-10">
              <Button
                icon={<CheckIcon className="w-5 shrink-0" />}
                onClick={handleLogout}
              >
                Yes
              </Button>
              <Button
                icon={<CloseIcon className="w-5 shrink-0" />}
                variant="secondary"
                onClick={() => setIsModalOpen(false)}
              >
                No
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
