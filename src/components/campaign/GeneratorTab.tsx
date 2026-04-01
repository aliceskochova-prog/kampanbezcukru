import { useState } from "react";
import { type Campaign, type GenBrief, type GenSettings } from "@/lib/campaign-data";

interface GeneratorTabProps {
  camp: Campaign;
  genBrief: GenBrief;
  setGenBrief: React.Dispatch<React.SetStateAction<GenBrief>>;
  generating: boolean;
  onGenerate: () => void;
  settings: GenSettings;
  onAddProduct: (name: string) => void;
  onRemoveProduct: (name: string) => void;
}

export function GeneratorTab({
  camp, genBrief, setGenBrief, generating, onGenerate, settings, onAddProduct, onRemoveProduct,
}: GeneratorTabProps) {
  const [newProduct, setNewProduct] = useState("");

  const handleAddProduct = () => {
    const name = newProduct.trim();
    if (!name || camp.products.includes(name)) return;
    onAddProduct(name);
    setNewProduct("");
  };

  return (
    <div className="max-w-[680px]">
      <div className="bg-card rounded-xl p-6 border border-border mb-5">
        <h2 className="font-bold text-base mb-4 text-foreground">📦 Produkty kampaně</h2>
        {camp.products.length === 0 ? (
          <p className="text-sm text-muted-foreground mb-3">Zatím žádné produkty. Přidej první produkt níže.</p>
        ) : (
          <div className="flex flex-wrap gap-2 mb-3">
            {camp.products.map(p => (
              <div key={p} className="flex items-center gap-1.5 bg-muted/60 rounded-lg px-3 py-1.5 text-sm border border-border">
                <span className="font-medium text-foreground">{p}</span>
                <button
                  onClick={() => {
                    if (genBrief.product === p) setGenBrief(b => ({ ...b, product: "" }));
                    onRemoveProduct(p);
                  }}
                  className="text-muted-foreground hover:text-destructive transition-colors ml-1 text-xs font-bold"
                >✕</button>
              </div>
            ))}
          </div>
        )}
        <div className="flex gap-2">
          <input
            value={newProduct}
            onChange={e => setNewProduct(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleAddProduct()}
            placeholder="Název produktu, např. Stevia Premium"
            className="flex-1 px-3 py-2 rounded-md border border-input text-sm bg-card"
          />
          <button
            onClick={handleAddProduct}
            disabled={!newProduct.trim() || camp.products.includes(newProduct.trim())}
            className="bg-primary text-primary-foreground border-none rounded-lg px-4 py-2 text-sm font-semibold cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
          >+ Přidat</button>
        </div>
      </div>

      <div className="bg-card rounded-xl p-6 border border-border mb-5">
        <h2 className="font-bold text-base mb-4 text-foreground">✨ AI Generátor textů</h2>
        {settings.clientName && (
          <div className="text-xs text-muted-foreground mb-3 bg-muted/50 rounded px-3 py-1.5 border border-border">
            🏢 Klient: <span className="font-semibold text-foreground">{settings.clientName}</span>
          </div>
        )}

        <div className="grid gap-3">
          <div>
            <label className="text-sm font-semibold text-foreground/80 block mb-1">Produkt</label>
            {camp.products.length === 0 ? (
              <p className="text-xs text-muted-foreground">Nejdřív přidej produkty výše.</p>
            ) : (
              <select
                value={genBrief.product}
                onChange={e => setGenBrief(b => ({ ...b, product: e.target.value }))}
                className="w-full px-3 py-2 rounded-md border border-input text-sm bg-card"
              >
                <option value="">— Vyber produkt —</option>
                {camp.products.map(p => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            )}
          </div>
          <div>
            <label className="text-sm font-semibold text-foreground/80 block mb-1">USP / hlavní sdělení *</label>
            <textarea
              value={genBrief.usp}
              onChange={e => setGenBrief(b => ({ ...b, usp: e.target.value }))}
              placeholder="Co je na produktu unikátní? Jaké benefity komunikovat?"
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
                placeholder="např. Objednejte dnes"
                className="w-full px-3 py-2 rounded-md border border-input text-sm bg-card"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-foreground/80 block mb-1">Cílová skupina</label>
              <input
                value={genBrief.audience}
                onChange={e => setGenBrief(b => ({ ...b, audience: e.target.value }))}
                placeholder="např. ženy 25-45"
                className="w-full px-3 py-2 rounded-md border border-input text-sm bg-card"
              />
            </div>
          </div>
        </div>

        <div className="mt-3 p-3 bg-muted/30 rounded-lg border border-border">
          <div className="text-xs font-semibold text-foreground/70 mb-1">Aktivní formáty:</div>
          <div className="text-xs text-muted-foreground">
            {settings.textTypes.map(t => `${t.label} (${t.count}× max ${t.maxLength} zn.)`).join(" · ")}
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            Tón: {settings.tone}
          </div>
        </div>

        <button
          onClick={onGenerate}
          disabled={generating || !genBrief.product || !genBrief.usp}
          className="mt-4 w-full bg-primary text-primary-foreground border-none rounded-lg px-6 py-3 text-sm font-bold cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
        >
          {generating ? "⏳ Generuji texty..." : "✨ Vygenerovat texty"}
        </button>
      </div>
    </div>
  );
}
