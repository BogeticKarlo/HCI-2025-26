import { BaseRecipe } from "@/database/models/domain";
import { supabase } from "./client";
import {
  CuisineOptions,
  RecipeTypeOptions,
  TimeOptions,
  FavoriteOptions,
} from "@/components/dropdown/Dropdown.types";

export async function fetchRecipesByUser(userId: string) {
  if (!userId) throw new Error("userId is required");

  const { data, error } = await supabase
    .from("recipes")
    .select("*")
    .eq("author_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching recipes:", error);
    return [];
  }

  return data;
}

export async function fetchRecipeById(recipeId: string) {
  const { data, error } = await supabase
    .from("recipes")
    .select("*")
    .eq("id", recipeId)
    .single();

  if (error || !data) return null;
  return data;
}
export async function fetchRecipes(filters: {
  cuisine?: CuisineOptions;
  recipeType?: RecipeTypeOptions;
  time?: TimeOptions;
  favorite?: FavoriteOptions;
  limit?: number;
  page?: number;
}): Promise<BaseRecipe[]> {
  let query = supabase.from("recipes").select("*");

  if (filters.cuisine && filters.cuisine !== "all") {
    query = query.eq("cuisine", filters.cuisine);
  }

  if (filters.recipeType && filters.recipeType !== "all") {
    query = query.eq("recipe_type", filters.recipeType);
  }

  const orderClauses: { column: string; ascending: boolean }[] = [];

  if (filters.favorite) {
    if (filters.favorite === "most_likes") {
      orderClauses.push({ column: "number_of_likes", ascending: false });
    } else if (filters.favorite === "least_likes") {
      orderClauses.push({ column: "number_of_likes", ascending: true });
    }
  }

  if (filters.time) {
    orderClauses.push({
      column: "created_at",
      ascending: filters.time === "oldest",
    });
  } else {
    orderClauses.push({ column: "created_at", ascending: false });
  }

  for (const { column, ascending } of orderClauses) {
    query = query.order(column, { ascending });
  }

  const limit = filters.limit ?? 20;
  const page = filters.page ?? 1;
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  query = query.range(from, to);

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching recipes:", error);
    return [];
  }

  return data;
}

export async function fetchUserById(userId: string) {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();

  if (error || !data) return null;
  return data;
}

export async function uploadRecipe(recipeData: BaseRecipe) {
  const { data, error } = await supabase
    .from("recipes")
    .insert([recipeData])
    .select();

  if (error) {
    console.error("Error uploading recipe:", error);
    return null;
  }

  return data;
}

export async function uploadRecipeImage(file: File, userId: string) {
  const filePath = `${userId}/${Date.now()}-${file.name}`;

  const { data, error } = await supabase.storage
    .from("recipe-images")
    .upload(filePath, file);

  if (error) {
    console.error("Error uploading image:", error);
    return null;
  }

  return data.path;
}
