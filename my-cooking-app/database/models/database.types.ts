export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type CuisineType =
  | "italian"
  | "greek"
  | "mexican"
  | "indian"
  | "french"
  | "japanese"
  | "chinese"
  | "american"
  | "mediterranean"
  | "other";

export type RecipeKind =
  | "quick"
  | "healthy"
  | "cheap"
  | "comfort"
  | "dessert"
  | "vegan"
  | "vegetarian"
  | "high_protein"
  | "other";

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          username: string;
          profile_picture_url: string | null;
          favourite_cuisine: CuisineType | null;
          bio: string | null;
          number_of_uploaded_recipes: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          username: string;
          profile_picture_url?: string | null;
          favourite_cuisine?: CuisineType | null;
          bio?: string | null;
          number_of_uploaded_recipes?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["profiles"]["Insert"]>;
      };

      recipes: {
        Row: {
          id: string;
          author_id: string;
          created_at: string;
          title: string;
          description: string | null;
          ingredients: string[];
          instructions: string[];
          cuisine: CuisineType | null;
          recipe_type: RecipeKind | null;
          image_url: string | null;
          number_of_likes: number;
          number_of_saves: number;
        };
        Insert: {
          id?: string;
          author_id: string;
          created_at?: string;
          title: string;
          description?: string | null;
          ingredients: string[];
          instructions: string[];
          cuisine?: CuisineType | null;
          recipe_type?: RecipeKind | null;
          image_url?: string | null;
          number_of_likes?: number;
          number_of_saves?: number;
        };
        Update: Partial<Database["public"]["Tables"]["recipes"]["Insert"]>;
      };

      stories: {
        Row: {
          id: string;
          author_id: string;
          created_at: string;
          title: string;
          description: string | null;
          image_url: string | null;
          number_of_likes: number;
        };
        Insert: {
          id?: string;
          author_id: string;
          created_at?: string;
          title: string;
          description?: string | null;
          image_url?: string | null;
          number_of_likes?: number;
        };
        Update: Partial<Database["public"]["Tables"]["stories"]["Insert"]>;
      };

      recipe_likes: {
        Row: {
          user_id: string;
          recipe_id: string;
          created_at: string;
        };
        Insert: {
          user_id: string;
          recipe_id: string;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["recipe_likes"]["Insert"]>;
      };

      recipe_saves: {
        Row: {
          user_id: string;
          recipe_id: string;
          created_at: string;
        };
        Insert: {
          user_id: string;
          recipe_id: string;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["recipe_saves"]["Insert"]>;
      };

      story_likes: {
        Row: {
          user_id: string;
          story_id: string;
          created_at: string;
        };
        Insert: {
          user_id: string;
          story_id: string;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["story_likes"]["Insert"]>;
      };

      cooking_lessons: {
        Row: {
          id: string;
          title: string;
          description: string | null;
          video_url: string;
          order_index: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description?: string | null;
          video_url: string;
          order_index?: number;
          created_at?: string;
        };
        Update: Partial<
          Database["public"]["Tables"]["cooking_lessons"]["Insert"]
        >;
      };

      culinary_techniques: {
        Row: {
          id: string;
          title: string;
          description: string | null;
          image_url: string | null;
          video_url: string | null;
          order_index: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description?: string | null;
          image_url?: string | null;
          video_url?: string | null;
          order_index?: number;
          created_at?: string;
        };
        Update: Partial<
          Database["public"]["Tables"]["culinary_techniques"]["Insert"]
        >;
      };
    };

    Enums: {
      cuisine_type: CuisineType;
      recipe_kind: RecipeKind;
    };
  };
}
