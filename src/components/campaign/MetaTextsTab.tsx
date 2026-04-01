import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { CharCount } from "./CharCount";
import { CopyButton, CopyAllButton } from "./CopyButton";
import { type Campaign } from "@/lib/campaign-data";

interface MetaTextsTabProps {
  camp: Campaign;
  setMetaText: (product: string, field: string, val: string) => void;
}

function trimToLimit(text: string, max: number): string {
  if (text.length <= max) return text;
  const trimmed = text.slice(0, max);
  const lastSentence = Math.max(trimmed.lastIndexOf(". "), trimmed.lastIndexOf("! "), trimmed.lastIndexOf("? "));
  if (lastSentence > 0) return trimmed.slice(0, lastSentence + 1);
  const lastSpace = trimmed.lastIndexOf(" ");
  return lastSpace > 0 ? trimmed.slice(0, lastSpace) : trimmed;
}

const META_TEXT_HINTS = [
  { label: "Varianta 1 – delší", placeholder: "🌟 Hlavní hook v první větě (do 125 zn.)..." },
  { label: "Varianta 2 – kratší", placeholder: "✨ Úderná krátká verze..." },
  { label: "Varianta 3 – delší", placeholder: "💚 Emotivní příběh nebo situace zákazníka..." },
  { label: "Varianta 4 – kratší", placeholder: "🎯 Přímá výzva k akci..." },
  { label: "Varianta 5 – delší", placeholder: "🍓 Začni otázkou nebo faktem..." },
];
const META_HEADLINE_HINTS = [
  { placeholder: "🌟 Krátký úderný nadpis 1..." },
  { placeholder: "✨ Nadpis 2 – jiný úhel pohledu..." },
  { placeholder: "💚 Nadpis 3 – benefit..." },
  { placeholder: "🎯 Nadpis 4 – výzva k akci..." },
  { placeholder: "🍓 Nadpis 5 – otázka nebo fakt..." },
];

export function MetaTextsTab({ camp, setMetaText }: MetaTextsTabProps) {
  const [generatingVariants, setGeneratingVariants] = useState<Record<string, boolean>>({});

  const generateVariants = async (product: string) => {
    const mt = (camp.metaTexts[product] as any) || {};
    const baseText = mt["mainText_0"] || "";
    const baseHeadline = mt["headline_0"] || "";
    if (!baseText) { alert("Nejdřív vygeneruj texty v záložce Generátor textů."); return; }
    setGeneratingVariants(prev => ({ ...prev, [product]: true }));
    try {
      const { data, error } = await supabase.functions.invoke("generate-fan-texts", {
        body: {
          product,
          usp: `Na základě tohoto META textu vytvoř 4 další varianty. Varianta 1: "${baseText}". Headline 1: "${baseHeadline}".`,
          cta: "", audience: "",
        },
      });
      if (error) throw error;
      if (data?.meta?.mainTexts) {
        data.meta.mainTexts.slice(1, 5).forEach((t: string, i: number) => { setMetaText(product, `mainText_${i + 1}`, t); });
      }
      if (data?.meta?.headlines) {
        data.meta.headlines.slice(1, 5).forEach((t: string, i: number) => { setMetaText(product, `headline_${i + 1}`, t); });
      }
    } catch (e) {
      console.error("Variant generation error:", e);
      alert("Chyba při generování variant.");
    }
    setGeneratingVariants(prev => ({ ...prev, [product]: false }));
  };

  return (
    <div>
      {camp.products.map(p => {
        const mt = (camp.metaTexts[p] as any) || {};
        const allMainTexts = META_TEXT_HINTS.map((_, i) => mt[`mainText_${i}`] || "").filter(Boolean);
        const allHeadlines = META_HEADLINE_HINTS.map((_, i) => mt[`headline_${i}`] || "").filter(Boolean);

        return (
          <div key={p} className="bg-card rounded-xl border border-channel-meta/10 mb-5 overflow-hidden">
            <div className="bg-channel-meta text-accent-foreground px-4 py-2.5 font-bold text-sm flex items-center justify-between">
              <span>{p}</span>
              <button onClick={() => generateVariants(p)} disabled={generatingVariants[p]}
                className="text-xs bg-white/20 hover:bg-white/30 text-white border-none rounded px-3 py-1 cursor-pointer font-semibold disabled:opacity-50">
                {generatingVariants[p] ? "⏳ Generuji..." : "✨ Vytvořit varianty 2–5"}
              </button>
            </div>
            <div className="p-4">
              <div className="mb-5">
                <div className="flex items-center justify-between mb-1">
                  <div className="text-xs font-bold text-channel-meta">✍️ HLAVNÍ TEXT – 5 variant</div>
                  <CopyAllButton texts={allMainTexts} />
                </div>
                <div className="text-[11px] text-muted-foreground mb-3">
                  📌 Prvních ~125 znaků = hook. Používej emoji! 🎯
                </div>
                {META_TEXT_HINTS.map((hint, i) => {
                  const key = `mainText_${i}`;
                  const val = mt[key] || "";
                  return (
                    <div key={i} className="mb-4 bg-muted/20 rounded-lg p-3 border border-border">
                      <div className="flex items-center justify-between mb-1">
                        <div className="text-[11px] font-bold text-channel-meta">{hint.label}</div>
                        {val && <CopyButton text={val} />}
                      </div>
                      <textarea value={val} onChange={e => setMetaText(p, key, e.target.value)}
                        placeholder={hint.placeholder} rows={i % 2 === 0 ? 6 : 3}
                        className="w-full px-2 py-1.5 rounded border border-input text-xs bg-card resize-y" />
                      <div className="flex justify-between items-center mt-1">
                        <span className={`text-[11px] font-semibold ${val.length >= 125 ? "text-status-done" : "text-channel-meta"}`}>
                          {val.length < 125 ? `⚠️ Hook: ${val.length}/125 zn.` : `✅ Hook splněn · celkem ${val.length} zn.`}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="text-xs font-bold text-channel-meta">🖼️ HEADLINE pod fotku – 5 variant (max 40 zn.)</div>
                  <CopyAllButton texts={allHeadlines} />
                </div>
                {META_HEADLINE_HINTS.map((hint, i) => {
                  const key = `headline_${i}`;
                  const val = mt[key] || "";
                  const over = val.length > 40;
                  return (
                    <div key={i} className="flex items-center gap-1 mb-2">
                      <div className="relative flex-1">
                        <input value={val} onChange={e => setMetaText(p, key, e.target.value)}
                          placeholder={hint.placeholder}
                          className={`w-full px-2 py-1.5 pr-16 rounded border text-xs bg-card ${over ? "border-destructive" : "border-input"}`} />
                        <span className="absolute right-1.5 top-1.5"><CharCount value={val} max={40} warn={35} /></span>
                      </div>
                      {val && <CopyButton text={val} />}
                      {over && <button onClick={() => setMetaText(p, key, trimToLimit(val, 40))}
                        className="text-[11px] bg-destructive/10 text-destructive border border-destructive/30 rounded px-1.5 py-1 cursor-pointer hover:bg-destructive/20 whitespace-nowrap">✂️</button>}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
