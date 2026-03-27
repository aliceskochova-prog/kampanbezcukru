import { type GenSettings, defaultGenSettings, TONE_OPTIONS, CAMPAIGN_TEMPLATES, type TextType } from "@/lib/campaign-data";
import { toast } from "sonner";

interface SettingsTabProps {
  settings: GenSettings;
  setSettings: (s: GenSettings) => void;
  onSaveDefault: () => void;
}

export function SettingsTab({ settings, setSettings, onSaveDefault }: SettingsTabProps) {
  const set = (patch: Partial<GenSettings>) => setSettings({ ...settings, ...patch });

  const updateTextType = (id: string, patch: Partial<TextType>) => {
    set({
      textTypes: settings.textTypes.map(t => t.id === id ? { ...t, ...patch } : t),
    });
  };

  const addTextType = () => {
    const newType: TextType = {
      id: `custom_${Date.now()}`,
      label: "Nový typ",
      count: 5,
      maxLength: 90,
    };
    set({ textTypes: [...settings.textTypes, newType] });
  };

  const removeTextType = (id: string) => {
    set({ textTypes: settings.textTypes.filter(t => t.id !== id) });
  };

  const moveTextType = (id: string, direction: "up" | "down") => {
    const idx = settings.textTypes.findIndex(t => t.id === id);
    if (direction === "up" && idx === 0) return;
    if (direction === "down" && idx === settings.textTypes.length - 1) return;
    const newTypes = [...settings.textTypes];
    const swap = direction === "up" ? idx - 1 : idx + 1;
    [newTypes[idx], newTypes[swap]] = [newTypes[swap], newTypes[idx]];
    set({ textTypes: newTypes });
  };

  const loadTemplate = (key: string) => {
    const template = CAMPAIGN_TEMPLATES[key];
    if (template) {
      set({ textTypes: template.textTypes.map(t => ({ ...t })) });
      toast.success(`Načtena šablona: ${template.label}`);
    }
  };

  return (
    <div className="max-w-[680px]">
      <div className="bg-card rounded-xl p-6 border border-border mb-5">
        <h2 className="font-bold text-base mb-4 text-foreground">⚙️ Nastavení kampaně</h2>
        <div className="grid gap-4">

          {/* Název klienta */}
          <div>
            <label className="text-sm font-semibold text-foreground/80 block mb-1">Název klienta</label>
            <input
              value={settings.clientName}
              onChange={e => set({ clientName: e.target.value })}
              placeholder="např. FAN Sladidla"
              className="w-full px-3 py-2 rounded-md border border-input text-sm bg-card"
            />
          </div>

          {/* Šablony kampaní */}
          <div>
            <label className="text-sm font-semibold text-foreground/80 block mb-2">Načíst šablonu kampaně</label>
            <div className="flex flex-wrap gap-2">
              {Object.entries(CAMPAIGN_TEMPLATES).map(([key, template]) => (
                <button
                  key={key}
                  onClick={() => loadTemplate(key)}
                  className="px-3 py-1.5 rounded-md border border-border text-sm font-medium hover:bg-muted transition-colors"
                >
                  {template.label}
                </button>
              ))}
            </div>
          </div>

          {/* Dynamické typy textů */}
          <div>
            <label className="text-sm font-semibold text-foreground/80 block mb-2">Typy textů</label>
            <div className="grid gap-2">
              {settings.textTypes.map((t, idx) => (
                <div key={t.id} className="grid grid-cols-[1fr_80px_80px_auto] gap-2 items-center bg-muted/40 rounded-lg px-3 py-2">
                  <input
                    value={t.label}
                    onChange={e => updateTextType(t.id, { label: e.target.value })}
                    className="px-2 py-1 rounded border border-input text-sm bg-card"
                    placeholder="Název typu"
                  />
                  <div>
                    <input
                      type="number"
                      min={1}
                      max={30}
                      value={t.count}
                      onChange={e => updateTextType(t.id, { count: Math.max(1, Math.min(30, parseInt(e.target.value) || 1)) })}
                      className="w-full px-2 py-1 rounded border border-input text-sm bg-card text-center"
                    />
                    <span className="text-[10px] text-muted-foreground block text-center">počet</span>
                  </div>
                  <div>
                    <input
                      type="number"
                      min={10}
                      max={300}
                      value={t.maxLength}
                      onChange={e => updateTextType(t.id, { maxLength: Math.max(10, Math.min(300, parseInt(e.target.value) || 30)) })}
                      className="w-full px-2 py-1 rounded border border-input text-sm bg-card text-center"
                    />
                    <span className="text-[10px] text-muted-foreground block text-center">max. zn.</span>
                  </div>
                  <div className="flex gap-1">
                    <button onClick={() => moveTextType(t.id, "up")} disabled={idx === 0} className="px-1.5 py-1 rounded text-xs hover:bg-muted disabled:opacity-30">↑</button>
                    <button onClick={() => moveTextType(t.id, "down")} disabled={idx === settings.textTypes.length - 1} className="px-1.5 py-1 rounded text-xs hover:bg-muted disabled:opacity-30">↓</button>
                    <button onClick={() => removeTextType(t.id)} className="px-1.5 py-1 rounded text-xs text-destructive hover:bg-destructive/10">✕</button>
                  </div>
                </div>
              ))}
            </div>
            <button
              onClick={addTextType}
              className="mt-2 px-3 py-1.5 rounded-md border border-dashed border-border text-sm text-muted-foreground hover:bg-muted transition-colors w-full"
            >
              + Přidat typ textu
            </button>
          </div>

          {/* Tón komunikace */}
          <div>
            <label className="text-sm font-semibold text-foreground/80 block mb-1">Tón komunikace</label>
            <select
              value={settings.tone}
              onChange={e => set({ tone: e.target.value as any })}
              className="w-full px-3 py-2 rounded-md border border-input text-sm bg-card"
            >
              {TONE_OPTIONS.map(t => (
                <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
              ))}
            </select>
          </div>

          {/* Tlačítka */}
          <div className="flex gap-3 pt-2">
            <button
              onClick={onSaveDefault}
              className="bg-primary text-primary-foreground border-none rounded-lg px-5 py-2.5 text-sm font-bold cursor-pointer hover:opacity-90 transition-opacity"
            >
              💾 Uložit jako výchozí
            </button>
            <button
              onClick={() => {
                setSettings({ ...defaultGenSettings, textTypes: defaultGenSettings.textTypes.map(t => ({ ...t })) });
                toast.success("Nastavení resetováno na výchozí hodnoty.");
              }}
              className="bg-muted text-foreground border border-border rounded-lg px-5 py-2.5 text-sm font-semibold cursor-pointer hover:bg-muted/80 transition-colors"
            >
              🔄 Resetovat na výchozí
            </button>
          </div>
        </div>
      </div>
      <div className="text-sm text-muted-foreground bg-muted/50 rounded-lg p-3 border border-border">
        💡 Tato nastavení ovlivní generátor textů, zobrazení v záložkách a export. Uloží se do prohlížeče.
      </div>
    </div>
  );
}
