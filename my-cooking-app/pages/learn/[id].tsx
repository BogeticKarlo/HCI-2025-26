import { GetServerSideProps } from "next";
import { getLessonsPageBySlug } from "@/fetch/cms";
import { LessonPageType } from "@/types/cms";
import { Button } from "@/components/button/Button";
import LessonCardHero from "@/components/lessonCard/LessonCardHero";

interface Props {
  page: LessonPageType | null;
  error: string | null;
}

export default function Cooking101({ page, error }: Props) {
  if (error) {
    return (
      <div className="flex flex-col items-center gap-5 px-6 text-center">
        <h1 className="text-xl text-primary-text">
          We are sorry, but we couldn&apos;t load the requested lesson page.
        </h1>
        <p className="text-primary-text opacity-80">{error}</p>
        <Button onClick={() => window.location.reload()} className="mt-4">
          Retry
        </Button>
      </div>
    );
  }

  if (!page) {
    return (
      <div className="flex flex-col items-center gap-5 px-6 text-center">
        <h1 className="text-primary-text text-xl font-semibold">
          Lesson page not found.
        </h1>
        <p className="text-primary-text opacity-80">
          Please go back and choose another learning path.
        </p>
      </div>
    );
  }

  const lessonsCount = page.lessons?.length ?? 0;

  return (
    <div className="flex flex-col items-center w-full">
      {/* TITLE */}
      <h1
        className="
          font-playfair font-bold
          text-[32px] leading-[120%]
          md:text-[40px]
          text-center mb-2 text-primary-text
        "
      >
        {page.title}
      </h1>

      {/* Short mapping text (no steps) */}
      <div className="w-full max-w-6xl px-6 sm:px-10 lg:px-20 mb-6">
        <p className="text-center text-sm text-primary-text opacity-80">
          Click a lesson card below to open the full lesson page.
        </p>
      </div>

      {/* DIVIDER */}
      <div className="w-full max-w-6xl px-6 sm:px-10 lg:px-20">
        <div className="border-t border-gray-200 my-2" />
      </div>

      {/* SECTION HEADER */}
      <div className="w-full max-w-6xl px-6 sm:px-10 lg:px-20 mt-4 mb-4">
        <div className="flex items-end justify-between gap-4 flex-wrap">
          <div className="flex flex-col gap-1">
            <h2 className="text-lg font-semibold text-primary-text">Lessons</h2>
            <p className="text-sm font-medium text-primary-text">
              Showing {lessonsCount} {lessonsCount === 1 ? "lesson" : "lessons"}
            </p>
          </div>

          {/* Small signifier */}
          {lessonsCount > 0 && (
            <div className="flex items-center gap-2 text-xs text-primary-text opacity-80">
              <span className="inline-block w-2 h-2 rounded-full bg-accent" />
              <span>Cards open a lesson page</span>
            </div>
          )}
        </div>
      </div>

      {/* GRID */}
      <div className="w-full max-w-6xl mx-auto px-6 sm:px-10 lg:px-20 pb-10">
        {lessonsCount === 0 ? (
          <div className="flex flex-col items-center text-center gap-3 py-16">
            <h2 className="text-lg font-semibold text-primary-text">
              No lessons available yet.
            </h2>
            <p className="text-sm text-primary-text opacity-80">
              Please check back later, or open another learning category.
            </p>
          </div>
        ) : (
          <div className="rounded-2xl border border-gray-200 bg-white/50 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-4 sm:px-6 py-3 border-b border-gray-200 bg-white/60">
              <div className="flex items-center gap-3">
                <span className="inline-block w-2.5 h-2.5 rounded-full bg-accent" />
                <p className="text-sm font-semibold text-primary-text">
                  Pick a lesson to begin
                </p>
              </div>
            </div>

            <div className="p-4 sm:p-6">
              <div className="grid justify-center items-stretch gap-10 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {page.lessons?.map((lesson, i) => (
                  <LessonCardHero key={i} {...lesson} />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.query;

  if (typeof id !== "string") {
    return {
      props: {
        page: null,
        error: "Invalid lesson page slug.",
      },
    };
  }

  try {
    const page = await getLessonsPageBySlug(id);

    if (!page) {
      return {
        props: {
          page: null,
          error: "Lesson page not found.",
        },
      };
    }

    return {
      props: {
        page,
        error: null,
      },
    };
  } catch (err) {
    return {
      props: {
        page: null,
        error: "Error loading lesson page.",
      },
    };
  }
};