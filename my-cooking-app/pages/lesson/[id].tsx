import { getLessonsById } from "@/fetch/cms";
import { LessonType } from "@/types/cms";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Button } from "@/components/button/Button";
import LessonCardSkeleton from "@/components/lessonCard/LessonCardSkeleton";

export default function LessonPage() {
  const router = useRouter();
  const { id } = router.query;

  const [data, setData] = useState<LessonType | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!router.isReady || typeof id !== "string") return;

    setIsLoading(true);
    setData(null);
    setError(null);

    getLessonsById(id)
      .then((data) => {
        if (!data) {
          setError("Lesson not found.");
          return;
        }
        setData(data);
      })
      .catch(() => {
        setError("Error loading lesson.");
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [router.isReady, id]);

  if (error) {
    return (
      <div className="flex flex-col items-center gap-5">
        <h1 className="text-xl">
          We are sorry, but we couldn&apos;t load the requested lesson.
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

  if (isLoading || !data) {
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

  return <div>Lesson Page for ID: {data?.title}</div>;
}
