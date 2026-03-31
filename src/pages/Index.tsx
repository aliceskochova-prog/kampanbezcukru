// ═══════════════════════════════════════════════════════════════
// ZMĚNY V src/pages/Index.tsx
// Nahraďte vždy celý uvedený blok kódu novým blokem
// ═══════════════════════════════════════════════════════════════


// ── ZMĚNA 1: Hlavička (řádek s h1 a p) ──────────────────────────
// NAJDI:
//   <h1 className="font-extrabold text-lg">📊 Campaign Manager</h1>
//   <p className="text-xs text-primary-foreground/60 mt-0.5">FAN Sladidla – správa reklamních kampaní a podkladů</p>
//
// NAHRAĎ:
//   <h1 className="font-extrabold text-lg">📊 PPC Text Generator</h1>
//   <p className="text-xs text-primary-foreground/60 mt-0.5">
//     {settings.clientName ? `Klient: ${settings.clientName}` : "Univerzální generátor PPC textů"}
//   </p>


// ── ZMĚNA 2: Přidat dvě nové funkce hned za funkci update() ─────
// Vlož tento kód ZA funkci update (cca řádek 100):

const addProduct = (name: string) =>
  update(c => {
    if (!c.products.includes(name)) c.products.push(name);
  });

const removeProduct = (name: string) =>
  update(c => {
    c.products = c.products.filter(p => p !== name);
    // Vyčistit data smazaného produktu
    delete c.checklist[name];
    delete c.googleTexts[name];
    delete c.sklikTexts[name];
    delete c.metaTexts[name];
  });


// ── ZMĚNA 3: Předat nové props do GeneratorTab ───────────────────
// NAJDI:
//   <GeneratorTab camp={camp} genBrief={genBrief} setGenBrief={setGenBrief} generating={generating} onGenerate={generateTexts} settings={settings} />
//
// NAHRAĎ:
//   <GeneratorTab
//     camp={camp}
//     genBrief={genBrief}
//     setGenBrief={setGenBrief}
//     generating={generating}
//     onGenerate={generateTexts}
//     settings={settings}
//     onAddProduct={addProduct}
//     onRemoveProduct={removeProduct}
//   />


// ── ZMĚNA 4: defaultCampaign - výchozí název bez FAN ─────────────
// NAJDI (2× výskyt):
//   defaultCampaign("FAN Sladidla – Performance Q2")
//
// NAHRAĎ obě místa:
//   defaultCampaign("Nová kampaň")


// ═══════════════════════════════════════════════════════════════
// HOTOVO - tohle jsou všechny změny potřebné v Index.tsx
// ═══════════════════════════════════════════════════════════════
