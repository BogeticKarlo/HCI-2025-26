import type { ComponentType, SVGProps } from "react";
import type { Database } from "../../types/supabase";

export type BorderStyle = "default" | "left-flat" | "right-flat";

export type Variant = "cuisine" | "recipeType";

export type CuisineOptions = Database["public"]["Enums"]["cuisine_type"];
export type RecipeTypeOptions = Database["public"]["Enums"]["recipe_kind"];

export type VariantMap = {
  cuisine: CuisineOptions;
  recipeType: RecipeTypeOptions;
};

export type Option<V extends Variant = Variant> = {
  variant: V;
  id: VariantMap[V];
  label: string;
  icon?: ComponentType<SVGProps<SVGSVGElement>>;
};

export type DropdownProps<V extends Variant> = {
  options: Option<V>[];
  value: Option<V> | null;
  onSelect: (option: Option<V>) => void;
  label?: string;
  placeholder?: string;
  isRequired?: boolean;
  customIcon?: ComponentType<SVGProps<SVGSVGElement>>;
  borderStyle?: BorderStyle;
  error?: string;
};
