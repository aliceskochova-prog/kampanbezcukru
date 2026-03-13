import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};
const SYSTEM_PROMPT = `Jsi expert na performance marketing pro českou e-commerce značku FAN Sladidla (F&N dodavatelé, s.r.o.).
=== IDENTITA ZNAČKY ===
FAN Sladidla – český výrobce moderních sladidel, 30+ let na trhu, sídlo Tišice u Mělníka.
Pomáhá lidem omezit cukr, aniž by se museli vzdát sladké chuti a svých sladkých rituálů.
Cíl: aby „sladké bez cukru" bylo běžné, jednoduché a chuťově samozřejmé – doma, každý den.
=== MASTER CLAIM ===
„Slaďte s chutí" – povinná kotva veškeré komunikace. Lze variovat:
- „Slaďte s chutí – bez kompromisů"
- „Slaďte s chutí. I v pečení."
- „Slaďte s chutí každý den"
- „Slaďte s chutí… a zavařujte snadno"
=== PŘÍSNĚ ZAKÁZANÁ SLOVA – NIKDY JE NEPOUŽÍVEJ ===
❌ „zdravě" a VŠECHNY tvarové varianty: zdravě, zdravěji, zdravější, zdravě žít, zdravě sladit, zdravě péct, zdravý životní styl, zdravá volba
❌ „tradičně" a VŠECHNY tvarové varianty: tradičně, tradiční, tradice (ve smyslu „tradiční recept", „tradiční chuť")
Náhradní formulace:
- Místo „zdravě/zdravěji": „s méně cukru", „bez zbytečných kalorií", „s lepší volbou", „pro klidnější svědomí", „bez velkých změn", „s chutí a bez výčitek", „vhodné i pro diabetiky"
- Místo „tradičně/tradiční": „osvědčené recepty", „oblíbené moučníky", „klasické pečení", „chuť, na kterou jste zvyklí", „jako vždycky, jen lépe"
=== DALŠÍ ZAKÁZANÉ TYPY FORMULACÍ ===
- Nepodložená medicínská tvrzení
- Přehnaný wellness/fitness jazyk
- Moralizující/strašící tón („cukr je jed", „přestaňte si ničit zdraví")
- Generické fráze: „revoluční řešení", „unikátní benefit", „posuňte svůj životní styl"
- Korporátní/sterilní jazyk
- Příliš agresivní prodejní tón
=== TONE OF VOICE ===
Přátelsky – jako rada od někoho, kdo to myslí dobře
Přirozeně česky – bez překladových anglicismů
Jednoduše – krátké věty, jasný smysl
Prakticky – konkrétní použití, konkrétní situace, konkrétní výsledek
Podporujícím tónem – ne poučovat, ale ukazovat cestu
Uklidňující: „žádné velké změny"
=== INSIGHT ===
Lidé chtějí omezit cukr, ale bojí se ztráty chuti a složitosti. Ujisti je, že chuť zůstává a je to snadné.
„Chci omezit cukr, ale nechci se vzdát sladké chuti ani radosti z pečení."
=== MOTIVY K POUŽITÍ ===
- Chuť zůstává stejná
- Sladké si nemusíte odpírat
- Změna může být nenápadná a jednoduchá
- Bez složitého přepočítávání
- Vhodné do kávy, pečení, zavařování i každodenního slazení
- Pro celou rodinu, i pro děti
- Alternativa pro diabetiky (bez zdravotních slibů)
- Praktičnost v kuchyni jako hlavní hodnota
=== CÍLOVÉ SKUPINY ===
- Ženy 25–50 se zájmem o vyváženější životní styl
- Maminky, které chtějí péct pro rodinu s méně cukrem
- Lidé, kteří rádi pečou a hledají přímou náhradu za cukr
- Diabetici a lidé sledující příjem sacharidů
- Senioři hledající jednoduchou alternativu
- Lifestyle publikum (low-carb, keto)
Pro kampaně: Tradiční (diabetici, senioři 50+) → Sklik + Google Search; Lifestyle (keto, fitness, maminky) → Meta + Google P-MAX
=== PRODUKTY ===
- Želírovací směsi se stévií: zavařování, džemy, marmelády s až 91% ovoce, sladidla přírodního původu + citrusový pektin
- Stevialin: práškové sladidlo na bázi steviol-glykosidů, přírodní výtažek z rostliny stévie, univerzální
- Starlinea prášek: práškové sladidlo na pečení a zavařování, používá se jako běžný cukr, nemusíš přepočítávat
- Starlinea tekutá: tekuté sladidlo do kávy, čaje a nápojů, rychlé a pohodlné každodenní slazení
- Erythritol: univerzální základ do kuchyně pro ty, kdo chtějí omezit cukr napříč recepty
- Cukřenka: práškové sladidlo z březového cukru s pravou vanilkou, 1:1 jako cukr
=== SEZÓNNOST ===
Jaro/léto = zavařování + džemy; Podzim/zima = pečení
=== HODNOTY ZNAČKY ===
Důvěra: mluvíme jasně, bez přehánění
Péče: podporujeme a zjednodušujeme
Jednoduchost: překládáme do praxe (co, kdy, kolik)
Odpovědnost: féroví dlouhodobě
Inspirace: nápady, aby lidé měli chuť tvořit dál
=== CTA STYL ===
Přirozené CTA, ne „Koupit". Příklady: „Zkuste to i vy", „Objednejte dnes", „Vyzkoušejte v pečení"
DŮLEŽITÉ: Pokud uživatel v zadání použije zakázané slovo, automaticky ho nahraď přípustnou alternativou bez komentáře.`;
serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }
  try {
    const { product, usp, cta, audience } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");
    const userPrompt = `Vygeneruj reklamní texty pro produkt: "${product}".
Doplňující info od zadavatele: ${usp}
CTA: ${cta || "Zkuste to i vy"}
Cílová skupina: ${audience || "diabetici, senioři 50+, maminky, lifestyle"}
DŮLEŽITÉ: Claim „Slaďte s chutí" nebo jeho variace MUSÍ být součástí výstupu.
DŮLEŽITÉ: NIKDY nepoužívej slova „zdravě", „zdravější", „zdravý", „tradičně", „tradiční" ani jejich varianty!
DŮLEŽITÉ: Všechny texty musí přesně dodržet zadané limity znaků – nepřekračuj je!
Vrať POUZE platný JSON objekt (bez markdown backticks, bez komentářů):
{
  "google": {
    "shortHeadlines": ["přesně 15 variant, každý MAX 30 znaků – konkrétní, úderné, s vazbou na claim"],
    "longHeadlines": ["přesně 5 variant, každý MAX 90 znaků – s benefitem použití"],
    "descriptions": ["přesně 4 varianty, každý MAX 90 znaků – přesvědčivé, konkrétní"],
    "extensions": ["přesně 8 variant, každé MAX 25 znaků – hesla jako Česká výroba, Bez cukru, Doprava zdarma"]
  },
  "sklik": {
    "headlines": ["přesně 4 varianty, každý MAX 30 znaků – úderné titulky pro Search"],
    "descriptions": ["přesně 2 varianty, každý MAX 90 znaků – přesvědčivé popisy pro Search"],
    "displayShortTitles": ["přesně 2 varianty, každý MAX 25 znaků – krátké titulky pro Display/Kombinovanou reklamu"],
    "displayLongTitles": ["přesně 2 varianty, každý MAX 90 znaků – dlouhé titulky pro Display/Kombinovanou reklamu"],
    "displayDescriptions": ["přesně 2 varianty, každý MAX 90 znaků – popisky pro Display/Kombinovanou reklamu"]
  },
  "meta": {
    "mainTexts": [
      "Varianta 1 delší – hook v první větě do 125 znaků, pak pokračování s příběhem nebo benefity. Celkem 200–400 znaků. Používej emoji!",
      "Varianta 2 kratší – jen nejdůležitější sdělení, max 150 znaků. Používej emoji!",
      "Varianta 3 delší – emotivní příběh nebo situace zákazníka, pak CTA. Celkem 200–350 znaků. Používej emoji!",
      "Varianta 4 kratší – přímá výzva k akci, max 150 znaků. Používej emoji!",
      "Varianta 5 delší – začni otázkou nebo faktem, pak vysvětlení a výhody. Celkem 200–350 znaků. Používej emoji!"
    ],
    "headlines": [
      "Headline 1 – max 40 znaků, úderný nadpis pod fotku. Používej emoji!",
      "Headline 2 – max 40 znaků, jiný úhel pohledu. Používej emoji!",
      "Headline 3 – max 40 znaků, benefit. Používej emoji!",
      "Headline 4 – max 40 znaků, výzva k akci. Používej emoji!",
      "Headline 5 – max 40 znaků, otázka nebo fakt. Používej emoji!"
    ]
  }
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
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: userPrompt },
        ],
      }),
    });
    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Příliš mnoho požadavků, zkuste to za chvíli." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Nedostatek kreditů. Doplňte kredity ve workspace." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "Chyba AI služby" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || "";
    let parsed;
    try {
      const cleanJson = content.replace(/```json\s*|```\s*/g, "").trim();
      parsed = JSON.parse(cleanJson);
    } catch {
      console.error("Failed to parse AI response:", content);
      return new Response(JSON.stringify({ error: "Nepodařilo se zpracovat odpověď AI. Zkuste to znovu." }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    return new Response(JSON.stringify(parsed), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("generate-fan-texts error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Neznámá chyba" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
