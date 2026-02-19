// components/lessonCard/LessonCardHero.tsx
import { getMediaImageUrl } from "@/fetch/media";
import { LessonType } from "@/types/cms";
import Image from "next/image";
import { useEffect, useState } from "react";
import LessonCardSkeleton from "./LessonCardSkeleton";

export default function LessonCardHero({
  id,
  title,
  heroImage,
}: Omit<LessonType, "slug" | "updatedAt" | "createdAt" | "video">) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const url = getMediaImageUrl(heroImage);
    setImageUrl(url);
    setLoading(false);
  }, [heroImage]);

  if (loading) return <LessonCardSkeleton />;

  return (
    <article
      className="flex flex-col w-[250px] bg-section-bg rounded-2xl shadow-md overflow-hidden h-80 cursor-pointer
        transition-transform duration-200 hover:scale-[1.03] hover:shadow-lg active:scale-[0.98]"
      onClick={() =>
        (window.location.href = `/lesson/${id}-${title.toLowerCase().replace(/\s+/g, "-")}`)
      }
    >
      <div className="w-full aspect-square">
        <Image
          src={imageUrl || "/placeholder.png"}
          alt={heroImage?.alt || "Lesson Hero Image"}
          width={400}
          height={400}
          loading="eager"
          className="object-cover w-full h-full"
        />
      </div>

      <div className="flex flex-col items-center justify-center py-2 px-5 gap-2 h-full">
        <h2
          className="flex items-center justify-center w-full text-xl text-center"
          style={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
          }}
        >
          {title}
        </h2>
      </div>
    </article>
  );
}
