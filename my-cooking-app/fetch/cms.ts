// fetch/cms.ts
import type {
  MediaImageType,
  MediaVideoType,
  LessonType,
  LessonPageType,
  ListResponse,
} from "@/types/cms";

// ✅ Use NEXT_PUBLIC_CMS_URL for both server and client
const CMS_URL = process.env.NEXT_PUBLIC_CMS_URL?.replace(/\/$/, "");
const MEDIA_IMAGES_URL = process.env.NEXT_PUBLIC_DB_MEDIA_IMAGES?.replace(/\/$/, "") || "";
const MEDIA_VIDEOS_URL = process.env.NEXT_PUBLIC_DB_MEDIA_VIDEOS?.replace(/\/$/, "") || "";

if (!CMS_URL) {
  console.warn("NEXT_PUBLIC_CMS_URL is not set. CMS fetches will fail.");
}

// -------------------------
// Lessons
// -------------------------
export async function getLessonsById(id: string): Promise<LessonType | null> {
  if (!CMS_URL) return null;

  const url = `${CMS_URL}/api/lessons/${id}?depth=2`;
  const res = await fetch(url); // works client + server
  if (!res.ok) return null;

  const data = await res.json();
  return data ?? null;
}

export async function getLessonsPageBySlug(slug: string): Promise<LessonPageType | null> {
  if (!CMS_URL) return null;

  const url = `${CMS_URL}/api/lesson-pages?where[slug][equals]=${encodeURIComponent(
    slug,
  )}&depth=3&limit=1`;

  const res = await fetch(url);
  const contentType = res.headers.get("content-type") || "";

  if (!res.ok) {
    const text = await res.text();
    console.error("getLessonsPageBySlug failed:", res.status, res.statusText, text);
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
  if (!CMS_URL) return [];

  const url = `${CMS_URL}/api/lesson-pages?depth=1&sort=order`;

  try {
    const res = await fetch(url);
    if (!res.ok) {
      console.error("getLessonPages failed:", res.status, res.statusText);
      throw new Error(`Failed to fetch lesson pages: ${res.status} ${res.statusText}`);
    }

    const data = (await res.json()) as ListResponse<LessonPageType>;
    return data.docs;
  } catch (error) {
    console.error("getLessonPages error:", {
      url,
      error: error instanceof Error ? error.message : String(error),
    });
    throw error;
  }
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
