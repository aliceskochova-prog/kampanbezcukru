import { CHECKLIST_ITEMS, CHANNELS, STATUS_OPTIONS, type Campaign, type ChannelKey } from "@/lib/campaign-data";

interface ChecklistTabProps {
  camp: Campaign;
  setChecklistStatus: (product: string, itemLabel: string, val: string) => void;
}

const statusStyle = (val: string) => {
  if (val === "✅ Hotovo") return "text-status-done font-bold bg-status-done-bg";
  if (val === "⏳ Čeká") return "text-status-pending bg-status-pending-bg";
  if (val === "❌ Chybí") return "text-status-missing bg-status-missing-bg";
  return "text-muted-foreground bg-card";
};

export function ChecklistTab({ camp, setChecklistStatus }: ChecklistTabProps) {
  return (
    <div>
      <p className="text-sm text-muted-foreground mb-4">Zaškrtni stav každého podkladu pro každý produkt.</p>
      {(Object.entries(CHANNELS) as [ChannelKey, typeof CHANNELS[ChannelKey]][]).map(([chKey, ch]) => (
        <div key={chKey} className="mb-6">
          <div className={`${ch.colorClass} text-primary-foreground px-4 py-2 rounded-t-lg font-bold text-sm`}>
            {ch.label}
          </div>
          <div className="bg-card rounded-b-lg border border-border overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className={ch.lightClass}>
                  <th className="p-2 px-3 text-left text-xs font-semibold w-[220px]">Typ podkladu</th>
                  <th className="p-2 px-3 text-left text-xs font-semibold w-[180px]">Specifikace</th>
                  {camp.products.map(p => (
                    <th key={p} className="p-2 px-3 text-center text-xs font-semibold min-w-[130px]">{p}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {CHECKLIST_ITEMS.filter(i => i.channel === chKey).map((item, idx) => (
                  <tr key={item.label} className={`${idx % 2 === 0 ? "bg-card" : "bg-muted/30"} border-t border-border/50`}>
                    <td className="p-2 px-3 text-sm">{item.label}</td>
                    <td className="p-2 px-3 text-xs text-muted-foreground">{item.spec}</td>
                    {camp.products.map(p => {
                      const val = camp.checklist[p]?.[item.label] || "–";
                      return (
                        <td key={p} className="p-2 px-3 text-center">
                          <select
                            value={val}
                            onChange={e => setChecklistStatus(p, item.label, e.target.value)}
                            className={`text-xs px-2 py-1 rounded border border-border ${statusStyle(val)}`}
                          >
                            {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                          </select>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  );
}
