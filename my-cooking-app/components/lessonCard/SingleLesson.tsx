import { type LessonType } from "../../types/cms";
import router from "next/router";
import backArrow from "../../public/assets/backArrow.png";
import Image from "next/image";
import { useEffect, useState } from "react";
import { getMediaVideoUrl } from "@/fetch/cms";
import SingleLessonSkeleton from "./SingleLessonSkeleton";

export default function SingleLesson({ lesson }: { lesson: LessonType }) {
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchVideoUrl = async () => {
      const data = getMediaVideoUrl(lesson.video);
      setVideoUrl(data);
      setLoading(false);
    };

    fetchVideoUrl();
  }, [lesson.video]);

  console.log("Video URL:", videoUrl);

  if (loading) {
    return (
      <div className="flex flex-col items-center gap-5">
        <SingleLessonSkeleton />
      </div>
    );
  }

  return (
    <article className="w-full max-w-[360px] md:max-w-[720px] bg-section-bg rounded-3xl p-8 shadow-md text-body-text flex flex-col gap-6">
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
        <h1 className="text-3xl font-bold text-primary-text font-playfair lg:mr-5">
          {lesson.title}
        </h1>
      </header>

      <p className="text-sm leading-relaxed text-body-text">
        {lesson.description}
      </p>

      {videoUrl ? (
        <video src={videoUrl} controls className="w-full rounded-lg mt-4" />
      ) : (
        <p className="text-center text-gray-500 mt-4">Video not available.</p>
      )}
    </article>
  );
}
