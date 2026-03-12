import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  CHECKLIST_ITEMS,
  defaultCampaign,
  type Campaign,
  type GenBrief,
} from "@/lib/campaign-data";
import { ChecklistTab } from "@/components/campaign/ChecklistTab";
import { GeneratorTab } from "@/components/campaign/GeneratorTab";
import { GoogleTextsTab } from "@/components/campaign/GoogleTextsTab";
import { SklikTextsTab } from "@/components/campaign/SklikTextsTab";
import { MetaTextsTab } from "@/components/campaign/MetaTextsTab";
import { GrafikTab } from "@/components/campaign/GrafikTab";

const TABS = [
  { key: "checklist", label: "✅ Checklist" },
  { key: "generate", label: "✨ Generátor textů" },
  { key: "google", label: "Google Ads texty" },
  { key: "sklik", label: "Sklik texty" },
  { key: "meta", label: "META Ads texty" },
  { key: "grafik", label: "🎨 Pro grafika" },
];

export default function CampaignManager() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([
    defaultCampaign("FAN Sladidla – Performance Q2"),
  ]);
  const [activeIdx, setActiveIdx] = useState(0);
  const [activeTab, setActiveTab] = useState("checklist");
  const [newName, setNewName] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [genBrief, setGenBrief] = useState<GenBrief>({ product: "", usp: "", cta: "", audience: "" });

  const camp = campaigns[activeIdx];

  const update = (fn: (c: Campaign) => void) => {
    setCampaigns(prev => {
      const next = prev.map((c, i) => (i === activeIdx ? { ...c } : c));
      fn(next[activeIdx]);
      return next;
    });
  };

  const setChecklistStatus = (product: string, itemLabel: string, val: string) =>
    update(c => {
      if (!c.checklist[product]) c.checklist[product] = {};
      c.checklist[product][itemLabel] = val;
    });

  const setGoogleText = (product: string, field: string, idx: number, val: string) =>
    update(c => {
      if (!c.googleTexts[product]) c.googleTexts[product] = {};
      if (!c.googleTexts[product][field]) c.googleTexts[product][field] = [];
      c.googleTexts[product][field][idx] = val;
    });

  const setSklikText = (product: string, field: string, idx: number, val: string) =>
    update(c => {
      if (!c.sklikTexts[product]) c.sklikTexts[product] = {};
      if (!c.sklikTexts[product][field]) c.sklikTexts[product][field] = [];
      c.sklikTexts[product][field][idx] = val;
    });

  const setMetaText = (product: string, field: string, val: string) =>
    update(c => {
      if (!c.metaTexts[product]) c.metaTexts[product] = {};
      c.metaTexts[product][field] = val;
    });

  const completionFor = (product: string) => {
    const done = CHECKLIST_ITEMS.filter(i => camp.checklist[product]?.[i.label] === "✅ Hotovo").length;
    return Math.round((done / CHECKLIST_ITEMS.length) * 100);
  };

  const overallPct = () =>
    Math.round(camp.products.reduce((s, p) => s + completionFor(p), 0) / camp.products.length);

  const generateTexts = async () => {
    if (!genBrief.product || !genBrief.usp) return;
    setGenerating(true);

    // Placeholder: AI generation would go here via Lovable Cloud edge function
    // For now, show alert that AI is not connected yet
    alert("AI generátor zatím není připojen. Dodejte informace o klientovi a napojíme ho.");
    setGenerating(false);
  };

  const pct = overallPct();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-fan-navy text-primary-foreground px-6 py-4 flex items-center justify-between no-print">
        <div>
          <h1 className="font-extrabold text-lg">📊 Campaign Manager</h1>
          <p className="text-xs text-primary-foreground/60 mt-0.5">FAN Sladidla – správa reklamních kampaní a podkladů</p>
        </div>
        <div className="flex gap-2 items-center flex-wrap">
          {campaigns.map((c, i) => (
            <button
              key={i}
              onClick={() => setActiveIdx(i)}
              className={`px-3 py-1.5 rounded-md text-sm border-none cursor-pointer transition-colors ${
                i === activeIdx
                  ? "bg-primary text-primary-foreground font-bold"
                  : "bg-fan-navy-light text-primary-foreground/80 hover:bg-primary/60"
              }`}
            >
              {c.name}
            </button>
          ))}
          {showNew ? (
            <div className="flex gap-1">
              <input
                value={newName}
                onChange={e => setNewName(e.target.value)}
                placeholder="Název kampaně"
                className="px-2 py-1 rounded border border-primary-foreground/30 text-sm bg-fan-navy-light text-primary-foreground placeholder:text-primary-foreground/40"
              />
              <button
                onClick={() => {
                  if (newName.trim()) {
                    setCampaigns(p => [...p, defaultCampaign(newName.trim())]);
                    setActiveIdx(campaigns.length);
                    setNewName("");
                    setShowNew(false);
                  }
                }}
                className="bg-status-done text-primary-foreground border-none rounded px-2.5 py-1 cursor-pointer text-sm font-semibold"
              >
                + Přidat
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowNew(true)}
              className="border border-dashed border-primary-foreground/30 text-primary-foreground/60 bg-transparent rounded-md px-3 py-1.5 cursor-pointer text-sm hover:border-primary-foreground/50 transition-colors"
            >
              + Nová kampaň
            </button>
          )}
        </div>
      </div>

      {/* Progress bar */}
      <div className="bg-card border-b border-border px-6 py-2.5 flex items-center gap-6 no-print">
        <div className="flex-1">
          <div className="text-xs text-muted-foreground mb-1">Celková dokončenost: {pct}%</div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                pct === 100 ? "bg-status-done" : pct > 50 ? "bg-primary" : "bg-status-pending"
              }`}
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>
        <div className="flex gap-4">
          {camp.products.map(p => {
            const pc = completionFor(p);
            return (
              <div key={p} className="text-center">
                <div className="text-[11px] text-muted-foreground">{p}</div>
                <div className={`text-base font-bold ${
                  pc === 100 ? "text-status-done" : pc > 50 ? "text-primary" : "text-status-pending"
                }`}>
                  {pc}%
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-card border-b border-border px-6 flex no-print">
        {TABS.map(t => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key)}
            className={`bg-transparent border-none px-4 py-3 cursor-pointer text-sm transition-colors ${
              activeTab === t.key
                ? "border-b-[3px] border-b-primary text-primary font-bold"
                : "border-b-[3px] border-b-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="p-6">
        {activeTab === "checklist" && <ChecklistTab camp={camp} setChecklistStatus={setChecklistStatus} />}
        {activeTab === "generate" && (
          <GeneratorTab camp={camp} genBrief={genBrief} setGenBrief={setGenBrief} generating={generating} onGenerate={generateTexts} />
        )}
        {activeTab === "google" && <GoogleTextsTab camp={camp} setGoogleText={setGoogleText} />}
        {activeTab === "sklik" && <SklikTextsTab camp={camp} setSklikText={setSklikText} />}
        {activeTab === "meta" && <MetaTextsTab camp={camp} setMetaText={setMetaText} />}
        {activeTab === "grafik" && <GrafikTab camp={camp} />}
      </div>
    </div>
  );
}
