// lib/cms.ts
import type {
  MediaImageType,
  MediaVideoType,
  LessonType,
  LessonPageType,
  ListResponse,
} from "@/types/cms";

// Never throw at module level
const CMS_URL = process.env.CMS_URL?.replace(/\/$/, "") || "";
const MEDIA_IMAGES_URL = process.env.DB_MEDIA_IMAGES?.replace(/\/$/, "") || "";
const MEDIA_VIDEOS_URL = process.env.DB_MEDIA_VIDEOS?.replace(/\/$/, "") || "";

// Helper to safely build URLs
function buildUrl(path: string): string {
  if (!CMS_URL) {
    throw new Error("CMS_URL environment variable is not set.");
  }

  try {
    return new URL(path, CMS_URL).toString();
  } catch (err) {
    console.error("Invalid CMS URL configuration:", {
      CMS_URL,
      path,
    });
    throw err;
  }
}

// -------------------------
// Lessons
// -------------------------

export async function getLessonsById(
  id: string
): Promise<LessonType | null> {
  const url = buildUrl(`/api/lessons/${id}?depth=2`);

  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) return null;

  return await res.json();
}

export async function getLessonsPageBySlug(
  slug: string
): Promise<LessonPageType | null> {
  const url = buildUrl(
    `/api/lesson-pages?where[slug][equals]=${encodeURIComponent(
      slug
    )}&depth=3&limit=1`
  );

  const res = await fetch(url, { cache: "no-store" });

  if (!res.ok) {
    const text = await res.text();
    console.error("getLessonsPageBySlug failed:", res.status, text);
    return null;
  }

  const contentType = res.headers.get("content-type") || "";
  if (!contentType.includes("application/json")) {
    const text = await res.text();
    console.error("Expected JSON, got:", contentType, text);
    throw new Error("CMS did not return JSON");
  }

  const data = (await res.json()) as ListResponse<LessonPageType>;
  return data.docs?.[0] ?? null;
}

export async function getLessonPages(): Promise<LessonPageType[]> {
  const url = buildUrl(`/api/lesson-pages?depth=1&sort=order`);

  const res = await fetch(url, { cache: "no-store" });

  if (!res.ok) {
    const text = await res.text();
    console.error("getLessonPages failed:", res.status, text);
    throw new Error(`Failed to fetch lesson pages: ${res.status}`);
  }

  const data = (await res.json()) as ListResponse<LessonPageType>;
  return data.docs ?? [];
}

// -------------------------
// Media URLs
// -------------------------

export function getMediaImageUrl(
  mediaOrPath?: MediaImageType | string | null
): string {
  if (!mediaOrPath || !MEDIA_IMAGES_URL) return "";

  const rawPath =
    typeof mediaOrPath === "string" ? mediaOrPath : mediaOrPath?.url;

  if (!rawPath) return "";

  const fileName = rawPath.split("/").pop();
  if (!fileName) return "";

  return `${MEDIA_IMAGES_URL}/${fileName}`;
}

export function getMediaVideoUrl(
  mediaOrPath?: MediaVideoType | string | null
): string {
  if (!mediaOrPath || !MEDIA_VIDEOS_URL) return "";

  const rawPath =
    typeof mediaOrPath === "string" ? mediaOrPath : mediaOrPath?.url;

  if (!rawPath) return "";

  const fileName = rawPath.split("/").pop();
  if (!fileName) return "";

  return `${MEDIA_VIDEOS_URL}/${fileName}`;
}
