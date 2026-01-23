import { FC, useId, ChangeEvent } from "react";
import clsx from "clsx";

interface TextAreaProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  maxLength?: number;
  error?: string;
  id?: string;
  className?: string;
  placeholder?: string;
}

export const TextArea: FC<TextAreaProps> = ({
  label,
  value,
  onChange,
  maxLength = 100,
  error,
  id,
  className,
  placeholder = "Provide description about your recipe...",
}) => {
  const generatedId = useId();
  const textAreaId = id ?? generatedId;
  const hasError = Boolean(error);
  const isLimitReached = value.length >= maxLength;

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label
          htmlFor={textAreaId}
          className="font-sans text-[18px] leading-normal text-primary-text"
        >
          {label}
        </label>
      )}

      <textarea
        id={textAreaId}
        value={value}
        maxLength={maxLength}
        onChange={handleChange}
        placeholder={placeholder}
        className={clsx(
          "w-full rounded-lg px-4 py-3 min-h-[136px] resize-none",
          "font-sans text-[18px] leading-normal",
          hasError ? "bg-error border-error-border" : "bg-input-field-bg",
          "text-primary-text",
          "placeholder:text-text-muted",
          "shadow-[0_4px_4px_rgba(0,0,0,0.25)]",
          "border border-transparent focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary",
          className
        )}
      />

      <div className="flex justify-between items-center mt-1">
        {error ? (
          <p className="font-sans text-[16px] leading-normal text-error-border">
            {error}
          </p>
        ) : (
          <span />
        )}

        <p
          className={clsx(
            "text-sm",
            isLimitReached ? "text-error-border" : "text-text-muted"
          )}
        >
          {value.length}/{maxLength}
        </p>
      </div>
    </div>
  );
};
