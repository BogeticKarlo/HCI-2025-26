import type {
  MediaImageType,
  MediaVideoType,
  LessonType,
  LessonPageType,
  ListResponse,
} from "@/types/cms";

const CMS_URL = process.env.NEXT_PUBLIC_CMS_URL as string;
const MEDIA_IMAGES_URL = process.env.NEXT_PUBLIC_DB_MEDIA_IMAGES as string;
const MEDIA_VIDEOS_URL = process.env.NEXT_PUBLIC_DB_MEDIA_VIDEOS as string;

export async function getLessonsById(id: string): Promise<LessonType | null> {
  const url = `${CMS_URL}/api/lessons/${id}?depth=2`;

  const res = await fetch(url);

  if (!res.ok) return null;

  const data = await res.json();

  return data ?? null; // no docs[]
}

export async function getLessonsPageBySlug(
  slug: string,
): Promise<LessonPageType | null> {
  const url = `${CMS_URL}/api/lesson-pages?where[slug][equals]=${encodeURIComponent(
    slug,
  )}&depth=3&limit=1`;

  const res = await fetch(url);
  const contentType = res.headers.get("content-type") || "";

  if (!res.ok) {
    const text = await res.text();
    console.error(
      "getLessonsPageBySlug failed:",
      res.status,
      res.statusText,
      text,
    );
    return null;
  }

  if (!contentType.includes("application/json")) {
    const text = await res.text();
    console.error("Expected JSON, got:", contentType, text);
    throw new Error("CMS did not return JSON for getLessonsPageBySlug");
  }

  const data = (await res.json()) as ListResponse<LessonPageType>;
  return data.docs[0] ?? null;
}

export async function getLessonPages(): Promise<LessonPageType[]> {
  const url = `${CMS_URL}/api/lesson-pages?depth=1&sort=order`;

  const res = await fetch(url);

  if (!res.ok) {
    console.error("getLessonPages failed:", res.status, res.statusText);
    throw new Error("Failed to fetch lesson pages");
  }

  const data = (await res.json()) as ListResponse<LessonPageType>;
  return data.docs;
}

export function getMediaImageUrl(
  mediaOrPath?: MediaImageType | string | null,
): string {
  if (!mediaOrPath) return "";

  const rawPath =
    typeof mediaOrPath === "string" ? mediaOrPath : mediaOrPath.url;

  if (!rawPath) return "";

  const fileName = rawPath.split("/").pop() || "";

  return `${MEDIA_IMAGES_URL}/${fileName}`;
}

export function getMediaVideoUrl(
  mediaOrPath?: MediaVideoType | string | null,
): string {
  if (!mediaOrPath) return "";

  const rawPath =
    typeof mediaOrPath === "string" ? mediaOrPath : mediaOrPath.url;

  if (!rawPath) return "";

  const fileName = rawPath.split("/").pop() || "";

  return `${MEDIA_VIDEOS_URL}/${fileName}`;
}
