// components/nav/DesktopNavBar.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import logo from "../../public/assets/logo.svg";

type NavItem = { label: string; href: string };

type DesktopNavBarProps = {
  navItems: NavItem[];
  subnavItems: NavItem[];
  activeMainHref: string;
  activeSubHref: string | null;
};

export default function DesktopNavBar({
  navItems,
  subnavItems,
  activeMainHref,
  activeSubHref,
}: DesktopNavBarProps) {
  return (
    <div className="hidden md:block">
      {/* Top bar */}
      <nav className="max-w-6xl mx-auto flex items-center justify-between px-4 sm:px-6 py-3 gap-4">
        {/* Left: logo */}
        <div className="flex items-center gap-3">
          <Image
            src={logo}
            alt="RecipeShare logo"
            width={56}
            height={56}
            className="object-contain"
          />
        </div>

        {/* Main nav */}
        <ul className="flex items-center gap-6 lg:gap-8 text-lg">
          {navItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={[
                  "px-4 py-1 rounded-full transition-colors duration-200",
                  activeMainHref === item.href
                    ? "bg-primary text-secondary-text"
                    : "text-primary-text hover:text-primary-text/70",
                ].join(" ")}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Right: user */}
        <div className="flex items-center gap-3">
          <span className="text-primary-text font-medium">Dominko123</span>
          <div className="w-10 h-10 rounded-full overflow-hidden border border-border">
            <Image
              src="https://avatars.dicebear.com/api/avataaars/dominko.svg"
              alt="User avatar"
              width={40}
              height={40}
              className="object-cover"
            />
          </div>
        </div>
      </nav>

      {/* Subnav (only if there are items) */}
      {subnavItems.length > 0 && (
        <div className="bg-navbar-bg">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-center gap-6 text-sm sm:text-base">
            {subnavItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={[
                  "px-3 py-1 rounded-full transition-colors duration-200",
                  activeSubHref === item.href
                    ? "bg-primary text-white"
                    : "text-primary-text hover:text-primary-text",
                ].join(" ")}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
