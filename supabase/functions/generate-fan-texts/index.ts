import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const BASE_SYSTEM_PROMPT = `Jsi expert na performance marketing.
=== PŘÍSNĚ ZAKÁZANÁ SLOVA – NIKDY JE NEPOUŽÍVEJ ===
❌ „zdravě" a VŠECHNY tvarové varianty
❌ „tradičně" a VŠECHNY tvarové varianty
Náhradní formulace:
- Místo „zdravě": „s méně cukru", „bez zbytečných kalorií", „s lepší volbou"
- Místo „tradičně": „osvědčené recepty", „klasické", „chuť, na kterou jste zvyklí"
=== DALŠÍ ZAKÁZANÉ TYPY FORMULACÍ ===
- Nepodložená medicínská tvrzení
- Generické fráze: „revoluční řešení", „unikátní benefit"
- Korporátní/sterilní jazyk
- Příliš agresivní prodejní tón`;

const FAN_SYSTEM_PROMPT = `Jsi expert na performance marketing pro značku FAN Sladidla.
Master claim „Slaďte s chutí" je povinná kotva komunikace (a jeho variace).
Tón: přátelský, přirozeně česky, jednoduše, prakticky.
` + BASE_SYSTEM_PROMPT;

const TONE_MAP: Record<string, string> = {
  "neutrální": "Piš neutrálním, věcným tónem.",
  "přátelský": "Piš přátelsky, jednoduše a přirozeně česky.",
  "profesionální": "Piš profesionálně, precizně.",
  "odborný": "Piš odborně, precizní formulace.",
  "prodejní": "Piš prodejním tónem s výzvami k akci.",
  "humorný": "Piš s vtipem a lehkostí.",
  "inspirativní": "Piš inspirativně, motivačně.",
  "urgentní": "Piš s pocitem naléhavosti.",
  "luxusní": "Piš luxusním, prestižním tónem.",
};

interface TextTypeReq {
  id: string;
  label: string;
  count: number;
  maxLength: number;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }
  try {
    const body = await req.json();
    const { product, usp, cta, audience } = body;
    const tone = body.tone || "přátelský";
    const clientName = body.clientName || "";
    const textTypes: TextTypeReq[] = Array.isArray(body.textTypes) && body.textTypes.length > 0
      ? body.textTypes
      : [
          { id: "shortHeadlines", label: "Krátký nadpis", count: body.headlineCount || 15, maxLength: body.headlineLength || 30 },
          { id: "longHeadlines", label: "Dlouhý nadpis", count: 5, maxLength: 90 },
          { id: "descriptions", label: "Popis", count: body.descriptionCount || 4, maxLength: body.descriptionLength || 90 },
        ];

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const isFan = !clientName || clientName.toLowerCase().includes("fan");
    let systemPrompt = isFan ? FAN_SYSTEM_PROMPT : BASE_SYSTEM_PROMPT;
    if (clientName && !isFan) {
      systemPrompt = `Jsi expert na performance marketing pro klienta "${clientName}".\n` + systemPrompt;
    }
    systemPrompt += `\n=== TÓN ===\n${TONE_MAP[tone] || TONE_MAP["přátelský"]}`;

    // Build dynamic JSON schema description
    const schemaLines = textTypes.map(t =>
      `  "${t.id}": [přesně ${t.count} variant pro typ „${t.label}", každá MAX ${t.maxLength} znaků]`
    ).join(",\n");

    const userPrompt = `Vygeneruj reklamní texty pro produkt: "${product}".
${clientName ? `Klient: ${clientName}` : ""}
Doplňující info: ${usp}
CTA: ${cta || "Zkuste to i vy"}
Cílová skupina: ${audience || "obecná"}
${isFan ? 'DŮLEŽITÉ: Claim „Slaďte s chutí" nebo jeho variace MUSÍ být součástí výstupu.' : ''}

DŮLEŽITÉ:
- NIKDY nepoužívej „zdravě", „zdravější", „zdravý", „tradičně", „tradiční" ani varianty.
- Všechny texty PŘESNĚ dodrž zadané limity znaků – nepřekračuj je.
- Vrať PŘESNĚ požadovaný počet variant pro každý typ.

Vrať POUZE platný JSON objekt (bez markdown backticků):
{
${schemaLines}
}`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
      }),
    });
    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Příliš mnoho požadavků, zkuste to za chvíli." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Nedostatek kreditů. Doplňte kredity ve workspace." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "Chyba AI služby" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || "";
    let parsed: Record<string, string[]>;
    try {
      const cleanJson = content.replace(/```json\s*|```\s*/g, "").trim();
      parsed = JSON.parse(cleanJson);
    } catch {
      console.error("Failed to parse AI response:", content);
      return new Response(JSON.stringify({ error: "Nepodařilo se zpracovat odpověď AI. Zkuste to znovu." }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Normalize: ensure each requested type has an array
    const results: Record<string, string[]> = {};
    for (const t of textTypes) {
      const arr = parsed[t.id];
      results[t.id] = Array.isArray(arr) ? arr.map(String) : [];
    }

    return new Response(JSON.stringify({ results }), {
      status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("generate-fan-texts error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Neznámá chyba" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
