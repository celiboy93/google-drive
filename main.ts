import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

serve(async (req) => {
  const url = new URL(req.url);

  // URL ခွဲထုတ်ခြင်း (Example: /FILE_ID/my_movie.mp4)
  const pathParts = url.pathname.split("/");
  
  // pathParts[1] = FILE_ID
  // pathParts[2] = FILE_NAME (User ပေးတဲ့ နာမည်)
  const fileId = pathParts[1];
  let fileName = pathParts[2];

  // ID မပါရင် Usage ပြမယ်
  if (!fileId || fileId === "favicon.ico") {
    return new Response("Usage: https://your-app.deno.dev/FILE_ID/desired_name.mp4", {
      headers: { "content-type": "text/plain" }
    });
  }

  // နာမည်မပါရင် Default နာမည်ပေးမယ်
  if (!fileName) {
    fileName = "video.mp4";
  }

  // API Key ယူမယ်
  const apiKey = Deno.env.get("GOOGLE_API_KEY");
  if (!apiKey) {
    return new Response("Server Error: API Key missing.", { status: 500 });
  }

  // Google Drive Link
  const targetUrl = `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media&key=${apiKey}`;

  // 🔥 အရေးကြီးဆုံးအပိုင်း (Redirect with Filename Hint)
  // Response.redirect() ကို မသုံးဘဲ Header ကိုယ်တိုင်တည်ဆောက်ပါမယ်
  return new Response(null, {
    status: 302, // Redirect Code
    headers: {
      "Location": targetUrl, // Google ဆီသွားပါ
      // Android ကို နာမည်အတင်းပေးခိုင်းတဲ့ Header
      "Content-Disposition": `attachment; filename="${decodeURIComponent(fileName)}"`
    }
  });
});
