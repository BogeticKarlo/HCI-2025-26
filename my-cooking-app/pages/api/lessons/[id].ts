import type { NextApiRequest, NextApiResponse } from "next";
import { LessonType } from "@/types/cms";

const CMS_URL = process.env.NEXT_PUBLIC_CMS_URL as string;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<LessonType | { error: string }>
) {
  if (!CMS_URL) {
    return res.status(500).json({ error: "CMS URL not set" });
  }

  const { id } = req.query;
  if (typeof id !== "string") {
    return res.status(400).json({ error: "Invalid lesson ID" });
  }

  try {
    const cmsRes = await fetch(`${CMS_URL}/api/lessons/${id}?depth=2`);
    if (!cmsRes.ok) {
      const text = await cmsRes.text();
      return res.status(cmsRes.status).json({ error: text });
    }

    const data = (await cmsRes.json()) as LessonType;
    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ error: err instanceof Error ? err.message : String(err) });
  }
}
