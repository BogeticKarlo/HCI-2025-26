import { ToggleButton } from "@/components/toggleButton/ToggleButton";
import { useTheme } from "next-themes";
import { useEffect, useMemo, useState } from "react";

export default function Settings() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Local state for notifications (swap with your real persisted setting if you have one)
  const [isNotificationsEnabled, setIsNotificationsEnabled] = useState(true);

  // Feedback (Norman: visible system status)
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => setMounted(true), []);
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 1800);
    return () => clearTimeout(t);
  }, [toast]);

  if (!mounted) return null;

  const isDarkMode = theme === "dark";

  // Knowledge in the world: short, always-visible “current state” summary
  const summary = useMemo(() => {
    const notif = isNotificationsEnabled ? "On" : "Off";
    const mode = isDarkMode ? "Dark" : "Light";
    return `Notifications: ${notif} · Theme: ${mode}`;
  }, [isNotificationsEnabled, isDarkMode]);

  const handleNotificationsToggle = (value: boolean) => {
    setIsNotificationsEnabled(value);
    setToast(value ? "Email notifications enabled" : "Email notifications disabled");
  };

  const handleThemeToggle = (value: boolean) => {
    setTheme(value ? "dark" : "light");
    setToast(value ? "Dark mode enabled" : "Light mode enabled");
  };

  return (
    <div className="flex flex-col items-center w-full px-6">
      {/* One clear title (visual hierarchy + conceptual model) */}
      <h1
        className="
          font-playfair font-bold
          text-[32px] leading-[120%]
          md:text-[40px]
          text-center mb-3 text-primary-text
        "
      >
        Preferences
      </h1>

      {/* Conceptual model: what this page controls */}
      <p className="text-sm text-primary-text/80 text-center mb-6">
        Manage how you receive updates and how the app looks.
      </p>

      {/* Knowledge in the world: current state summary */}
      <div className="w-full max-w-xl mb-4">
        <div className="rounded-2xl border border-gray-200 bg-white/60 px-4 py-3 text-sm text-primary-text">
          <span className="font-semibold">Current settings:</span> {summary}
        </div>
      </div>

      <div className="w-full max-w-xl rounded-2xl bg-section-bg shadow-sm border border-gray-200 px-6 py-4">
        {/* Email notification row */}
        <div className="flex items-center justify-between gap-4 py-4">
          <div className="flex-1">
            <h3 className="text-[22px] md:text-[26px] font-semibold font-playfair text-primary-text">
              Email notifications
            </h3>

            <p className="text-[15px] md:text-[18px] text-body-text">
              Receive updates and newsletters
            </p>

            {/* Mapping + signifier: label current state explicitly */}
            <p className="text-xs text-primary-text/70 mt-1">
              Status:{" "}
              <span className="font-semibold text-primary-text">
                {isNotificationsEnabled ? "On" : "Off"}
              </span>
            </p>
          </div>

          {/* Constraints: bigger hit area wrapper + clear affordance */}
          <button
            type="button"
            onClick={() => handleNotificationsToggle(!isNotificationsEnabled)}
            className="
              rounded-xl
              p-2
              cursor-pointer
              transition-all duration-200
              hover:bg-white/60 hover:shadow-sm
              active:scale-[0.98]
              focus-visible:outline-none
              focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2
            "
            aria-label={`Turn email notifications ${
              isNotificationsEnabled ? "off" : "on"
            }`}
          >
            <ToggleButton
              checked={isNotificationsEnabled}
              onChange={handleNotificationsToggle}
            />
          </button>
        </div>

        <div className="border-t border-gray-200 my-1" />

        {/* Dark mode row */}
        <div className="flex items-center justify-between gap-4 py-4">
          <div className="flex-1">
            <h3 className="text-[22px] md:text-[26px] font-semibold font-playfair text-primary-text">
              Dark mode
            </h3>

            <p className="text-[15px] md:text-[18px] text-body-text">
              Enable dark theme for low-light environments
            </p>

            <p className="text-xs text-primary-text/70 mt-1">
              Status:{" "}
              <span className="font-semibold text-primary-text">
                {isDarkMode ? "On" : "Off"}
              </span>
            </p>
          </div>

          <button
            type="button"
            onClick={() => handleThemeToggle(!isDarkMode)}
            className="
              rounded-xl
              p-2
              cursor-pointer
              transition-all duration-200
              hover:bg-white/60 hover:shadow-sm
              active:scale-[0.98]
              focus-visible:outline-none
              focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2
            "
            aria-label={`Turn dark mode ${isDarkMode ? "off" : "on"}`}
          >
            <ToggleButton checked={isDarkMode} onChange={handleThemeToggle} />
          </button>
        </div>
      </div>

      {/* Feedback: small toast */}
      {toast && (
        <div
          className="
            fixed bottom-4 left-1/2 -translate-x-1/2
            z-50
            rounded-full
            border border-gray-200
            bg-white/90
            px-4 py-2
            text-sm text-primary-text
            shadow-md
            animate-pulse
          "
          aria-live="polite"
        >
          {toast}
        </div>
      )}
    </div>
  );
}