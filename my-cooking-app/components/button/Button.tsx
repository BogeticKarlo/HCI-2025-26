import { type FC } from "react";
import { Spinner } from "../../public/reactComponentAssets/RotationSpinner";
import { type ButtonProps } from "./Button.types";
import clsx from "clsx";

export const Button: FC<ButtonProps> = ({
  children,
  className = "",
  variant = "primary",
  icon,
  isLoading = false,
  disabled,
  ...rest
}) => {
  const isDisabled = disabled || isLoading;

  const variantClasses =
    variant === "primary"
      ? "bg-primary text-secondary-text"
      : "bg-secondary text-secondary-text";

  const enabledHover =
    "hover:opacity-90 hover:shadow-[0_4px_4px_rgba(0,0,0,0.25)]";

  const disabledClasses = "bg-disabled text-secondary-text opacity-70";

  return (
    <button
      type="button"
      className={clsx(
        "inline-flex items-center justify-center rounded-[10px] px-6 py-2",
        "text-sm font-medium transition-all duration-150",
        "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary",
        isDisabled ? disabledClasses : variantClasses,
        !isDisabled && enabledHover,
        "disabled:cursor-not-allowed",
        !isDisabled && "cursor-pointer",
        className
      )}
      disabled={isDisabled}
      aria-busy={isLoading || undefined}
      {...rest}
    >
      {(isLoading || icon) && (
        <span className="mr-2 flex items-center">
          {isLoading ? <Spinner /> : icon}
        </span>
      )}
      <span>{children}</span>
    </button>
  );
};
