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
          <div className="text-xs text-
