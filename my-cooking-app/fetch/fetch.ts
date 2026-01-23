import { BaseRecipe } from "@/database/models/domain";
import { supabase } from "./client";

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

export async function fetchLatestRecipes(limit: number = 10) {
  const { data, error } = await supabase
    .from("recipes")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("Error fetching latest recipes:", error);
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
