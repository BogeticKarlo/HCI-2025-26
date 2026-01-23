import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import { fetchRecipesByUser } from "../../fetch/fetch";
import { RecipeMinimizeCard } from "@/components/recipeMinimizeCard/RecipeMinimizeCard";
import { RecipeMinimizeCardSkeletonLoader } from "@/components/recipeMinimizeCard/RecipeMinimizeCardSkeletonLoader";
import { Database } from "@/types/supabase";
import { NoRecipesCard } from "@/components/noRecipes/NoRecipesCard";

type Recipe = Database["public"]["Tables"]["recipes"]["Row"];

export default function MyRecipes() {
  const { user } = useAuth();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const loadRecipes = async () => {
      setLoading(true);
      const data = await fetchRecipesByUser(user.id);
      setRecipes(data);
      setLoading(false);
    };

    loadRecipes();
  }, [user]);

  if (!user) return null;

  return (
    <div>
      <h1
        className="
          font-playfair font-bold 
          text-[32px] leading-[120%] 
          md:text-[40px] 
          text-center mb-10 text-primary-text
        "
      >
        My Recipes
      </h1>

      <div className="max-w-6xl mx-auto px-6 sm:px-10 lg:px-20">
        {loading ? (
          <div
            className="
        grid 
        gap-6
        grid-cols-1 md:grid-cols-2 xl:grid-cols-3
        place-items-center
      "
          >
            {Array.from({ length: 12 }).map((_, i) => (
              <RecipeMinimizeCardSkeletonLoader key={i} />
            ))}
          </div>
        ) : recipes.length === 0 ? (
          <div className="flex justify-center">
            <NoRecipesCard
              title="Your kitchen is empty!"
              description="No recipes yet — not even a secret family dish 👀 Time to break the
        silence and cook up something amazing."
              buttonText="Create your first recipe"
              quote="Even instant noodles deserve a recipe 😌"
            />
          </div>
        ) : (
          <div
            className="
        grid 
        gap-6
        grid-cols-1 md:grid-cols-2 xl:grid-cols-3
        place-items-center
      "
          >
            {recipes.map((recipe) => (
              <RecipeMinimizeCard
                key={recipe.id}
                id={recipe.id}
                title={recipe.title}
                imageUrl={recipe.image_url || ""}
                description={recipe.description || ""}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
