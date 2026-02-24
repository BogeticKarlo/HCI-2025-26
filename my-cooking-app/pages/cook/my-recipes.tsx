"use client";

import { useAuth } from "@/context/AuthContext";
import { useEffect, useMemo, useState } from "react";
import { fetchRecipesByUser } from "../../fetch/fetch";
import { RecipeMinimizeCard } from "@/components/recipeMinimizeCard/RecipeMinimizeCard";
import { RecipeMinimizeCardSkeletonLoader } from "@/components/recipeMinimizeCard/RecipeMinimizeCardSkeletonLoader";
import { NoRecipesCard } from "@/components/noRecipes/NoRecipesCard";
import { BaseRecipe } from "@/database/models/domain";
import { Option } from "@/components/dropdown/Dropdown.types";
import {
  cuisineOptions,
  recipeTypeOptions,
  timeOptions,
  favoriteOptions,
} from "@/components/dropdown/DropdownOptions";
import { Dropdown } from "@/components/dropdown/Dropdown";
import { Button } from "@/components/button/Button";
import Link from "next/link";

const localStorageKey = "myRecipeFilters";
const pageLimit = 12;

export default function MyRecipes() {
  const { user } = useAuth();

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

  if (!user) return null;

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

  /* ---------------- RESET PAGE ON FILTER CHANGE ---------------- */
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCuisine, selectedRecipeType, selectedTime, selectedFavorite]);

  /* ---------------- FETCH RECIPES ---------------- */
  const fetchMyRecipes = async () => {
    try {
      if (currentPage === 1) setIsLoading(true);
      else setIsFetchingMore(true);

      setIsError(false);

      const newRecipes = await fetchRecipesByUser(user.id, {
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

  useEffect(() => {
    fetchMyRecipes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    user.id,
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
  }, [selectedCuisine, selectedRecipeType, selectedTime, selectedFavorite]);

  // Match homepage behavior: hide time chip, keep favorite removable
  const activeChips = useMemo(() => {
    return activeFilters.filter((f) => f.type !== "time");
  }, [activeFilters]);

  /* ---------------- SLUG HELPER ---------------- */
  const slugify = (text: string) =>
    text
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^\p{L}\p{N}-]+/gu, "")
      .replace(/-+/g, "-");

  return (
    <div className="flex flex-col items-center">
      {/* FIX #1: reduce empty vertical space (title → filters) */}
      <h1 className="font-playfair font-bold text-[40px] text-center mb-6 text-primary-text">
        My Recipes
      </h1>

      {/* FILTERS (contrast + clearer “interactive area”) */}
      <div className="w-full max-w-6xl mx-auto px-6 sm:px-10 lg:px-20">
        <div className="rounded-2xl border border-gray-200 bg-white/70 shadow-sm p-5 sm:p-6">
          <div className="flex items-center justify-between gap-3 flex-wrap mb-4">
            <p className="text-sm font-semibold text-primary-text">
              Filters
              <span className="ml-2 text-xs font-normal text-black/70">
                (updates automatically)
              </span>
            </p>

            {/* Inline feedback when filters trigger loading */}
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

            {/* Keep helper text close to filters */}
            <p className="text-xs text-black text-center -mt-1">
              Filters update recipes automatically
            </p>
          </div>
        </div>
      </div>

      {/* ACTIVE CHIPS (centered) */}
      {activeChips.length > 0 && (
        <div className="w-full max-w-6xl mx-auto px-6 sm:px-10 lg:px-20">
          {/* FIX #1: tighten spacing between filters and chips */}
          <div className="flex flex-wrap gap-3 mt-4 mb-4 items-center justify-center">
            {activeChips.map(({ type, value }) => (
              <button
                key={`${type}-${value.id}`}
                onClick={() => resetFilter(type)}
                className="
                  group flex items-center gap-2
                  px-4 py-2 text-sm font-medium
                  border border-accent text-accent
                  rounded-full bg-white shadow-sm
                  cursor-pointer transition-all duration-200
                  hover:scale-105 hover:shadow-xl hover:bg-accent hover:text-black
                  active:scale-95
                  focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2
                "
                title={`Remove ${value.label} filter`}
              >
                <span>{value.label}</span>
                <span className="text-xs font-bold group-hover:rotate-90 transition-transform duration-200">
                  ✕
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* FIX #1: reduce divider spacing */}
      <div className="w-full max-w-6xl px-6 sm:px-10 lg:px-20">
        <div className="border-t border-gray-200 my-4" />
      </div>

      {/* FIX #1: reduce spacing before grid */}
      <div className="w-full max-w-6xl px-6 sm:px-10 lg:px-20 mb-3">
        <p className="text-sm font-medium text-primary-text">
          Showing {recipes.length} {recipes.length === 1 ? "recipe" : "recipes"}
        </p>
      </div>

      {/* GRID + ERROR STATE */}
      <div className="max-w-6xl mx-auto px-6 sm:px-10 lg:px-20 w-full">
        {/* FIX #1: reduce min height so page doesn’t feel “empty” */}
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-3 place-items-center min-h-[160px]">
          {isError ? (
            <div className="col-span-full flex flex-col items-center gap-4 text-center">
              <p className="text-lg font-semibold text-primary-text">
                We couldn’t load your recipes.
              </p>
              <p className="text-sm text-secondary-text">
                Please check your connection and try again.
              </p>
              <Button
                onClick={() => fetchMyRecipes()}
                disabled={isLoading || isFetchingMore}
              >
                Retry
              </Button>
            </div>
          ) : recipes.length === 0 && !isLoading ? (
            <div className="col-span-full flex justify-center items-center h-96">
              <NoRecipesCard
                title="Your kitchen is empty!"
                description="No recipes fitting those filters yet — time to cook up something amazing."
                buttonText="Create your first recipe"
              />
            </div>
          ) : (
            <>
              {/* First load skeletons */}
              {isLoading && currentPage === 1
                ? Array.from({ length: pageLimit }).map((_, i) => (
                    <RecipeMinimizeCardSkeletonLoader key={`first-${i}`} />
                  ))
                : recipes.map((recipe) => {
                    const recipeId = recipe.id || "";
                    const titleSlug = slugify(recipe.title || "recipe");
                    const href = `/recipes/${recipeId}-${titleSlug}`;

                    return (
                      <Link
                        key={recipeId}
                        href={href}
                        prefetch
                        onClick={() => setLoadingRecipeId(recipeId)}
                        title="Open recipe"
                        className="
                          relative
                          inline-block
                          w-fit
                          justify-self-center
                          cursor-pointer
                          transition-transform duration-200
                          hover:-translate-y-1 hover:shadow-lg
                        "
                      >
                        <RecipeMinimizeCard
                          id={recipeId}
                          title={recipe.title}
                          imageUrl={recipe.image_url || ""}
                          description={recipe.description || ""}
                          authorId={recipe.author_id || ""}
                        />

                        {/* Spinner overlay (only covers the card now) */}
                        {loadingRecipeId === recipeId && (
                          <div className="absolute inset-0 flex justify-center items-center bg-white/70 rounded-lg">
                            <div className="w-10 h-10 border-4 border-accent border-t-transparent rounded-full animate-spin" />
                          </div>
                        )}
                      </Link>
                    );
                  })}

              {/* Pagination continuity: skeletons below grid on page 2+ */}
              {isFetchingMore && currentPage > 1 && (
                <>
                  {Array.from({ length: 3 }).map((_, i) => (
                    <RecipeMinimizeCardSkeletonLoader key={`more-${i}`} />
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