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
  description: string;
  heroImage: MediaImageType;
  video: MediaVideoType;
  updatedAt: string;
  createdAt: string;
};

export type ListResponse<T> = {
  docs: T[];
  totalDocs: number;
  limit: number;
  page: number;
  totalPages: number;
};

export type LessonPageType = {
  id: number;
  title: string;
  label: string;
  slug: string;
  order: number;
  lessons?: LessonType[] | null;
  updatedAt: string;
  createdAt: string;
};
