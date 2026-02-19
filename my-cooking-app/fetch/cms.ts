// lib/cms.ts
import type {
  MediaImageType,
  MediaVideoType,
  LessonPageType,
  LessonType,
  ListResponse,
} from "@/types/cms";

// ⚠️ Server-only CMS URL
const CMS_URL = process.env.CMS_URL?.replace(/\/$/, "");
if (!CMS_URL) throw new Error("CMS_URL environment variable is not set.");

// Optional safeguard: prevent accidental client import
if (typeof window !== "undefined") {
  throw new Error(
    "CMS fetch functions are server-only. Do not import or call them in client components."
  );
}

// -------------------------
// Lessons
// -------------------------
export async function getLessonsById(id: string): Promise<LessonType | null> {
  const url = new URL(`/api/lessons/${id}?depth=2`, CMS_URL).toString();

  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) return null;

  const data = await res.json();
  return data ?? null;
}

export async function getLessonsPageBySlug(slug: string): Promise<LessonPageType | null> {
  const url = new URL(
    `/api/lesson-pages?where[slug][equals]=${encodeURIComponent(slug)}&depth=3&limit=1`,
    CMS_URL
  ).toString();

  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) {
    const text = await res.text();
    console.error("getLessonsPageBySlug failed:", res.status, res.statusText, text);
    return null;
  }

  const contentType = res.headers.get("content-type") || "";
  if (!contentType.includes("application/json")) {
    const text = await res.text();
    console.error("Expected JSON, got:", contentType, text);
    throw new Error("CMS did not return JSON for getLessonsPageBySlug");
  }

  const data = (await res.json()) as ListResponse<LessonPageType>;
  return data.docs[0] ?? null;
}

export async function getLessonPages(): Promise<LessonPageType[]> {
  const url = new URL(`/api/lesson-pages?depth=1&sort=order`, CMS_URL).toString();

  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) {
    throw new Error(`Failed to fetch lesson pages: ${res.status} ${res.statusText}`);
  }

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
  return `${process.env.DB_MEDIA_IMAGES?.replace(/\/$/, "")}/${fileName}`;
}

export function getMediaVideoUrl(mediaOrPath?: MediaVideoType | string | null): string {
  if (!mediaOrPath) return "";
  const rawPath = typeof mediaOrPath === "string" ? mediaOrPath : mediaOrPath.url;
  if (!rawPath) return "";
  const fileName = rawPath.split("/").pop() || "";
  return `${process.env.DB_MEDIA_VIDEOS?.replace(/\/$/, "")}/${fileName}`;
}
