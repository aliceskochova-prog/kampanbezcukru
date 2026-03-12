import { CharCount } from "./CharCount";
import { type Campaign } from "@/lib/campaign-data";
interface SklikTextsTabProps {
  camp: Campaign;
  setSklikText: (product: string, field: string, idx: number, val: string) => void;
}

function trimToLimit(text: string, max: number): string {
  if (text.length <= max) return text;
  const trimmed = text.slice(0, max);
  const lastSpace = trimmed.lastIndexOf(" ");
  return lastSpace > 0 ? trimmed.slice(0, lastSpace) : trimmed;
}

export function SklikTextsTab({ camp, setSklikText }: SklikTextsTabProps) {
  return (
    <div>
      <div className="bg-channel-sklik-light rounded-lg px-3.5 py-2 text-xs text-channel-sklik mb-4 border border-channel-sklik/20">
        💡 Prioritní cílovka: 50+ · diabetici · senioři · Seznam je pro tuto skupinu silnější než Google
      </div>
      {camp.products.map(p => {
        const st = camp.sklikTexts[p] || {};
        return (
          <div key={p} className="bg-card rounded-xl border border-channel-sklik/10 mb-5 overflow-hidden">
            <div className="bg-channel-sklik text-secondary-foreground px-4 py-2.5 font-bold text-sm">{p}</div>
            <div className="p-4">
              <div className="mb-5">
                <div className="text-xs font-bold text-channel-sklik mb-3">🔍 SEARCH reklama</div>
                <div className="mb-3">
                  <div className="text-xs font-semibold text-channel-sklik/80 mb-2">TITULEK – max 30 zn. (4 varianty)</div>
                  {Array.from({ length: 4 }, (_, i) => {
                    const val = st.headlines?.[i] || "";
                    const over = val.length > 30;
                    return (
                      <div key={i} className="flex items-center gap-1 mb-1">
                        <div className="relative flex-1">
                          <input
                            value={val}
                            onChange={e => setSklikText(p, "headlines", i, e.target.value)}
                            placeholder={`Titulek ${i + 1}`}
                            className={`w-full px-2 py-1 pr-12 rounded border text-xs bg-card ${over ? "border-destructive" : "border-input"}`}
                          />
                          <span className="absolute right-1.5 top-1.5">
                            <CharCount value={val} max={30} warn={25} />
                          </span>
                        </div>
                        {over && (
                          <button onClick={() => setSklikText(p, "headlines", i, trimToLimit(val, 30))}
                            className="text-[11px] bg-destructive/10 text-destructive border border-destructive/30 rounded px-1.5 py-1 cursor-pointer hover:bg-destructive/20 whitespace-nowrap">✂️</button>
                        )}
                      </div>
                    );
                  })}
                </div>
                <div>
                  <div className="text-xs font-semibold text-channel-sklik/80 mb-2">POPISEK – max 90 zn. (2 varianty)</div>
                  {Array.from({ length: 2 }, (_, i) => {
                    const val = st.descriptions?.[i] || "";
                    const over = val.length > 90;
                    return (
                      <div key={i} className="mb-2">
                        <div className="flex items-start gap-1">
                          <textarea
                            value={val}
                            onChange={e => setSklikText(p, "descriptions", i, e.target.value)}
                            placeholder={`Popisek ${i + 1}`}
                            rows={2}
                            className={`flex-1 px-2 py-1 rounded border text-xs bg-card resize-y ${over ? "border-destructive" : "border-input"}`}
                          />
                          {over && (
                            <button onClick={() => setSklikText(p, "descriptions", i, trimToLimit(val, 90))}
                              className="text-[11px] bg-destructive/10 text-destructive border border-destructive/30 rounded px-1.5 py-1 cursor-pointer hover:bg-destructive/20 whitespace-nowrap mt-0.5">✂️</button>
                          )}
                        </div>
                        <div className="text-right"><CharCount value={val} max={90} warn={80} /></div>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="border-t border-channel-sklik/10 pt-4">
                <div className="text-xs font-bold text-channel-sklik mb-3">🖼️ DISPLAY / Kombinovaná reklama</div>
                <div className="mb-3">
                  <div className="text-xs font-semibold text-channel-sklik/80 mb-2">KRÁTKÝ TITULEK – max 25 zn. (2 varianty)</div>
                  {Array.from({ length: 2 }, (_, i) => {
                    const val = st.displayShortTitles?.[i] || "";
                    const over = val.length > 25;
                    return (
                      <div key={i} className="flex items-center gap-1 mb-1">
                        <div className="relative flex-1">
                          <input
                            value={val}
                            onChange={e => setSklikText(p, "displayShortTitles", i, e.target.value)}
                            placeholder={`Krátký titulek ${i + 1}`}
                            className={`w-full px-2 py-1 pr-12 rounded border text-xs bg-card ${over ? "border-destructive" : "border-input"}`}
                          />
                          <span className="absolute right-1.5 top-1.5">
                            <CharCount value={val} max={25} warn={20} />
                          </span>
                        </div>
                        {over && (
                          <button onClick={() => setSklikText(p, "displayShortTitles", i, trimToLimit(val, 25))}
                            className="text-[11px] bg-destructive/10 text-destructive border border-destructive/30 rounded px-1.5 py-1 cursor-pointer hover:bg-destructive/20 whitespace-nowrap">✂️</button>
                        )}
                      </div>
                    );
                  })}
                </div>
                <div className="mb-3">
                  <div className="text-xs font-semibold text-channel-sklik/80 mb-2">DLOUHÝ TITULEK – max 90 zn. (2 varianty)</div>
                  {Array.from({ length: 2 }, (_, i) => {
                    const val = st.displayLongTitles?.[i] || "";
                    const over = val.length > 90;
                    return (
                      <div key={i} className="flex items-center gap-1 mb-1">
                        <div className="relative flex-1">
                          <input
                            value={val}
                            onChange={e => setSklikText(p, "displayLongTitles", i, e.target.value)}
                            placeholder={`Dlouhý titulek ${i + 1}`}
                            className={`w-full px-2 py-1 pr-12 rounded border text-xs bg-card ${over ? "border-destructive" : "border-input"}`}
                          />
                          <span className="absolute right-1.5 top-1.5">
                            <CharCount value={val} max={90} warn={80} />
                          </span>
                        </div>
                        {over && (
                          <button onClick={() => setSklikText(p, "displayLongTitles", i, trimToLimit(val, 90))}
                            className="text-[11px] bg-destructive/10 text-destructive border border-destructive/30 rounded px-1.5 py-1 cursor-pointer hover:bg-destructive/20 whitespace-nowrap">✂️</button>
                        )}
                      </div>
                    );
                  })}
                </div>
                <div>
                  <div className="text-xs font-semibold text-channel-sklik/80 mb-2">POPISEK – max 90 zn. (2 varianty)</div>
                  {Array.from({ length: 2 }, (_, i) => {
                    const val = st.displayDescriptions?.[i] || "";
                    const over = val.length > 90;
                    return (
                      <div key={i} className="mb-2">
                        <div className="flex items-start gap-1">
                          <textarea
                            value={val}
                            onChange={e => setSklikText(p, "displayDescriptions", i, e.target.value)}
                            placeholder={`Popisek ${i + 1}`}
                            rows={2}
                            className={`flex-1 px-2 py-1 rounded border text-xs bg-card resize-y ${over ? "border-destructive" : "border-input"}`}
                          />
                          {over && (
                            <button onClick={() => setSklikText(p, "displayDescriptions", i, trimToLimit(val, 90))}
                              className="text-[11px] bg-destructive/10 text-destructive border border-destructive/30 rounded px-1.5 py-1 cursor-pointer hover:bg-destructive/20 whitespace-nowrap mt-0.5">✂️</button>
                          )}
                        </div>
                        <div className="text-right"><CharCount value={val} max={90} warn={80} /></div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
