// pages/recipes/[id].tsx
import type { GetServerSideProps, NextPage } from "next";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { RecipeCard } from "../../components/recipeCard/RecipeCard";
import { RecipeCardSkeleton } from "../../components/recipeCard/RecipeSkeletonLoaderCard";
import Image from "next/image";
import backArrow from "../../public/assets/backArrow.png";

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

  const router = useRouter();

  useEffect(() => {
    // Delay one tick so the skeleton shows before hydration
    const timeout = setTimeout(() => setLoading(false), 150);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className="relative flex justify-center mt-2">
      {/* Back Arrow — positioned to the left of the centered card */}
      <button
        onClick={() => router.back()}
        className="
      absolute left-0 top-2
      cursor-pointer
      transition duration-200
      hover:scale-110 hover:opacity-80
    "
      >
        <Image
          src={backArrow}
          alt="Back"
          width={48}
          height={48}
          className="w-10 h-10 md:w-12 md:h-12"
        />
      </button>

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
