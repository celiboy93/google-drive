import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

serve(async (req) => {
  const url = new URL(req.url);

  // URL ခွဲထုတ်ခြင်း
  // Link ပုံစံ: /FILE_NAME/FILE_ID
  const pathParts = url.pathname.split("/");
  
  // pathParts[1] = FILE_NAME (dasd619-lugyiapp.mp4)
  // pathParts[2] = FILE_ID (1xEvdN...)
  const fileName = pathParts[1]; // ရှေ့ကကောင်ကို နာမည်လို့ မှတ်မယ်
  const fileId = pathParts[2];   // နောက်ကကောင်ကို ID လို့ မှတ်မယ်

  // ID မပါလာရင် Usage စာသားပြမယ်
  if (!fileId) {
    return new Response("Usage Error! \nCorrect Format: https://your-app.deno.dev/YOUR_FILENAME.mp4/YOUR_FILE_ID", {
      headers: { "content-type": "text/plain" }
    });
  }

  const apiKey = Deno.env.get("GOOGLE_API_KEY");
  if (!apiKey) {
    return new Response("Server Error: API Key missing.", { status: 500 });
  }

  // Google Drive Link တည်ဆောက်ခြင်း
  let targetUrl = `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media&key=${apiKey}`;
  
  // 🔥 Last Trick: Android ကို လှည့်စားဖို့ နောက်ဆုံးမှာ #.mp4 ထည့်မယ်
  targetUrl = targetUrl + `#.mp4`;

  // Redirect လုပ်မယ်
  return new Response(null, {
    status: 302,
    headers: {
      "Location": targetUrl,
      // Header မှာလည်း နာမည်ထပ်ထည့်ပေးမယ်
      "Content-Disposition": `attachment; filename="${decodeURIComponent(fileName)}"`
    }
  });
});
