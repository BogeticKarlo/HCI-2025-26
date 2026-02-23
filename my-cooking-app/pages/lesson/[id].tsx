import { GetServerSideProps } from "next";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import { getLessonsById } from "@/fetch/cms";
import { LessonType } from "@/types/cms";
import { Button } from "@/components/button/Button";
import SingleLesson from "@/components/lessonCard/SingleLesson";

interface Props {
  lesson: LessonType | null;
  error: string | null;
}

const COOKING_101_BACK_URL = "/learn/cooking-101";

export default function LessonPage({ lesson, error }: Props) {
  const router = useRouter();

  const [isHydrating, setIsHydrating] = useState(true);
  const [isRetrying, setIsRetrying] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setIsHydrating(false), 120);
    return () => clearTimeout(t);
  }, []);

  const handleBackToCourse = () => {
    router.push(COOKING_101_BACK_URL);
  };

  const handleRetry = () => {
    if (isRetrying) return;
    setIsRetrying(true);
    setTimeout(() => window.location.reload(), 200);
  };

  const lessonTitle = useMemo(() => {
    // Be defensive about shape differences in CMS data
    const anyLesson = lesson as any;
    return (
      anyLesson?.title ||
      anyLesson?.name ||
      anyLesson?.heading ||
      null
    ) as string | null;
  }, [lesson]);

  const StatusChip = ({ label, icon }: { label: string; icon: string }) => (
    <span className="inline-flex items-center gap-2 text-xs font-semibold text-black bg-accent/20 px-3 py-1 rounded-full">
      <span aria-hidden="true">{icon}</span>
      {label}
    </span>
  );

  const PageShell = ({
    children,
    contentLabel,
    contentIcon,
  }: {
    children: React.ReactNode;
    contentLabel: string;
    contentIcon: string;
  }) => (
    <div className="w-full max-w-5xl mx-auto px-6 sm:px-10 lg:px-20 py-8">
      {/* TOP BAR */}
      <header className="flex flex-col gap-4 mb-6">
        <div className="flex items-start justify-between gap-4">
          {/* Page identity */}
          <div className="flex items-start gap-3">
            <div className="w-11 h-11 rounded-2xl bg-accent/20 flex items-center justify-center text-black font-bold text-lg">
              📘
            </div>

            <div className="flex flex-col">
              <p className="text-xs text-black/70">
                Learn <span className="mx-1">→</span>
                <span className="font-semibold text-black">Cooking 101</span>{" "}
                <span className="mx-1">→</span>
                <span className="font-semibold text-black">Lesson</span>
              </p>

              <h1 className="text-2xl sm:text-3xl font-playfair font-bold text-black leading-tight">
                Lesson
              </h1>

              {lessonTitle && (
                <p className="text-sm text-black/70 mt-1">
                  You’re viewing:{" "}
                  <span className="font-semibold text-black">{lessonTitle}</span>
                </p>
              )}
            </div>
          </div>

          {/* Back button MUST go to /learn/cooking-101 */}
          <button
            type="button"
            onClick={handleBackToCourse}
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
              ${
                isRetrying
                  ? "opacity-60 cursor-not-allowed"
                  : "cursor-pointer hover:scale-105 hover:shadow-md hover:bg-gray-50 active:scale-95"
              }
            `}
            aria-label="Go back to Cooking 101 course"
            title={isRetrying ? "Please wait…" : "Back to Cooking 101"}
          >
            ← Back to Cooking 101
          </button>
        </div>

        <div className="border-t border-gray-200" />
      </header>

      {/* CONTENT HEADER */}
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <StatusChip label={contentLabel} icon={contentIcon} />
          <span className="text-xs text-black/60">
            This area updates based on your connection and lesson availability.
          </span>
        </div>
      </div>

      {children}
    </div>
  );

  if (isHydrating) {
    return (
      <PageShell contentLabel="Loading" contentIcon="⏳">
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

          <p className="mt-5 text-xs text-black/60">
            Tip: If this takes too long, try Retry (in the error state) or go
            back to Cooking 101.
          </p>
        </div>
      </PageShell>
    );
  }

  if (error) {
    return (
      <PageShell contentLabel="Error" contentIcon="⚠️">
        <div
          className="flex flex-col items-center text-center gap-5 border border-red-300 bg-red-50 rounded-2xl p-8 shadow-sm"
          role="alert"
          aria-live="assertive"
        >
          <div className="w-14 h-14 rounded-2xl bg-red-100 flex items-center justify-center text-red-700 text-2xl font-bold">
            !
          </div>

          <div className="flex flex-col gap-2">
            <h2 className="text-xl font-semibold text-black">
              We couldn’t load this lesson
            </h2>
            <p className="text-sm text-black/80 max-w-xl">
              {error} Please check your connection and try again.
            </p>
          </div>

          <div className="text-sm text-black/70 max-w-xl">
            <p className="font-semibold text-black mb-1">What you can do:</p>
            <ul className="list-disc list-inside text-left">
              <li>Press Retry to attempt loading again.</li>
              <li>Go back to Cooking 101 and open a different lesson.</li>
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 mt-2">
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

            <Button
              variant="secondary"
              onClick={handleBackToCourse}
              className="cursor-pointer transition-all duration-200 hover:scale-105 active:scale-95"
            >
              Back to Cooking 101
            </Button>
          </div>

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
      <PageShell contentLabel="Not found" contentIcon="🔎">
        <div
          className="flex flex-col items-center text-center gap-5 border border-gray-300 bg-white rounded-2xl p-8 shadow-sm"
          role="status"
          aria-live="polite"
        >
          <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center text-black text-2xl font-bold">
            ?
          </div>

          <div className="flex flex-col gap-2">
            <h2 className="text-xl font-semibold text-black">Lesson not found</h2>
            <p className="text-sm text-black/70 max-w-md">
              This lesson may have been removed or the link might be incorrect.
            </p>
          </div>

          <div className="text-sm text-black/70 max-w-md">
            <p className="font-semibold text-black mb-1">Next step:</p>
            <p>Go back to Cooking 101 and select another lesson.</p>
          </div>

          <Button
            onClick={handleBackToCourse}
            className="cursor-pointer transition-all duration-200 hover:scale-105 active:scale-95"
          >
            Back to Cooking 101
          </Button>
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell contentLabel="Lesson content" contentIcon="✅">
      <section
        className="w-full bg-white border border-gray-200 rounded-3xl shadow-md p-6 sm:p-8"
        aria-label="Lesson content"
      >
        <div className="flex items-center justify-between gap-3 mb-6">
          <div className="flex items-center gap-2">
            <span className="text-black">📄</span>
            <p className="text-sm font-semibold text-black">
              Content
              {lessonTitle ? (
                <span className="font-normal text-black/70"> — {lessonTitle}</span>
              ) : null}
            </p>
          </div>

          {/* Also goes to Cooking 101 (not /learn) */}
          <button
            type="button"
            onClick={handleBackToCourse}
            className="text-xs text-black/70 underline cursor-pointer"
            title="Back to Cooking 101"
            aria-label="Back to Cooking 101"
          >
            Back to Cooking 101
          </button>
        </div>

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