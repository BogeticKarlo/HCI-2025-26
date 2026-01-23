// pages/recipes/[id].tsx
import type { GetServerSideProps, NextPage } from "next";
import { useEffect, useState } from "react";
import { RecipeCard } from "../../components/recipeCard/RecipeCard";
import { RecipeCardSkeleton } from "../../components/recipeCard/RecipeSkeletonLoaderCard";
import { fetchRecipeById } from "../../fetch/fetch";

import { Database } from "@/types/supabase";

type Recipe = Database["public"]["Tables"]["recipes"]["Row"];

type RecipePageProps = {
  recipe: Recipe | null;
};

const RecipePage: NextPage<RecipePageProps> = ({ recipe }) => {
  // Show skeleton on first paint for smooth UX
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Delay one tick so the skeleton shows before hydration
    const timeout = setTimeout(() => setLoading(false), 150);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className="relative flex justify-center mt-2">
      {/* Centered Card */}
      <div>
        {loading ? (
          <RecipeCardSkeleton />
        ) : recipe ? (
          <RecipeCard recipe={recipe} isLoading={false} />
        ) : (
          <p className="text-primary-text">Recipe not found.</p>
        )}
      </div>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps<RecipePageProps> = async (
  context
) => {
  const { id } = context.params as { id: string };

  try {
    const recipe = await fetchRecipeById(id);
    return { props: { recipe } };
  } catch (e) {
    console.error(e);
    return { props: { recipe: null } };
  }
};

export default RecipePage;
