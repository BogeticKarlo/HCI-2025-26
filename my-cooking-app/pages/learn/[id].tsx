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
      {/* Title */}
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

      {/* Discoverability hint */}
      <p className="text-center text-sm text-primary-text opacity-80 mb-6 px-6">
        Choose a lesson below to start learning. Each card opens a full lesson with a video.
      </p>

      {/* Divider (conceptual model clarity) */}
      <div className="w-full max-w-6xl px-6 sm:px-10 lg:px-20">
        <div className="border-t border-gray-200 my-4" />
      </div>

      {/* Results label */}
      <div className="w-full max-w-6xl px-6 sm:px-10 lg:px-20 mb-4">
        <p className="text-sm font-medium text-primary-text">
          Showing {lessonsCount} {lessonsCount === 1 ? "lesson" : "lessons"}
        </p>
        <p className="text-xs text-primary-text opacity-70 mt-1">
          Tip: click a card to open the lesson.
        </p>
      </div>

      {/* Lessons grid */}
      <div className="w-full max-w-6xl mx-auto px-6 sm:px-10 lg:px-20 pb-10">
        {lessonsCount === 0 ? (
          <div className="flex flex-col items-center text-center gap-3 py-16">
            <h2 className="text-lg font-semibold text-primary-text">
              No lessons available yet.
            </h2>
            <p className="text-sm text-primary-text opacity-80">
              Please check back later or explore another learning category.
            </p>
          </div>
        ) : (
          <div className="grid justify-center items-stretch gap-10 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {page.lessons?.map((lesson, i) => (
              <LessonCardHero key={i} {...lesson} />
            ))}
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