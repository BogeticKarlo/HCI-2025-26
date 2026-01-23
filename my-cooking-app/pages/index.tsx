"use client";

import { useEffect, useState } from "react";
import { RecipeMinimizeCard } from "../components/recipeMinimizeCard/RecipeMinimizeCard";
import { RecipeMinimizeCardSkeletonLoader } from "../components/recipeMinimizeCard/RecipeMinimizeCardSkeletonLoader";
import { fetchLatestRecipes } from "@/fetch/fetch";
import { Database } from "@/types/supabase";
import { Option } from "@/components/dropdown/Dropdown.types";
import {
  cuisineOptions,
  recipeTypeOptions,
  timeOptions,
  favoriteOptions,
} from "@/components/dropdown/DropdownOptions";
import { Dropdown } from "@/components/dropdown/Dropdown";

type Recipe = Database["public"]["Tables"]["recipes"]["Row"];

export default function HomePage() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  const [selectedCuisine, setSelectedCuisine] = useState<Option<"cuisine">>(
    cuisineOptions[0]
  );
  const [selectedRecipeType, setSelectedRecipeType] = useState<
    Option<"recipeType">
  >(recipeTypeOptions[0]);
  const [selectedTime, setSelectedTime] = useState<Option<"time">>(
    timeOptions[0]
  );
  const [selectedFavorite, setSelectedFavorite] = useState<Option<"favorite">>(
    favoriteOptions[0]
  );

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
    <div className="flex flex-col items-center">
      {isError && (
        <p className="text-warning text-sm mb-4">
          Something went wrong while loading recipes.
        </p>
      )}

      <h1 className="font-playfair font-bold text-[40px] leading-[120%] tracking-[0] text-center mb-10 text-primary-text">
        Check Out Best Recipes
      </h1>

      <div className="flex flex-col w-9/10 items-center justify-center gap-10">
        <div className="grid grid-cols-2 gap-5 w-full lg:w-[70%]">
          <Dropdown
            label="Choose Cuisine"
            options={cuisineOptions}
            onSelect={setSelectedCuisine}
            value={selectedCuisine}
          />
          <Dropdown
            label="Choose Type"
            options={recipeTypeOptions}
            onSelect={setSelectedRecipeType}
            value={selectedRecipeType}
          />
        </div>
        <div className="grid grid-cols-2 gap-5 w-full mb-10 lg:w-[70%]">
          <Dropdown
            label="Choose Latest"
            options={timeOptions}
            onSelect={setSelectedTime}
            value={selectedTime}
          />
          <Dropdown
            label="Choose Popular"
            options={favoriteOptions}
            onSelect={setSelectedFavorite}
            value={selectedFavorite}
          />
        </div>
      </div>

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
    </div>
  );
}
