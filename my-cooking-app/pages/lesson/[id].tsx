import { GetServerSideProps } from "next";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import { getLessonsById } from "@/fetch/cms";
import { LessonType } from "@/types/cms";
import { Button } from "@/components/button/Button";
import SingleLesson from "@/components/lessonCard/SingleLesson";
import backArrow from "@/assets/backArrow.png"; // adjust path if needed

interface Props {
  lesson: LessonType | null;
  error: string | null;
}

export default function LessonPage({ lesson, error }: Props) {
  const router = useRouter();

  const [isHydrating, setIsHydrating] = useState(true);
  const [isRetrying, setIsRetrying] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setIsHydrating(false), 120);
    return () => clearTimeout(t);
  }, []);

  const handleRetry = () => {
    if (isRetrying) return;
    setIsRetrying(true);
    setTimeout(() => window.location.reload(), 200);
  };

  return (
    <div className="relative flex flex-col items-center gap-10 w-full">
      {/* SINGLE BACK BUTTON (replacing all previous ones) */}
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

      {/* LOADING FEEDBACK */}
      {isHydrating && (
        <div className="w-full max-w-5xl mx-auto px-6 sm:px-10 lg:px-20 py-8">
          <div
            className="w-full bg-white border border-gray-200 rounded-3xl shadow-md p-8"
            role="status"
            aria-live="polite"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-6 h-6 border-2 border-accent border-t-transparent rounded-full animate-spin" />
              <p className="text-sm font-medium text-primary-text">
                Loading lesson…
              </p>
            </div>

            <div className="space-y-3">
              <div className="h-6 w-2/3 bg-gray-200 animate-pulse rounded" />
              <div className="h-4 w-full bg-gray-200 animate-pulse rounded" />
              <div className="h-4 w-5/6 bg-gray-200 animate-pulse rounded" />
              <div className="h-4 w-4/6 bg-gray-200 animate-pulse rounded" />
            </div>
          </div>
        </div>
      )}

      {/* ERROR STATE (Feedback improvement) */}
      {!isHydrating && error && (
        <div className="w-full max-w-5xl mx-auto px-6 sm:px-10 lg:px-20">
          <div
            className="flex flex-col items-center text-center gap-5 border border-red-300 bg-red-50 rounded-3xl p-10 shadow-md"
            role="alert"
            aria-live="assertive"
          >
            <div className="w-16 h-16 rounded-2xl bg-red-100 flex items-center justify-center text-red-700 text-2xl font-bold">
              !
            </div>

            <div className="flex flex-col gap-2">
              <h2 className="text-xl font-semibold text-primary-text">
                We couldn’t load this lesson
              </h2>
              <p className="text-sm text-primary-text opacity-80 max-w-xl">
                {error} Please check your internet connection and try again.
              </p>
            </div>

            <Button
              onClick={handleRetry}
              disabled={isRetrying}
              className="cursor-pointer transition-all duration-200 hover:scale-105 active:scale-95"
            >
              {isRetrying ? "Retrying…" : "Retry"}
            </Button>
          </div>
        </div>
      )}

      {/* NOT FOUND STATE */}
      {!isHydrating && !error && !lesson && (
        <div className="w-full max-w-5xl mx-auto px-6 sm:px-10 lg:px-20">
          <div className="flex flex-col items-center text-center gap-4 border border-gray-300 bg-white rounded-3xl p-10 shadow-md">
            <h2 className="text-xl font-semibold text-primary-text">
              Lesson not found
            </h2>
            <p className="text-sm text-primary-text opacity-80">
              This lesson may have been removed or the link might be incorrect.
            </p>
          </div>
        </div>
      )}

      {/* MAIN CONTENT (Visual hierarchy preserved) */}
      {!isHydrating && lesson && (
        <div className="w-full max-w-5xl mx-auto px-6 sm:px-10 lg:px-20">
          <div
            className="w-full bg-white border border-gray-200 rounded-3xl shadow-md p-6 sm:p-8"
            aria-label="Lesson content"
          >
            <SingleLesson lesson={lesson} />
          </div>
        </div>
      )}
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.query;

  if (typeof id !== "string") {
    return {
      props: {
        lesson: null,
        error: "Invalid lesson ID.",
      },
    };
  }

  try {
    const lesson = await getLessonsById(id);

    if (!lesson) {
      return {
        props: {
          lesson: null,
          error: "Lesson not found.",
        },
      };
    }

    return {
      props: {
        lesson,
        error: null,
      },
    };
  } catch (err) {
    return {
      props: {
        lesson: null,
        error: "Error loading lesson.",
      },
    };
  }
};