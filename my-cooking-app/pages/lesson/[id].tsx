// app/lessons/[id]/page.tsx
import SingleLesson from "@/components/lessonCard/SingleLesson";

// ⚠️ Server-side only environment variable
const CMS_URL = process.env.CMS_URL?.replace(/\/$/, "");
if (!CMS_URL) throw new Error("CMS_URL environment variable is not set.");

interface LessonPageProps {
  params: {
    id: string;
  };
}

export const dynamic = "force-dynamic"; // ensures server-side fetch

export default async function LessonPage({ params }: LessonPageProps) {
  const { id } = params;

  let lesson = null;

  try {
    const url = new URL(`/api/lessons/${id}?depth=2`, CMS_URL).toString();
    const res = await fetch(url, { cache: "no-store" });

    if (!res.ok) {
      console.error("Failed to fetch lesson:", res.status, res.statusText);
      lesson = null;
    } else {
      lesson = await res.json();
    }
  } catch (err) {
    console.error("Error fetching lesson:", err);
    lesson = null;
  }

  if (!lesson) {
    return (
      <div className="flex flex-col items-center gap-5">
        <h1 className="text-xl">
          We are sorry, but we couldn&apos;t load the requested lesson.
        </h1>
        <p>Please try again later or contact support if the problem persists.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-10">
      <SingleLesson lesson={lesson} />
    </div>
  );
}
