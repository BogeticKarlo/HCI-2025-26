// components/footer/Footer.tsx
"use client";

import Link from "next/link";

export default function Footer() {
  const scrollToTop = () => {
    if (typeof window === "undefined") return;
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDisabledClick = (e: React.MouseEvent) => {
    e.preventDefault();
  };

  const linkClass =
    "group inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-sm text-footer-text transition-all duration-200 hover:bg-white/10 hover:border-white/25 hover:-translate-y-[1px] active:translate-y-0 active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-footer-bg opacity-80 cursor-not-allowed";

  const sectionTitle =
    "text-lg font-semibold text-footer-text flex items-center justify-center gap-2";

  const helperText =
    "text-xs text-footer-text/70 text-center mb-6";

  return (
    <footer className="bg-footer-bg text-footer-text py-10 px-6 mt-10">
      <div className="max-w-6xl mx-auto">
        {/* Header row: purpose + Back to top */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-4">
          <div className="text-center sm:text-left">
            <p className="text-sm font-semibold text-footer-text">
              RecipeShare
            </p>
          </div>

          <button
            type="button"
            onClick={scrollToTop}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-sm text-footer-text transition-all duration-200 hover:bg-white/10 hover:border-white/25 hover:-translate-y-[1px] active:translate-y-0 active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-footer-bg"
            aria-label="Back to top"
            title="Back to top"
          >
            <span aria-hidden>↑</span>
            Back to top
          </button>
        </div>

        {/* Knowledge in the world (Norman): explain why links don’t navigate */}
        <p className={helperText}>
          Policy and legal pages are informational placeholders and will be
          available in a future update.
        </p>

        {/* Top Section (Centered Columns) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 text-center">
          {/* Privacy Policy */}
          <div className="flex flex-col items-center gap-4">
            <h3 className={sectionTitle}>
              <span aria-hidden>🔒</span> Privacy Policy
            </h3>

            <ul className="space-y-3 w-full">
              <li>
                <Link
                  href="#"
                  onClick={handleDisabledClick}
                  aria-disabled="true"
                  title="Coming soon – page not available yet"
                  className={linkClass}
                >
                  <span aria-hidden>📄</span>
                  Information We Collect
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  onClick={handleDisabledClick}
                  aria-disabled="true"
                  title="Coming soon – page not available yet"
                  className={linkClass}
                >
                  <span aria-hidden>🧠</span>
                  How We Use Your Information
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  onClick={handleDisabledClick}
                  aria-disabled="true"
                  title="Coming soon – page not available yet"
                  className={linkClass}
                >
                  <span aria-hidden>🍪</span>
                  Cookies & Tracking
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  onClick={handleDisabledClick}
                  aria-disabled="true"
                  title="Coming soon – page not available yet"
                  className={linkClass}
                >
                  <span aria-hidden>🛡️</span>
                  Data Storage & Security
                </Link>
              </li>
            </ul>
          </div>

          {/* Terms and Conditions */}
          <div className="flex flex-col items-center gap-4">
            <h3 className={sectionTitle}>
              <span aria-hidden>📜</span> Terms & Conditions
            </h3>

            <ul className="space-y-3 w-full">
              <li>
                <Link
                  href="#"
                  onClick={handleDisabledClick}
                  aria-disabled="true"
                  title="Coming soon – page not available yet"
                  className={linkClass}
                >
                  <span aria-hidden>✅</span>
                  Acceptance of Terms
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  onClick={handleDisabledClick}
                  aria-disabled="true"
                  title="Coming soon – page not available yet"
                  className={linkClass}
                >
                  <span aria-hidden>👤</span>
                  User Responsibilities
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  onClick={handleDisabledClick}
                  aria-disabled="true"
                  title="Coming soon – page not available yet"
                  className={linkClass}
                >
                  <span aria-hidden>🔑</span>
                  Accounts & Security
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  onClick={handleDisabledClick}
                  aria-disabled="true"
                  title="Coming soon – page not available yet"
                  className={linkClass}
                >
                  <span aria-hidden>💳</span>
                  Payment
                </Link>
              </li>
            </ul>
          </div>

          {/* Social Media */}
          <div className="flex flex-col items-center gap-4">
            <h3 className={sectionTitle}>
              <span aria-hidden>🌐</span> Social Media
            </h3>

            <ul className="space-y-3 w-full">
              <li>
                <a
                  href="#"
                  onClick={handleDisabledClick}
                  aria-disabled="true"
                  title="Coming soon – social links not connected yet"
                  className={linkClass}
                >
                  <span aria-hidden>📷</span>
                  Instagram
                </a>
              </li>
              <li>
                <a
                  href="#"
                  onClick={handleDisabledClick}
                  aria-disabled="true"
                  title="Coming soon – social links not connected yet"
                  className={linkClass}
                >
                  <span aria-hidden>📘</span>
                  Facebook
                </a>
              </li>
              <li>
                <a
                  href="#"
                  onClick={handleDisabledClick}
                  aria-disabled="true"
                  title="Coming soon – social links not connected yet"
                  className={linkClass}
                >
                  <span aria-hidden>✖️</span>
                  X
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider + Bottom Text */}
        <div className="border-t border-white/15 mt-10 pt-4 text-center text-sm text-footer-text/80">
          © 2025 RecipeShare. All rights reserved.
        </div>
      </div>
    </footer>
  );
}