import {
  useEffect,
  useId,
  useRef,
  useState,
  type ComponentType,
  type SVGProps,
} from "react";
import { DropdownList } from "./DropdownList";
import { ArrowIcon } from "@/assets/ArrowIcon";
import { type DropdownProps, type Option } from "./Dropdown.types";
import { radiusVariants } from "./Dropdown.const";
import type { Variant } from "./Dropdown.types";
import clsx from "clsx";

export const Dropdown = <V extends Variant>({
  options,
  value,
  onSelect,
  label,
  placeholder,
  isRequired,
  customIcon,
  borderStyle = "default",
  error,
}: DropdownProps<V>) => {
  const id = useId();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleSelect = (option: Option<V>) => {
    setIsOpen(false);
    onSelect(option);
  };
  const handleToggle = () => setIsOpen((prev) => !prev);

  const isPlaceholderActive = !value && !!placeholder;
  const displayText = isPlaceholderActive ? placeholder : value?.label ?? "";

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (!dropdownRef.current) return;
      if (!dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div ref={dropdownRef} className="flex flex-col gap-1">
      {label && (
        <label
          htmlFor={id}
          className={clsx(
            "font-sans text-[18px] leading-normal",
            "text-primary-text"
          )}
        >
          {label}
        </label>
      )}
      <div className="relative w-full">
        <button
          id={id}
          type="button"
          onClick={handleToggle}
          className={`flex w-full cursor-pointer items-center justify-between px-4 py-3 ${
            radiusVariants[borderStyle]
          } ${isOpen ? "ring-2 ring-primary" : "border"} ${
            error
              ? "border border-error-border bg-error"
              : "border-input-border bg-input-field-bg"
          }`}
        >
          <div className="flex items-center gap-3">
            <p
              className={`align-middle leading-6 ${
                isPlaceholderActive ? "text-text-muted" : ""
              }`}
            >
              {displayText}
            </p>
          </div>

          <ArrowIcon
            className={`w-5 text-color-text-secondary transition-transform duration-400 ease-in-out ${
              isOpen ? "rotate-90" : "-rotate-90"
            }`}
          />
        </button>

        {isOpen && <DropdownList options={options} onSelect={handleSelect} />}
      </div>

      {error && (
        <p className="mt-1 text-[16px] font-medium text-error-border">
          {error}
        </p>
      )}
    </div>
  );
};
