import type { NextApiRequest, NextApiResponse } from "next";
import { LessonPageType, ListResponse } from "@/types/cms";

// CMS URL and API token (server-side only)
const CMS_URL = process.env.CMS_URL as string;
const CMS_TOKEN = process.env.CMS_TOKEN as string;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<LessonPageType[] | { error: string }>
) {
  // Check that environment variables are set
  if (!CMS_URL) {
    return res.status(500).json({ error: "CMS URL not set" });
  }
  if (!CMS_TOKEN) {
    return res.status(500).json({ error: "CMS token not set" });
  }

  try {
    // Fetch lesson pages from CMS using the token
    const cmsRes = await fetch(`${CMS_URL}/api/lesson-pages?depth=1&sort=order`, {
      headers: {
        Authorization: `Bearer ${CMS_TOKEN}`, // token authorizes the request
      },
    });

    // Handle non-200 responses
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
