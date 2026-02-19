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
      <div className="flex flex-col items-center gap-5">
        <h1 className="text-xl">
          We are sorry, but we couldn&apos;t load the requested lesson page.
        </h1>
        <p>{error}</p>
        <Button onClick={() => window.location.reload()} className="mt-4">
          Retry
        </Button>
      </div>
    );
  }

  if (!page) {
    return (
      <div className="flex flex-col items-center gap-5">
        <h1>Lesson page not found.</h1>
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
        {page.title}
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
