import { BaseRecipe } from "@/database/models/domain";

const recipeDataFormating = (
  data: any,
  userId: string,
  image?: string | null
): BaseRecipe => {
  return {
    author_id: userId,
    title: data.title,
    description: data.description,
    ingredients: data.ingredients,
    instructions: data.steps,
    cuisine: data.selectedCuisine,
    recipe_type: data.selectedRecipeType,
    image_url: image || null,
    number_of_likes: 0,
    number_of_saves: 0,
    created_at: new Date().toISOString(),
  };
};

export { recipeDataFormating };
