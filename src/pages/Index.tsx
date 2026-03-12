import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import * as XLSX from "xlsx";
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

  const exportToExcel = () => {
    const wb = XLSX.utils.book_new();
    const googleRow
