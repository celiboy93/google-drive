import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

serve(async (req) => {
  const url = new URL(req.url);

  // URL ခွဲထုတ်ခြင်း
  // ပုံစံ: /dasd619-lugyiapp.mp4/1xEvdN6n0hoHDGGH3VFuakL2_Jj2DBXkV
  const pathParts = url.pathname.split("/");
  
  // pathParts[1] = FILE_NAME (dasd619-lugyiapp.mp4)
  // pathParts[2] = FILE_ID (1xEvdN...)
  const fileName = pathParts[1];
  const fileId = pathParts[2];

  // ID မပါရင် Usage ပြမယ်
  if (!fileId) {
    return new Response("Usage: https://your-app.deno.dev/YOUR_FILENAME.mp4/YOUR_FILE_ID", {
      headers: { "content-type": "text/plain" }
    });
  }

  const apiKey = Deno.env.get("GOOGLE_API_KEY");
  if (!apiKey) {
    return new Response("Server Error: API Key missing.", { status: 500 });
  }

  // Google Drive API Link (Size ပေါ်တဲ့ Link အဟောင်းကို ပြန်သုံးမယ်)
  const targetUrl = `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media&key=${apiKey}`;

  // Redirect (Header နဲ့ နာမည်အတင်းထည့်ပေးမယ်)
  return new Response(null, {
    status: 302,
    headers: {
      "Location": targetUrl,
      // URL မှာ နာမည်ပါနေပေမဲ့ Header မှာပါ ထပ်ထည့်ပေးလိုက်တာ ပိုသေချာပါတယ်
      "Content-Disposition": `attachment; filename="${decodeURIComponent(fileName)}"`
    }
  });
});
