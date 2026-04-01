// ─── Typy ────────────────────────────────────────────────────────────────────

export type ToneOption =
  | "přátelský"
  | "profesionální"
  | "humorný"
  | "inspirativní"
  | "urgentní"
  | "luxusní";

export const TONE_OPTIONS: ToneOption[] = [
  "přátelský",
  "profesionální",
  "humorný",
  "inspirativní",
  "urgentní",
  "luxusní",
];

export interface TextType {
  id: string;
  label: string;
  count: number;
  maxLength: number;
}

export interface GenSettings {
  clientName: string;
  // Zachováváme pro zpětnou kompatibilitu s generátorem
  headlineCount: number;
  headlineLength: number;
  descriptionCount: number;
  descriptionLength: number;
  tone: ToneOption;
  textTypes: TextType[];
}

export interface GenBrief {
  product: string;
  usp: string;
  cta: string;
  audience: string;
}

export interface Campaign {
  id?: string;
  name: string;
  products: string[];
  checklist: Record<string, Record<string, string>>;
  googleTexts: Record<string, any>;
  sklikTexts: Record<string, any>;
  metaTexts: Record<string, any>;
}

// ─── Šablony kampaní (typy textů) ────────────────────────────────────────────

export const CAMPAIGN_TEMPLATES: Record<string, { label: string; textTypes: TextType[] }> = {
  google_pmax: {
    label: "Google PMAX",
    textTypes: [
      { id: "headline_short", label: "Nadpis (30 zn.)", count: 15, maxLength: 30 },
      { id: "headline_long", label: "Dlouhý nadpis (90 zn.)", count: 5, maxLength: 90 },
      { id: "description", label: "Popis (90 zn.)", count: 5, maxLength: 90 },
    ],
  },
  google_search: {
    label: "Google Search",
    textTypes: [
      { id: "headline_short", label: "Nadpis (30 zn.)", count: 15, maxLength: 30 },
      { id: "description", label: "Popis (90 zn.)", count: 4, maxLength: 90 },
      { id: "extension", label: "Rozšíření / Sitelink (25 zn.)", count: 8, maxLength: 25 },
    ],
  },
  sklik_search: {
    label: "Sklik Search",
    textTypes: [
      { id: "sklik_headline", label: "Titulek (30 zn.)", count: 10, maxLength: 30 },
      { id: "sklik_desc", label: "Popisek (90 zn.)", count: 4, maxLength: 90 },
    ],
  },
  sklik_display: {
    label: "Sklik Display",
    textTypes: [
      { id: "display_short", label: "Krátký titulek (25 zn.)", count: 5, maxLength: 25 },
      { id: "display_long", label: "Dlouhý titulek (90 zn.)", count: 5, maxLength: 90 },
      { id: "display_desc", label: "Popisek display (90 zn.)", count: 5, maxLength: 90 },
    ],
  },
  meta: {
    label: "META Ads",
    textTypes: [
      { id: "meta_main", label: "Hlavní text (125 zn.)", count: 5, maxLength: 125 },
      { id: "meta_headline", label: "Headline (40 zn.)", count: 5, maxLength: 40 },
      { id: "meta_desc", label: "Popis (30 zn.)", count: 5, maxLength: 30 },
    ],
  },
  linkedin: {
    label: "LinkedIn Ads",
    textTypes: [
      { id: "li_headline", label: "Headline (70 zn.)", count: 3, maxLength: 70 },
      { id: "li_desc", label: "Popis (100 zn.)", count: 3, maxLength: 100 },
    ],
  },
  banner: {
    label: "Bannery",
    textTypes: [
      { id: "banner_short", label: "Krátký nadpis (25 zn.)", count: 5, maxLength: 25 },
      { id: "banner_long", label: "Delší nadpis (40 zn.)", count: 5, maxLength: 40 },
    ],
  },
};

// ─── Výchozí nastavení ────────────────────────────────────────────────────────

