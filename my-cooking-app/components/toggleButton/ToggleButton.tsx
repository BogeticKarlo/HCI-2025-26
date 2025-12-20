// components/ui/ToggleButton.tsx
"use client";

import clsx from "clsx";
import { type ToggleButtonProps } from "./ToggleButton.types";
import { FC } from "react";

export const ToggleButton: FC<ToggleButtonProps> = ({
  checked,
  onChange,
  className = "",
  disabled = false,
}) => {
  const handleToggle = () => {
    if (disabled) return;
    onChange(!checked);
  };

  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={handleToggle}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleToggle();
        }
      }}
      disabled={disabled}
      className={clsx(
        "relative inline-flex h-7 w-12 items-center rounded-full transition-colors",
        checked ? "bg-toggle-on" : "bg-toggle-off",
        disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer",
        className
      )}
    >
      <span
        className={clsx(
          "absolute h-5 w-5 rounded-full bg-section-bg shadow transition-all",
          checked ? "right-1" : "left-1"
        )}
      />
    </button>
  );
};
