"use client";

import { useEffect, useState, useMemo } from "react";
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
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [isError, setIsError] = useState(false);
  const [showResetMessage, setShowResetMessage] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const [selectedCuisine, setSelectedCuisine] = useState<Option<"cuisine">>(
    savedFilters.cuisine || cuisineOptions[0],
  );
  const [selectedRecipeType, setSelectedRecipeType] = useState<
    Option<"recipeType">
  >(savedFilters.recipeType || recipeTypeOptions[0]);
  const [selectedTime, setSelectedTime] = useState<Option<"time">>(
    savedFilters.time || timeOptions[0],
  );
  const [selectedFavorite, setSelectedFavorite] = useState<Option<"favorite">>(
    savedFilters.favorite || favoriteOptions[0],
  );

  // Save filters
  useEffect(() => {
    const filters = {
      cuisine: selectedCuisine,
      recipeType: selectedRecipeType,
      time: selectedTime,
      favorite: selectedFavorite,
    };
    localStorage.setItem(localStorageKey, JSON.stringify(filters));
  }, [selectedCuisine, selectedRecipeType, selectedTime, selectedFavorite]);

  // Reset pagination on filter change
  useEffect(() => {
    setCurrentPage(1);
    setRecipes([]);
    setHasMore(true);
  }, [selectedCuisine, selectedRecipeType, selectedTime, selectedFavorite]);

  // Fetch recipes
  useEffect(() => {
    const fetchHomeRecipes = async () => {
      try {
        if (currentPage === 1) {
          setIsLoading(true);
        } else {
          setIsFetchingMore(true);
        }

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
          currentPage === 1 ? newRecipes : [...prev, ...newRecipes],
        );

        setHasMore(newRecipes.length === pageLimit);
      } catch (err) {
        console.error(err);
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

  const handleResetFilters = () => {
    setSelectedCuisine(cuisineOptions[0]);
    setSelectedRecipeType(recipeTypeOptions[0]);
    setSelectedTime(timeOptions[0]);
    setSelectedFavorite(favoriteOptions[0]);

    // Show temporary confirmation
    setShowResetMessage(true);
    setTimeout(() => setShowResetMessage(false), 2000);
  };

  const activeFilters = useMemo(() => {
    return [
      selectedCuisine,
      selectedRecipeType,
      selectedTime,
      selectedFavorite,
    ].filter((option) => option.id !== "all");
  }, [
    selectedCuisine,
    selectedRecipeType,
    selectedTime,
    selectedFavorite,
  ]);

  const retryFetch = () => {
    setCurrentPage(1);
  };

  return (
    <div className="flex flex-col items-center">

      {/* Error Feedback */}
      {isError && (
        <div className="flex flex-col items-center gap-3 mb-6">
          <p className="text-warning text-sm">
            We couldn’t load recipes. Please check your connection.
          </p>
          <Button onClick={retryFetch} variant="secondary">
            Retry
          </Button>
        </div>
      )}

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

        <Button onClick={handleResetFilters} className="w-40" variant="secondary">
          Reset Filters
        </Button>

        {showResetMessage && (
          <p className="text-xs text-accent animate-fade-in">
            Filters reset successfully
          </p>
        )}

        <p className="text-xs text-secondary-text text-center">
          Filters update recipes automatically
        </p>
      </div>

      {/* Results */}
      <div className="max-w-6xl mx-auto px-6 sm:px-10 lg:px-20 w-full relative">

        {/* Loading Overlay */}
        {isLoading && (
          <div className="absolute inset-0 bg-white/60 backdrop-blur-sm flex justify-center items-center z-10">
            <p className="text-sm text-primary-text animate-pulse">
              Updating recipes...
            </p>
          </div>
        )}

        <p className="text-sm mb-2 text-secondary-text">
          Showing {recipes.length} recipe{recipes.length !== 1 ? "s" : ""}
        </p>

        {activeFilters.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {activeFilters.map((filter) => (
              <span
                key={filter.id}
                className="px-3 py-1 bg-accent/10 text-accent text-sm rounded-full"
              >
                {filter.label}
              </span>
            ))}
          </div>
        )}

        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-3 place-items-center transition-opacity duration-300">
          {isLoading && currentPage === 1 ? (
            Array.from({ length: pageLimit }).map((_, i) => (
              <RecipeMinimizeCardSkeletonLoader key={i} />
            ))
          ) : recipes.length === 0 ? (
            <div className="col-span-full flex justify-center items-center h-96">
              <NoRecipesCard
                title="This kitchen is empty!"
                description="No recipes match your filters. Try adjusting them."
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
                authorId={recipe.author_id || ""}
              />
            ))
          )}
        </div>
      </div>

      {/* Load More Feedback */}
      {hasMore && (
        <Button
          onClick={() => setCurrentPage((prev) => prev + 1)}
          className="mt-6"
          isLoading={isFetchingMore}
          disabled={isFetchingMore}
        >
          {isFetchingMore ? "Loading more..." : "Load More"}
        </Button>
      )}
    </div>
  );
}
