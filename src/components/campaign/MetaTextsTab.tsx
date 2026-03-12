import { CharCount } from "./CharCount";
import { type Campaign } from "@/lib/campaign-data";
interface MetaTextsTabProps {
  camp: Campaign;
  setMetaText: (product: string, field: string, val: string) => void;
}

function trimToLimit(text: string, max: number): string {
  if (text.length <= max) return text;
  const trimmed = text.slice(0, max);
  const lastSentence = Math.max(
    trimmed.lastIndexOf(". "),
    trimmed.lastIndexOf("! "),
    trimmed.lastIndexOf("? ")
  );
  if (lastSentence > 0) return trimmed.slice(0, lastSentence + 1);
  const lastSpace = trimmed.lastIndexOf(" ");
  return lastSpace > 0 ? trimmed.slice(0, lastSpace) : trimmed;
}

const META_TEXT_HINTS = [
  { label: "Varianta 1 – delší", placeholder: "🌟 Hlavní hook v první větě (do 125 zn.)...\n\nPokračování – více info, příběh, důvody ke koupi..." },
  { label: "Varianta 2 – kratší", placeholder: "✨ Úderná krátká verze – jen to nejdůležitější..." },
  { label: "Varianta 3 – delší", placeholder: "💚 Emotivní příběh nebo situace zákazníka...\n\nPokračování s benefity a CTA..." },
  { label: "Varianta 4 – kratší", placeholder: "🎯 Přímá výzva k akci – stručně a jasně..." },
  { label: "Varianta 5 – delší", placeholder: "🍓 Začni otázkou nebo faktem...\n\nPokračování s vysvětlením a výhodami..." },
];
const META_HEADLINE_HINTS = [
  { placeholder: "🌟 Krátký úderný nadpis 1..." },
  { placeholder: "✨ Nadpis 2 – jiný úhel pohledu..." },
  { placeholder: "💚 Nadpis 3 – benefit..." },
  { placeholder: "🎯 Nadpis 4 – výzva k akci..." },
  { placeholder: "🍓 Nadpis 5 – otázka nebo fakt..." },
];

export function MetaTextsTab({ camp, setMetaText }: MetaTextsTabProps) {
  return (
    <div>
      {camp.products.map(p => {
        const mt = (camp.metaTexts[p] as any) || {};
        return (
          <div key={p} className="bg-card rounded-xl border border-channel-meta/10 mb-5 overflow-hidden">
            <div className="bg-channel-meta text-accent-foreground px-4 py-2.5 font-bold text-sm">{p}</div>
            <div className="p-4">
              <div className="mb-5">
                <div className="text-xs font-bold text-channel-meta mb-1">✍️ HLAVNÍ TEXT – 5 variant</div>
                <div className="text-[11px] text-muted-foreground mb-3">
                  📌 Prvních ~125 znaků musí obsahovat hook. Zbytek se skryje pod „Zobrazit více". Používej emoji! 🎯
                </div>
                {META_TEXT_HINTS.map((hint, i) => {
                  const key = `mainText_${i}`;
                  const val = mt[key] || "";
                  return (
                    <div key={i} className="mb-4 bg-muted/20 rounded-lg p-3 border border-border">
                      <div className="text-[11px] font-bold text-channel-meta mb-1">{hint.label}</div>
                      <textarea
                        value={val}
                        onChange={e => setMetaText(p, key, e.target.value)}
                        placeholder={hint.placeholder}
                        rows={i % 2 === 0 ? 6 : 3}
                        className="w-full px-2 py-1.5 rounded border border-input text-xs bg-card resize-y"
                      />
                      <div className="flex justify-between items-center mt-1">
                        <span className={`text-[11px] font-semibold ${val.length >= 125 ? "text-status-done" : "text-channel-meta"}`}>
                          {val.length < 125
                            ? `⚠️ Hook: ${val.length}/125 zn.`
                            : `✅ Hook splněn · celkem ${val.length} zn.`}
                        </span>
                      </div>
                      {val.length > 0 && (
                        <div className="mt-2 bg-channel-meta-light border border-channel-meta/20 rounded-md px-3 py-2">
                          <div className="text-[11px] text-channel-meta font-bold mb-1">👁️ Viditelná část (prvních 125 zn.):</div>
                          <div className="text-xs text-foreground">{val.slice(0, 125)}{val.length > 125 ? "…" : ""}</div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
              <div>
                <div className="text-xs font-bold text-channel-meta mb-2">🖼️ HEADLINE pod fotku – 5 variant (max 40 zn.)</div>
                {META_HEADLINE_HINTS.map((hint, i) => {
                  const key = `headline_${i}`;
                  const val = mt[key] || "";
                  const over = val.length > 40;
                  return (
                    <div key={i} className="flex items-center gap-1 mb-2">
                      <div className="relative flex-1">
                        <input
                          value={val}
                          onChange={e => setMetaText(p, key, e.target.value)}
                          placeholder={hint.placeholder}
                          className={`w-full px-2 py-1.5 pr-16 rounded border text-xs bg-card ${
                            over ? "border-destructive" : "border-input"
                          }`}
                        />
                        <span className="absolute right-1.5 top-1.5">
                          <CharCount value={val} max={40} warn={35} />
                        </span>
                      </div>
                      {over && (
                        <button
                          onClick={() => setMetaText(p, key, trimToLimit(val, 40))}
                          className="text-[11px] bg-destructive/10 text-destructive border border-destructive/30 rounded px-1.5 py-1 cursor-pointer hover:bg-destructive/20 whitespace-nowrap"
                        >✂️</button>
                      )}
                    </div>
                  );
                })}
              </div>
              <div className="mt-4 bg-channel-meta-light rounded-lg px-3.5 py-2.5 text-xs text-channel-meta border border-channel-meta/20">
                📐 Vizuály: Příspěvek 1080×1080 px · Story/Reels 1080×1920 px · XML Feed do FB Katalogu
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
