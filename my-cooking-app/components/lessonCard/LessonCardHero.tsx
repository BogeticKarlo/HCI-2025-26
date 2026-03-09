// components/lessonCard/LessonCardHero.tsx
import { getMediaImageUrl } from "@/fetch/media";
import { LessonType } from "@/types/cms";
import Image from "next/image";
import { useEffect, useMemo, useState, type KeyboardEvent } from "react";
import LessonCardSkeleton from "./LessonCardSkeleton";
import { useRouter } from "next/router";

export default function LessonCardHero({
  id,
  title,
  heroImage,
}: Omit<LessonType, "slug" | "updatedAt" | "createdAt" | "video">) {
  const router = useRouter();

  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Feedback: show spinner overlay like recipe cards
  const [isOpening, setIsOpening] = useState(false);

  const lessonHref = useMemo(() => {
    const slug = title
      .toLowerCase()
      .trim()
      .replace(/[^\p{L}\p{N}\s-]/gu, "")
      .replace(/\s+/g, "-");
    return `/lesson/${id}-${slug}`;
  }, [id, title]);

  useEffect(() => {
    const url = getMediaImageUrl(heroImage);
    setImageUrl(url);
    setLoading(false);
  }, [heroImage]);

  const openLesson = () => {
    if (isOpening) return; // constraint: prevent double-click racing
    setIsOpening(true);
    router.push(lessonHref);
    // If route is fast, clearing isn't necessary; but keeps UX consistent if it doesn't unmount instantly
    window.setTimeout(() => setIsOpening(false), 900);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      openLesson();
    }
  };

  if (loading) return <LessonCardSkeleton />;

  return (
    <article
      role="link"
      tabIndex={0}
      aria-label={`Open lesson: ${title}`}
      onClick={openLesson}
      onKeyDown={onKeyDown}
      title="Click to open lesson"
      className="
        group
        relative
        flex flex-col
        w-full
        max-w-[280px]
        mx-auto
        bg-section-bg
        rounded-2xl
        shadow-md
        overflow-hidden
        h-80

        border border-gray-200/70
        cursor-pointer
        transition-all duration-200
        hover:shadow-lg
        hover:-translate-y-1
        hover:border-accent/60
        active:scale-[0.98]
        focus-visible:outline-none
        focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2
      "
    >
      {/* IMAGE AREA */}
      <div className="relative w-full aspect-square">
        <Image
          src={imageUrl || "/placeholder.png"}
          alt={heroImage?.alt || `Lesson image for ${title}`}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 280px"
          loading="eager"
          className="object-cover"
        />

        {/* DISCOVERABILITY SIGNIFIER */}
        <div
          className="
            absolute inset-0
            bg-black/0
            transition-colors duration-200
            group-hover:bg-black/10
          "
        />

        <div
          className="
            absolute bottom-3 right-3
            opacity-0 translate-y-1
            group-hover:opacity-100 group-hover:translate-y-0
            transition-all duration-200
            text-xs font-semibold
            px-3 py-1.5
            rounded-full
            bg-white/90
            text-primary-text
            border border-gray-200
            shadow-sm
          "
          aria-hidden="true"
        >
          Open →
        </div>
      </div>

      {/* TITLE AREA */}
      <div className="flex flex-col items-center justify-center py-3 px-5 gap-2 h-full">
        <h2
          className="
            w-full
            text-lg
            font-semibold
            text-primary-text
            text-center
            leading-snug
          "
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

        <p className="text-xs text-primary-text/70">Click to open lesson</p>
      </div>

      {/* Spinner overlay (same style as recipe cards on homepage) */}
      {isOpening && (
        <div className="absolute inset-0 flex justify-center items-center bg-white/70 rounded-2xl">
          <div className="w-10 h-10 border-4 border-accent border-t-transparent rounded-full animate-spin" />
        </div>
      )}
    </article>
  );
}
