"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import DesktopNavBar from "./DesktopNavBar";
import MobileNavBar from "./MobileNavBar";
import { useAuth } from "@/context/AuthContext";
import Modal from "../modal/Modal";
import { type NavItem } from "./NavBar";

export default function Navigation({ items: NAV_ITEMS }: { items: NavItem[] }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user, signOut } = useAuth();
  const router = useRouter();

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

  if (!user) return null;

  const isRecipePage = pathname?.startsWith("/recipes/");

  const activeMainHref = (() => {
    if (isRecipePage) return null;

    for (const item of NAV_ITEMS) {
      if (!item.subnav) continue;

      const subMatch = item.subnav.find(
        (sub) => pathname === sub.href || pathname?.startsWith(sub.href + "/"),
      );

      if (subMatch) return item.href;
    }

    const mainMatch = NAV_ITEMS.find(
      (item) => pathname === item.href || pathname?.startsWith(item.href + "/"),
    );

    return mainMatch?.href ?? null;
  })();

  const activeSubHref = (() => {
    if (isRecipePage) return null;

    const activeMain = NAV_ITEMS.find((item) => item.href === activeMainHref);

    if (!activeMain?.subnav) return null;

    const found = activeMain.subnav.find(
      (item) => pathname === item.href || pathname.startsWith(item.href + "/"),
    );

    return found?.href ?? null;
  })();

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
        <Modal
          title="Are you sure you want to exit?"
          handleAction={handleLogout}
          setIsModalOpen={setIsModalOpen}
        />
      )}
    </header>
  );
}
