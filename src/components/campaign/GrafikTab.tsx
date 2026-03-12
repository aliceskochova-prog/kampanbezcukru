import { type Campaign } from "@/lib/campaign-data";
interface GrafikTabProps {
  camp: Campaign;
}
export function GrafikTab({ camp }: GrafikTabProps) {
  return (
    <div>
      <div className="bg-card rounded-xl px-4 py-3 mb-4 border border-border flex items-center justify-between no-print">
        <div>
          <h2 className="font-bold text-base text-foreground">🎨 Pohled pro grafika — {camp.name}</h2>
          <p className="text-xs text-muted-foreground mt-0.5">Přehled textů a formátů pro přípravu podkladů.</p>
        </div>
        <button
          onClick={() => window.print()}
          className="bg-fan-navy text-primary-foreground border-none rounded-lg px-4 py-2 text-sm font-semibold cursor-pointer hover:opacity-90 transition-opacity"
        >
          🖨️ Tisknout / PDF
        </button>
      </div>
      {camp.products.map(p => {
        const gt = camp.googleTexts[p] || {};
        const mt = (camp.metaTexts[p] as any) || {};
        return (
          <div key={p} className="bg-card rounded-xl border border-border mb-6 overflow-hidden">
            <div className="bg-fan-navy text-primary-foreground px-4 py-2.5 font-bold text-[15px]">{p}</div>

            {/* META */}
            <div className="p-4 border-b border-border">
              <div className="text-xs font-bold text-channel-meta mb-3 uppercase">META Ads – texty do vizuálu</div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-[11px] font-bold text-muted-foreground mb-2">Hlavní texty (5 variant)</div>
                  {Array.from({ length: 5 }, (_, i) => {
                    const val = mt[`mainText_${i}`];
                    return val ? (
                      <div key={i} className="mb-2 bg-channel-meta-light border border-channel-meta/20 rounded-md px-3 py-2">
                        <div className="text-[11px] text-channel-meta font-bold mb-1">Varianta {i + 1}</div>
                        <div className="text-xs text-foreground font-semibold">{val.slice(0, 125)}{val.length > 125 ? "…" : ""}</div>
                        {val.length > 125 && (
                          <div className="text-xs text-muted-foreground mt-1">{val.slice(125)}</div>
                        )}
                      </div>
                    ) : null;
                  })}
                </div>
                <div>
                  <div className="text-[11px] font-bold text-muted-foreground mb-2">Headliny (5 variant)</div>
                  {Array.from({ length: 5 }, (_, i) => {
                    const val = mt[`headline_${i}`];
                    return val ? (
                      <div key={i} className="mb-1 bg-channel-meta-light border border-channel-meta/20 rounded-md px-3 py-1.5">
                        <span className="text-[11px] text-channel-meta font-bold mr-2">{i + 1}.</span>
                        <span className="text-xs font-semibold text-foreground">{val}</span>
                      </div>
                    ) : null;
                  })}
                </div>
              </div>
              <div className="mt-3 bg-channel-meta-light rounded-lg px-3 py-2 text-xs text-channel-meta border border-channel-meta/20">
                📐 <strong>Formáty META:</strong> Příspěvek 1080×1080 px · Story/Reels 1080×1920 px · XML Feed do FB Katalogu
              </div>
            </div>

            {/* Google Ads */}
            <div className="p-4 border-b border-border">
              <div className="text-xs font-bold text-channel-google mb-3 uppercase">Google Ads – texty a formáty</div>
              <div className="grid grid-cols-2 gap-4 mb-3">
                <div>
                  <div className="text-[11px] text-muted-foreground mb-1">Krátké nadpisy (max 30 zn.)</div>
                  <div className="flex flex-wrap gap-1.5">
                    {(gt.shortHeadlines || []).filter(Boolean).length > 0
                      ? (gt.shortHeadlines || []).filter(Boolean).map((h, i) => (
                          <span key={i} className="bg-channel-google-light text-channel-google rounded px-2 py-0.5 text-xs font-medium">{h}</span>
                        ))
                      : <span className="text-muted-foreground/50 text-xs">— nevyplněno —</span>}
                  </div>
                </div>
                <div>
                  <div className="text-[11px] text-muted-foreground mb-1">Rozšíření / hesla (max 25 zn.)</div>
                  <div className="flex flex-wrap gap-1.5">
                    {(gt.extensions || []).filter(Boolean).length > 0
                      ? (gt.extensions || []).filter(Boolean).map((h, i) => (
                          <span key={i} className="bg-status-done-bg text-status-done rounded px-2 py-0.5 text-xs font-medium">✓ {h}</span>
                        ))
                      : <span className="text-muted-foreground/50 text-xs">— nevyplněno —</span>}
                  </div>
                </div>
              </div>
              <div className="bg-channel-google-light rounded-lg p-3 border border-channel-google/20">
                <div className="text-xs font-bold text-channel-google mb-2">📐 Formáty Google Ads PMAX</div>
                <div className="text-[11px] text-muted-foreground mb-2">3 varianty: 1× bez textu · 1× s textem · 1× jen logo. Lze použít až 20 obrázků.</div>
                <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-xs">
                  <div className="flex justify-between"><span>Landscape 1,91:1</span><span className="text-muted-foreground">1200×628 px</span></div>
                  <div className="flex justify-between"><span>Logo čtverec 1:1</span><span className="text-muted-foreground">průhledné pozadí</span></div>
                  <div className="flex justify-between"><span>Čtverec 1:1</span><span className="text-muted-foreground">1200×1200 px</span></div>
                  <div className="flex justify-between"><span>Logo landscape 4:1</span><span className="text-muted-foreground">průhledné pozadí</span></div>
                  <div className="flex justify-between"><span>Portrét 4:5</span><span className="text-muted-foreground">960×1200 px</span></div>
                  <div className="flex justify-between"><span></span><span></span></div>
                  <div className="flex justify-between"><span>Story 9:16</span><span className="text-muted-foreground">1080×1920 px</span></div>
                </div>
              </div>
            </div>

            {/* Sklik */}
            <div className="p-4">
              <div className="text-xs font-bold text-channel-sklik mb-3 uppercase">Sklik – formáty</div>
              <div className="bg-channel-sklik-light rounded-lg p-3 border border-channel-sklik/20">
                <div className="text-xs font-bold text-channel-sklik mb-2">📐 Formáty Sklik Display</div>
                <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-xs">
                  <div className="flex justify-between"><span>Banner</span><span className="text-muted-foreground">300×250 px · max 150 kB</span></div>
                  <div className="flex justify-between"><span>Banner</span><span className="text-muted-foreground">728×90 px · max 150 kB</span></div>
                  <div className="flex justify-between"><span>Banner</span><span className="text-muted-foreground">300×600 px · max 150 kB</span></div>
                  <div className="flex justify-between"><span>Banner mobil</span><span className="text-muted-foreground">320×100 px · max 150 kB</span></div>
                </div>
              </div>
            </div>

          </div>
        );
      })}
    </div>
  );
}
