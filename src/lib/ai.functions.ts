import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const schema = z.object({
  field: z.enum(["subject", "message"]),
  text: z.string().min(1).max(2000),
  contextSubject: z.string().max(200).optional().nullable(),
});

const SYSTEM_PROMPT = `אתה עורך טקסטים משפטי-עסקי בעברית עבור פלטפורמת חתימה דיגיטלית.
המשימה: לקחת טקסט שכתב המשתמש ולשפר אותו לטון מקצועי, נקי, ותמציתי המתאים לפנייה לחתימה על מסמך.
כללים:
- תשובה בעברית בלבד
- ללא הקדמות, ללא הסברים, ללא ציטוטים
- אם הטקסט הוא נושא של פנייה (subject) — עד 12 מילים
- אם הטקסט הוא הודעה (message) — עד 4 משפטים, אדיבים ומקצועיים
- שמור על משמעות מקורית; אל תמציא עובדות
- החזר אך ורק את הטקסט המשופר`;

export const refineText = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => schema.parse(data))
  .handler(async ({ data }) => {
    const apiKey = process.env.LOVABLE_API_KEY;
    if (!apiKey) throw new Error("LOVABLE_API_KEY חסר");

    const userPrompt =
      data.field === "subject"
        ? `שפר את הנושא הבא:\n\n${data.text}`
        : `שפר את ההודעה הבאה${data.contextSubject ? ` (נושא הפנייה: ${data.contextSubject})` : ""}:\n\n${data.text}`;

    const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: userPrompt },
        ],
      }),
    });

    if (res.status === 429) throw new Error("חרגת ממכסת הבקשות, נסה שוב בעוד רגע");
    if (res.status === 402) throw new Error("נדרש מילוי קרדיטים בהגדרות הסביבה");
    if (!res.ok) {
      const t = await res.text().catch(() => "");
      console.error("AI gateway error", res.status, t);
      throw new Error("שירות ה-AI אינו זמין כרגע");
    }

    const json = (await res.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };
    const suggestion = json.choices?.[0]?.message?.content?.trim() ?? "";
    if (!suggestion) throw new Error("לא התקבלה הצעה");

    return { suggestion };
  });