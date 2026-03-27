import { useState, useEffect, useRef, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  CHECKLIST_ITEMS,
  defaultCampaign,
  type Campaign,
  type GenBrief,
  type GenSettings,
  defaultGenSettings,
  loadSettings,
  saveSettings,
} from "@/lib/campaign-data";
import { ChecklistTab } from "@/components/campaign/ChecklistTab";
import { GeneratorTab } from "@/components/campaign/GeneratorTab";
import { GoogleTextsTab } from "@/components/campaign/GoogleTextsTab";
import { SklikTextsTab } from "@/components/campaign/SklikTextsTab";
import { MetaTextsTab } from "@/components/campaign/MetaTextsTab";
import { GrafikTab } from "@/components/campaign/GrafikTab";
import { SettingsTab } from "@/components/campaign/SettingsTab";

interface PPCRow {
  platforma: string;
  produkt: string;
  typTextu: string;
  cislo: number;
  text: string;
  znaku: number;
  limit: number;
  status: string;
}

function exportToExcel(data: PPCRow[], fileName = "FAN_Sladidla_PPC_Export"): void {
  const header = ["Platforma", "Produkt", "Typ textu", "Č.", "Text", "Znaků", "Limit", "Status"];
  const PLAT_ORDER = ["Google Ads", "Sklik", "META"];
  const sorted = [...data].sort((a, b) => {
    const pi = PLAT_ORDER.indexOf(a.platforma) - PLAT_ORDER.indexOf(b.platforma);
    if (pi !== 0) return pi;
    if (a.produkt < b.produkt) return -1;
    if (a.produkt > b.produkt) return 1;
    if (a.typTextu < b.typTextu) return -1;
    if (a.typTextu > b.typTextu) return 1;
    return a.cislo - b.cislo;
  });
  const rows = sorted.map(r => [r.platforma, r.produkt, r.typTextu, r.cislo, r.text, r.znaku, r.limit || "", r.status]);
  const csvRows = [header, ...rows].map(row =>
    row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(",")
  );
  const blob = new Blob(["\uFEFF" + csvRows.join("\n")], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${fileName}_${new Date().toISOString().slice(0,10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

function getStatus(len: number, max: number): string {
  if (len === 0) return "";
  if (len > max) return "❌ Přes limit";
  if (len >= max - 4) return "⚠️ Na hraně";
  return "✅ OK";
}

const TABS = [
  { key: "settings", label: "⚙️ Nastavení" },
  { key: "checklist", label: "✅ Checklist" },
  { key: "generate", label: "✨ Generátor textů" },
  { key: "google", label: "Google Ads texty" },
  { key: "sklik", label: "Sklik texty" },
  { key: "meta", label: "META Ads texty" },
  { key: "grafik", label: "🎨 Pro grafika" },
];

function dbToCampaign(row: any): Campaign {
  return {
    id: row.id,
    name: row.name,
    products: row.products || [],
    checklist: row.checklist || {},
    googleTexts: row.google_texts || {},
    sklikTexts: row.sklik_texts || {},
    metaTexts: row.meta_texts || {},
  };
}

export default function CampaignManager() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [activeIdx, setActiveIdx] = useState(0);
  const [activeTab, setActiveTab] = useState("settings");
  const [newName, setNewName] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [loading, setLoading] = useState(true);
  const [genBrief, setGenBrief] = useState<GenBrief>({ product: "", usp: "", cta: "", audience: "" });
  const [settings, setSettings] = useState<GenSettings>(loadSettings);
  const saveTimeout = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    const load = async () => {
      const { data, error } = await supabase
        .from("campaigns")
        .select("*")
        .order("created_at", { ascending: true });
      if (error) {
        console.error("Load error:", error);
        setCampaigns([defaultCampaign("FAN Sladidla – Performance Q2")]);
      } else if (data && data.length > 0) {
        setCampaigns(data.map(dbToCampaign));
      } else {
        const def = defaultCampaign("FAN Sladidla – Performance Q2");
        const { data: inserted, error: insertErr } = await supabase
          .from("campaigns")
          .insert({
            name: def.name,
            products: def.products,
            checklist: def.checklist,
            google_texts: def.googleTexts,
            sklik_texts: def.sklikTexts,
            meta_texts: def.metaTexts,
          })
          .select()
          .single();
        if (insertErr || !inserted) {
          setCampaigns([def]);
        } else {
          setCampaigns([dbToCampaign(inserted)]);
        }
      }
      setLoading(false);
    };
    load();
  }, []);

  const saveCampaign = useCallback(async (camp: Campaign) => {
    if (!camp.id) return;
    await supabase
      .from("campaigns")
      .update({
        name: camp.name,
        products: camp.products,
        checklist: camp.checklist,
        google_texts: camp.googleTexts,
        sklik_texts: camp.sklikTexts,
        meta_texts: camp.metaTexts,
      })
      .eq("id", camp.id);
  }, []);

  const camp = campaigns[activeIdx] || defaultCampaign("...");

  const update = (fn: (c: Campaign) => void) => {
    setCampaigns(prev => {
      const next = prev.map((c, i) => (i === activeIdx ? { ...c } : c));
      fn(next[activeIdx]);
      if (saveTimeout.current) clearTimeout(saveTimeout.current);
      saveTimeout.current = setTimeout(() => saveCampaign(next[activeIdx]), 1000);
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
      (c.metaTexts[product] as any)[field] = val;
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
          headlineCount: settings.headlineCount,
          headlineLength: settings.headlineLength,
          descriptionCount: settings.descriptionCount,
          descriptionLength: settings.descriptionLength,
          tone: settings.tone,
          clientName: settings.clientName,
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
          displayShortTitles: data.sklik?.displayShortTitles || [],
          displayLongTitles: data.sklik?.displayLongTitles || [],
          displayDescriptions: data.sklik?.displayDescriptions || [],
        };
        const metaTexts: Record<string, string> = {};
        if (data.meta?.mainTexts && Array.isArray(data.meta.mainTexts)) {
          data.meta.mainTexts.forEach((t: string, i: number) => {
            metaTexts[`mainText_${i}`] = t;
          });
        } else if (data.meta?.mainTextVisible) {
          metaTexts[`mainText_0`] = data.meta.mainTextVisible + (data.meta.mainTextHidden ? "\n\n" + data.meta.mainTextHidden : "");
        }
        if (data.meta?.headlines && Array.isArray(data.meta.headlines)) {
          data.meta.headlines.forEach((t: string, i: number) => {
            metaTexts[`headline_${i}`] = t;
          });
        } else if (data.meta?.headline) {
          metaTexts[`headline_0`] = data.meta.headline;
        }
        (c.metaTexts[p] as any) = metaTexts;
      });
      toast.success(`Texty pro "${p}" vygenerovány! Zkontroluj záložky Google, Sklik a META.`);
      setTimeout(() => {
        const currentCamp = campaigns[activeIdx];
        if (currentCamp) saveCampaign(currentCamp);
      }, 100);
    } catch (e: any) {
      console.error("Generation error:", e);
      toast.error(e.message || "Chyba při generování textů. Zkuste to znovu.");
    }
    setGenerating(false);
  };

  const handleExport = () => {
    const rows: PPCRow[] = [];
    camp.products.forEach(p => {
      const g = camp.googleTexts[p] || {};
      const s = camp.sklikTexts[p] || {};
      const m = (camp.metaTexts[p] as any) || {};
      (g.shortHeadlines || []).forEach((text: string, i: number) => {
        if (!text) return;
        rows.push({ platforma: "Google Ads", produkt: p, typTextu: "Krátký nadpis", cislo: i + 1, text, znaku: text.length, limit: settings.headlineLength, status: getStatus(text.length, settings.headlineLength) });
      });
      (g.longHeadlines || []).forEach((text: string, i: number) => {
        if (!text) return;
        rows.push({ platforma: "Google Ads", produkt: p, typTextu: "Dlouhý nadpis", cislo: i + 1, text, znaku: text.length, limit: 90, status: getStatus(text.length, 90) });
      });
      (g.descriptions || []).forEach((text: string, i: number) => {
        if (!text) return;
        rows.push({ platforma: "Google Ads", produkt: p, typTextu: "Popis", cislo: i + 1, text, znaku: text.length, limit: settings.descriptionLength, status: getStatus(text.length, settings.descriptionLength) });
      });
      (g.extensions || []).forEach((text: string, i: number) => {
        if (!text) return;
        rows.push({ platforma: "Google Ads", produkt: p, typTextu: "Rozšíření", cislo: i + 1, text, znaku: text.length, limit: 25, status: getStatus(text.length, 25) });
      });
      (s.headlines || []).forEach((text: string, i: number) => {
        if (!text) return;
        rows.push({ platforma: "Sklik", produkt: p, typTextu: "Search titulek", cislo: i + 1, text, znaku: text.length, limit: settings.headlineLength, status: getStatus(text.length, settings.headlineLength) });
      });
      (s.descriptions || []).forEach((text: string, i: number) => {
        if (!text) return;
        rows.push({ platforma: "Sklik", produkt: p, typTextu: "Search popisek", cislo: i + 1, text, znaku: text.length, limit: settings.descriptionLength, status: getStatus(text.length, settings.descriptionLength) });
      });
      (s.displayShortTitles || []).forEach((text: string, i: number) => {
        if (!text) return;
        rows.push({ platforma: "Sklik", produkt: p, typTextu: "Display krátký titulek", cislo: i + 1, text, znaku: text.length, limit: 25, status: getStatus(text.length, 25) });
      });
      (s.displayLongTitles || []).forEach((text: string, i: number) => {
        if (!text) return;
        rows.push({ platforma: "Sklik", produkt: p, typTextu: "Display dlouhý titulek", cislo: i + 1, text, znaku: text.length, limit: 90, status: getStatus(text.length, 90) });
      });
      (s.displayDescriptions || []).forEach((text: string, i: number) => {
        if (!text) return;
        rows.push({ platforma: "Sklik", produkt: p, typTextu: "Display popisek", cislo: i + 1, text, znaku: text.length, limit: 90, status: getStatus(text.length, 90) });
      });
      for (let i = 0; i < 5; i++) {
        const text = m[`mainText_${i}`];
        if (!text) continue;
        rows.push({ platforma: "META", produkt: p, typTextu: "Hlavní text", cislo: i + 1, text, znaku: text.length, limit: 0, status: "✅ OK" });
      }
      for (let i = 0; i < 5; i++) {
        const text = m[`headline_${i}`];
        if (!text) continue;
        rows.push({ platforma: "META", produkt: p, typTextu: "Headline", cislo: i + 1, text, znaku: text.length, limit: 40, status: getStatus(text.length, 40) });
      }
    });
    if (rows.length === 0) {
      toast.error("Žádné texty k exportu. Nejdřív vygeneruj texty v záložce Generátor.");
      return;
    }
    exportToExcel(rows, camp.name.replace(/[^a-zA-Z0-9_\-]/g, "_"));
    toast.success("Export dokončen! Soubor byl stažen.");
  };

  const pct = overallPct();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-muted-foreground text-lg">⏳ Načítám kampaně...</div>
      </div>
    );
  }

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
                onClick={async () => {
                  if (newName.trim()) {
                    const def = defaultCampaign(newName.trim());
                    const { data: inserted, error } = await supabase
                      .from("campaigns")
                      .insert({
                        name: def.name,
                        products: def.products,
                        checklist: def.checklist,
                        google_texts: def.googleTexts,
                        sklik_texts: def.sklikTexts,
                        meta_texts: def.metaTexts,
                      })
                      .select()
                      .single();
                    if (error || !inserted) {
                      toast.error("Chyba při vytváření kampaně");
                      return;
                    }
                    setCampaigns(p => [...p, dbToCampaign(inserted)]);
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
            onClick={handleExport}
            className="bg-green-600 hover:bg-green-500 text-white border-none rounded-md px-3 py-1.5 cursor-pointer text-sm font-semibold transition-colors"
          >
            📥 Export do Excelu
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
        {activeTab === "settings" && (
          <SettingsTab
            settings={settings}
            setSettings={setSettings}
            onSaveDefault={() => {
              saveSettings(settings);
              toast.success("Nastavení uloženo jako výchozí.");
            }}
          />
        )}
        {activeTab === "checklist" && <ChecklistTab camp={camp} setChecklistStatus={setChecklistStatus} />}
        {activeTab === "generate" && (
          <GeneratorTab camp={camp} genBrief={genBrief} setGenBrief={setGenBrief} generating={generating} onGenerate={generateTexts} settings={settings} />
        )}
        {activeTab === "google" && <GoogleTextsTab camp={camp} setGoogleText={setGoogleText} settings={settings} />}
        {activeTab === "sklik" && <SklikTextsTab camp={camp} setSklikText={setSklikText} settings={settings} />}
        {activeTab === "meta" && <MetaTextsTab camp={camp} setMetaText={setMetaText} />}
        {activeTab === "grafik" && <GrafikTab camp={camp} />}
      </div>
    </div>
  );
}
