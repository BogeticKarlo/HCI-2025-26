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

  const recipesCount = recipes.length;

  return (
    <div className="flex flex-col items-center">
      <h1 className="font-playfair font-bold text-[40px] text-center mb-8 text-primary-text">
        My Recipes
      </h1>

      {/* Filters + section purpose (Fix #3: management/ownership cue) */}
      <div className="w-full max-w-6xl mx-auto px-6 sm:px-10 lg:px-20">
        <p className="text-sm text-primary-text opacity-80 text-center mb-6">
          Browse and manage the recipes you’ve uploaded.
        </p>
      </div>

      {/* FILTERS */}
      <div className="flex flex-col w-9/10 items-center gap-8 mb-6">
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

        <p className="text-xs text-black text-center">
          Filters update recipes automatically
        </p>
      </div>

      {/* ACTIVE CHIPS (centered) */}
      {activeChips.length > 0 && (
        <div className="w-full max-w-6xl mx-auto px-6 sm:px-10 lg:px-20">
          <div className="flex flex-wrap gap-3 mb-5 items-center justify-center">
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

      {/* Divider + Results header grouped (Fix #1 + #2: proximity + stronger results hierarchy) */}
      <div className="w-full max-w-6xl mx-auto px-6 sm:px-10 lg:px-20">
        <div className="border-t border-gray-200 my-5" />

        <div className="flex items-end justify-between gap-4 flex-wrap mb-4">
          <div className="flex flex-col gap-1">
            <h2 className="text-lg font-semibold text-primary-text">
              Your Recipes{" "}
              <span className="opacity-80">({recipesCount})</span>
            </h2>
            <p className="text-sm text-primary-text opacity-80">
              {recipesCount === 0
                ? "No recipes to show yet."
                : "Click a card to open a recipe."}
            </p>
          </div>

          {/* Management signifiers (Fix #3: explicit actions) */}
          <div className="flex items-center gap-2 text-xs text-primary-text opacity-80">
            <span className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white/60 px-3 py-2">
              <span aria-hidden>👁️</span> View
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white/60 px-3 py-2">
              <span aria-hidden>✏️</span> Edit
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white/60 px-3 py-2">
              <span aria-hidden>🗑️</span> Delete
            </span>
          </div>
        </div>
      </div>

      {/* GRID + ERROR STATE */}
      <div className="max-w-6xl mx-auto px-6 sm:px-10 lg:px-20 w-full pb-2">
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-3 place-items-center min-h-[220px]">
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
            <div className="col-span-full flex justify-center items-center py-12">
              <NoRecipesCard
                title="Your kitchen is empty!"
                description="No recipes fitting those filters yet — time to cook up something amazing."
                buttonText="Create your first recipe"
              />
            </div>
          ) : (
            <>
              {/* First load skeletons (Fix #2: clearer feedback) */}
              {isLoading && currentPage === 1
                ? Array.from({ length: pageLimit }).map((_, i) => (
                    <RecipeMinimizeCardSkeletonLoader key={`first-${i}`} />
                  ))
                : recipes.map((recipe) => {
                    const recipeId = recipe.id || "";
                    const titleSlug = slugify(recipe.title || "recipe");
                    const href = `/recipes/${recipeId}-${titleSlug}`;

                    return (
                      <div key={recipeId} className="w-fit justify-self-center">
                        {/* Card (view) */}
                        <Link
                          href={href}
                          prefetch
                          onClick={() => setLoadingRecipeId(recipeId)}
                          title="Open recipe"
                          className="
                            relative
                            inline-block
                            w-fit
                            cursor-pointer
                            transition-transform duration-200
                            hover:-translate-y-1 hover:shadow-lg
                            focus-visible:outline-none
                            focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2
                            rounded-lg
                            overflow-hidden
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

                        {/* Management actions (Fix #3: signifiers + direct actions) */}
                        <div className="mt-2 flex items-center justify-center gap-2">
                          <button
                            type="button"
                            className="
                              inline-flex items-center justify-center gap-2
                              px-3 py-2 text-xs font-semibold
                              rounded-xl border border-gray-200
                              bg-white/60 text-primary-text
                              shadow-sm
                              transition-all duration-200
                              hover:shadow-md hover:-translate-y-[1px]
                              active:scale-[0.98]
                              focus-visible:outline-none
                              focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2
                            "
                            title="Edit recipe (not implemented)"
                            aria-label="Edit recipe (not implemented)"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              // TODO: implement edit navigation/modal
                            }}
                          >
                            ✏️ Edit
                          </button>

                          <button
                            type="button"
                            className="
                              inline-flex items-center justify-center gap-2
                              px-3 py-2 text-xs font-semibold
                              rounded-xl border border-gray-200
                              bg-white/60 text-primary-text
                              shadow-sm
                              transition-all duration-200
                              hover:shadow-md hover:-translate-y-[1px]
                              active:scale-[0.98]
                              focus-visible:outline-none
                              focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2
                            "
                            title="Delete recipe (not implemented)"
                            aria-label="Delete recipe (not implemented)"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              // TODO: implement delete confirmation + API
                            }}
                          >
                            🗑️ Delete
                          </button>
                        </div>
                      </div>
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