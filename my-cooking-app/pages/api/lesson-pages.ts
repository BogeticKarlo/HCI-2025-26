import type { NextApiRequest, NextApiResponse } from "next";
import { LessonPageType, ListResponse } from "@/types/cms";

const CMS_URL = process.env.CMS_URL as string;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<LessonPageType[] | { error: string }>
) {
  if (!CMS_URL) {
    return res.status(500).json({ error: "CMS URL not set" });
  }

  try {
    // Fetch lesson pages without authentication
    const cmsRes = await fetch(`${CMS_URL}/api/lesson-pages?depth=1&sort=order`);

    // Handle non-200 responses from CMS
    if (!cmsRes.ok) {
      const text = await cmsRes.text();
      console.error("CMS fetch failed:", cmsRes.status, text);
      return res.status(cmsRes.status).json({ error: text });
    }

    // Parse JSON safely
    const data = (await cmsRes.json()) as ListResponse<LessonPageType>;
    return res.status(200).json(data.docs);
  } catch (err) {
    console.error("Server error fetching lesson pages:", err);
    return res.status(500).json({
      error: err instanceof Error ? err.message : String(err),
    });
  }
}
