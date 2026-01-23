import type { Database, CuisineType, RecipeKind } from "./database.types";

export type ProfileRow = Database["public"]["Tables"]["profiles"]["Row"];
export type RecipeRow = Database["public"]["Tables"]["recipes"]["Row"];
export type StoryRow = Database["public"]["Tables"]["stories"]["Row"];
export type CookingLessonRow =
  Database["public"]["Tables"]["cooking_lessons"]["Row"];
export type CulinaryTechniqueRow =
  Database["public"]["Tables"]["culinary_techniques"]["Row"];

export type BaseRecipe = Database["public"]["Tables"]["recipes"]["Insert"];

export type UserProfile = {
  id: string;
  username: string;
  profilePictureUrl: string | null;
  favouriteCuisine: CuisineType | null;
  bio: string | null;
  numberOfUploadedRecipes: number;
  createdAt: string;
  updatedAt: string;
};

export function mapProfile(row: ProfileRow): UserProfile {
  return {
    id: row.id,
    username: row.username,
    profilePictureUrl: row.profile_picture_url,
    favouriteCuisine: row.favourite_cuisine,
    bio: row.bio,
    numberOfUploadedRecipes: row.number_of_uploaded_recipes,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function mapRecipe(row: RecipeRow): BaseRecipe {
  return {
    id: row.id,
    author_id: row.author_id,
    created_at: row.created_at,
    title: row.title,
    description: row.description,
    ingredients: row.ingredients,
    instructions: row.instructions,
    cuisine: row.cuisine,
    recipe_type: row.recipe_type,
    image_url: row.image_url,
    number_of_likes: row.number_of_likes,
    number_of_saves: row.number_of_saves,
  };
}

export type Story = {
  id: string;
  authorId: string;
  createdAt: string;
  title: string;
  description: string | null;
  imageUrl: string | null;
  numberOfLikes: number;
  authorUsername?: string;
  authorProfilePictureUrl?: string | null;
  haveUserLiked?: boolean;
};

export function mapStory(row: StoryRow): Story {
  return {
    id: row.id,
    authorId: row.author_id,
    createdAt: row.created_at,
    title: row.title,
    description: row.description,
    imageUrl: row.image_url,
    numberOfLikes: row.number_of_likes,
  };
}

export type CookingLesson = {
  id: string;
  title: string;
  description: string | null;
  videoUrl: string;
  orderIndex: number;
  createdAt: string;
};

export function mapCookingLesson(row: CookingLessonRow): CookingLesson {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    videoUrl: row.video_url,
    orderIndex: row.order_index,
    createdAt: row.created_at,
  };
}

export type CulinaryTechnique = {
  id: string;
  title: string;
  description: string | null;
  imageUrl: string | null;
  videoUrl: string | null;
  orderIndex: number;
  createdAt: string;
};

export function mapCulinaryTechnique(
  row: CulinaryTechniqueRow
): CulinaryTechnique {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    imageUrl: row.image_url,
    videoUrl: row.video_url,
    orderIndex: row.order_index,
    createdAt: row.created_at,
  };
}
