import { type GenSettings, defaultGenSettings, TONE_OPTIONS } from "@/lib/campaign-data";
import { toast } from "sonner";

interface SettingsTabProps {
  settings: GenSettings;
  setSettings: (s: GenSettings) => void;
  onSaveDefault: () => void;
}

export function SettingsTab({ settings, setSettings, onSaveDefault }: SettingsTabProps) {
  const set = (patch: Partial<GenSettings>) => setSettings({ ...settings, ...patch });

  return (
    <div className="max-w-[680px]">
      <div className="bg-card rounded-xl p-6 border border-border mb-5">
        <h2 className="font-bold text-base mb-4 text-foreground">⚙️ Nastavení kampaně</h2>
        <div className="grid gap-4">
          <div>
            <label className="text-sm font-semibold text-foreground/80 block mb-1">Název klienta</label>
            <input
              value={settings.clientName}
              onChange={e => set({ clientName: e.target.value })}
              placeholder="např. FAN Sladidla"
              className="w-full px-3 py-2 rounded-md border border-input text-sm bg-card"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-semibold text-foreground/80 block mb-1">Počet nadpisů</label>
              <input
                type="number"
                min={1}
                max={30}
                value={settings.headlineCount}
                onChange={e => set({ headlineCount: Math.max(1, Math.min(30, parseInt(e.target.value) || 1)) })}
                className="w-full px-3 py-2 rounded-md border border-input text-sm bg-card"
              />
              <span className="text-[11px] text-muted-foreground">Výchozí: 15</span>
            </div>
            <div>
              <label className="text-sm font-semibold text-foreground/80 block mb-1">Max. délka nadpisu (zn.)</label>
              <input
                type="number"
                min={10}
                max={150}
                value={settings.headlineLength}
                onChange={e => set({ headlineLength: Math.max(10, Math.min(150, parseInt(e.target.value) || 30)) })}
                className="w-full px-3 py-2 rounded-md border border-input text-sm bg-card"
              />
              <span className="text-[11px] text-muted-foreground">Výchozí: 30</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-semibold text-foreground/80 block mb-1">Počet popisků</label>
              <input
                type="number"
                min={1}
                max={10}
                value={settings.descriptionCount}
                onChange={e => set({ descriptionCount: Math.max(1, Math.min(10, parseInt(e.target.value) || 1)) })}
                className="w-full px-3 py-2 rounded-md border border-input text-sm bg-card"
              />
              <span className="text-[11px] text-muted-foreground">Výchozí: 4</span>
            </div>
            <div>
              <label className="text-sm font-semibold text-foreground/80 block mb-1">Max. délka popisku (zn.)</label>
              <input
                type="number"
                min={20}
                max={300}
                value={settings.descriptionLength}
                onChange={e => set({ descriptionLength: Math.max(20, Math.min(300, parseInt(e.target.value) || 90)) })}
                className="w-full px-3 py-2 rounded-md border border-input text-sm bg-card"
              />
              <span className="text-[11px] text-muted-foreground">Výchozí: 90</span>
            </div>
          </div>
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
          <div className="flex gap-3 pt-2">
            <button
              onClick={onSaveDefault}
              className="bg-primary text-primary-foreground border-none rounded-lg px-5 py-2.5 text-sm font-bold cursor-pointer hover:opacity-90 transition-opacity"
            >
              💾 Uložit jako výchozí
            </button>
            <button
              onClick={() => {
                setSettings({ ...defaultGenSettings });
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
