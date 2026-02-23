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
    <article className="relative w-full max-w-[360px] md:max-w-[720px] bg-section-bg rounded-3xl p-8 pt-16 shadow-md text-body-text flex flex-col gap-6">
      {/* BACK BUTTON — NOW TRULY INSIDE THE CARD */}
      <button
        onClick={() => router.back()}
        className="
          absolute left-6 top-6
          flex items-center gap-2 p-2
          cursor-pointer
          transition-all duration-200
          hover:scale-110 hover:opacity-80
          active:scale-95
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
        <span className="text-sm font-semibold text-primary-text">Back</span>
      </button>

      {/* HEADER */}
      <header className="flex items-center justify-center">
        <h1 className="text-3xl font-bold text-primary-text font-playfair text-center">
          {lesson.title}
        </h1>
      </header>

      {/* DESCRIPTION */}
      <p className="text-sm leading-relaxed text-body-text">
        {lesson.description}
      </p>

      {/* VIDEO */}
      {videoUrl ? (
        <video
          src={videoUrl}
          controls
          className="w-full rounded-lg mt-4 shadow-sm"
        />
      ) : (
        <p className="text-center text-gray-500 mt-4">
          Video not available.
        </p>
      )}
    </article>
  );
}