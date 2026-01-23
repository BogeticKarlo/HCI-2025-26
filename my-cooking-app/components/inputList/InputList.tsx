// src/components/ui/InputList.tsx
import { FC } from "react";
import { Input } from "../input/Input";
import { PlusCircleIcon } from "@/assets/PlusCircleIcon";
import { MinusCircleIcon } from "@/assets/MinusCircleIcon";
import { Button } from "../button/Button";
import clsx from "clsx";

interface InputListProps {
  label?: string;
  values: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
  maxItems?: number;
  error?: string;
}

export const InputList: FC<InputListProps> = ({
  label,
  values,
  onChange,
  placeholder = "Add ingredient...",
  maxItems,
  error,
}) => {
  const hasError = Boolean(error);

  const handleChange = (index: number, value: string) => {
    const updated = [...values];
    updated[index] = value;
    onChange(updated);
  };

  const handleAdd = () => {
    if (maxItems && values.length >= maxItems) return;
    onChange([...values, ""]);
  };

  const handleRemove = (index: number) => {
    const updated = values.filter((_, i) => i !== index);
    onChange(updated);
  };

  return (
    <div className="flex flex-col gap-3 w-full">
      {label && (
        <p className="font-sans text-[18px] text-primary-text">{label}</p>
      )}

      {values.map((value, index) => (
        <div key={index} className="flex w-full gap-2 ">
          <Input
            value={value}
            onChange={(e) => handleChange(index, e.target.value)}
            placeholder={`${placeholder} #${index + 1}`}
            containerClassName="flex-1"
          />

          <button
            type="button"
            onClick={() => handleRemove(index)}
            className="
            shrink-0
              rounded-full
              text-text-muted
              hover:text-error-border
              transition
              cursor-pointer
            "
            aria-label="Remove item"
          >
            <MinusCircleIcon className="w-5 h-5" />
          </button>
        </div>
      ))}

      <Button
        type="button"
        onClick={handleAdd}
        className="inline-flex items-center justify-center
      text-primary font-semibold
      transition
    "
        icon={<PlusCircleIcon className="w-5 h-5" />}
      >
        Add ingredient
      </Button>

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
