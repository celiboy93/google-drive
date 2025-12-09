import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

serve(async (req) => {
  const url = new URL(req.url);

  // 1. Browser/APK ကနေ ID ပါမပါ စစ်မယ် (Example: /?id=xxxxx)
  const fileId = url.searchParams.get("id");

  // ID မပါရင် စာပဲပြမယ်
  if (!fileId) {
    return new Response("Movie Shop API is Running!\nUsage: /?id=YOUR_FILE_ID", {
      status: 200, 
      headers: { "content-type": "text/plain" }
    });
  }

  // 2. Server ထဲက API Key ကို လှမ်းယူမယ်
  const apiKey = Deno.env.get("GOOGLE_API_KEY");

  // Key မရှိရင် Error ပြမယ် (ဒါက အရေးကြီးတယ်)
  if (!apiKey) {
    return new Response("Error: Server API Key is missing. Please check Deno Deploy settings.", { status: 500 });
  }

  // 3. Google Drive Direct Link ကို တည်ဆောက်မယ်
  const targetUrl = `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media&key=${apiKey}`;

  // 4. User ကို Video ဆီ လမ်းကြောင်းလွှဲပေးလိုက်မယ် (302 Redirect)
  // APK က ဒီ Link ကို နှိပ်တာနဲ့ Google Drive က Video ကို တန်းဆွဲပါလိမ့်မယ်
  return Response.redirect(targetUrl, 302);
});