export const defaultGenSettings: GenSettings = {
  clientName: "",
  headlineCount: 15,
  headlineLength: 30,
  descriptionCount: 5,
  descriptionLength: 90,
  tone: "přátelský",
  // Výchozí šablona = Google PMAX
  textTypes: CAMPAIGN_TEMPLATES.google_pmax.textTypes.map(t => ({ ...t })),
};

// ─── Checklist ────────────────────────────────────────────────────────────────

export type ChannelKey = "google" | "sklik" | "meta";

export const CHANNELS: Record<ChannelKey, { label: string; colorClass: string }> = {
  google: { label: "Google Ads", colorClass: "bg-channel-google" },
  sklik: { label: "Sklik", colorClass: "bg-channel-sklik" },
  meta: { label: "META Ads", colorClass: "bg-channel-meta" },
};

export const STATUS_OPTIONS = ["–", "✅ Hotovo", "⏳ Čeká", "❌ Chybí"];

export const CHECKLIST_ITEMS = [
  { label: "Krátké nadpisy", category: "Copy", channel: "google" as ChannelKey, type: "copy" as const, spec: "max 30 zn." },
  { label: "Dlouhé nadpisy", category: "Copy", channel: "google" as ChannelKey, type: "copy" as const, spec: "max 90 zn." },
  { label: "Popisy", category: "Copy", channel: "google" as ChannelKey, type: "copy" as const, spec: "max 90 zn." },
  { label: "Rozšíření", category: "Copy", channel: "google" as ChannelKey, type: "copy" as const, spec: "max 25 zn." },
  { label: "Bannery Google", category: "Grafika", channel: "google" as ChannelKey, type: "grafika" as const, spec: "PMAX vizuály" },
  { label: "Search titulky", category: "Copy", channel: "sklik" as ChannelKey, type: "copy" as const, spec: "max 30 zn." },
  { label: "Search popisky", category: "Copy", channel: "sklik" as ChannelKey, type: "copy" as const, spec: "max 90 zn." },
  { label: "Display titulky", category: "Copy", channel: "sklik" as ChannelKey, type: "copy" as const, spec: "max 25/90 zn." },
  { label: "Display popisky", category: "Copy", channel: "sklik" as ChannelKey, type: "copy" as const, spec: "max 90 zn." },
  { label: "Bannery Sklik", category: "Grafika", channel: "sklik" as ChannelKey, type: "grafika" as const, spec: "Display vizuály" },
  { label: "Hlavní texty", category: "Copy", channel: "meta" as ChannelKey, type: "copy" as const, spec: "5 variant" },
  { label: "Headlines", category: "Copy", channel: "meta" as ChannelKey, type: "copy" as const, spec: "max 40 zn." },
  { label: "Vizuály META", category: "Grafika", channel: "meta" as ChannelKey, type: "grafika" as const, spec: "1080×1080 / 1080×1920" },
];

// ─── Výchozí kampaň — PRÁZDNÁ (bez hardcoded produktů) ───────────────────────

export function defaultCampaign(name: string): Campaign {
  return {
    name,
    products: [], // ← prázdné, uživatel přidá sám
    checklist: {},
    googleTexts: {},
    sklikTexts: {},
    metaTexts: {},
  };
}

// ─── LocalStorage ─────────────────────────────────────────────────────────────

const SETTINGS_KEY = "ppc_gen_settings_v2";

export function loadSettings(): GenSettings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return { ...defaultGenSettings, textTypes: defaultGenSettings.textTypes.map(t => ({ ...t })) };
    const parsed = JSON.parse(raw);
    // Zajistíme zpětnou kompatibilitu — pokud textTypes chybí, přidáme výchozí
    if (!parsed.textTypes) {
      parsed.textTypes = defaultGenSettings.textTypes.map(t => ({ ...t }));
    }
    return parsed;
  } catch {
    return { ...defaultGenSettings, textTypes: defaultGenSettings.textTypes.map(t => ({ ...t })) };
  }
}

export function saveSettings(s: GenSettings): void {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(s));
}
