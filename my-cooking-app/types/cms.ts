export type MediaImageType = {
  id: number;
  alt: string;
  caption?: string | null;
  prefix?: string | null;
  updatedAt: string;
  createdAt: string;
  url?: string | null;
  thumbnailURL?: string | null;
  filename?: string | null;
  mimeType?: string | null;
  filesize?: number | null;
  width?: number | null;
  height?: number | null;
  focalX?: number | null;
  focalY?: number | null;
};

export type MediaVideoType = {
  id: number;
  title: string;
  caption?: string | null;
  prefix?: string | null;
  updatedAt: string;
  createdAt: string;
  url?: string | null;
  thumbnailURL?: string | null;
  filename?: string | null;
  mimeType?: string | null;
  filesize?: number | null;
  width?: number | null;
  height?: number | null;
  focalX?: number | null;
  focalY?: number | null;
};

export type LessonType = {
  id: number;
  title: string;
  slug: string;
  description: string;
  heroImage: number | MediaImageType;
  video: number | MediaVideoType;
  updatedAt: string;
  createdAt: string;
};

export type LessonPageType = {
  id: number;
  title: string;
  slug: string;
  order: number;
  lessons?: (number | LessonType)[] | null;
  updatedAt: string;
  createdAt: string;
};
