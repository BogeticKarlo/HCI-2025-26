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
    <article className="relative w-full max-w-[800px] bg-section-bg rounded-3xl p-4 sm:p-8 pt-14 sm:pt-16 shadow-md text-body-text mx-auto">
      {/* BACK BUTTON — FULL BORDERED CLICKABLE AREA */}
      <button
        onClick={() => router.back()}
        className="
    absolute left-6 top-6
    inline-flex items-center gap-2
    px-4 py-2
    border border-gray-300
    bg-white/80
    rounded-xl
    shadow-sm
    cursor-pointer
    transition-all duration-200
    hover:border-accent hover:bg-white hover:shadow-md
    active:scale-95
    focus-visible:outline-none
    focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2
  "
        title="Go back"
        aria-label="Go back to previous page"
      >
        <Image
          src={backArrow}
          alt="Back"
          width={36}
          height={36}
          className="w-5 h-5"
        />
        <span className="text-sm font-semibold text-primary-text">Back</span>
      </button>
      {/* CENTERED CONTENT WRAPPER */}
      <div className="flex flex-col items-center gap-8 text-center mt-5">
        {/* TITLE */}
        <h1 className="text-3xl md:text-4xl font-bold text-primary-text font-playfair max-w-[650px]">
          {lesson.title}
        </h1>

        {/* DESCRIPTION (controlled line length for better readability) */}
        <p className="text-sm md:text-base leading-relaxed text-body-text max-w-[600px]">
          {lesson.description}
        </p>

        {/* VIDEO */}
        {videoUrl ? (
          <div className="w-full max-w-[700px]">
            <video
              src={videoUrl}
              controls
              className="w-full rounded-xl shadow-sm"
            />
          </div>
        ) : (
          <p className="text-center text-gray-500">Video not available.</p>
        )}
      </div>
    </article>
  );
}
