import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

serve(async (req) => {
  const url = new URL(req.url);

  // URL ခွဲထုတ်ခြင်း (Example: /my_movie.mp4/FILE_ID)
  // ရှေ့မှာ နာမည်ထားတာ ပိုကောင်းပါတယ်
  const pathParts = url.pathname.split("/");
  
  // pathParts[1] = FILE_NAME (my_movie.mp4)
  // pathParts[2] = FILE_ID (1xEvd...)
  let fileName = pathParts[1];
  const fileId = pathParts[2];

  if (!fileId) {
    return new Response("Usage: https://your-app.deno.dev/YOUR_NAME.mp4/YOUR_FILE_ID", {
      headers: { "content-type": "text/plain" }
    });
  }

  const apiKey = Deno.env.get("GOOGLE_API_KEY");
  if (!apiKey) {
    return new Response("Server Error: API Key missing.", { status: 500 });
  }

  // Google Drive Link
  let targetUrl = `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media&key=${apiKey}`;

  // 🔥 Last Trick: Link နောက်ဆုံးမှာ #.mp4 ထည့်ခြင်း 🔥
  // ဒါက Google ကို မထိခိုက်စေဘဲ Android ကို လှည့်စားတာပါ
  targetUrl = targetUrl + `#.mp4`;

  return new Response(null, {
    status: 302,
    headers: {
      "Location": targetUrl,
      // Header မှာလည်း နာမည်ထပ်ထည့်ပေးမယ် (၂ ထပ်ကွမ်းပေါ့)
      "Content-Disposition": `attachment; filename="${decodeURIComponent(fileName)}"`
    }
  });
});
