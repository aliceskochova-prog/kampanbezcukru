import { VISUAL_ITEMS, type Campaign } from "@/lib/campaign-data";
interface GrafikTabProps {
  camp: Campaign;
}
const chColor: Record<string, string> = {
  "Google Ads": "text-channel-google",
  "Sklik": "text-channel-sklik",
  "META": "text-channel-meta",
};
export function GrafikTab({ camp }: GrafikTabProps) {
  return (
    <div>
      <div className="bg-card rounded-xl px-4 py-3 mb-4 border border-border flex items-center justify-between no-print">
        <div>
          <h2 className="font-bold text-base text-foreground">🎨 Pohled pro grafika — {camp.name}</h2>
          <p className="text-xs text-muted-foreground mt-0.5">Read-only přehled textů, formátů a stavu podkladů.</p>
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
        const mt = camp.metaTexts[p] || {};
        const cl = camp.checklist[p] || {};
        return (
          <div key={p} className="bg-card rounded-xl border border-border mb-6 overflow-hidden">
            <div className="bg-fan-navy text-primary-foreground px-4 py-2.5 font-bold text-[15px]">{p}</div>
            <div className="grid grid-cols-2 border-b border-border">
              {/* META texts */}
              <div className="p-4 border-r border-border">
                <div className="text-xs font-bold text-channel-meta mb-2.5 uppercase">META Ads – texty do vizuálu</div>
                <ReadOnlyField label="Headline pod fotku (max 40 zn.)" value={mt.headline} highlight />
                <ReadOnlyField label="Hlavní text – prvních 125 zn. (hook)" value={mt.mainTextVisible ? mt.mainTextVisible.slice(0, 125) + (mt.mainTextVisible.length > 125 ? "…" : "") : ""} highlight />
                {mt.mainTextVisible && mt.mainTextVisible.length > 125 && (
                  <ReadOnlyField label="Pokračování textu (skryté)" value={mt.mainTextVisible.slice(125)} />
                )}
              </div>
              {/* Google headlines */}
              <div className="p-4">
                <div className="text-xs font-bold text-channel-google mb-2.5 uppercase">Google Ads – nadpisy a hesla</div>
                <div className="mb-2.5">
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
            </div>

            {/* Google Ads PMAX formáty */}
            <div className="p-4 border-b border-border">
              <div className="text-xs font-bold text-channel-google mb-3 uppercase">Google Ads PMAX – grafické formáty</div>
              <div className="text-[11px] text-muted-foreground mb-3">3 varianty: 1× bez textu · 1× s textem · 1× jen logo (průhledné pozadí). Lze použít až 20 obrázků.</div>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-channel-google-light rounded-lg p-3 border border-channel-google/20">
                  <div className="text-xs font-bold text-channel-google mb-2">📐 Formáty obrázků</div>
                  <div className="space-y-1 text-xs text-foreground">
                    <div className="flex justify-between"><span>Landscape 1,91:1</span><span className="text-muted-foreground">1200×628 px</span></div>
                    <div className="flex justify-between"><span>Čtverec 1:1</span><span className="text-muted-foreground">1200×1200 px</span></div>
                    <div className="flex justify-between"><span>Portrét 4:5</span><span className="text-muted-foreground">960×1200 px</span></div>
                    <div className="flex justify-between"><span>Story 9:16</span><span className="text-muted-foreground">1080×1920 px</span></div>
                  </div>
                </div>
                <div className="bg-channel-google-light rounded-lg p-3 border border-channel-google/20">
                  <div className="text-xs font-bold text-channel-google mb-2">🏷️ Logo formáty</div>
                  <div className="space-y-1 text-xs text-foreground">
                    <div className="flex justify-between"><span>Čtverec 1:1</span><span className="text-muted-foreground">průhledné pozadí</span></div>
                    <div className="flex justify-between"><span>Landscape 4:1</span><span className="text-muted-foreground">průhledné pozadí</span></div>
                  </div>
                  <div className="mt-2 text-[11px] text-muted-foreground">⚠️ Logo musí mít průhledné pozadí (.PNG)</div>
                </div>
              </div>
            </div>

            {/* Visual formats checklist */}
            <div className="p-4">
              <div className="text-xs font-bold text-foreground/70 mb-2.5 uppercase">Grafické formáty – stav podkladů</div>
              <div className="grid grid-cols-3 gap-1.5">
                {VISUAL_ITEMS.map(item => {
                  const status = cl[item.label] || "–";
                  const bgClass = status === "✅ Hotovo" ? "bg-status-done-bg border-status-done/30"
                    : status === "⏳ Čeká" ? "bg-status-pending-bg border-status-pending/30"
                    : status === "❌ Chybí" ? "bg-status-missing-bg border-status-missing/30"
                    : "bg-muted/30 border-border";
                  return (
                    <div key={item.label} className={`${bgClass} border rounded-md px-2.5 py-2 flex justify-between items-start`}>
                      <div>
                        <div className={`text-[11px] font-bold ${chColor[item.ch] || "text-foreground"}`}>{item.ch}</div>
                        <div className="text-xs font-semibold text-foreground mt-0.5">{item.spec}</div>
                        <div className="text-[11px] text-muted-foreground mt-0.5">{item.note}</div>
                      </div>
                      <div className="text-sm ml-1.5">{status !== "–" ? status.split(" ")[0] : ""}</div>
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
function ReadOnlyField({ label, value, highlight }: { label: string; value?: string; highlight?: boolean }) {
  return (
    <div className="mb-2.5">
      <div className="text-[11px] text-muted-foreground mb-0.5">{label}</div>
      <div className={`border rounded-md px-2.5 py-1.5 text-xs min-h-[32px] whitespace-pre-wrap ${
        value
          ? highlight ? "bg-channel-meta-light border-channel-meta/20 font-bold text-foreground" : "bg-muted/30 border-border text-foreground/80"
          : "bg-muted/20 border-border text-muted-foreground/40"
      }`}>
        {value || "— nevyplněno —"}
      </div>
    </div>
  );
}
