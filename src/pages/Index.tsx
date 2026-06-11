import { useState, useEffect, useRef, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import * as XLSX from "xlsx";
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
import { GrafikTab } from "@/components/campaign/GrafikTab";
import { SettingsTab } from "@/components/campaign/SettingsTab";
import { GeneratedTextsTab } from "@/components/campaign/GeneratedTextsTab";

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

function exportToExcel(data: PPCRow[], fileName = "PPC_Export"): void {
  const PLAT_ORDER = ["Google PMAX", "Google Search", "Sklik Search", "Sklik Display", "META Ads", "LinkedIn Ads", "Bannery"];
  const header = ["Produkt", "Typ textu", "Č.", "Text", "Znaků", "Limit", "Status"];
  const wb = XLSX.utils.book_new();

  PLAT_ORDER.forEach(channel => {
    const channelRows = data.filter(r => r.platforma === channel);
    if (channelRows.length === 0) return;
    const sorted = [...channelRows].sort((a, b) => {
      if (a.produkt < b.produkt) return -1;
      if (a.produkt > b.produkt) return 1;
      if (a.typTextu < b.typTextu) return -1;
      if (a.typTextu > b.typTextu) return 1;
      return a.cislo - b.cislo;
    });
    const wsData = [header, ...sorted.map(r => [r.produkt, r.typTextu, r.cislo, r.text, r.znaku, r.limit || "", r.status])];
    const ws = XLSX.utils.aoa_to_sheet(wsData);
    ws["!cols"] = [{ wch: 20 }, { wch: 25 }, { wch: 4 }, { wch: 60 }, { wch: 7 }, { wch: 7 }, { wch: 12 }];
    XLSX.utils.book_append_sheet(wb, ws, channel);
  });

  const date = new Date().toISOString().slice(0, 10);
  XLSX.writeFile(wb, `${fileName}_${date}.xlsx`);
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
  { key: "results", label: "📝 Vygenerované texty" },
  { key: "google_pmax", label: "Google PMAX" },
  { key: "google_search", label: "Google Search" },
  { key: "sklik_search", label: "Sklik Search" },
  { key: "sklik_display", label: "Sklik Display" },
  { key: "meta", label: "META Ads" },
  { key: "linkedin", label: "LinkedIn Ads" },
  { key: "bannery", label: "Bannery" },
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
    customTexts: row.custom_texts || {},
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
  const [editingTabIdx, setEditingTabIdx] = useState<number | null>(null);
  const [editingName, setEditingName] = useState("");
  const [genBrief, setGenBrief] = useState<GenBrief>({ product: "", usp: "", cta: "", audience: "" });
  const [settings, setSettings] = useState<GenSettings>(loadSettings);
  const saveTimeout = useRef<ReturnType<typeof setTimeout>>();

  const refreshCampaign = useCallback(async (idx: number, allCampaigns: Campaign[]) => {
    const c = allCampaigns[idx];
    if (!c?.id) return;
    const { data, error } = await supabase
      .from("campaigns")
      .select("*")
      .eq("id", c.id)
      .single();
    if (!error && data) {
      setCampaigns(prev => prev.map((camp, i) => i === idx ? dbToCampaign(data) : camp));
    }
  }, []);

  const switchCampaign = useCallback(async (idx: number, allCampaigns: Campaign[]) => {
    setActiveIdx(idx);
    setGenBrief({ product: "", usp: "", cta: "", audience: "" });
    await refreshCampaign(idx, allCampaigns);
  }, [refreshCampaign]);

  useEffect(() => {
    const load = async () => {
      const { data, error } = await supabase
        .from("campaigns")
        .select("*")
        .order("created_at", { ascending: true });
      if (error) {
        console.error("Load error:", error);
        setCampaigns([defaultCampaign("Nová kampaň")]);
      } else if (data && data.length > 0) {
        setCampaigns(data.map(dbToCampaign));
      } else {
        const def = defaultCampaign("Nová kampaň");
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
        custom_texts: camp.customTexts,
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

  const addProduct = (name: string) =>
    update(c => {
      if (!c.products.includes(name)) c.products.push(name);
    });

  const removeProduct = (name: string) =>
    update(c => {
      c.products = c.products.filter(p => p !== name);
      delete c.checklist[name];
      delete c.googleTexts[name];
      delete c.sklikTexts[name];
      delete c.metaTexts[name];
      if (c.customTexts) delete c.customTexts[name];
    });

  const setCustomText = (product: string, typeId: string, idx: number, val: string) =>
    update(c => {
      if (!c.customTexts) c.customTexts = {};
      if (!c.customTexts[product]) c.customTexts[product] = {};
      if (!c.customTexts[product][typeId]) c.customTexts[product][typeId] = [];
      c.customTexts[product][typeId][idx] = val;
    });

  const setChecklistStatus = (product: string, itemLabel: string, val: string) =>
    update(c => {
      if (!c.checklist[product]) c.checklist[product] = {};
      c.checklist[product][itemLabel] = val;
    });

  const completionFor = (product: string) => {
    const done = CHECKLIST_ITEMS.filter(i => camp.checklist[product]?.[i.label] === "✅ Hotovo").length;
    return Math.round((done / CHECKLIST_ITEMS.length) * 100);
  };

  const overallPct = () =>
    camp.products.length === 0
      ? 0
      : Math.round(camp.products.reduce((s, p) => s + completionFor(p), 0) / camp.products.length);

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
          tone: settings.tone,
          clientName: settings.clientName,
          textTypes: settings.textTypes.map(t => ({
            id: t.id, label: t.label, count: t.count, maxLength: t.maxLength,
          })),
        },
      });
      if (error) throw error;
      if (data.error) throw new Error(data.error);
      const p = genBrief.product;
      const results: Record<string, string[]> = data.results || {};
      update(c => {
        if (!c.customTexts) c.customTexts = {};
        c.customTexts[p] = { ...results };
      });
      toast.success(`Texty pro "${p}" vygenerovány!`);
      setActiveTab("results");
    } catch (e: any) {
      console.error("Generation error:", e);
      toast.error(e.message || "Chyba při generování textů. Zkuste to znovu.");
    }
    setGenerating(false);
  };

  const handleExport = () => {
    const rows: PPCRow[] = [];
    camp.products.forEach(p => {
      const custom = (camp.customTexts?.[p] as Record<string, string[]>) || {};
      settings.textTypes.forEach(t => {
        const texts = custom[t.id] || [];
        texts.forEach((text, i) => {
          if (!text) return;
          rows.push({
            platforma: t.channel || "Ostatní",
            produkt: p,
            typTextu: t.label,
            cislo: i + 1,
            text,
            znaku: text.length,
            limit: t.maxLength,
            status: getStatus(text.length, t.maxLength),
          });
        });
      });
    });
    if (rows.length === 0) {
      toast.error("Žádné texty k exportu.");
      return;
    }
    exportToExcel(rows, camp.name.replace(/[^a-zA-Z0-9_\-]/g, "_"));
    toast.success("Export dokončen!");
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
          <h1 className="font-extrabold text-lg">📊 PPC Text Generator</h1>
          <p className="text-xs text-primary-foreground/60 mt-0.5">
            {settings.clientName ? `Klient: ${settings.clientName}` : "Univerzální generátor PPC textů"}
          </p>
        </div>
        <div className="flex gap-2 items-center flex-wrap">
          <button
            onClick={async () => {
              const name = prompt("Zadejte název nového projektu:", "Nový projekt");
              if (!name || !name.trim()) return;
              const def = defaultCampaign(name.trim());
              const { data: inserted, error } = await supabase
                .from("campaigns")
                .insert({
                  name: def.name, products: def.products, checklist: def.checklist,
                  google_texts: def.googleTexts, sklik_texts: def.sklikTexts, meta_texts: def.metaTexts,
                })
                .select().single();
              if (error || !inserted) { toast.error("Chyba při vytváření projektu"); return; }
              const newCampaigns = [...campaigns, dbToCampaign(inserted)];
              setCampaigns(newCampaigns);
              setActiveIdx(newCampaigns.length - 1);
              setGenBrief({ product: "", usp: "", cta: "", audience: "" });
              setSettings({ ...defaultGenSettings, textTypes: defaultGenSettings.textTypes.map(t => ({ ...t })) });
              setActiveTab("settings");
              toast.success(`Projekt „${name.trim()}" vytvořen!`);
            }}
            className="bg-status-done text-primary-foreground border-none rounded-md px-3 py-1.5 cursor-pointer text-sm font-semibold hover:opacity-90 transition-opacity"
          >
            🆕 Nový projekt
          </button>
          {campaigns.map((c, i) => (
            <div
              key={c.id || i}
              className={`group relative flex items-center gap-1 px-3 py-1.5 rounded-md text-sm border-none cursor-pointer transition-colors ${
                i === activeIdx
                  ? "bg-primary text-primary-foreground font-bold"
                  : "bg-fan-navy-light text-primary-foreground/80 hover:bg-primary/60"
              }`}
              onClick={() => switchCampaign(i, campaigns)}
              onDoubleClick={(e) => { e.stopPropagation(); setEditingTabIdx(i); setEditingName(c.name); }}
            >
              {editingTabIdx === i ? (
                <input
                  autoFocus
                  value={editingName}
                  onChange={e => setEditingName(e.target.value)}
                  onBlur={async () => {
                    const trimmed = editingName.trim();
                    if (trimmed && trimmed !== c.name) {
                      update(camp => { camp.name = trimmed; });
                      const updated = { ...c, name: trimmed };
                      await saveCampaign(updated);
                    }
                    setEditingTabIdx(null);
                  }}
                  onKeyDown={async (e) => {
                    if (e.key === "Enter") (e.target as HTMLInputElement).blur();
                    if (e.key === "Escape") setEditingTabIdx(null);
                  }}
                  onClick={e => e.stopPropagation()}
                  className="bg-transparent border-b border-primary-foreground/50 text-primary-foreground text-sm font-bold outline-none w-24"
                />
              ) : (
                <span>{c.name}</span>
              )}
              {campaigns.length > 1 && editingTabIdx !== i && (
                <button
                  onClick={async (e) => {
                    e.stopPropagation();
                    if (!confirm(`Opravdu smazat kampaň „${c.name}"?`)) return;
                    if (!c.id) return;
                    const { error } = await supabase.from("campaigns").delete().eq("id", c.id);
                    if (error) { toast.error("Chyba při mazání kampaně"); return; }
                    setCampaigns(prev => prev.filter((_, idx) => idx !== i));
                    setActiveIdx(prev => Math.min(prev, campaigns.length - 2));
                    toast.success("Kampaň smazána.");
                  }}
                  className="ml-1 opacity-0 group-hover:opacity-100 text-primary-foreground/70 hover:text-primary-foreground bg-transparent border-none cursor-pointer text-xs leading-none transition-opacity"
                  title="Smazat kampaň"
                >
                  ×
                </button>
              )}
            </div>
          ))}
          <button
            onClick={handleExport}
            className="bg-green-600 hover:bg-green-500 text-white border-none rounded-md px-3 py-1.5 cursor-pointer text-sm font-semibold transition-colors"
          >
