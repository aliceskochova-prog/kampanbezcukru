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
              <div className="mb-4">
                <div className="text-xs font-bold text-channel-sklik mb-2">NADPIS – max 60 zn. (3 varianty)</div>
                {Array.from({ length: 3 }, (_, i) => (
                  <div key={i} className="relative mb-1">
                    <input
                      value={st.headlines?.[i] || ""}
                      onChange={e => setSklikText(p, "headlines", i, e.target.value)}
                      placeholder={`Nadpis ${i + 1}`}
                      className={`w-full px-2 py-1 pr-12 rounded border text-xs bg-card ${
                        (st.headlines?.[i] || "").length > 60 ? "border-destructive" : "border-input"
                      }`}
                    />
                    <span className="absolute right-1.5 top-1.5">
                      <CharCount value={st.headlines?.[i]} max={60} warn={50} />
                    </span>
                  </div>
                ))}
              </div>
              <div>
                <div className="text-xs font-bold text-channel-sklik mb-2">POPIS – max 150 zn. (2 varianty)</div>
                {Array.from({ length: 2 }, (_, i) => (
                  <div key={i} className="mb-2">
                    <textarea
                      value={st.descriptions?.[i] || ""}
                      onChange={e => setSklikText(p, "descriptions", i, e.target.value)}
                      placeholder={`Popis ${i + 1}`}
                      rows={3}
                      className={`w-full px-2 py-1 rounded border text-xs bg-card resize-y ${
                        (st.descriptions?.[i] || "").length > 150 ? "border-destructive" : "border-input"
                      }`}
                    />
                    <div className="text-right">
                      <CharCount value={st.descriptions?.[i]} max={150} warn={130} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
