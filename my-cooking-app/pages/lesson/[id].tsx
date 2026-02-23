import { GetServerSideProps } from "next";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getLessonsById } from "@/fetch/cms";
import { LessonType } from "@/types/cms";
import { Button } from "@/components/button/Button";
import SingleLesson from "@/components/lessonCard/SingleLesson";

interface Props {
  lesson: LessonType | null;
  error: string | null;
}

export default function LessonPage({ lesson, error }: Props) {
  const [isHydrating, setIsHydrating] = useState(true);
  const [isRetrying, setIsRetrying] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setIsHydrating(false), 120);
    return () => clearTimeout(t);
  }, []);

  const handleRetry = () => {
    // Constraint: prevent rapid double-click / repeated reloads
    if (isRetrying) return;

    setIsRetrying(true);

    // Small delay so user sees the feedback state before reload
    setTimeout(() => {
      window.location.reload();
    }, 200);
  };

  const PageShell = ({
    children,
    contentLabel,
  }: {
    children: React.ReactNode;
    contentLabel: string;
  }) => (
    <div className="w-full max-w-5xl mx-auto px-6 sm:px-10 lg:px-20 py-8">
      <header className="flex items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center text-black font-bold">
            📘
          </div>

          <div className="flex flex-col">
            <p className="text-xs text-black/70">
              Learn <span className="mx-1">→</span>
              <span className="font-semibold text-black">Lesson</span>
            </p>

            <h1 className="text-2xl sm:text-3xl font-playfair font-bold text-black">
              Lesson Page
            </h1>
          </div>
        </div>

        {/* Constraint: disable navigation while retrying (prevents slips) */}
        <Link href="/learn" aria-disabled={isRetrying} tabIndex={isRetrying ? -1 : 0}>
          <button
            disabled={isRetrying}
            className={`
              flex items-center gap-2
              px-4 py-2
              border border-gray-300
              rounded-xl
              bg-white
              text-black font-medium
              shadow-sm
              transition-all duration-200
              focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2
              ${isRetrying ? "opacity-60 cursor-not-allowed" : "cursor-pointer hover:scale-105 hover:shadow-md hover:bg-gray-50 active:scale-95"}
            `}
            aria-label="Go back to lessons"
            title={isRetrying ? "Please wait…" : "Back to lessons"}
          >
            ← Back to Lessons
          </button>
        </Link>
      </header>

      <div className="border-t border-gray-200 mb-6" />

      <div className="mb-4 flex items-center gap-2">
        <span className="text-sm font-semibold text-black bg-accent/20 px-3 py-1 rounded-full">
          {contentLabel}
        </span>
      </div>

      {children}
    </div>
  );

  if (isHydrating) {
    return (
      <PageShell contentLabel="Loading">
        <div
          className="w-full border border-gray-200 bg-white rounded-3xl p-6 sm:p-8 shadow-sm"
          role="status"
          aria-live="polite"
        >
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 border-2 border-accent border-t-transparent rounded-full animate-spin" />
            <p className="text-sm font-medium text-black">Loading lesson…</p>
          </div>

          <div className="mt-6 space-y-3">
            <div className="h-6 w-2/3 bg-gray-200 animate-pulse rounded" />
            <div className="h-4 w-full bg-gray-200 animate-pulse rounded" />
            <div className="h-4 w-5/6 bg-gray-200 animate-pulse rounded" />
            <div className="h-4 w-4/6 bg-gray-200 animate-pulse rounded" />
          </div>
        </div>
      </PageShell>
    );
  }

  if (error) {
    return (
      <PageShell contentLabel="Couldn’t load lesson">
        <div
          className="flex flex-col items-center text-center gap-5 border border-red-300 bg-red-50 rounded-2xl p-8 shadow-sm"
          role="alert"
          aria-live="assertive"
        >
          <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center text-red-600 text-2xl font-bold">
            !
          </div>

          <h2 className="text-xl font-semibold text-black">
            We couldn’t load this lesson
          </h2>

          <p className="text-sm text-black/80 max-w-xl">
            {error} Please check your connection and try again.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 mt-2">
            {/* Constraint: disable while retrying */}
            <Button
              onClick={handleRetry}
              disabled={isRetrying}
              className={`transition-all duration-200 ${
                isRetrying
                  ? "opacity-70 cursor-not-allowed"
                  : "cursor-pointer hover:scale-105 active:scale-95"
              }`}
            >
              <span className="flex items-center gap-2">
                {isRetrying && (
                  <span className="w-4 h-4 border-2 border-accent border-t-transparent rounded-full animate-spin" />
                )}
                {isRetrying ? "Retrying…" : "Retry"}
              </span>
            </Button>

            {/* Constraint: still allow browsing as alternate path (not disabled) */}
            <Link href="/learn">
              <Button
                variant="secondary"
                className="cursor-pointer transition-all duration-200 hover:scale-105 active:scale-95"
              >
                Browse Other Lessons
              </Button>
            </Link>
          </div>

          {/* Extra constraint signifier: tells user why controls might be disabled */}
          {isRetrying && (
            <p className="text-xs text-black/70" role="status" aria-live="polite">
              Retrying now… please wait.
            </p>
          )}
        </div>
      </PageShell>
    );
  }

  if (!lesson) {
    return (
      <PageShell contentLabel="Lesson not found">
        <div
          className="flex flex-col items-center text-center gap-5 border border-gray-300 bg-white rounded-2xl p-8 shadow-sm"
          role="status"
          aria-live="polite"
        >
          <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center text-black text-2xl font-bold">
            ?
          </div>

          <h2 className="text-xl font-semibold text-black">Lesson not found</h2>

          <p className="text-sm text-black/70 max-w-md">
            This lesson may have been removed or the link might be incorrect.
          </p>

          <Link href="/learn">
            <Button className="cursor-pointer transition-all duration-200 hover:scale-105 active:scale-95">
              Go to Lessons
            </Button>
          </Link>
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell contentLabel="Lesson content">
      <section
        className="w-full bg-white border border-gray-200 rounded-3xl shadow-md p-6 sm:p-8"
        aria-label="Lesson content"
      >
        <SingleLesson lesson={lesson} />
      </section>
    </PageShell>
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