// src/components/ui/Input.tsx
import { type FC, useId } from "react";
import clsx from "clsx";
import type { InputProps } from "./Input.types";

export const Input: FC<InputProps> = ({
  label,
  error,
  id,
  className,
  ...rest
}) => {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const hasError = Boolean(error);

  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label
          htmlFor={inputId}
          className={clsx(
            "font-sans text-[18px] leading-normal",
            "text-primary-text"
          )}
        >
          {label}
        </label>
      )}

      <input
        id={inputId}
        className={clsx(
          "w-full rounded-lg px-4 py-2",
          "font-sans text-[18px] leading-normal",
          hasError ? "bg-error border-error-border" : "bg-input-field-bg",
          "text-primary-text",
          "placeholder:text-muted",
          "shadow-[0_4px_4px_rgba(0,0,0,0.25)]",
          "border border-transparent focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary",
          className
        )}
        {...rest}
      />

      {hasError && (
        <p
          className={clsx(
            "mt-1",
            "font-sans text-[16px] leading-normal",
            "text-error-border"
          )}
        >
          {error}
        </p>
      )}
    </div>
  );
};
