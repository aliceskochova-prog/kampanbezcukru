import { CharCount } from "./CharCount";
import { CopyButton, CopyAllButton } from "./CopyButton";
import { type Campaign, type GenSettings } from "@/lib/campaign-data";

interface SklikTextsTabProps {
  camp: Campaign;
  setSklikText: (product: string, field: string, idx: number, val: string) => void;
  settings: GenSettings;
}

function trimToLimit(text: string, max: number): string {
  if (text.length <= max) return text;
  const trimmed = text.slice(0, max);
  const lastSentence = Math.max(trimmed.lastIndexOf(". "), trimmed.lastIndexOf("! "), trimmed.lastIndexOf("? "));
  if (lastSentence > 0) return trimmed.slice(0, lastSentence + 1);
  const lastSpace = trimmed.lastIndexOf(" ");
  return lastSpace > 0 ? trimmed.slice(0, lastSpace) : trimmed;
}

export function SklikTextsTab({ camp, setSklikText, settings }: SklikTextsTabProps) {
  const hlMax = settings.headlineLength;
  const descMax = settings.descriptionLength;

  return (
    <div>
      {camp.products.map(p => {
        const st = camp.sklikTexts[p] || {};
        return (
          <div key={p} className="bg-card rounded-xl border border-channel-sklik/10 mb-5 overflow-hidden">
            <div className="bg-channel-sklik text-secondary-foreground px-4 py-2.5 font-bold text-sm">{p}</div>
            <div className="p-4">
              <div className="mb-5">
                <div className="text-xs font-bold text-channel-sklik mb-3">🔍 SEARCH reklama</div>
                <SklikSection title={`TITULEK – max ${hlMax} zn. (4 varianty)`}
                  copyTexts={(st.headlines || []).filter(Boolean)}>
                  {Array.from({ length: 4 }, (_, i) => {
                    const val = st.headlines?.[i] || "";
                    const over = val.length > hlMax;
                    return (
                      <div key={i} className="flex items-center gap-1 mb-1">
                        <div className="relative flex-1">
                          <input value={val} onChange={e => setSklikText(p, "headlines", i, e.target.value)}
                            placeholder={`Titulek ${i + 1}`}
                            className={`w-full px-2 py-1 pr-12 rounded border text-xs bg-card ${over ? "border-destructive" : "border-input"}`} />
                          <span className="absolute right-1.5 top-1.5"><CharCount value={val} max={hlMax} warn={hlMax - 5} /></span>
                        </div>
                        {val && <CopyButton text={val} />}
                        {over && <button onClick={() => setSklikText(p, "headlines", i, trimToLimit(val, hlMax))}
                          className="text-[11px] bg-destructive/10 text-destructive border border-destructive/30 rounded px-1.5 py-1 cursor-pointer hover:bg-destructive/20 whitespace-nowrap">✂️</button>}
                      </div>
                    );
                  })}
                </SklikSection>
                <SklikSection title={`POPISEK – max ${descMax} zn. (2 varianty)`}
                  copyTexts={(st.descriptions || []).filter(Boolean)}>
                  {Array.from({ length: 2 }, (_, i) => {
                    const val = st.descriptions?.[i] || "";
                    const over = val.length > descMax;
                    return (
                      <div key={i} className="mb-2">
                        <div className="flex items-start gap-1">
                          <textarea value={val} onChange={e => setSklikText(p, "descriptions", i, e.target.value)}
                            placeholder={`Popisek ${i + 1}`} rows={2}
                            className={`flex-1 px-2 py-1 rounded border text-xs bg-card resize-y ${over ? "border-destructive" : "border-input"}`} />
                          {val && <CopyButton text={val} />}
                          {over && <button onClick={() => setSklikText(p, "descriptions", i, trimToLimit(val, descMax))}
                            className="text-[11px] bg-destructive/10 text-destructive border border-destructive/30 rounded px-1.5 py-1 cursor-pointer hover:bg-destructive/20 whitespace-nowrap mt-0.5">✂️</button>}
                        </div>
                        <div className="text-right"><CharCount value={val} max={descMax} warn={descMax - 10} /></div>
                      </div>
                    );
                  })}
                </SklikSection>
              </div>
              <div className="border-t border-channel-sklik/10 pt-4">
                <div className="text-xs font-bold text-channel-sklik mb-3">🖼️ DISPLAY / Kombinovaná reklama</div>
                <SklikSection title="KRÁTKÝ TITULEK – max 25 zn. (2 varianty)"
                  copyTexts={(st.displayShortTitles || []).filter(Boolean)}>
                  {Array.from({ length: 2 }, (_, i) => {
                    const val = st.displayShortTitles?.[i] || "";
                    const over = val.length > 25;
                    return (
                      <div key={i} className="flex items-center gap-1 mb-1">
                        <div className="relative flex-1">
                          <input value={val} onChange={e => setSklikText(p, "displayShortTitles", i, e.target.value)}
                            placeholder={`Krátký titulek ${i + 1}`}
                            className={`w-full px-2 py-1 pr-12 rounded border text-xs bg-card ${over ? "border-destructive" : "border-input"}`} />
                          <span className="absolute right-1.5 top-1.5"><CharCount value={val} max={25} warn={20} /></span>
                        </div>
                        {val && <CopyButton text={val} />}
                        {over && <button onClick={() => setSklikText(p, "displayShortTitles", i, trimToLimit(val, 25))}
                          className="text-[11px] bg-destructive/10 text-destructive border border-destructive/30 rounded px-1.5 py-1 cursor-pointer hover:bg-destructive/20 whitespace-nowrap">✂️</button>}
                      </div>
                    );
                  })}
                </SklikSection>
                <SklikSection title="DLOUHÝ TITULEK – max 90 zn. (2 varianty)"
                  copyTexts={(st.displayLongTitles || []).filter(Boolean)}>
                  {Array.from({ length: 2 }, (_, i) => {
                    const val = st.displayLongTitles?.[i] || "";
                    const over = val.length > 90;
                    return (
                      <div key={i} className="flex items-center gap-1 mb-1">
                        <div className="relative flex-1">
                          <input value={val} onChange={e => setSklikText(p, "displayLongTitles", i, e.target.value)}
                            placeholder={`Dlouhý titulek ${i + 1}`}
                            className={`w-full px-2 py-1 pr-12 rounded border text-xs bg-card ${over ? "border-destructive" : "border-input"}`} />
                          <span className="absolute right-1.5 top-1.5"><CharCount value={val} max={90} warn={80} /></span>
                        </div>
                        {val && <CopyButton text={val} />}
                        {over && <button onClick={() => setSklikText(p, "displayLongTitles", i, trimToLimit(val, 90))}
                          className="text-[11px] bg-destructive/10 text-destructive border border-destructive/30 rounded px-1.5 py-1 cursor-pointer hover:bg-destructive/20 whitespace-nowrap">✂️</button>}
                      </div>
                    );
                  })}
                </SklikSection>
                <SklikSection title={`POPISEK – max ${descMax} zn. (2 varianty)`}
                  copyTexts={(st.displayDescriptions || []).filter(Boolean)}>
                  {Array.from({ length: 2 }, (_, i) => {
                    const val = st.displayDescriptions?.[i] || "";
                    const over = val.length > descMax;
                    return (
                      <div key={i} className="mb-2">
                        <div className="flex items-start gap-1">
                          <textarea value={val} onChange={e => setSklikText(p, "displayDescriptions", i, e.target.value)}
                            placeholder={`Popisek ${i + 1}`} rows={2}
                            className={`flex-1 px-2 py-1 rounded border text-xs bg-card resize-y ${over ? "border-destructive" : "border-input"}`} />
                          {val && <CopyButton text={val} />}
                          {over && <button onClick={() => setSklikText(p, "displayDescriptions", i, trimToLimit(val, descMax))}
                            className="text-[11px] bg-destructive/10 text-destructive border border-destructive/30 rounded px-1.5 py-1 cursor-pointer hover:bg-destructive/20 whitespace-nowrap mt-0.5">✂️</button>}
                        </div>
                        <div className="text-right"><CharCount value={val} max={descMax} warn={descMax - 10} /></div>
                      </div>
                    );
                  })}
                </SklikSection>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function SklikSection({ title, children, copyTexts }: { title: string; children: React.ReactNode; copyTexts?: string[] }) {
  return (
    <div className="mb-3">
      <div className="flex items-center justify-between mb-2">
        <div className="text-xs font-semibold text-channel-sklik/80">{title}</div>
        {copyTexts && <CopyAllButton texts={copyTexts} />}
      </div>
      {children}
    </div>
  );
}
