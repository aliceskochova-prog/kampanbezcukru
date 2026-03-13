import * as XLSX from "xlsx";

export interface PPCRow {
  platforma: string;
  produkt: string;
  typTextu: string;
  cislo: number;
  text: string;
  znaku: number;
  limit: number;
  status: string;
}

export function exportToExcel(data: PPCRow[], fileName = "FAN_Sladidla_PPC_Export"): void {
  const wb = XLSX.utils.book_new();

  // ── List 1: Všechny texty ──
  const wsData: any[][] = [
    ["Platforma", "Produkt", "Typ textu", "Č.", "Text", "Znaků", "Limit", "Status"]
  ];

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

  sorted.forEach(row => {
    wsData.push([
      row.platforma,
      row.produkt,
      row.typTextu,
      row.cislo,
      row.text,
      row.znaku,
      row.limit || "",
      row.status,
    ]);
  });

  const ws1 = XLSX.utils.aoa_to_sheet(wsData);
  ws1["!cols"] = [
    { wpx: 90 },
    { wpx: 140 },
    { wpx: 170 },
    { wpx: 30 },
    { wpx: 500 },
    { wpx: 55 },
    { wpx: 55 },
    { wpx: 100 },
  ];
  XLSX.utils.book_append_sheet(wb, ws1, "PPC Texty");

  // ── List 2: Rychlý přehled počtů ──
  const pivot: Record<string, number> = {};
  data.forEach(r => {
    const key = `${r.platforma}||${r.produkt}||${r.typTextu}`;
    pivot[key] = (pivot[key] || 0) + 1;
  });

  const ws2Data: any[][] = [["Platforma", "Produkt", "Typ textu", "Počet textů"]];
  Object.entries(pivot)
    .sort(([a], [b]) => a.localeCompare(b))
    .forEach(([key, count]) => {
      const [platforma, produkt, typTextu] = key.split("||");
      ws2Data.push([platforma, produkt, typTextu, count]);
    });

  const ws2 = XLSX.utils.aoa_to_sheet(ws2Data);
  ws2["!cols"] = [{ wpx: 100 }, { wpx: 150 }, { wpx: 180 }, { wpx: 80 }];
  XLSX.utils.book_append_sheet(wb, ws2, "Přehled počtů");

  // ── List 3: Legenda ──
  const ws3Data = [
    ["Symbol", "Význam"],
    ["✅ OK", "Text je v limitu"],
    ["⚠️ Na hraně", "Do limitu zbývá méně než 5 znaků"],
    ["❌ Přes limit", "Překračuje povolený počet znaků"],
    ["", ""],
    ["Typ textu", "Limit znaků"],
    ["Krátký nadpis / Search titulek", "30"],
    ["Dlouhý nadpis / Popis / Display popisek", "90"],
    ["Rozšíření / Display krátký titulek", "25"],
    ["Headline META", "40"],
    ["Hlavní text META", "bez limitu"],
  ];
  const ws3 = XLSX.utils.aoa_to_sheet(ws3Data);
  ws3["!cols"] = [{ wpx: 280 }, { wpx: 200 }];
  XLSX.utils.book_append_sheet(wb, ws3, "Legenda");

  const date = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  XLSX.writeFile(wb, `${fileName}_${date}.xlsx`);
}
