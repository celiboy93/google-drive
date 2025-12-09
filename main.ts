import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

serve(async (req) => {
  const url = new URL(req.url);
  
  // URL ခွဲထုတ်ခြင်း (Example: /FILE_ID/my_movie.mp4)
  const pathParts = url.pathname.split("/");
  const fileId = pathParts[1];
  let fileName = pathParts[2];

  if (!fileId || fileId === "favicon.ico") {
    return new Response("Usage: https://your-app.deno.dev/FILE_ID/name.mp4", {
      headers: { "content-type": "text/plain" }
    });
  }

  // API Key ယူမယ် (မရှိလည်း ဒီ Link ပုံစံနဲ့က ရတတ်ပါတယ်၊ ဒါပေမဲ့ ထည့်ထားတာ ပိုစိတ်ချရပါတယ်)
  const apiKey = Deno.env.get("GOOGLE_API_KEY");
  
  // 🔥 ပြောင်းလဲလိုက်သော အပိုင်း 🔥
  // API V3 Link အစား Export Link ကို သုံးပါမယ်
  // ဒီ Link က Android Download Manager နဲ့ ပိုတည့်ပါတယ်
  const targetUrl = `https://drive.google.com/uc?export=download&id=${fileId}`;

  // Redirect လုပ်မယ် (302)
  return new Response(null, {
    status: 302,
    headers: {
      "Location": targetUrl
    }
  });
});
