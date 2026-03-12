import { type ReactNode } from "react";

export const CHECKLIST_ITEMS = [
  { channel: "google" as const, label: "XML Feed – Merchant Center", spec: "Shopping feed" },
  { channel: "google" as const, label: "Krátké nadpisy", spec: "15×, max 30 zn." },
  { channel: "google" as const, label: "Dlouhé nadpisy", spec: "5×, max 90 zn." },
  { channel: "google" as const, label: "Popisy", spec: "1× (60 zn.) + 4× (90 zn.)" },
  { channel: "google" as const, label: "Rozšíření / hesla", spec: "4–8 ks, max 25 zn." },
  { channel: "google" as const, label: "Obrázek – čtverec", spec: "1200×1200 px, bez textu/loga" },
  { channel: "google" as const, label: "Obrázek – landscape", spec: "1200×628 px, bez textu/loga" },
  { channel: "google" as const, label: "Obrázek – portrait", spec: "960×1200 px, bez textu/loga" },
  { channel: "google" as const, label: "Logo – čtverec", spec: "1:1, průhledné pozadí" },
  { channel: "google" as const, label: "Logo – obdélník", spec: "4:1, průhledné pozadí" },
  { channel: "google" as const, label: "Video (YouTube link)", spec: "min. 10 vteřin" },
  { channel: "sklik" as const, label: "XML Feed – Zboží.cz", spec: "Produktový feed" },
  { channel: "sklik" as const, label: "Nadpis produktu", spec: "max 60 zn." },
  { channel: "sklik" as const, label: "Popis produktu", spec: "max 150 zn." },
  { channel: "sklik" as const, label: "Banner 300×250 px", spec: "max 150 kB" },
  { channel: "sklik" as const, label: "Banner 300×600 px", spec: "max 150 kB" },
  { channel: "sklik" as const, label: "Banner 728×90 px", spec: "max 150 kB" },
  { channel: "sklik" as const, label: "Banner 320×100 px", spec: "max 150 kB, mobil" },
  { channel: "meta" as const, label: "XML Feed – FB Katalog", spec: "Produktový feed" },
  { channel: "meta" as const, label: "Hlavní text – viditelná část", spec: "~125 zn." },
  { channel: "meta" as const, label: "Pokračování textu", spec: "libovolná délka" },
  { channel: "meta" as const, label: "Headline pod foto", spec: "max 40 zn." },
  { channel: "meta" as const, label: "Vizuál čtverec", spec: "1080×1080 px" },
  { channel: "meta" as const, label: "Story / Reels vizuál", spec: "1080×1920 px" },
];

export type ChannelKey = "google" | "sklik" | "meta";

export const CHANNELS: Record<ChannelKey, { label: string; colorClass: string; lightClass: string }> = {
  google: { label: "Google Ads", colorClass: "bg-channel-google", lightClass: "bg-channel-google-light" },
  sklik:  { label: "Sklik",      colorClass: "bg-channel-sklik",  lightClass: "bg-channel-sklik-light" },
  meta:   { label: "META Ads",   colorClass: "bg-channel-meta",   lightClass: "bg-channel-meta-light" },
};

export const VISUAL_ITEMS = [
  { ch: "Google Ads", label: "Obrázek – čtverec", spec: "1200×1200 px", note: "Bez textu, bez loga" },
  { ch: "Google Ads", label: "Obrázek – landscape", spec: "1200×628 px", note: "Bez textu, bez loga" },
  { ch: "Google Ads", label: "Obrázek – portrait", spec: "960×1200 px", note: "Bez textu, bez loga" },
  { ch: "Google Ads", label: "Logo – čtverec", spec: "1:1", note: "Průhledné pozadí" },
  { ch: "Google Ads", label: "Logo – obdélník", spec: "4:1", note: "Průhledné pozadí" },
  { ch: "Google Ads", label: "Video (YouTube link)", spec: "min. 10 s", note: "Odkaz na YT" },
  { ch: "Sklik", label: "Banner 300×250 px", spec: "300×250 px", note: "max 150 kB" },
  { ch: "Sklik", label: "Banner 300×600 px", spec: "300×600 px", note: "max 150 kB" },
  { ch: "Sklik", label: "Banner 728×90 px", spec: "728×90 px", note: "max 150 kB" },
  { ch: "Sklik", label: "Banner 320×100 px", spec: "320×100 px", note: "max 150 kB, mobil" },
  { ch: "META", label: "Vizuál čtverec", spec: "1080×1080 px", note: "Příspěvek FB + IG" },
  { ch: "META", label: "Story / Reels vizuál", spec: "1080×1920 px", note: "Story + Reels" },
];

export const STATUS_OPTIONS = ["–", "✅ Hotovo", "⏳ Čeká", "❌ Chybí"] as const;
export type StatusOption = typeof STATUS_OPTIONS[number];

export interface Campaign {
  name: string;
  products: string[];
  checklist: Record<string, Record<string, string>>;
  googleTexts: Record<string, Record<string, string[]>>;
  sklikTexts: Record<string, Record<string, string[]>>;
  metaTexts: Record<string, Record<string, string>>;
}

export const defaultCampaign = (name: string): Campaign => ({
  name,
  products: ["Želírovací směsi", "Stevialin", "Starlinea prášek", "Starlinea tekutá", "Erythritol", "Cukřenka"],
  checklist: {},
  googleTexts: {},
  sklikTexts: {},
  metaTexts: {},
});

export interface GenBrief {
  product: string;
  usp: string;
  cta: string;
  audience: string;
}
