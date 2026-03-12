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
    try {
      const { data, error } = await supabase.functions.invoke("generate-fan-texts", {
        body: {
          product: genBrief.product,
          usp: genBrief.usp,
          cta: genBrief.cta,
          audience: genBrief.audience,
        },
      });
      if (error) throw error;
      if (data.error) throw new Error(data.error);
      const p = genBrief.product;
      update(c => {
        c.googleTexts[p] = {
          shortHeadlines: data.google?.shortHeadlines || [],
          longHeadlines: data.google?.longHeadlines || [],
          descriptions: data.google?.descriptions || [],
          extensions: data.google?.extensions || [],
        };
        c.sklikTexts[p] = {
          headlines: data.sklik?.headlines || [],
          descriptions: data.sklik?.descriptions || [],
        };
        c.metaTexts[p] = {
          mainTextVisible: data.meta?.mainTextVisible || "",
          mainTextHidden: data.meta?.mainTextHidden || "",
          headline: data.meta?.headline || "",
        };
      });
      toast.success(`Texty pro "${p}" vygenerovány! Zkontroluj záložky Google, Sklik a META.`);
    } catch (e: any) {
      console.error("Generation error:", e);
      toast.error(e.message || "Chyba při generování textů. Zkuste to znovu.");
    }
    setGenerating(false);
  };

  const exportToCSV = () => {
    const rows: string[] = ["Platforma\tProdukt\tTyp textu\tČ.\tText"];
    camp.products.forEach(p => {
      const g = camp.googleTexts[p] || {};
      (g.shortHeadlines || []).forEach((t: string, i: number) => rows.push(`Google Ads\t${p}\tKrátký nadpis\t${i+1}\t${t}`));
      (g.longHeadlines || []).forEach((t: string, i: number) => rows.push(`Google Ads\t${p}\tDlouhý nadpis\t${i+1}\t${t}`));
      (g.descriptions || []).forEach((t: string, i: number) => rows.push(`Google Ads\t${p}\tPopis\t${i+1}\t${t}`));
      (g.extensions || []).forEach((t: string, i: number) => rows.push(`Google Ads\t${p}\tRozšíření\t${i+1}\t${t}`));
      const s = camp.sklikTexts[p] || {};
      (s.headlines || []).forEach((t: string, i: number) => rows.push(`Sklik\t${p}\tNadpis\t${i+1}\t${t}`));
      (s.descriptions || []).forEach((t: string, i: number) => rows.push(`Sklik\t${p}\tPopis\t${i+1}\t${t}`));
      const m = camp.metaTexts[p] || {};
      if (m.headline) rows.push(`META\t${p}\tNadpis\t1\t${m.headline}`);
      if (m.mainTextVisible) rows.push(`META\t${p}\tHlavní text (viditelný)\t1\t${m.mainTextVisible}`);
      if (m.mainTextHidden) rows.push(`META\t${p}\tHlavní text (skrytý)\t1\t${m.mainTextHidden}`);
    });
    const blob = new Blob(["\uFEFF" + rows.join("\n")], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${camp.name}_texty.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Export dokončen! Soubor byl stažen.");
  };

  const pct = overallPct();
  return (
    <div className="min-h-screen bg-background">
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
          <button
            onClick={exportToCSV}
            className="bg-green-600 hover:bg-green-500 text-white border-none rounded-md px-3 py-1.5 cursor-pointer text-sm font-semibold transition-colors"
          >
            📥 Export do CSV
          </button>
        </div>
      </div>
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
