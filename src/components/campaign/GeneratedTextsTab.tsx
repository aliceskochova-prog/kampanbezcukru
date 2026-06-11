import { type Campaign, type GenSettings, type TextType } from "@/lib/campaign-data";
import { CharCount } from "./CharCount";
import { CopyButton, CopyAllButton } from "./CopyButton";

interface Props {
  camp: Campaign;
  settings: GenSettings;
  setCustomText: (product: string, typeId: string, idx: number, val: string) => void;
}

export function GeneratedTextsTab({ camp, settings, setCustomText }: Props) {
  if (camp.products.length === 0) {
    return <p className="text-sm text-muted-foreground">Zatím žádné produkty. Přidej produkt v záložce Generátor.</p>;
  }
  const types = settings.textTypes;
  if (types.length === 0) {
    return <p className="text-sm text-muted-foreground">V Nastavení nejsou definovány žádné typy textů.</p>;
  }

  // Seskupení typů podle kanálu, zachová pořadí
  const grouped: { channel: string; types: TextType[] }[] = [];
  for (const t of types) {
    const ch = t.channel || "Ostatní";
    let g = grouped.find(x => x.channel === ch);
    if (!g) { g = { channel: ch, types: [] }; grouped.push(g); }
    g.types.push(t);
  }

  return (
    <div className="space-y-8">
      {camp.products.map(product => {
        const data = (camp.customTexts?.[product] as Record<string, string[]>) || {};
        const hasAny = types.some(t => (data[t.id] || []).some(Boolean));
        return (
          <div key={product} className="bg-card rounded-xl border border-border p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-base text-foreground">📦 {product}</h3>
              {!hasAny && (
                <span className="text-xs text-muted-foreground">Vygeneruj texty v záložce Generátor.</span>
              )}
            </div>

            <div className="space-y-6">
              {grouped.map(group => (
                <div key={group.channel} className="border border-border/60 rounded-lg p-4 bg-muted/20">
                  <h4 className="font-bold text-sm text-foreground mb-3 flex items-center gap-2">
                    <span className="inline-block w-1.5 h-4 bg-primary rounded-sm" />
                    {group.channel}
                  </h4>
                  <div className="space-y-4">
                    {group.types.map(t => {
                      const arr = data[t.id] || [];
                      const values: string[] = Array.from({ length: t.count }, (_, i) => arr[i] || "");
                      return (
                        <div key={t.id}>
                          <div className="flex items-center justify-between mb-2">
                            <div className="text-sm font-semibold text-foreground">
                              {t.label} <span className="text-xs text-muted-foreground font-normal">({t.count}× max {t.maxLength} zn.)</span>
                            </div>
                            <CopyAllButton texts={values} />
                          </div>
                          <div className="grid gap-2">
                            {values.map((v, i) => {
                              const over = v.length > t.maxLength;
                              return (
                                <div key={i} className="flex items-start gap-2">
                                  <span className="text-xs text-muted-foreground w-6 pt-2 text-right">{i + 1}.</span>
                                  <textarea
                                    value={v}
                                    onChange={e => setCustomText(product, t.id, i, e.target.value)}
                                    rows={v.length > 80 ? 2 : 1}
                                    className={`flex-1 px-2 py-1.5 rounded border text-sm bg-card resize-y ${
                                      over ? "border-destructive" : "border-input"
                                    }`}
                                  />
                                  <div className="flex flex-col items-end gap-1 pt-1 min-w-[60px]">
                                    <CharCount value={v} max={t.maxLength} warn={Math.max(1, t.maxLength - 4)} />
                                    <CopyButton text={v} />
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
