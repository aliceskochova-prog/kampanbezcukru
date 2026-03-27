import { type Campaign, type GenBrief, type GenSettings } from "@/lib/campaign-data";

interface GeneratorTabProps {
  camp: Campaign;
  genBrief: GenBrief;
  setGenBrief: React.Dispatch<React.SetStateAction<GenBrief>>;
  generating: boolean;
  onGenerate: () => void;
  settings: GenSettings;
}

export function GeneratorTab({ camp, genBrief, setGenBrief, generating, onGenerate, settings }: GeneratorTabProps) {
  return (
    <div className="max-w-[680px]">
      <div className="bg-card rounded-xl p-6 border border-border mb-5">
        <h2 className="font-bold text-base mb-4 text-foreground">✨ AI Generátor textů</h2>
        {settings.clientName && (
          <div className="text-xs text-muted-foreground mb-3 bg-muted/50 rounded px-3 py-1.5 border border-border">
            Klient: <strong className="text-foreground">{settings.clientName}</strong> · Nadpisy: {settings.headlineCount}× max {settings.headlineLength} zn. · Popisy: {settings.descriptionCount}× max {settings.descriptionLength} zn. · Tón: {settings.tone}
          </div>
        )}
        <div className="grid gap-3.5">
          <div>
            <label className="text-sm font-semibold text-foreground/80 block mb-1">Produkt *</label>
            <select
              value={genBrief.product}
              onChange={e => setGenBrief(b => ({ ...b, product: e.target.value }))}
              className="w-full px-3 py-2 rounded-md border border-input text-sm bg-card"
            >
              <option value="">– vyber produkt –</option>
              {camp.products.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
          <div>
            <label className="text-sm font-semibold text-foreground/80 block mb-1">USP / klíčové sdělení *</label>
            <textarea
              value={genBrief.usp}
              onChange={e => setGenBrief(b => ({ ...b, usp: e.target.value }))}
              placeholder="např. Přírodní sladidlo bez kalorií, česká výroba, vhodné pro diabetiky"
              rows={3}
              className="w-full px-3 py-2 rounded-md border border-input text-sm bg-card resize-y"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-semibold text-foreground/80 block mb-1">CTA</label>
              <input
                value={genBrief.cta}
                onChange={e => setGenBrief(b => ({ ...b, cta: e.target.value }))}
                placeholder="Koupit nyní"
                className="w-full px-3 py-2 rounded-md border border-input text-sm bg-card"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-foreground/80 block mb-1">Cílová skupina</label>
              <input
                value={genBrief.audience}
                onChange={e => setGenBrief(b => ({ ...b, audience: e.target.value }))}
                placeholder="50+, diabetici, senioři"
                className="w-full px-3 py-2 rounded-md border border-input text-sm bg-card"
              />
            </div>
          </div>
          <button
            onClick={onGenerate}
            disabled={generating || !genBrief.product || !genBrief.usp}
            className="bg-primary text-primary-foreground border-none rounded-lg px-6 py-3 text-sm font-bold cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
          >
            {generating ? "⏳ Generuji texty..." : "✨ Vygenerovat texty pro Google, Sklik i META"}
          </button>
        </div>
      </div>
      <div className="text-sm text-muted-foreground bg-muted/50 rounded-lg p-3 border border-border">
        💡 Texty se uloží na záložkách Google Ads texty, Sklik texty a META Ads texty, kde je můžeš upravit.
      </div>
    </div>
  );
}
