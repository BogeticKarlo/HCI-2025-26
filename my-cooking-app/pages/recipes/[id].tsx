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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => setLoading(false), 150);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <main className="w-full min-h-screen bg-main-bg py-6 sm:py-12 px-2 sm:px-0">
      <div className="w-full flex justify-center">
        {loading ? (
          <RecipeCardSkeleton />
        ) : recipe ? (
          <RecipeCard recipe={recipe} isLoading={false} />
        ) : (
          <p className="text-primary-text">Recipe not found.</p>
        )}
      </div>
    </main>
  );
};

export const getServerSideProps: GetServerSideProps<RecipePageProps> = async (
  context,
) => {
  const { id } = context.params as { id: string };
  const recipeId = id.slice(-36);

  try {
    const recipe = await fetchRecipeById(recipeId);
    return { props: { recipe } };
  } catch (e) {
    console.error(e);
    return { props: { recipe: null } };
  }
};

export default RecipePage;
