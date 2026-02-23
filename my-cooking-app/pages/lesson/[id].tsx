import { GetServerSideProps } from "next";
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

export default function LessonPage({ lesson, error }: Props) {
  const router = useRouter();
  const [isHydrating, setIsHydrating] = useState(true);
  const [isRetrying, setIsRetrying] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setIsHydrating(false), 120);
    return () => clearTimeout(t);
  }, []);

  // Determine the correct course page for this lesson
  const courseSlug = useMemo(() => {
    if (!lesson) return null;

    // Adjust these if your CMS uses different fields
    return (
      (lesson as any)?.courseSlug ||
      (lesson as any)?.course?.slug ||
      (lesson as any)?.course_id ||
      null
    ) as string | null;
  }, [lesson]);

  const backHref = useMemo(() => {
    if (!courseSlug) return "/learn";
    return `/learn/${courseSlug}`;
  }, [courseSlug]);

  const backLabel = useMemo(() => {
    if (!courseSlug) return "Back to Learn";
    if (courseSlug === "cooking-101") return "Back to Cooking 101";
    if (courseSlug === "culinary-techniques") return "Back to Culinary Techniques";
    if (courseSlug === "cuisine-explorer") return "Back to Cuisine Explorer";
    return "Back to Course";
  }, [courseSlug]);

  const handleBack = () => {
    // Natural mapping: if they came from a course page, normal back makes sense
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
      return;
    }
    // If they landed here directly, go to the correct course page
    router.push(backHref);
  };

  const handleRetry = () => {
    if (isRetrying) return;
    setIsRetrying(true);
    setTimeout(() => window.location.reload(), 200);
  };

  const PageShell = ({ children }: { children: React.ReactNode }) => (
    <div className="w-full max-w-5xl mx-auto px-6 sm:px-10 lg:px-20 py-8">
      {children}
    </div>
  );

  const ContentCard = ({ children }: { children: React.ReactNode }) => (
    <section
      className="w-full bg-white border border-gray-200 rounded-3xl shadow-md p-6 sm:p-8"
      aria-label="Lesson content"
    >
      {/* ✅ Single back button INSIDE the card */}
      <div className="flex items-center justify-between gap-3 mb-6">
        <button
          type="button"
          onClick={handleBack}
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
          aria-label={backLabel}
          title={backLabel}
        >
          <span aria-hidden="true">←</span>
          <span>{backLabel}</span>
        </button>

        {/* (Optional) keep space for future actions without adding extra UI now */}
        <div />
      </div>

      {children}
    </section>
  );

  if (isHydrating) {
    return (
      <PageShell>
        <ContentCard>
          <div role="status" aria-live="polite">
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
        </ContentCard>
      </PageShell>
    );
  }

  if (error) {
    return (
      <PageShell>
        <ContentCard>
          <div
            className="flex flex-col items-center text-center gap-5 border border-red-300 bg-red-50 rounded-2xl p-8"
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
                onClick={() => router.push(backHref)}
                className="cursor-pointer transition-all duration-200 hover:scale-105 active:scale-95"
              >
                {backLabel}
              </Button>
            </div>
          </div>
        </ContentCard>
      </PageShell>
    );
  }

  if (!lesson) {
    return (
      <PageShell>
        <ContentCard>
          <div
            className="flex flex-col items-center text-center gap-5 border border-gray-300 bg-white rounded-2xl p-8"
            role="status"
            aria-live="polite"
          >
            <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center text-black text-2xl font-bold">
              ?
            </div>

            <div className="flex flex-col gap-2">
              <h2 className="text-xl font-semibold text-black">
                Lesson not found
              </h2>
              <p className="text-sm text-black/70 max-w-md">
                This lesson may have been removed or the link might be incorrect.
              </p>
            </div>

            <Button
              onClick={() => router.push(backHref)}
              className="cursor-pointer transition-all duration-200 hover:scale-105 active:scale-95"
            >
              {backLabel}
            </Button>
          </div>
        </ContentCard>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <ContentCard>
        <SingleLesson lesson={lesson} />
      </ContentCard>
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