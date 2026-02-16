import { getLessonsPageBySlug } from "@/fetch/cms";
import { LessonPageType } from "@/types/cms";
import { useEffect, useState } from "react";
import { Button } from "@/components/button/Button";
import { useRouter } from "next/router";
import LessonCardSkeleton from "@/components/lessonCard/LessonCardSkeleton";
import LessonCardHero from "@/components/lessonCard/LessonCardHero";

export default function Cooking101() {
  const router = useRouter();
  const { id } = router.query;

  const [page, setPage] = useState<LessonPageType | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!router.isReady || typeof id !== "string") return;

    setIsLoading(true);
    setPage(null);
    setError(null);

    getLessonsPageBySlug(id)
      .then((data) => {
        if (!data) {
          setError("Lesson page not found.");
          return;
        }
        setPage(data);
      })
      .catch(() => {
        setError("Error loading lesson page.");
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [router.isReady, id]);

  if (error) {
    return (
      <div className="flex flex-col items-center gap-5">
        <h1 className="text-xl">
          We are sorry, but we couldn&apos;t load the requested lesson page.
          <br />
          Please try again later or contact support if the problem persists.
        </h1>
        <p>{error}</p>
        <Button onClick={() => window.location.reload()} className="mt-4">
          Retry
        </Button>
      </div>
    );
  }

  if (isLoading || !page) {
    return (
      <div className="flex flex-col items-center gap-10">
        <div className="h-10 w-1/3 bg-secondary-text rounded-md animate-pulse" />
        <div className="grid justify-center items-center gap-10 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <LessonCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center">
      <h1
        className="
  font-playfair font-bold 
  text-[32px] leading-[120%] 
  md:text-[40px] 
  text-center mb-10 text-primary-text
"
      >
        {page?.title}
      </h1>
      <div className="flex flex-col items-center gap-10">
        <div className="grid justify-center items-center gap-10 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {page.lessons?.map((lesson, i) => (
            <LessonCardHero key={i} {...lesson} />
          ))}
        </div>
      </div>
    </div>
  );
}
