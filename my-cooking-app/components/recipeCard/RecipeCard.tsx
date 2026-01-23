"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { RecipeCardSkeleton } from "./RecipeSkeletonLoaderCard";
import { useState, useEffect } from "react";
import CakeImage from "../../public/assets/cake.png";
import SoupImage from "../../public/assets/soup.png";
import backArrow from "../../public/assets/backArrow.png";
import { HeartIcon } from "@/public/reactComponentAssets/HeartIcon";
import { BookmarkIcon } from "@/public/reactComponentAssets/BookmarkIcon";
import { Database } from "@/types/supabase";
import { fetchUserById } from "@/fetch/fetch";

type Recipe = Database["public"]["Tables"]["recipes"]["Row"];
type Profile = Database["public"]["Tables"]["profiles"]["Row"];

export function RecipeCard({
  recipe,
  isLoading,
}: {
  recipe?: Recipe;
  isLoading?: boolean;
}) {
  const router = useRouter();
  const [author, setAuthor] = useState<Profile>();

  useEffect(() => {
    if (!recipe?.author_id) return;

    const fetchData = async () => {
      const user = await fetchUserById(recipe.author_id);
      setAuthor(user);
    };

    fetchData();
  }, [recipe?.author_id]);

  if (isLoading || !recipe) return <RecipeCardSkeleton />;

  const publicImageUrl = `https://xhebsnwjpfcdttydwuhg.supabase.co/storage/v1/object/public/recipe-images/${recipe.image_url}`;

  return (
    <article className="w-full max-w-[360px] md:max-w-[720px] bg-section-bg rounded-3xl p-8 shadow-md text-body-text flex flex-col gap-6">
      {/* Header */}
      <header className="flex items-center gap-3">
        <button
          onClick={() => router.back()}
          className="cursor-pointer transition duration-200 hover:scale-110 hover:opacity-80"
        >
          <Image
            src={backArrow}
            alt="Back"
            width={48}
            height={48}
            className="w-15 md:w-12 aspect-square"
          />
        </button>
        <h1 className="text-3xl font-bold text-primary-text font-playfair">
          {recipe.title}
        </h1>
      </header>

      {/* Description */}
      <p className="text-sm leading-relaxed text-body-text">
        {recipe.description}
      </p>

      {/* Ingredients & Instructions */}
      <section className="flex flex-col md:flex-row items-start">
        <div className="flex items-start justify-center lg:w-1/2">
          {/* Ingredients */}
          <div className="md:w-1/2 flex flex-col gap-4">
            <h2 className="text-xl font-semibold mb-2 text-primary-text font-playfair">
              Ingredients
            </h2>
            <ul className="list-disc ml-5 text-sm flex-1">
              {recipe.ingredients.map((item, i) => (
                <li key={i} className="mb-1 text-body-text">
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="w-24 h-20 rounded-xl flex items-center justify-center">
            <Image
              src={CakeImage}
              alt="Cake"
              width={90}
              height={90}
              className="object-contain -rotate-12"
            />
          </div>
        </div>

        {/* Instructions */}
        <div className="flex justify-center items-start lg:w-1/2">
          <div className="md:w-1/2 flex flex-col gap-4">
            <h2 className="text-xl font-semibold mb-2 text-primary-text font-playfair">
              Instructions
            </h2>
            <ol className="list-decimal ml-5 text-sm flex-1">
              {recipe.instructions.map((step, i) => (
                <li key={i} className="mb-1 text-body-text">
                  {step}
                </li>
              ))}
            </ol>
          </div>
          <div className="w-24 h-20 rounded-xl flex items-center justify-center">
            <Image
              src={SoupImage}
              alt="Soup"
              width={80}
              height={80}
              className="object-contain rotate-20"
            />
          </div>
        </div>
      </section>

      {/* Main Recipe Image */}
      {publicImageUrl && (
        <div className="relative w-full h-48 rounded-2xl overflow-hidden">
          <Image
            src={publicImageUrl}
            alt={recipe.title}
            fill
            sizes="100%"
            className="object-cover"
          />
        </div>
      )}

      {/* Footer */}
      <footer className="flex justify-between items-center text-sm text-body-text">
        <span className="text-body-text">
          {author?.username?.split("@")[0]}
        </span>
        <div className="flex flex-col sm:flex-row items-center gap-5">
          {/* Likes */}
          <div className="flex items-center gap-1 text-body-text">
            <button className="w-8 h-8 flex items-center justify-center hover:text-primary-text cursor-pointer transition-all duration-200 hover:scale-110 active:scale-95">
              <HeartIcon className="w-5 h-5" />
            </button>
            <span>{recipe.number_of_likes}</span>
          </div>
          {/* Saves */}
          <div className="flex items-center gap-1 text-body-text">
            <button className="w-8 h-8 flex items-center justify-center hover:text-primary-text cursor-pointer transition-all duration-200 hover:scale-110 active:scale-95">
              <BookmarkIcon className="w-5 h-5" />
            </button>
            <span>{recipe.number_of_saves}</span>
          </div>
        </div>
      </footer>
    </article>
  );
}
