// RecipeMinimizeCard.tsx
"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { RecipeMinimizeCardProps } from "./RecipeMinimizeCard.types";

export function RecipeMinimizeCard({
  id,
  title,
  imageUrl,
  description,
}: RecipeMinimizeCardProps) {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/recipes/${id}`);
  };

  return (
    <article
      onClick={handleClick}
      className="
    flex w-[320px] bg-section-bg rounded-2xl shadow-md overflow-hidden h-24 cursor-pointer
    transition-transform duration-200 hover:scale-[1.03] hover:shadow-lg active:scale-[0.98]
  "
    >
      {/* Image */}
      <div className="relative w-24 h-24 shrink-0">
        <Image src={imageUrl} alt={title} fill className="object-cover" />
      </div>

      {/* Text */}
      <div className="flex flex-col px-4 py-3 gap-1 overflow-hidden">
        <h2 className="text-base font-semibold text-primary-text truncate font-playfair">
          {title}
        </h2>
        <p
          className="text-xs text-body-text leading-snug"
          style={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
          }}
        >
          {description}
        </p>
      </div>
    </article>
  );
}
