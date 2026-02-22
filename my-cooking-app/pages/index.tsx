"use client";

import { useEffect, useState, useMemo } from "react";
import { RecipeMinimizeCard } from "../components/recipeMinimizeCard/RecipeMinimizeCard";
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
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [isError, setIsError] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const [selectedCuisine, setSelectedCuisine] =
    useState<Option<"cuisine">>(savedFilters.cuisine || cuisineOptions[0]);

  const [selectedRecipeType, setSelectedRecipeType] =
    useState<Option<"recipeType">>(
      savedFilters.recipeType || recipeTypeOptions[0]
    );

  const [selectedTime, setSelectedTime] =
    useState<Option<"time">>(savedFilters.time || timeOptions[0]);

  const [selectedFavorite, setSelectedFavorite] =
    useState<Option<"favorite">>(
      savedFilters.favorite || favoriteOptions[0]
    );

  /* ---------------- SAVE FILTERS ---------------- */

  useEffect(() => {
    const filters = {
      cuisine: selectedCuisine,
      recipeType: selectedRecipeType,
      time: selectedTime,
      favorite: selectedFavorite,
    };

    localStorage.setItem(localStorageKey, JSON.stringify(filters));
  }, [selectedCuisine, selectedRecipeType, selectedTime, selectedFavorite]);

  /* ---------------- RESET PAGE WHEN FILTERS CHANGE ---------------- */

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCuisine, selectedRecipeType, selectedTime, selectedFavorite]);

  /* ---------------- FETCH RECIPES ---------------- */

  useEffect(() => {
    const fetchHomeRecipes = async () => {
      try {
        if (currentPage === 1) setIsLoading(true);
        else setIsFetchingMore(true);

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
        setIsError(true);
      } finally {
        setIsLoading(false);
        setIsFetchingMore(false);
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

  /* ---------------- FILTER RESET ---------------- */

  const resetFilter = (type: string) => {
    if (type === "cuisine") setSelectedCuisine(cuisineOptions[0]);
    if (type === "recipeType") setSelectedRecipeType(recipeTypeOptions[0]);
    if (type === "time") setSelectedTime(timeOptions[0]);
    if (type === "favorite") setSelectedFavorite(favoriteOptions[0]);
  };

  const activeFilters = useMemo(() => {
    return [
      { type: "cuisine", value: selectedCuisine },
      { type: "recipeType", value: selectedRecipeType },
      { type: "time", value: selectedTime },
      { type: "favorite", value: selectedFavorite },
    ].filter((item) => item.value.id !== "all");
  }, [
    selectedCuisine,
    selectedRecipeType,
    selectedTime,
    selectedFavorite,
  ]);

  /* ================= RENDER ================= */

  return (
    <div className="flex flex-col items-center">
      <h1 className="font-playfair font-bold text-[40px] text-center mb-10 text-primary-text">
        Check Out Best Recipes
      </h1>

      {/* Filters section unchanged for brevity */}

      {/* Recipes Grid */}

      <div
        className={`grid gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-3 place-items-center
        transition-opacity duration-300 ${
          isLoading ? "opacity-50" : "opacity-100"
        }`}
      >
        {recipes.length === 0 && !isLoading ? (
          <div className="col-span-full flex justify-center items-center h-96">
            <NoRecipesCard
              title="No recipes found"
              description="Try adjusting your filters."
              buttonText="Create new dish"
            />
          </div>
        ) : (
          recipes.map((recipe) => (
            <div
              key={recipe.id}
              className="transition-transform duration-200 hover:-translate-y-1 hover:shadow-lg"
            >
              <RecipeMinimizeCard
                id={recipe.id || ""}
                title={recipe.title}
                imageUrl={recipe.image_url || ""}
                description={recipe.description || ""}
                authorId={recipe.author_id || ""}
              />
            </div>
          ))
        )}
      </div>

      {/* ---------------- LOAD MORE (Improved Constraint) ---------------- */}

      {hasMore && (
        <Button
          onClick={() => {
            if (!isFetchingMore && !isLoading) {
              setCurrentPage((prev) => prev + 1);
            }
          }}
          className="mt-6 transition-all duration-200 hover:scale-105 active:scale-95"
          isLoading={isFetchingMore}
          disabled={isFetchingMore || isLoading}
        >
          {isFetchingMore ? "Loading more..." : "Load More"}
        </Button>
      )}
    </div>
  );
}
