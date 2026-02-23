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
  const fetchUserRecipes = async () => {
    if (!user) return;

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
    fetchUserRecipes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    user?.id,
    selectedCuisine,
    selectedRecipeType,
    selectedTime,
    selectedFavorite,
    currentPage,
  ]);

  /* ---------------- FILTER RESET HELPERS ---------------- */
  const resetFilter = (type: string) => {
    if (type === "cuisine") setSelectedCuisine(cuisineOptions[0]);
    if (type === "recipeType") setSelectedRecipeType(recipeTypeOptions[0]);
    if (type === "time") setSelectedTime(timeOptions[0]);
    if (type === "favorite") setSelectedFavorite(favoriteOptions[0]);
  };

  const resetAllFilters = () => {
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
      }),
    );
  };

  const activeFilters = useMemo(() => {
    return [
      { type: "cuisine", value: selectedCuisine },
      { type: "recipeType", value: selectedRecipeType },
      { type: "time", value: selectedTime },
      { type: "favorite", value: selectedFavorite },
    ].filter((item) => item.value.id !== "all");
  }, [selectedCuisine, selectedRecipeType, selectedTime, selectedFavorite]);

  const activeChips = useMemo(() => {
    // Keep same behavior as your homepage:
    // - hide Date chip completely (latest/oldest)
    // - allow removing Popularity chip (most/least likes)
    return activeFilters.filter((f) => f.type !== "time");
  }, [activeFilters]);

  return (
    <div className="flex flex-col items-center">
      <h1 className="font-playfair font-bold text-[40px] leading-[120%] text-center mb-10 text-primary-text">
        My Recipes
      </h1>

      {/* FILTERS (same model as homepage) */}
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
          Filters update your recipes automatically
        </p>
      </div>

      {/* ACTIVE CHIPS + REMOVE ALL (same style as homepage) */}
      {(activeChips.length > 0 || activeFilters.length > 0) && (
        <div className="w-full max-w-6xl mx-auto px-6 sm:px-10 lg:px-20">
          <div className="flex flex-wrap items-center gap-3 mb-6">
            {activeChips.map(({ type, value }) => (
              <button
                key={`${type}-${value.id}`}
                onClick={() => resetFilter(type)}
                title={`Remove ${value.label} filter`}
                className="
                  group
                  flex items-center gap-2
                  px-4 py-2
                  text-sm font-medium
                  border border-accent
                  text-accent
                  rounded-full
                  bg-white
                  shadow-sm
                  transition-all duration-200 ease-in-out
                  cursor-pointer
                  transform
                  hover:scale-105
                  hover:shadow-xl
                  hover:bg-accent
                  hover:text-black
                  active:scale-95
                  focus:outline-none
                  focus:ring-2 focus:ring-accent
                  focus:ring-offset-2
                "
              >
                <span>{value.label}</span>
                <span className="text-xs font-bold transition-transform duration-200 group-hover:rotate-90">
                  ✕
                </span>
              </button>
            ))}

            {/* Remove all filters button (shows if ANY filter is active) */}
            {activeFilters.length > 0 && (
              <button
                onClick={resetAllFilters}
                title="Remove all filters"
                className="
                  group
                  flex items-center gap-2
                  px-4 py-2
                  text-sm font-medium
                  border border-gray-300
                  text-primary-text
                  rounded-full
                  bg-white
                  shadow-sm
                  transition-all duration-200 ease-in-out
                  cursor-pointer
                  hover:shadow-md
                  hover:-translate-y-[1px]
                  active:scale-95
                  focus:outline-none
                  focus:ring-2 focus:ring-gray-300
                  focus:ring-offset-2
                "
              >
                <span>Remove all</span>
                <span className="text-xs font-bold">✕</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* DIVIDER (same conceptual model improvement as homepage) */}
      <div className="w-full max-w-6xl px-6 sm:px-10 lg:px-20">
        <div className="border-t border-gray-200 my-6" />
      </div>

      {/* RESULTS LABEL (black text like homepage requirement) */}
      <div className="w-full max-w-6xl px-6 sm:px-10 lg:px-20 mb-4">
        <p className="text-sm font-medium text-primary-text">
          Showing {recipes.length} {recipes.length === 1 ? "recipe" : "recipes"}
        </p>
      </div>

      {/* GRID + ERROR STATE (keep structure; add retry like homepage) */}
      <div className="max-w-6xl mx-auto px-6 sm:px-10 lg:px-20 w-full">
        <div
          className={`
            grid gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-3 place-items-center min-h-[300px]
            transition-opacity duration-300
            ${isLoading && currentPage === 1 ? "opacity-60" : "opacity-100"}
          `}
        >
          {isError ? (
            <div className="col-span-full flex flex-col items-center gap-4 text-center">
              <p className="text-lg font-semibold text-primary-text">
                We couldn’t load your recipes.
              </p>
              <p className="text-sm text-secondary-text">
                Please check your connection and try again.
              </p>
              <Button
                onClick={() => fetchUserRecipes()}
                disabled={isLoading || isFetchingMore}
              >
                Retry
              </Button>
            </div>
          ) : isLoading && currentPage === 1 ? (
            Array.from({ length: pageLimit }).map((_, i) => (
              <RecipeMinimizeCardSkeletonLoader key={i} />
            ))
          ) : recipes.length === 0 ? (
            <div className="col-span-full flex justify-center items-center h-96">
              <NoRecipesCard
                title="Your kitchen is empty!"
                description="No recipes fitting those filters yet — time to cook up something amazing."
                buttonText="Create your first recipe"
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

          {/* Pagination continuity: skeletons below grid on page 2+ */}
          {!isError && isFetchingMore && currentPage > 1 && (
            <>
              {Array.from({ length: 3 }).map((_, i) => (
                <RecipeMinimizeCardSkeletonLoader key={`more-${i}`} />
              ))}
            </>
          )}
        </div>
      </div>

      {/* LOAD MORE (disable while loading to prevent double-click conflicts) */}
      {hasMore && !isError && (
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