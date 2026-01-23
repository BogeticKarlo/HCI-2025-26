import type { Option } from "./Dropdown.types";
import type { Variant, VariantMap } from "./Dropdown.types";

function createOptions<V extends Variant>(
  variant: V,
  values: VariantMap[V][]
): Option<V>[] {
  return values.map((v) => ({
    variant,
    id: v,
    label: formatLabel(v),
  }));
}

function formatLabel(str: string) {
  return str
    .split("_")
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(" ");
}
export const cuisineOptions: Option<"cuisine">[] = createOptions("cuisine", [
  "all",
  "italian",
  "greek",
  "mexican",
  "indian",
  "french",
  "japanese",
  "chinese",
  "american",
  "mediterranean",
  "other",
]);

export const recipeTypeOptions: Option<"recipeType">[] = createOptions(
  "recipeType",
  [
    "all",
    "quick",
    "healthy",
    "cheap",
    "comfort",
    "dessert",
    "vegan",
    "vegetarian",
    "high_protein",
    "other",
  ]
);

export const timeOptions: Option<"time">[] = createOptions("time", [
  "latest",
  "oldest",
]);

export const favoriteOptions: Option<"favorite">[] = createOptions("favorite", [
  "all",
  "most_likes",
  "least_likes",
]);
