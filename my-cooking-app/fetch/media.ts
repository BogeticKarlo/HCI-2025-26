// fetch/media.ts
import type { MediaImageType, MediaVideoType } from "@/types/cms";

const MEDIA_IMAGES_URL = (process.env.NEXT_PUBLIC_DB_MEDIA_IMAGES || "").replace(/\/$/, "");
const MEDIA_VIDEOS_URL = (process.env.NEXT_PUBLIC_DB_MEDIA_VIDEOS || "").replace(/\/$/, "");

export function getMediaImageUrl(mediaOrPath?: MediaImageType | string | null): string {
  if (!mediaOrPath || !MEDIA_IMAGES_URL) return "";

  const rawPath = typeof mediaOrPath === "string" ? mediaOrPath : mediaOrPath?.url;
  if (!rawPath) return "";

  const fileName = rawPath.split("/").pop() || "";
  return `${MEDIA_IMAGES_URL}/${fileName}`;
}

export function getMediaVideoUrl(mediaOrPath?: MediaVideoType | string | null): string {
  if (!mediaOrPath || !MEDIA_VIDEOS_URL) return "";

  const rawPath = typeof mediaOrPath === "string" ? mediaOrPath : mediaOrPath?.url;
  if (!rawPath) return "";

  const fileName = rawPath.split("/").pop() || "";
  return `${MEDIA_VIDEOS_URL}/${fileName}`;
}
