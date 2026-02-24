"use client";

import { useEffect, useState, useMemo } from "react";
import { RecipeMinimizeCard } from "../components/recipeMinimizeCard/RecipeMinimizeCard";
import { RecipeMinimizeCardSkeletonLoader } from "@/components/recipeMinimizeCard/RecipeMinimizeCardSkeletonLoader";
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
  const [loadingRecipeId, setLoadingRecipeId] = useState<string | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const [selectedCuisine, setSelectedCuisine] =
    useState<Option<"cuisine">>(savedFilters.cuisine || cuisineOptions[0]);
  const [selectedRecipeType, setSelectedRecipeType] =
    useState<Option<"recipeType">>(
      savedFilters.recipeType || recipeTypeOptions[0],
    );
  const [selectedTime, setSelectedTime] =
    useState<Option<"time">>(savedFilters.time || timeOptions[0]);
  const [selectedFavorite, setSelectedFavorite] =
    useState<Option<"favorite">>(
      savedFilters.favorite || favoriteOptions[0],
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

  /* ---------------- RESET PAGE ON FILTER CHANGE (+ clear results for clean feedback) ---------------- */
  useEffect(() => {
    setCurrentPage(1);
    setRecipes([]);
    setHasMore(true);
  }, [selectedCuisine, selectedRecipeType, selectedTime, selectedFavorite]);

  /* ---------------- FETCH RECIPES ---------------- */
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
        currentPage === 1 ? newRecipes : [...prev, ...newRecipes],
      );
      setHasMore(newRecipes.length === pageLimit);
    } catch (err) {
      setIsError(true);
    } finally {
      setIsLoading(false);
      setIsFetchingMore(false);
    }
  };

  useEffect(() => {
    fetchHomeRecipes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCuisine, selectedRecipeType, selectedTime, selectedFavorite, currentPage]);

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
  }, [selectedCuisine, selectedRecipeType, selectedTime, selectedFavorite]);

  /* ---------------- HANDLE RECIPE CLICK ---------------- */
  const handleRecipeClick = async (recipeId: string) => {
    setLoadingRecipeId(recipeId);
    try {
      // simulate network delay
      await new Promise((res) => setTimeout(res, 600));
      // navigate to recipe detail page here
      // router.push(`/recipes/${recipeId}`);
    } finally {
      setLoadingRecipeId(null);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <h1 className="font-playfair font-bold text-[40px] text-center mb-8 text-primary-text">
        Check Out Best Recipes
      </h1>

      {/* FILTERS (Fix #1: more contrast + clearer “interactive area”) */}
      <div className="w-full max-w-6xl mx-auto px-6 sm:px-10 lg:px-20">
        <div className="rounded-2xl border border-gray-200 bg-white/70 shadow-sm p-5 sm:p-6">
          <div className="flex items-center justify-between gap-3 flex-wrap mb-4">
            <p className="text-sm font-semibold text-primary-text">
              Filters
              <span className="ml-2 text-xs font-normal text-black/70">
                (updates automatically)
              </span>
            </p>

            {/* Fix #2: small, inline feedback when filters trigger loading */}
            {(isLoading || isFetchingMore) && (
              <span className="text-xs text-black/70" aria-live="polite">
                Updating recipes…
              </span>
            )}
          </div>

          <div className="flex flex-col items-center gap-5">
            <div className="grid grid-cols-2 gap-5 w-full">
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

            <div className="grid grid-cols-2 gap-5 w-full">
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

            {/* Fix #3: reduce empty space + keep helper text close to filters */}
            <p className="text-xs text-black text-center -mt-1">
              Filters update recipes automatically
            </p>
          </div>
        </div>
      </div>

      {/* ACTIVE CHIPS */}
      {activeFilters.length > 0 && (
        <div className="w-full max-w-6xl mx-auto px-6 sm:px-10 lg:px-20">
          <div className="flex flex-wrap gap-3 mt-5 mb-4 justify-center">
            {activeFilters.map(({ type, value }) => {
              if (type === "time") return null;
              return (
                <button
                  key={value.id}
                  onClick={() => resetFilter(type)}
                  className="group flex items-center gap-2 px-4 py-2 text-sm font-medium border border-accent text-accent rounded-full bg-white shadow-sm cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-xl hover:bg-accent hover:text-black active:scale-95"
                  title={`Remove ${value.label} filter`}
                >
                  <span>{value.label}</span>
                  <span className="text-xs font-bold group-hover:rotate-90 transition-transform duration-200">
                    ✕
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* DIVIDER (Fix #3: less vertical space) */}
      <div className="w-full max-w-6xl px-6 sm:px-10 lg:px-20">
        <div className="border-t border-gray-200 my-4" />
      </div>

      {/* RESULTS LABEL */}
      <div className="w-full max-w-6xl px-6 sm:px-10 lg:px-20 mb-4">
        <p className="text-sm font-medium text-primary-text">
          Showing {recipes.length} {recipes.length === 1 ? "recipe" : "recipes"}
        </p>
      </div>

      {/* RECIPES GRID + ERROR STATE */}
      <div className="w-full max-w-6xl mx-auto px-6 sm:px-10 lg:px-20">
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-3 place-items-center min-h-[300px]">
          {isError ? (
            <div className="col-span-full flex flex-col items-center gap-4 text-center">
              <p className="text-lg font-semibold text-primary-text">
                We couldn’t load recipes.
              </p>
              <p className="text-sm text-secondary-text">
                Please check your connection and try again.
              </p>
              <Button
                onClick={() => fetchHomeRecipes()}
                disabled={isLoading || isFetchingMore}
              >
                Retry
              </Button>
            </div>
          ) : recipes.length === 0 && isLoading && currentPage === 1 ? (
            // Fix #2: show skeletons during filter updates / initial load
            Array.from({ length: pageLimit }).map((_, i) => (
              <RecipeMinimizeCardSkeletonLoader key={`home-skel-${i}`} />
            ))
          ) : recipes.length === 0 && !isLoading ? (
            <div className="col-span-full flex justify-center items-center h-96">
              <NoRecipesCard
                title="No recipes found"
                description="Try adjusting your filters."
                buttonText="Create new dish"
              />
            </div>
          ) : (
            <>
              {recipes.map((recipe) => (
                <div
                  key={recipe.id}
                  className="transition-transform duration-200 hover:-translate-y-1 hover:shadow-lg w-full relative cursor-pointer"
                  onClick={() => handleRecipeClick(recipe.id || "")}
                  title="Open recipe"
                >
                  <RecipeMinimizeCard
                    id={recipe.id || ""}
                    title={recipe.title}
                    imageUrl={recipe.image_url || ""}
                    description={recipe.description || ""}
                    authorId={recipe.author_id || ""}
                  />

                  {/* Spinner overlay (existing improvement kept) */}
                  {loadingRecipeId === recipe.id && (
                    <div className="absolute inset-0 flex justify-center items-center bg-white/70 rounded-lg">
                      <div className="w-10 h-10 border-4 border-accent border-t-transparent rounded-full animate-spin" />
                    </div>
                  )}
                </div>
              ))}

              {/* Fix #2: skeletons while fetching more */}
              {isFetchingMore && (
                <>
                  {Array.from({ length: 3 }).map((_, i) => (
                    <RecipeMinimizeCardSkeletonLoader key={`home-more-${i}`} />
                  ))}
                </>
              )}
            </>
          )}
        </div>
      </div>

      {/* LOAD MORE */}
      {hasMore && !isError && (
        <Button
          onClick={() => {
            if (!isFetchingMore && !isLoading) {
              setCurrentPage((prev) => prev + 1);
            }
          }}
          className="mt-6"
          isLoading={isFetchingMore}
          disabled={isFetchingMore || isLoading}
        >
          {isFetchingMore ? "Loading more..." : "Load More"}
        </Button>
      )}
    </div>
  );
}