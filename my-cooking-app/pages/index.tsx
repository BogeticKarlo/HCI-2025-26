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
    useState<Option<"recipeType">>(savedFilters.recipeType || recipeTypeOptions[0]);
  const [selectedTime, setSelectedTime] =
    useState<Option<"time">>(savedFilters.time || timeOptions[0]);
  const [selectedFavorite, setSelectedFavorite] =
    useState<Option<"favorite">>(savedFilters.favorite || favoriteOptions[0]);

  // Save filters to localStorage
  useEffect(() => {
    const filters = {
      cuisine: selectedCuisine,
      recipeType: selectedRecipeType,
      time: selectedTime,
      favorite: selectedFavorite,
    };
    localStorage.setItem(localStorageKey, JSON.stringify(filters));
  }, [selectedCuisine, selectedRecipeType, selectedTime, selectedFavorite]);

  // Fetch recipes
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
  }, [selectedCuisine, selectedRecipeType, selectedTime, selectedFavorite, currentPage]);

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
  }, [selectedCuisine, selectedRecipeType, selectedTime, selectedFavorite]);

  return (
    <div className="flex flex-col items-center">
      <h1 className="font-playfair font-bold text-[40px] text-center mb-10 text-primary-text">
        Check Out Best Recipes
      </h1>

      {/* Filters */}
      <div className="flex flex-col w-9/10 items-center gap-8 mb-10">
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
            label="Sort by Date"
            options={timeOptions}
            onSelect={setSelectedTime}
            value={selectedTime}
          />
          <Dropdown
            label="Sort by Popularity"
            options={favoriteOptions}
            onSelect={setSelectedFavorite}
            value={selectedFavorite}
          />
        </div>

        <p className="text-xs text-secondary-text text-center">
          Filters update recipes automatically
        </p>
      </div>

      {/* Active Filters */}
      {activeFilters.length > 0 && (
        <div className="flex flex-wrap gap-3 mb-6">
          {activeFilters.map(({ type, value }) => {
            // Hide latest/oldest completely
            if (type === "time") return null;

            return (
              <button
                key={value.id}
                onClick={() => resetFilter(type)}
                className="
                  flex items-center gap-2
                  px-4 py-2
                  text-sm font-medium
                  border border-accent
                  text-accent
                  rounded-lg
                  bg-white
                  shadow-sm
                  transition-all duration-200 transform
                  hover:scale-105 hover:shadow-lg hover:bg-accent hover:text-black
                  active:scale-95
                  focus:outline-none
                  focus:ring-2 focus:ring-accent focus:ring-offset-2
                  cursor-pointer
                "
              >
                <span>{value.label}</span>
                {/* Show ✕ only for cuisine and recipeType */}
                {(type === "cuisine" || type === "recipeType") && (
                  <span className="text-xs font-bold">✕</span>
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* Recipe Grid */}
      <div
        className={`grid gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-3 place-items-center
                    transition-opacity duration-300 ${isLoading ? "opacity-50" : "opacity-100"}`}
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

      {/* Load More Button */}
      {hasMore && (
        <Button
          onClick={() => setCurrentPage((prev) => prev + 1)}
          className="mt-6 transition-all duration-200 hover:scale-105 active:scale-95"
          isLoading={isFetchingMore}
          disabled={isFetchingMore}
        >
          {isFetchingMore ? "Loading more..." : "Load More"}
        </Button>
      )}
    </div>
  );
}
