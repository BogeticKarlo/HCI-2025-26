"use client";

import { useEffect, useState } from "react";
import { RecipeMinimizeCard } from "../components/recipeMinimizeCard/RecipeMinimizeCard";
import { RecipeMinimizeCardSkeletonLoader } from "../components/recipeMinimizeCard/RecipeMinimizeCardSkeletonLoader";
import { fetchLatestRecipes } from "@/fetch/fetch";
import { Database } from "@/types/supabase";

type Recipe = Database["public"]["Tables"]["recipes"]["Row"];

export default function HomePage() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        setIsLoading(true);
        setIsError(false);

        setRecipes(await fetchLatestRecipes(12));
      } catch (err) {
        console.error(err);
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecipes();
  }, []);

  return (
    <>
      {isError && (
        <p className="text-warning text-sm mb-4">
          Something went wrong while loading recipes.
        </p>
      )}

      <h1 className="font-playfair font-bold text-[40px] leading-[120%] tracking-[0] text-center mb-10 text-primary-text">
        Check Out Newest Recipes
      </h1>

      <div className="max-w-6xl mx-auto px-6 sm:px-10 lg:px-20">
        <div
          className="
          grid 
          gap-6
          grid-cols-1 md:grid-cols-2 xl:grid-cols-3
          place-items-center
        "
        >
          {isLoading
            ? Array.from({ length: 12 }).map((_, i) => (
                <RecipeMinimizeCardSkeletonLoader key={i} />
              ))
            : recipes.map((recipe) => (
                <RecipeMinimizeCard
                  key={recipe.id}
                  id={recipe.id}
                  title={recipe.title}
                  imageUrl={recipe.image_url || ""}
                  description={recipe.description || ""}
                />
              ))}
        </div>
      </div>
    </>
  );
}
