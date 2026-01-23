"use client";

import { useEffect, useState } from "react";
import { RecipeMinimizeCard } from "../components/recipeMinimizeCard/RecipeMinimizeCard";
import { RecipeMinimizeCardSkeletonLoader } from "../components/recipeMinimizeCard/RecipeMinimizeCardSkeletonLoader";
import { fetchRecipes } from "@/fetch/fetch";
import { Option } from "@/components/dropdown/Dropdown.types";
import {
  cuisineOptions,
  recipeTypeOptions,
  timeOptions,
  favoriteOptions,
} from "@/components/dropdown/DropdownOptions";
import { Dropdown } from "@/components/dropdown/Dropdown";
import { BaseRecipe } from "@/database/models/domain";
import { NoRecipesCard } from "@/components/noRecipes/NoRecipesCard";
import { Button } from "@/components/button/Button";

const localStorageKey = "recipeFilters";
const pageLimit = 12;

export default function HomePage() {
  const savedFilters =
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem(localStorageKey) || "{}")
      : {};

  const [recipes, setRecipes] = useState<BaseRecipe[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const [selectedCuisine, setSelectedCuisine] = useState<Option<"cuisine">>(
    savedFilters.cuisine || cuisineOptions[0]
  );
  const [selectedRecipeType, setSelectedRecipeType] = useState<
    Option<"recipeType">
  >(savedFilters.recipeType || recipeTypeOptions[0]);
  const [selectedTime, setSelectedTime] = useState<Option<"time">>(
    savedFilters.time || timeOptions[0]
  );
  const [selectedFavorite, setSelectedFavorite] = useState<Option<"favorite">>(
    savedFilters.favorite || favoriteOptions[0]
  );

  useEffect(() => {
    const filters = {
      cuisine: selectedCuisine,
      recipeType: selectedRecipeType,
      time: selectedTime,
      favorite: selectedFavorite,
    };
    localStorage.setItem(localStorageKey, JSON.stringify(filters));
  }, [selectedCuisine, selectedRecipeType, selectedTime, selectedFavorite]);

  useEffect(() => {
    setCurrentPage(1);
    setRecipes([]);
    setHasMore(true);
  }, [selectedCuisine, selectedRecipeType, selectedTime, selectedFavorite]);

  useEffect(() => {
    const fetchHomeRecipes = async () => {
      try {
        setIsLoading(true);
        setIsError(false);

        const newRecipes = await fetchRecipes({
          cuisine: selectedCuisine.id,
          recipeType: selectedRecipeType.id,
          time: selectedTime.id,
          favorite: selectedFavorite.id,
          limit: pageLimit,
          page: currentPage,
        });

        setRecipes((prev) =>
          currentPage === 1 ? newRecipes : [...prev, ...newRecipes]
        );
        setHasMore(newRecipes.length === pageLimit);
      } catch (err) {
        console.error(err);
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHomeRecipes();
  }, [
    selectedCuisine,
    selectedRecipeType,
    selectedTime,
    selectedFavorite,
    currentPage,
  ]);

  const handleResetFilters = () => {
    setSelectedCuisine(cuisineOptions[0]);
    setSelectedRecipeType(recipeTypeOptions[0]);
    setSelectedTime(timeOptions[0]);
    setSelectedFavorite(favoriteOptions[0]);

    localStorage.setItem(
      localStorageKey,
      JSON.stringify({
        cuisine: cuisineOptions[0],
        recipeType: recipeTypeOptions[0],
        time: timeOptions[0],
        favorite: favoriteOptions[0],
      })
    );
  };

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

      <div className="flex flex-col w-9/10 items-center justify-center gap-10 mb-10">
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
        <div className="grid grid-cols-2 gap-5 w-full lg:w-[70%]">
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
        <Button onClick={handleResetFilters} className="w-1/2">
          Reset Filters
        </Button>
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
          {isLoading && currentPage === 1 ? (
            Array.from({ length: pageLimit }).map((_, i) => (
              <RecipeMinimizeCardSkeletonLoader key={i} />
            ))
          ) : recipes.length === 0 ? (
            <div className="col-span-full flex justify-center items-center h-96">
              <NoRecipesCard
                title="This kitchen is empty!"
                description="No recipes fitting those filters yet — Time to break the silence and cook up something amazing."
                buttonText="Create new dish"
              />
            </div>
          ) : (
            recipes.map((recipe) => (
              <RecipeMinimizeCard
                key={recipe.id}
                id={recipe.id || ""}
                title={recipe.title}
                imageUrl={recipe.image_url || ""}
                description={recipe.description || ""}
              />
            ))
          )}
        </div>
      </div>

      {hasMore && (
        <Button
          onClick={() => setCurrentPage((prev) => prev + 1)}
          className="mt-6"
          isLoading={isLoading}
        >
          Load More
        </Button>
      )}
    </div>
  );
}
