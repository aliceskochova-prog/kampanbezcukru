import { CharCount } from "./CharCount";
import { type Campaign } from "@/lib/campaign-data";
interface SklikTextsTabProps {
  camp: Campaign;
  setSklikText: (product: string, field: string, idx: number, val: string) => void;
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

              {/* SEARCH */}
              <div className="mb-5">
                <div className="text-xs font-bold text-channel-sklik mb-3">🔍 SEARCH reklama</div>
                <div className="mb-3">
                  <div className="text-xs font-semibold text-channel-sklik/80 mb-2">TITULEK – max 30 zn. (4 varianty)</div>
                  {Array.from({ length: 4 }, (_, i) => (
                    <div key={i} className="relative mb-1">
                      <input
                        value={st.headlines?.[i] || ""}
                        onChange={e => setSklikText(p, "headlines", i, e.target.value)}
                        placeholder={`Titulek ${i + 1}`}
                        className={`w-full px-2 py-1 pr-12 rounded border text-xs bg-card ${
                          (st.headlines?.[i] || "").length > 30 ? "border-destructive" : "border-input"
                        }`}
                      />
                      <span className="absolute right-1.5 top-1.5">
                        <CharCount value={st.headlines?.[i]} max={30} warn={25} />
                      </span>
                    </div>
                  ))}
                </div>
                <div>
                  <div className="text-xs font-semibold text-channel-sklik/80 mb-2">POPISEK – max 90 zn. (2 varianty)</div>
                  {Array.from({ length: 2 }, (_, i) => (
                    <div key={i} className="mb-2">
                      <textarea
                        value={st.descriptions?.[i] || ""}
                        onChange={e => setSklikText(p, "descriptions", i, e.target.value)}
                        placeholder={`Popisek ${i + 1}`}
                        rows={2}
                        className={`w-full px-2 py-1 rounded border text-xs bg-card resize-y ${
                          (st.descriptions?.[i] || "").length > 90 ? "border-destructive" : "border-input"
                        }`}
                      />
                      <div className="text-right">
                        <CharCount value={st.descriptions?.[i]} max={90} warn={80} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* DISPLAY */}
              <div className="border-t border-channel-sklik/10 pt-4">
                <div className="text-xs font-bold text-channel-sklik mb-3">🖼️ DISPLAY / Kombinovaná reklama</div>
                <div className="mb-3">
                  <div className="text-xs font-semibold text-channel-sklik/80 mb-2">KRÁTKÝ TITULEK – max 25 zn. (2 varianty)</div>
                  {Array.from({ length: 2 }, (_, i) => (
                    <div key={i} className="relative mb-1">
                      <input
                        value={st.displayShortTitles?.[i] || ""}
                        onChange={e => setSklikText(p, "displayShortTitles", i, e.target.value)}
                        placeholder={`Krátký titulek ${i + 1}`}
                        className={`w-full px-2 py-1 pr-12 rounded border text-xs bg-card ${
                          (st.displayShortTitles?.[i] || "").length > 25 ? "border-destructive" : "border-input"
                        }`}
                      />
                      <span className="absolute right-1.5 top-1.5">
                        <CharCount value={st.displayShortTitles?.[i]} max={25} warn={20} />
                      </span>
                    </div>
                  ))}
                </div>
                <div className="mb-3">
                  <div className="text-xs font-semibold text-channel-sklik/80 mb-2">DLOUHÝ TITULEK – max 90 zn. (2 varianty)</div>
                  {Array.from({ length: 2 }, (_, i) => (
                    <div key={i} className="relative mb-1">
                      <input
                        value={st.displayLongTitles?.[i] || ""}
                        onChange={e => setSklikText(p, "displayLongTitles", i, e.target.value)}
                        placeholder={`Dlouhý titulek ${i + 1}`}
                        className={`w-full px-2 py-1 pr-12 rounded border text-xs bg-card ${
                          (st.displayLongTitles?.[i] || "").length > 90 ? "border-destructive" : "border-input"
                        }`}
                      />
                      <span className="absolute right-1.5 top-1.5">
                        <CharCount value={st.displayLongTitles?.[i]} max={90} warn={80} />
                      </span>
                    </div>
                  ))}
                </div>
                <div>
                  <div className="text-xs font-semibold text-channel-sklik/80 mb-2">POPISEK – max 90 zn. (2 varianty)</div>
                  {Array.from({ length: 2 }, (_, i) => (
                    <div key={i} className="mb-2">
                      <textarea
                        value={st.displayDescriptions?.[i] || ""}
                        onChange={e => setSklikText(p, "displayDescriptions", i, e.target.value)}
                        placeholder={`Popisek ${i + 1}`}
                        rows={2}
                        className={`w-full px-2 py-1 rounded border text-xs bg-card resize-y ${
                          (st.displayDescriptions?.[i] || "").length > 90 ? "border-destructive" : "border-input"
                        }`}
                      />
                      <div className="text-right">
                        <CharCount value={st.displayDescriptions?.[i]} max={90} warn={80} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        );
      })}
    </div>
  );
}
