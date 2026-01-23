import type { Option } from "./Dropdown.types";
import type { Variant } from "./Dropdown.types";

interface DropdownItemProps<V extends Variant> {
  option: Option<V>;
  onClick: (option: Option<V>) => void;
}

export const DropdownItem = <V extends Variant>({
  option,
  onClick,
}: DropdownItemProps<V>) => {
  const Icon = option.icon;
  const handleClick = () => onClick(option);

  return (
    <button
      className="flex h-12 w-full cursor-pointer items-center gap-4 px-4 py-2 hover:bg-section-bg"
      onClick={handleClick}
    >
      {Icon && <Icon />}
      <p className="align-middle leading-6">{option.label}</p>
    </button>
  );
};
