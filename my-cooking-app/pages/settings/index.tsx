"use client";

import { ToggleButton } from "@/components/toggleButton/ToggleButton";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";

export default function Settings() {
  const { theme, setTheme } = useTheme();
  const { user } = useAuth();

  const [mounted, setMounted] = useState(false);
  const [isNotificationsEnabled, setIsNotificationsEnabled] = useState(true);

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const isDarkMode = theme === "dark";

  return (
    <div className="flex flex-col items-center">
      {/* PAGE TITLE */}
      <h1
        className="
          font-playfair font-bold 
          text-[32px] leading-[120%] 
          md:text-[40px] 
          text-center mb-4 text-primary-text
        "
      >
        Account Management
      </h1>

      {/* ================= ACCOUNT SETTINGS ================= */}
      <div className="max-w-xl w-full rounded-2xl bg-section-bg shadow-sm px-6 py-4 mb-8">
        <h2 className="text-[26px] font-semibold font-playfair text-primary-text mb-4">
          Account Settings
        </h2>

        {/* Username */}
        <div className="flex items-center justify-between gap-4 py-3">
          <div className="w-[80%]">
            <h3 className="text-[22px] font-semibold font-playfair text-primary-text">
              Username
            </h3>
            <p className="text-[16px] text-body-text">
              Your public display name on recipes and comments
            </p>
          </div>
        </div>

        <div className="border-t border-body-text my-1" />

        {/* Email */}
        <div className="flex items-center justify-between gap-4 py-3">
          <div className="w-[80%]">
            <h3 className="text-[22px] font-semibold font-playfair text-primary-text">
              Email Address
            </h3>
            <p className="text-[16px] text-body-text">
              Used for login and important account notifications
            </p>
          </div>

          <div className="w-[20%] text-right">
            <span className="text-[16px] font-medium text-primary-text break-all">
              {user?.email || "Not available"}
            </span>
          </div>
        </div>

        <div className="border-t border-body-text my-1" />

        {/* Account Status (UX feedback / trust) */}
        <div className="flex items-center justify-between gap-4 py-3">
          <div className="w-[80%]">
            <h3 className="text-[22px] font-semibold font-playfair text-primary-text">
              Account Status
            </h3>
            <p className="text-[16px] text-body-text">
              Shows whether your account is active
            </p>
          </div>

          <div className="w-[20%] text-right">
            <span className="text-[16px] font-semibold text-green-600">
              Active
            </span>
          </div>
        </div>
      </div>

      {/* ================= PREFERENCES TITLE ================= */}
      <h1
        className="
          font-playfair font-bold 
          text-[32px] leading-[120%] 
          md:text-[40px] 
          text-center mb-6 text-primary-text
        "
      >
        Preferences
      </h1>

      {/* ================= PREFERENCES CARD ================= */}
      <div className="max-w-xl w-full rounded-2xl bg-section-bg shadow-sm px-6 py-4">
        {/* Email notification row */}
        <div className="flex items-center justify-between gap-4 py-3">
          <div className="w-[80%]">
            <h3 className="text-[26px] font-semibold font-playfair text-primary-text">
              Email notification
            </h3>
            <p className="text-[18px] text-body-text">
              Receive updates and newsletters
            </p>
          </div>

          <div className="w-[20%] flex justify-end">
            <ToggleButton
              checked={isNotificationsEnabled}
              onChange={setIsNotificationsEnabled}
            />
          </div>
        </div>

        <div className="border-t border-body-text my-1" />

        {/* Dark mode (fits your theme system perfectly) */}
        <div className="flex items-center justify-between gap-4 py-3">
          <div className="w-[80%]">
            <h3 className="text-[26px] font-semibold font-playfair text-primary-text">
              Dark mode
            </h3>
            <p className="text-[18px] text-body-text">
              Enable dark theme for low-light environments
            </p>
          </div>

          <div className="w-[20%] flex justify-end">
            <ToggleButton
              checked={isDarkMode}
              onChange={(value) => setTheme(value ? "dark" : "light")}
            />
          </div>
        </div>
      </div>
    </div>
  );
}