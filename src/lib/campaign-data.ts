import { type ReactNode } from "react";

export const CHECKLIST_ITEMS = [
  // Google Ads – copy
  { channel: "google" as const, type: "copy", label: "Krátké nadpisy", spec: "15×, max 30 zn." },
  { channel: "google" as const, type: "copy", label: "Dlouhé nadpisy", spec: "5×, max 90 zn." },
  { channel: "google" as const, type: "copy", label: "Popisy", spec: "1× (60 zn.) + 4× (90 zn.)" },
  { channel: "google" as const, type: "copy", label: "Rozšíření / hesla", spec: "4–8 ks, max 25 zn." },
  // Google Ads – grafika
  { channel: "google" as const, type: "grafika", label: "Obrázek – landscape", spec: "1200×628 px, bez textu/loga" },
  { channel: "google" as const, type: "grafika", label: "Obrázek – čtverec", spec: "1200×1200 px, bez textu/loga" },
  { channel: "google" as const, type: "grafika", label: "Obrázek – portrét", spec: "960×1200 px, bez textu/loga" },
  { channel: "google" as const, type: "grafika", label: "Obrázek – story", spec: "1080×1920 px, bez textu/loga" },
  { channel: "google" as const, type: "grafika", label: "Logo – čtverec", spec: "1:1, průhledné pozadí (.PNG)" },
  { channel: "google" as const, type: "grafika", label: "Logo – obdélník", spec: "4:1, průhledné pozadí (.PNG)" },
  { channel: "google" as const, type: "grafika", label: "XML Feed – Merchant Center", spec: "Shopping feed" },
  { channel: "google" as const, type: "grafika", label: "Video (YouTube link)", spec: "min. 10 vteřin" },
  // Sklik – copy
  { channel: "sklik" as const, type: "copy", label: "Search – titulky", spec: "4×, max 30 zn." },
  { channel: "sklik" as const, type: "copy", label: "Search – popisky", spec: "2×, max 90 zn." },
  { channel: "sklik" as const, type: "copy", label: "Display – krátký titulek", spec: "2×, max 25 zn." },
  { channel: "sklik" as const, type: "copy", label: "Display – dlouhý titulek", spec: "2×, max 90 zn." },
  { channel: "sklik" as const, type: "copy", label: "Display – popisek", spec: "2×, max 90 zn." },
  // Sklik – grafika
  { channel: "sklik" as const, type: "grafika", label: "Banner 300×250 px", spec: "max 150 kB" },
  { channel: "sklik" as const, type: "grafika", label: "Banner 300×600 px", spec: "max 150 kB" },
  { channel: "sklik" as const, type: "grafika", label: "Banner 728×90 px", spec: "max 150 kB" },
  { channel: "sklik" as const, type: "grafika", label: "Banner 320×100 px", spec: "max 150 kB, mobil" },
  { channel: "sklik" as const, type: "grafika", label: "XML Feed – Zboží.cz", spec: "Produktový feed" },
  // META – copy
  { channel: "meta" as const, type: "copy", label: "Hlavní texty", spec: "5 variant" },
  { channel: "meta" as const, type: "copy", label: "Headliny", spec: "5 variant, max 40 zn." },
  // META – grafika
  { channel: "meta" as const, type: "grafika", label: "Vizuál čtverec", spec: "1080×1080 px" },
  { channel: "meta" as const, type: "grafika", label: "Story / Reels vizuál", spec: "1080×1920 px" },
  { channel: "meta" as const, type: "grafika", label: "XML Feed – FB Katalog", spec: "Produktový feed" },
];

export type ChannelKey = "google" | "sklik" | "meta";

export const CHANNELS: Record<ChannelKey, { label: string; colorClass: string; lightClass: string }> = {
  google: { label: "Google Ads", colorClass: "bg-channel-google", lightClass: "bg-channel-google-light" },
  sklik:  { label: "Sklik",      colorClass: "bg-channel-sklik",  lightClass: "bg-channel-sklik-light" },
  meta:   { label: "META Ads",   colorClass: "bg-channel-meta",   lightClass: "bg-channel-meta-light" },
};

export const VISUAL_ITEMS = [
  { ch: "Google Ads", label: "Obrázek – landscape", spec: "1200×628 px", note: "Bez textu, bez loga" },
  { ch: "Google Ads", label: "Obrázek – čtverec", spec: "1200×1200 px", note: "Bez textu, bez loga" },
  { ch: "Google Ads", label: "Obrázek – portrét", spec: "960×1200 px", note: "Bez textu, bez loga" },
  { ch: "Google Ads", label: "Obrázek – story", spec: "1080×1920 px", note: "Bez textu, bez loga" },
  { ch: "Google Ads", label: "Logo – čtverec", spec: "1:1", note: "Průhledné pozadí (.PNG)" },
  { ch: "Google Ads", label: "Logo – obdélník", spec: "4:1", note: "Průhledné pozadí (.PNG)" },
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
  id?: string;
  name: string;
  products: string[];
  checklist: Record<string, Record<string, string>>;
  googleTexts: Record<string, Record<string, string[]>>;
  sklikTexts: Record<string, Record<string, string[]>>;
  metaTexts: Record<string, Record<string, string[]>>;
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
