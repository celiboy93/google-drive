import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

serve(async (req) => {
  const url = new URL(req.url);

  // URL ခွဲထုတ်ခြင်း (Example: /FILE_ID/my_movie.mp4)
  const pathParts = url.pathname.split("/");
  const fileId = pathParts[1];

  if (!fileId || fileId === "favicon.ico") {
    return new Response("Usage: https://your-app.deno.dev/FILE_ID/name.mp4", {
      headers: { "content-type": "text/plain" }
    });
  }

  const apiKey = Deno.env.get("GOOGLE_API_KEY");
  if (!apiKey) {
    return new Response("Server Error: API Key missing.", { status: 500 });
  }

  // Google Drive API Link
  const targetUrl = `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media&key=${apiKey}`;

  // ရိုးရိုးရှင်းရှင်း Redirect (302)
  // Android က Google Drive ထဲက နာမည်ကိုပဲ အတည်ယူပါလိမ့်မယ်
  return Response.redirect(targetUrl, 302);
});
