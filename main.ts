import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

serve(async (req) => {
  const url = new URL(req.url);

  // URL လမ်းကြောင်းကို ခွဲထုတ်မယ်
  // ဥပမာ: /FILE_ID/my_movie.mp4 ဆိုပြီး လာရင် ခွဲထုတ်မယ်
  const pathParts = url.pathname.split("/");
  
  // pathParts[1] က FILE_ID ဖြစ်မယ်
  const fileId = pathParts[1];

  if (!fileId || fileId === "favicon.ico") {
    return new Response("Usage: https://your-app.deno.dev/YOUR_FILE_ID/any_name.mp4", {
      headers: { "content-type": "text/plain" }
    });
  }

  const apiKey = Deno.env.get("GOOGLE_API_KEY");
  if (!apiKey) {
    return new Response("Server Error: API Key missing.", { status: 500 });
  }

  // Google Drive Direct Link
  const targetUrl = `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media&key=${apiKey}`;

  // Redirect
  return Response.redirect(targetUrl, 302);
});
