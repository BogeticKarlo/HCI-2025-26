import { BaseRecipe } from "@/database/models/domain";
import { supabase } from "./client";
import {
  CuisineOptions,
  RecipeTypeOptions,
  TimeOptions,
  FavoriteOptions,
} from "@/components/dropdown/Dropdown.types";

export async function fetchRecipesByUser(
  userId: string,
  filters?: {
    cuisine?: CuisineOptions;
    recipeType?: RecipeTypeOptions;
    time?: TimeOptions;
    favorite?: FavoriteOptions;
    limit?: number;
    page?: number;
  }
): Promise<BaseRecipe[]> {
  if (!userId) throw new Error("userId is required");

  let query = supabase.from("recipes").select("*").eq("author_id", userId);

  if (filters?.cuisine && filters.cuisine !== "all") {
    query = query.eq("cuisine", filters.cuisine);
  }

  if (filters?.recipeType && filters.recipeType !== "all") {
    query = query.eq("recipe_type", filters.recipeType);
  }

  const orderClauses: { column: string; ascending: boolean }[] = [];

  if (filters?.favorite) {
    if (filters.favorite === "most_likes") {
      orderClauses.push({ column: "number_of_likes", ascending: false });
    } else if (filters.favorite === "least_likes") {
      orderClauses.push({ column: "number_of_likes", ascending: true });
    }
  }

  if (filters?.time) {
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

  const limit = filters?.limit ?? 20;
  const page = filters?.page ?? 1;
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

export async function deleteRecipe(recipeId: string, userId: string) {
  const { error } = await supabase
    .from("recipes")
    .delete()
    .eq("id", recipeId)
    .eq("author_id", userId)
    .select();

  if (error) {
    console.error("Error deleting recipe:", error);
    return false;
  }

  return true;
}
// --- Like/Unlike Functions ---

// Like a recipe
export async function likeRecipe(recipeId: string, userId: string) {
  // 1. Add user like
  const { error: likeError } = await supabase
    .from("recipe_likes")
    .insert({ recipe_id: recipeId, user_id: userId });

  if (likeError) {
    console.error("Error liking recipe:", likeError);
    return false;
  }

  // 2. Increment number_of_likes in recipes
  // First, get current number_of_likes
  const { data: recipeData, error: fetchError } = await supabase
    .from("recipes")
    .select("number_of_likes")
    .eq("id", recipeId)
    .single();

  if (fetchError || !recipeData) {
    console.error("Error fetching recipe likes:", fetchError);
    return false;
  }

  const newCount = (recipeData.number_of_likes || 0) + 1;

  const { error: countError } = await supabase
    .from("recipes")
    .update({ number_of_likes: newCount })
    .eq("id", recipeId);

  if (countError) {
    console.error("Error updating number_of_likes:", countError);
    return false;
  }

  return true;
}

// Unlike a recipe
export async function unlikeRecipe(recipeId: string, userId: string) {
  // 1. Remove user like
  const { error: likeError } = await supabase
    .from("recipe_likes")
    .delete()
    .eq("recipe_id", recipeId)
    .eq("user_id", userId);

  if (likeError) {
    console.error("Error unliking recipe:", likeError);
    return false;
  }

  // 2. Decrement number_of_likes
  const { data: recipeData, error: fetchError } = await supabase
    .from("recipes")
    .select("number_of_likes")
    .eq("id", recipeId)
    .single();

  if (fetchError || !recipeData) {
    console.error("Error fetching recipe likes:", fetchError);
    return false;
  }

  const newCount = Math.max((recipeData.number_of_likes || 1) - 1, 0);

  const { error: countError } = await supabase
    .from("recipes")
    .update({ number_of_likes: newCount })
    .eq("id", recipeId);

  if (countError) {
    console.error("Error updating number_of_likes:", countError);
    return false;
  }

  return true;
}

// Check if user has liked a recipe
export async function hasUserLikedRecipe(recipeId: string, userId: string) {
  const { data, error, status } = await supabase
    .from("recipe_likes")
    .select("*")
    .eq("recipe_id", recipeId)
    .eq("user_id", userId)
    .single();

  if (error && status !== 406) {
    // 406 = not found, which is ok
    console.error("Error checking like:", error);
    return false;
  }

  return !!data; // true if user liked, false otherwise
}


// Get number of likes for a recipe
export async function getRecipeLikes(recipeId: string) {
  const { data, error } = await supabase
    .from("recipes")
    .select("number_of_likes")
    .eq("id", recipeId)
    .single();

  if (error) {
    console.error("Error fetching likes:", error);
    return 0;
  }

  return data?.number_of_likes || 0;
}

