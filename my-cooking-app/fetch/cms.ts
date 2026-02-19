// fetch/cms.ts
import type {
  MediaImageType,
  MediaVideoType,
  LessonType,
  LessonPageType,
  ListResponse,
} from "@/types/cms";

// Use NEXT_PUBLIC_CMS_URL if you don't want server-only env vars
const CMS_URL = process.env.NEXT_PUBLIC_CMS_URL!;
const MEDIA_IMAGES_URL = process.env.NEXT_PUBLIC_DB_MEDIA_IMAGES!;
const MEDIA_VIDEOS_URL = process.env.NEXT_PUBLIC_DB_MEDIA_VIDEOS!;

// -------------------------
// Lessons
// -------------------------
export async function getLessonsById(id: string): Promise<LessonType | null> {
  const res = await fetch(`${CMS_URL}/api/lessons/${id}?depth=2`);
  if (!res.ok) return null;
  return (await res.json()) ?? null;
}

export async function getLessonsPageBySlug(
  slug: string,
): Promise<LessonPageType | null> {
  const res = await fetch(
    `${CMS_URL}/api/lesson-pages?where[slug][equals]=${encodeURIComponent(
      slug,
    )}&depth=3&limit=1`,
  );

  if (!res.ok) {
    const text = await res.text();
    console.error("getLessonsPageBySlug failed:", res.status, text);
    return null;
  }

  const data = (await res.json()) as ListResponse<LessonPageType>;
  return data.docs[0] ?? null;
}

export async function getLessonPages(): Promise<LessonPageType[]> {
  const res = await fetch(`${CMS_URL}/api/lesson-pages?depth=1&sort=order`);
  if (!res.ok) throw new Error(`Failed to fetch lesson pages: ${res.status}`);
  const data = (await res.json()) as ListResponse<LessonPageType>;
  return data.docs;
}

// -------------------------
// Media URLs
// -------------------------
export function getMediaImageUrl(mediaOrPath?: MediaImageType | string | null): string {
  if (!mediaOrPath) return "";
  const rawPath = typeof mediaOrPath === "string" ? mediaOrPath : mediaOrPath.url;
  if (!rawPath) return "";
  const fileName = rawPath.split("/").pop() || "";
  return `${MEDIA_IMAGES_URL}/${fileName}`;
}

export function getMediaVideoUrl(mediaOrPath?: MediaVideoType | string | null): string {
  if (!mediaOrPath) return "";
  const rawPath = typeof mediaOrPath === "string" ? mediaOrPath : mediaOrPath.url;
  if (!rawPath) return "";
  const fileName = rawPath.split("/").pop() || "";
  return `${MEDIA_VIDEOS_URL}/${fileName}`;
}
