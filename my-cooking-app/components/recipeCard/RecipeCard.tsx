// RecipeCard.tsx
"use client";

import Image from "next/image";

import { Recipe } from "./RecipeCard.types";
import { RecipeCardSkeleton } from "./RecipeSkeletonLoaderCard";

import LemonImage from "../../public/assets/lemon.png";
import CakeImage from "../../public/assets/cake.png";
import SoupImage from "../../public/assets/soup.png";

export function RecipeCard({
  recipe,
  isLoading,
}: {
  recipe?: Recipe;
  isLoading?: boolean;
}) {
  if (isLoading || !recipe) return <RecipeCardSkeleton />;

  return (
    <article className="w-[360px] bg-section-bg rounded-3xl p-8 shadow-md text-body-text flex flex-col gap-6">
      {/* Header */}
      <header className="flex items-center gap-3">
        <Image
          src={LemonImage}
          alt="Lemon icon"
          width={50}
          height={50}
          className="rounded-md"
        />
        <h1 className="text-3xl font-bold text-primary-text">{recipe.title}</h1>
      </header>

      {/* Description */}
      <p className="text-sm leading-relaxed text-body-text">
        {recipe.description}
      </p>

      {/* Ingredients */}
      <section className="flex justify-between items-start">
        <div>
          <h2 className="text-xl font-semibold mb-2 text-primary-text">
            Ingredients
          </h2>
          <ul className="list-disc ml-5 text-sm">
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
      </section>

      {/* Instructions */}
      <section className="flex justify-between items-start">
        <div>
          <h2 className="text-xl font-semibold mb-2 text-primary-text">
            Instructions
          </h2>
          <ol className="list-decimal ml-5 text-sm">
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

        <div className="flex items-center gap-5">
          <div className="flex items-center gap-1 text-body-text">
            <span>🤍</span>
            <span>{recipe.numberOfLikes}</span>
          </div>
          <div className="flex items-center gap-1 text-body-text">
            <span>🔖</span>
            <span>{recipe.numberOfSaves}</span>
          </div>
        </div>
      </footer>
    </article>
  );
}
