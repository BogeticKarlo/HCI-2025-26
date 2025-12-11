"use client";

import { useEffect, useState } from "react";
import { RecipeMinimizeCard } from "../components/recipeMinimizeCard/RecipeMinimizeCard";
import { RecipeMinimizeCardSkeletonLoader } from "../components/recipeMinimizeCard/RecipeMinimizeCardSkeletonLoader";

type Recipe = {
  id: string;
  createdAt: number;
  title: string;
  description: string;
  fileUrl: string;
  // other fields exist but we only need these here
};

export default function HomePage() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        setIsLoading(true);
        setIsError(false);

        const res = await fetch(process.env.NEXT_PUBLIC_API_URL as string);
        if (!res.ok) {
          throw new Error("Failed to fetch recipes");
        }

        const data: Recipe[] = await res.json();

        // sort by createdAt desc (newest first)
        const sorted = [...data].sort(
          (a, b) => Number(b.createdAt) - Number(a.createdAt)
        );

        setRecipes(sorted);
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
    <>
      {isError && (
        <p className="text-warning text-sm mb-4">
          Something went wrong while loading recipes.
        </p>
      )}

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
            ? Array.from({ length: 6 }).map((_, i) => (
                <RecipeMinimizeCardSkeletonLoader key={i} />
              ))
            : recipes.map((recipe) => (
                <RecipeMinimizeCard
                  key={recipe.id}
                  id={recipe.id}
                  title={recipe.title}
                  imageUrl={recipe.fileUrl}
                  description={recipe.description}
                />
              ))}
        </div>
      </div>
    </>
  );
}
