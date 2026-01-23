import type { Option } from "./Dropdown.types";
import { DropdownItem } from "./DropdownItem";
import { useState } from "react";
import type { Variant } from "./Dropdown.types";

interface DropdownListProps<V extends Variant> {
  options: Option<V>[];
  onSelect: (item: Option<V>) => void;
}

export const DropdownList = <V extends Variant>({
  options,
  onSelect,
}: DropdownListProps<V>) => {
  const [search, setSearch] = useState("");

  const filtered = options.filter((option) =>
    option.label.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelectItem = (option: Option<V>) => {
    onSelect(option);
    setSearch("");
  };

  return (
    <div className="absolute z-50 mt-2 w-full overflow-hidden rounded-md border border-input-border bg-input-field-bg shadow-md">
      <ul className="max-h-60 overflow-y-auto">
        {filtered.length === 0 && (
          <li className="p-2 text-center text-text-muted">No results found</li>
        )}

        {filtered.map((option) => (
          <DropdownItem
            key={option.id}
            option={option}
            onClick={handleSelectItem}
          />
        ))}
      </ul>
    </div>
  );
};
