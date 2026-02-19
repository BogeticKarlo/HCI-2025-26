import type { NextApiRequest, NextApiResponse } from "next";
import { LessonPageType, ListResponse } from "@/types/cms";

const CMS_URL = process.env.CMS_URL as string;
const CMS_TOKEN = process.env.CMS_TOKEN as string; // <-- Add your CMS API token here

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<LessonPageType[] | { error: string }>
) {
  if (!CMS_URL) {
    return res.status(500).json({ error: "CMS URL not set" });
  }
  if (!CMS_TOKEN) {
    return res.status(500).json({ error: "CMS token not set" });
  }

  try {
    const cmsRes = await fetch(
      `${CMS_URL}/api/lesson-pages?depth=1&sort=order`,
      {
        headers: {
          Authorization: `Bearer ${CMS_TOKEN}`, // send token to authorize request
        },
      }
    );

    if (!cmsRes.ok) {
      const text = await cmsRes.text();
      return res.status(cmsRes.status).json({ error: text });
    }

    const data = (await cmsRes.json()) as ListResponse<LessonPageType>;
    return res.status(200).json(data.docs);
  } catch (err) {
    return res.status(500).json({
      error: err instanceof Error ? err.message : String(err),
    });
  }
}
