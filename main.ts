import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

serve(async (req) => {
  const url = new URL(req.url);

  // အရင်က searchParams.get("id") နဲ့ ယူတာကို ဖျက်မယ်
  // အခု pathname (မျဉ်းစောင်းအနောက်က စာသား) ကို ယူမယ်
  // ဥပမာ: /12345ABCDE ဆိုရင် "12345ABCDE" ကို ယူမယ်
  const fileId = url.pathname.slice(1); // ရှေ့ဆုံးက / ကို ဖြတ်ထုတ်လိုက်တာ

  // ID မပါရင် (သို့) ID နေရာမှာ favicon.ico လိုဟာတွေ ပါလာရင် စစ်ထုတ်မယ်
  if (!fileId || fileId === "favicon.ico") {
    return new Response("Usage: https://your-project.deno.dev/YOUR_FILE_ID", {
      headers: { "content-type": "text/plain" }
    });
  }

  const apiKey = Deno.env.get("GOOGLE_API_KEY");

  if (!apiKey) {
    return new Response("Server Error: API Key missing.", { status: 500 });
  }

  // Google Drive Link
  const targetUrl = `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media&key=${apiKey}`;

  // Redirect
  return Response.redirect(targetUrl, 302);
});
