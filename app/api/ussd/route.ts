import { NextRequest, NextResponse } from "next/server";
import { getPosts } from "@/lib/posts";
import { SITE } from "@/lib/site";
import { ussd } from "@/lib/ussd";
import { query } from "@/lib/db";

// Africa's Talking USSD callback. Point your service code's callback URL at https://<your-domain>/api/ussd
export async function POST(req: NextRequest) {
  const type = req.headers.get("content-type") ?? "";
  let body: Record<string, string> = {};
  if (type.includes("application/json")) body = await req.json().catch(() => ({}));
  else body = Object.fromEntries((await req.formData().catch(() => new FormData())).entries()) as Record<string, string>;

  const secret = process.env.USSD_SECRET;
  if (secret && req.nextUrl.searchParams.get("key") !== secret) {
    return new NextResponse("END Unauthorised", { status: 401, headers: { "content-type": "text/plain" } });
  }

  const siteUrl = process.env.SITE_URL ?? req.nextUrl.origin;
  const posts = getPosts().map((p) => ({ slug: p.slug, title: p.title, dek: p.dek }));
  const result = ussd(String(body.text ?? ""), posts, { siteUrl, shortcode: SITE.smsShortcode });

  const phone = String(body.phoneNumber ?? "").trim();
  if (result.subscribe && /^\+?\d{9,15}$/.test(phone)) {
    await query(
      "INSERT INTO subscribers (phone, channel) VALUES ($1, 'sms') ON CONFLICT (phone) DO UPDATE SET unsubscribed_at = NULL",
      [phone],
    ).catch(() => {});
  }
  return new NextResponse(result.reply, { headers: { "content-type": "text/plain; charset=utf-8" } });
}
