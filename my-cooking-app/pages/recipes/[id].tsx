// pages/recipes/[id].tsx
import type { GetServerSideProps, NextPage } from "next";
import { useEffect, useState } from "react";
import { RecipeCard } from "../../components/recipeCard/RecipeCard";
import { RecipeCardSkeleton } from "../../components/recipeCard/RecipeSkeletonLoaderCard";

type Recipe = {
  id: string;
  createdAt: number;
  title: string;
  description: string;
  ingredients: string[];
  instructions: string[];
  author: string;
  numberOfLikes: number;
  numberOfSaves: number;
  fileUrl: string;
};

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
          <p className="text-gray-800">Recipe not found.</p>
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
    const res = await fetch(process.env.NEXT_PUBLIC_API_URL as string);

    if (!res.ok) return { props: { recipe: null } };

    const data: Recipe[] = await res.json();
    const recipe = data.find((r) => r.id === id) ?? null;

    return { props: { recipe } };
  } catch (e) {
    console.error(e);
    return { props: { recipe: null } };
  }
};

export default RecipePage;
