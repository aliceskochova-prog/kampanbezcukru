import { CharCount } from "./CharCount";
import { CopyButton, CopyAllButton } from "./CopyButton";
import { type Campaign, type GenSettings } from "@/lib/campaign-data";

interface GoogleTextsTabProps {
  camp: Campaign;
  setGoogleText: (product: string, field: string, idx: number, val: string) => void;
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

export function GoogleTextsTab({ camp, setGoogleText, settings }: GoogleTextsTabProps) {
  const hlMax = settings.headlineLength;
  const hlCount = settings.headlineCount;
  const descMax = settings.descriptionLength;
  const descCount = settings.descriptionCount;

  return (
    <div>
      {camp.products.map(p => {
        const gt = camp.googleTexts[p] || {};
        return (
          <div key={p} className="bg-card rounded-xl border border-channel-google/10 mb-5 overflow-hidden">
            <div className="bg-channel-google text-primary-foreground px-4 py-2.5 font-bold text-sm">{p}</div>
            <div className="p-4">
              <Section title={`KRÁTKÉ NADPISY – max ${hlMax} zn. (${hlCount} variant)`} color="text-channel-google"
                copyTexts={(gt.shortHeadlines || []).filter(Boolean)}>
                <div className="grid grid-cols-3 gap-1.5">
                  {Array.from({ length: hlCount }, (_, i) => (
                    <FieldWithCount key={i}
                      value={gt.shortHeadlines?.[i] || ""}
                      onChange={v => setGoogleText(p, "shortHeadlines", i, v)}
                      placeholder={`Nadpis ${i + 1}`}
                      max={hlMax} warn={hlMax - 5}
                    />
                  ))}
                </div>
              </Section>
              <Section title="DLOUHÉ NADPISY – max 90 zn. (5 variant)" color="text-channel-google"
                copyTexts={(gt.longHeadlines || []).filter(Boolean)}>
                {Array.from({ length: 5 }, (_, i) => (
                  <FieldWithCount key={i}
                    value={gt.longHeadlines?.[i] || ""}
                    onChange={v => setGoogleText(p, "longHeadlines", i, v)}
                    placeholder={`Dlouhý nadpis ${i + 1}`}
                    max={90} warn={80}
                  />
                ))}
              </Section>
              <Section title={`POPISY – max ${descMax} zn. (${descCount} varianty)`} color="text-channel-google"
                copyTexts={(gt.descriptions || []).filter(Boolean)}>
                {Array.from({ length: descCount }, (_, i) => (
                  <FieldWithCount key={i}
                    value={gt.descriptions?.[i] || ""}
                    onChange={v => setGoogleText(p, "descriptions", i, v)}
                    placeholder={`Popis ${i + 1}`}
                    max={descMax} warn={descMax - 10}
                  />
                ))}
              </Section>
              <Section title="ROZŠÍŘENÍ / HESLA – max 25 zn. (4–8 ks)" color="text-channel-google"
                copyTexts={(gt.extensions || []).filter(Boolean)}>
                <div className="grid grid-cols-4 gap-1.5">
                  {Array.from({ length: 8 }, (_, i) => (
                    <FieldWithCount key={i}
                      value={gt.extensions?.[i] || ""}
                      onChange={v => setGoogleText(p, "extensions", i, v)}
                      placeholder={`Heslo ${i + 1}`}
                      max={25} warn={20}
                    />
                  ))}
                </div>
              </Section>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function Section({ title, color, children, copyTexts }: { title: string; color: string; children: React.ReactNode; copyTexts?: string[] }) {
  return (
    <div className="mb-4">
      <div className="flex items-center justify-between mb-2">
        <div className={`text-xs font-bold ${color}`}>{title}</div>
        {copyTexts && <CopyAllButton texts={copyTexts} />}
      </div>
      {children}
    </div>
  );
}

function FieldWithCount({ value, onChange, placeholder, max, warn }: {
  value: string; onChange: (v: string) => void; placeholder: string; max: number; warn: number;
}) {
  const over = value.length > max;
  return (
    <div className="mb-1">
      <div className="flex items-center gap-1">
        <div className="relative flex-1">
          <input
            value={value}
            onChange={e => onChange(e.target.value)}
            placeholder={placeholder}
            className={`w-full px-2 py-1 pr-11 rounded border text-xs bg-card ${over ? "border-destructive" : "border-input"}`}
          />
          <span className="absolute right-1.5 top-1.5">
            <CharCount value={value} max={max} warn={warn} />
          </span>
        </div>
        {value && <CopyButton text={value} />}
        {over && (
          <button
            onClick={() => onChange(trimToLimit(value, max))}
            className="text-[11px] bg-destructive/10 text-destructive border border-destructive/30 rounded px-1.5 py-1 cursor-pointer hover:bg-destructive/20 whitespace-nowrap"
          >✂️</button>
        )}
      </div>
    </div>
  );
}
