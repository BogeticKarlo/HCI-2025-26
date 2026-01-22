// RecipeCard.tsx
"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

import { Recipe } from "./RecipeCard.types";
import { RecipeCardSkeleton } from "./RecipeSkeletonLoaderCard";

import LemonImage from "../../public/assets/lemon.png";
import CakeImage from "../../public/assets/cake.png";
import SoupImage from "../../public/assets/soup.png";
import { HeartIcon } from "@/public/reactComponentAssets/HeartIcon";
import { BookmarkIcon } from "@/public/reactComponentAssets/BookmarkIcon";
import backArrow from "../../public/assets/backArrow.png";

export function RecipeCard({
  recipe,
  isLoading,
}: {
  recipe?: Recipe;
  isLoading?: boolean;
}) {
  const router = useRouter();

  if (isLoading || !recipe) return <RecipeCardSkeleton />;

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
      <section className="flex flex-col md:flex-row items-start gap-6">
        <div className="flex items-start justify-center">
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
        <div className="flex justify-center items-start">
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

      {/* Recipe Image */}
      {recipe.fileUrl && (
        <div className="relative w-full h-48 rounded-2xl overflow-hidden">
          <Image
            src={recipe.fileUrl}
            alt={recipe.title}
            fill
            className="object-cover"
          />
        </div>
      )}

      {/* Footer */}
      <footer className="flex justify-between items-center text-sm text-body-text">
        <span className="text-body-text">{recipe.author}</span>
        <div className="flex flex-col sm:flex-row items-center gap-5">
          {/* Likes */}
          <div className="flex items-center gap-1 text-body-text">
            <button className="w-8 h-8 flex items-center justify-center hover:text-primary-text cursor-pointer transition-all duration-200 hover:scale-110 active:scale-95">
              <HeartIcon className="w-5 h-5" />
            </button>
            <span>{recipe.numberOfLikes}</span>
          </div>
          {/* Saves */}
          <div className="flex items-center gap-1 text-body-text">
            <button className="w-8 h-8 flex items-center justify-center hover:text-primary-text cursor-pointer transition-all duration-200 hover:scale-110 active:scale-95">
              <BookmarkIcon className="w-5 h-5" />
            </button>
            <span>{recipe.numberOfSaves}</span>
          </div>
        </div>
      </footer>
    </article>
  );
}
