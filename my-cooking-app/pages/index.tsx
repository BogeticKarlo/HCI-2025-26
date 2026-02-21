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
    <div className="flex flex-col items-center px-4">

      {/* Page Title */}
      <h1 className="font-playfair font-bold text-[40px] text-center mb-4 text-primary-text">
        Discover Recipes
      </h1>

      <p className="text-secondary-text text-sm mb-10 text-center max-w-xl">
        Use filters below to refine your search. Results update automatically.
      </p>

      {/* FILTER SECTION */}
      <div className="w-full max-w-5xl mb-12">
        <h2 className="text-lg font-semibold text-primary-text mb-6 tracking-wide uppercase">
          Filters
        </h2>

        <div className="grid grid-cols-2 gap-6">
          <Dropdown
            label="Cuisine"
            options={cuisineOptions}
            onSelect={setSelectedCuisine}
            value={selectedCuisine}
          />
          <Dropdown
            label="Recipe Type"
            options={recipeTypeOptions}
            onSelect={setSelectedRecipeType}
            value={selectedRecipeType}
          />
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
      </div>

      {/* ACTIVE FILTERS */}
      {activeFilters.length > 0 && (
        <div className="w-full max-w-5xl mb-10">
          <h3 className="text-sm font-semibold text-secondary-text mb-4 uppercase tracking-wide">
            Active Filters (Click to Remove)
          </h3>

          <div className="flex flex-wrap gap-3">
            {activeFilters.map(({ type, value }) => (
              <button
                key={value.id}
                onClick={() => resetFilter(type)}
                className="
                  group
                  flex items-center gap-2
                  px-4 py-2
                  text-sm font-medium
                  border border-accent
                  text-accent
                  bg-white
                  rounded-lg
                  shadow-sm
                  transition-all duration-200
                  hover:bg-accent/5
                  hover:shadow-md
                  active:scale-95
                  cursor-pointer
                  focus:outline-none
                  focus:ring-2 focus:ring-accent focus:ring-offset-2
                "
              >
                <span>{value.label}</span>

                <span
                  className="
                    flex items-center justify-center
                    w-5 h-5
                    rounded-full
                    bg-accent/10
                    text-accent
                    text-xs font-bold
                    transition-all duration-200
                    group-hover:bg-accent/20
                  "
                >
                  ✕
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* RESULTS SECTION */}
      <div className="w-full max-w-6xl">
        <h2 className="text-lg font-semibold text-primary-text mb-6 tracking-wide uppercase">
          Results
        </h2>

        <div
          className={`grid gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-3
                      transition-opacity duration-300
                      ${isLoading ? "opacity-50" : "opacity-100"}`}
        >
          {recipes.length === 0 && !isLoading ? (
            <NoRecipesCard
              title="No recipes found"
              description="Try adjusting your filters."
              buttonText="Create new dish"
            />
          ) : (
            recipes.map((recipe) => (
              <div
                key={recipe.id}
                className="
                  cursor-pointer
                  transition-all duration-200
                  hover:-translate-y-1
                  hover:shadow-lg
                  hover:ring-2
                  hover:ring-accent/20
                  rounded-xl
                "
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
      </div>

      {/* LOAD MORE */}
      {hasMore && (
        <Button
          onClick={() => setCurrentPage((prev) => prev + 1)}
          className="mt-10 px-8 transition-all duration-200 hover:scale-105 active:scale-95"
          isLoading={isFetchingMore}
          disabled={isFetchingMore}
        >
          {isFetchingMore ? "Loading more..." : "Load More ↓"}
        </Button>
      )}
    </div>
  );
}
