// components/lessonCard/SingleLesson.tsx
import { LessonType } from "@/types/cms";
import { useEffect, useState } from "react";
import Image from "next/image";
import { getMediaVideoUrl } from "@/fetch/media";
import SingleLessonSkeleton from "./SingleLessonSkeleton";
import backArrow from "../../public/assets/backArrow.png";
import { useRouter } from "next/router";

export default function SingleLesson({ lesson }: { lesson: LessonType }) {
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const url = getMediaVideoUrl(lesson.video);
    setVideoUrl(url);
    setLoading(false);
  }, [lesson.video]);

  if (loading) return <SingleLessonSkeleton />;

  return (
    <article
      className="
        w-full
        max-w-[360px]
        md:max-w-[720px]
        bg-section-bg
        rounded-3xl
        p-8
        shadow-md
        text-body-text
        flex
        flex-col
        gap-6
      "
    >
      {/* HEADER (Back button inside card, stable on hover) */}
      <header className="grid grid-cols-[auto,1fr,auto] items-center gap-3">
        {/* Back Button – no scale to prevent left shift */}
        <button
          onClick={() => router.back()}
          className="
            flex items-center gap-2 px-3 py-2
            cursor-pointer
            transition-colors duration-200
            hover:bg-white/60
            hover:opacity-90
            active:opacity-80
            focus-visible:outline-none
            focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2
            rounded-lg
          "
          title="Go back"
          aria-label="Go back to previous page"
        >
          <Image
            src={backArrow}
            alt="Back"
            width={36}
            height={36}
            className="w-9 aspect-square"
          />
          <span className="text-sm font-semibold text-primary-text">
            Back
          </span>
        </button>

        {/* Centered Title */}
        <h1 className="text-3xl font-bold text-primary-text font-playfair text-center">
          {lesson.title}
        </h1>

        {/* Spacer to keep title perfectly centered */}
        <div className="w-[88px]" />
      </header>

      {/* Description */}
      <p className="text-sm leading-relaxed text-body-text">
        {lesson.description}
      </p>

      {/* Video Section */}
      {videoUrl ? (
        <video
          src={videoUrl}
          controls
          className="w-full rounded-lg mt-4"
        />
      ) : (
        <p className="text-center text-gray-500 mt-4">
          Video not available.
        </p>
      )}
    </article>
  );
}