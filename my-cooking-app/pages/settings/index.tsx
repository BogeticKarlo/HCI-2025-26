import { ToggleButton } from "@/components/toggleButton/ToggleButton";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function Settings() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isNotificationsEnabled, setIsNotificationsEnabled] = useState(true);

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const isDarkMode = theme === "dark";

  return (
    <div className="flex flex-col items-center">
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
      <h1
        className="
          font-playfair font-bold 
          text-[32px] leading-[120%] 
          md:text-[40px] 
          text-center mb-10 text-primary-text
        "
      >
        Preferences
      </h1>

      <div className="max-w-xl rounded-2xl bg-section-bg shadow-sm px-6 py-4">
        {/* Email notification row */}
        <div className="flex items-center justify-between gap-4 py-3">
          <div>
            <h3 className="text-[26px] font-semibold font-playfair text-primary-text">
              Email notification
            </h3>
            <p className="text-[18px] text-body-text">
              Receive updates and newsletters
            </p>
          </div>

          <ToggleButton
            checked={isNotificationsEnabled}
            onChange={setIsNotificationsEnabled}
          />
        </div>

        <div className="border-t border-body-text my-1" />

        {/* Dark mode row */}
        <div className="flex items-center justify-between gap-4 py-3">
          <div>
            <h3 className="text-[26px] font-semibold font-playfair text-primary-text">
              Dark mode
            </h3>
            <p className="text-[18px] text-body-text">
              Enable dark theme for low-light environments
            </p>
          </div>

          <ToggleButton
            checked={isDarkMode}
            onChange={(value) => setTheme(value ? "dark" : "light")}
          />
        </div>
      </div>
    </div>
  );
}
