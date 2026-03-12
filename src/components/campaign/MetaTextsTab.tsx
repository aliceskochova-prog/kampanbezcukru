import { CharCount } from "./CharCount";
import { type Campaign } from "@/lib/campaign-data";

interface MetaTextsTabProps {
  camp: Campaign;
  setMetaText: (product: string, field: string, val: string) => void;
}

export function MetaTextsTab({ camp, setMetaText }: MetaTextsTabProps) {
  return (
    <div>
      {camp.products.map(p => {
        const mt = camp.metaTexts[p] || {};
        return (
          <div key={p} className="bg-card rounded-xl border border-channel-meta/10 mb-5 overflow-hidden">
            <div className="bg-channel-meta text-accent-foreground px-4 py-2.5 font-bold text-sm">{p}</div>
            <div className="p-4">
              <div className="grid grid-cols-2 gap-4 mb-3.5">
                <div>
                  <div className="text-xs font-bold text-channel-meta mb-1">HLAVNÍ TEXT – viditelná část (~125 zn.)</div>
                  <div className="text-[11px] text-muted-foreground mb-1">To nejdůležitější musí být hned v prvních 2 větách</div>
                  <textarea
                    value={mt.mainTextVisible || ""}
                    onChange={e => setMetaText(p, "mainTextVisible", e.target.value)}
                    placeholder="Hlavní sdělení – první 2 věty"
                    rows={4}
                    className={`w-full px-2 py-1.5 rounded border text-xs bg-card resize-y ${
                      (mt.mainTextVisible || "").length > 125 ? "border-destructive" : "border-input"
                    }`}
                  />
                  <div className="text-right">
                    <CharCount value={mt.mainTextVisible} max={125} warn={110} />
                  </div>
                </div>
                <div>
                  <div className="text-xs font-bold text-channel-meta mb-1">POKRAČOVÁNÍ TEXTU – skryté</div>
                  <div className="text-[11px] text-muted-foreground mb-1">Libovolná délka, pod "Zobrazit více"</div>
                  <textarea
                    value={mt.mainTextHidden || ""}
                    onChange={e => setMetaText(p, "mainTextHidden", e.target.value)}
                    placeholder="Pokračování textu..."
                    rows={4}
                    className="w-full px-2 py-1.5 rounded border border-input text-xs bg-card resize-y"
                  />
                </div>
              </div>
              <div className="max-w-[360px]">
                <div className="text-xs font-bold text-channel-meta mb-1.5">HEADLINE pod fotku – max 40 zn.</div>
                <div className="relative">
                  <input
                    value={mt.headline || ""}
                    onChange={e => setMetaText(p, "headline", e.target.value)}
                    placeholder="Krátký úderný nadpis pod fotku"
                    className={`w-full px-2 py-1.5 pr-12 rounded border text-xs bg-card ${
                      (mt.headline || "").length > 40 ? "border-destructive" : "border-input"
                    }`}
                  />
                  <span className="absolute right-1.5 top-1.5">
                    <CharCount value={mt.headline} max={40} warn={35} />
                  </span>
                </div>
              </div>
              <div className="mt-3.5 bg-channel-meta-light rounded-lg px-3.5 py-2.5 text-xs text-channel-meta border border-channel-meta/20">
                📐 Vizuály: Příspěvek 1080×1080 px · Story/Reels 1080×1920 px · XML Feed do FB Katalogu
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
