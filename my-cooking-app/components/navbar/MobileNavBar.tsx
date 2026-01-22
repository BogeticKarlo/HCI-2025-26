// components/nav/MobileNavBar.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import logo from "../../public/assets/logo.svg";
import { LogoutIcon } from "@/assets/LogoutIcon";

type NavItem = { label: string; href: string };

type MobileNavBarProps = {
  navItems: NavItem[];
  subnavItems: NavItem[];
  activeMainHref: string;
  activeSubHref: string | null;
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
  userName: string;
  onLogout: () => void;
};

export default function MobileNavBar({
  navItems,
  subnavItems,
  activeMainHref,
  activeSubHref,
  mobileOpen,
  setMobileOpen,
  userName,
  onLogout,
}: MobileNavBarProps) {
  return (
    <div className="md:hidden">
      {/* Top bar */}
      <nav className="max-w-6xl mx-auto flex items-center justify-between px-4 py-3 gap-4">
        {/* Left: logo + brand */}
        <div className="flex items-center gap-3">
          <Image
            src={logo}
            alt="RecipeShare logo"
            width={48}
            height={48}
            className="object-contain"
          />
        </div>

        {/* Right: user + hamburger */}
        <div className="flex items-center gap-3">
          <span className="text-primary-text font-medium">{userName}</span>

          {/* Animated hamburger */}
          <button
            type="button"
            className="inline-flex items-center justify-center w-9 h-9 rounded-md border border-border text-primary-text hover:text-primary-text hover:border-primary transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle navigation menu"
          >
            <span className="relative flex flex-col gap-1 items-end w-6">
              {/* Top line */}
              <span
                className={[
                  "h-[3px] rounded-full bg-primary-text transition-all duration-200 ease-out",
                  mobileOpen ? "w-6" : "w-5",
                ].join(" ")}
              />

              {/* Middle line */}
              <span
                className={[
                  "h-[3px] rounded-full bg-primary-text transition-all duration-200 ease-out",
                  mobileOpen ? "w-4" : "w-3",
                ].join(" ")}
              />

              {/* Bottom line */}
              <span
                className={[
                  "h-[3px] rounded-full bg-primary-text transition-all duration-200 ease-out",
                  mobileOpen ? "w-6" : "w-5",
                ].join(" ")}
              />
            </span>
          </button>

          <div
            onClick={onLogout}
            className="w-10 h-10 rounded-full overflow-hidden border border-border duration-200 transition-colors ease-in-out hover:bg-main-bg/90"
          >
            <LogoutIcon className="w-6 h-6 text-primary-text m-2 cursor-pointer" />
          </div>
        </div>
      </nav>

      {/* Dropdown panel */}
      {mobileOpen && (
        <div className="bg-navbar-bg border-t border-border">
          <div className="max-w-6xl mx-auto px-4 py-3 space-y-4">
            {/* Main nav */}
            <ul className="flex flex-col gap-2">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={[
                      "block w-full text-left px-3 py-2 rounded-md text-base",
                      activeMainHref === item.href
                        ? "bg-primary text-white"
                        : "text-primary-text hover:text-primary-text",
                    ].join(" ")}
                    onClick={() => setMobileOpen(false)}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Subnav (if any) */}
            {subnavItems.length > 0 && (
              <div className="border-t border-border pt-3">
                <p className="text-xs uppercase tracking-wide text-text-muted mb-2">
                  Section options
                </p>
                <ul className="flex flex-col gap-2">
                  {subnavItems.map((item) => (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className={[
                          "block w-full text-left px-3 py-2 rounded-md text-sm",
                          activeSubHref === item.href
                            ? "bg-primary text-white"
                            : "text-primary-text hover:text-primary-text",
                        ].join(" ")}
                        onClick={() => setMobileOpen(false)}
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
