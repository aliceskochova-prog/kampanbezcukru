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
const chColor: Record<string, string> = {
  google: "text-channel-google",
  sklik: "text-channel-sklik",
  meta: "text-channel-meta",
};
const chBg: Record<string, string> = {
  google: "bg-channel-google-light",
  sklik: "bg-channel-sklik-light",
  meta: "bg-channel-meta-light",
};
export function ChecklistTab({ camp, setChecklistStatus }: ChecklistTabProps) {
  return (
    <div>
      <p className="text-sm text-muted-foreground mb-4">Stav podkladů pro každý produkt.</p>
      {camp.products.map(p => (
        <div key={p} className="bg-card rounded-xl border border-border mb-6 overflow-hidden">
          <div className="bg-fan-navy text-primary-foreground px-4 py-2.5 font-bold text-[15px]">{p}</div>
          {(["google", "sklik", "meta"] as ChannelKey[]).map(chKey => {
            const ch = CHANNELS[chKey];
            const copyItems = CHECKLIST_ITEMS.filter(i => i.channel === chKey && i.type === "copy");
            const grafikaItems = CHECKLIST_ITEMS.filter(i => i.channel === chKey && i.type === "grafika");
            return (
              <div key={chKey} className="border-t border-border">
                <div className={`${ch.colorClass} text-primary-foreground px-4 py-1.5 text-xs font-bold uppercase`}>
                  {ch.label}
                </div>
                <div className="grid grid-cols-2 divide-x divide-border">
                  {/* Copy */}
                  <div className="p-3">
                    <div className="text-[11px] font-bold text-muted-foreground uppercase mb-2">✍️ Copy</div>
                    {copyItems.map((item, idx) => {
                      const val = camp.checklist[p]?.[item.label] || "–";
                      return (
                        <div key={item.label} className={`flex items-center justify-between py-1.5 px-2 rounded mb-1 ${idx % 2 === 0 ? "bg-muted/20" : ""}`}>
                          <div>
                            <div className="text-xs font-medium">{item.label}</div>
                            <div className="text-[11px] text-muted-foreground">{item.spec}</div>
                          </div>
                          <select
                            value={val}
                            onChange={e => setChecklistStatus(p, item.label, e.target.value)}
                            className={`text-xs px-2 py-1 rounded border border-border ml-2 ${statusStyle(val)}`}
                          >
                            {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                          </select>
                        </div>
                      );
                    })}
                  </div>
                  {/* Grafika */}
                  <div className="p-3">
                    <div className="text-[11px] font-bold text-muted-foreground uppercase mb-2">🎨 Grafika</div>
                    {grafikaItems.map((item, idx) => {
                      const val = camp.checklist[p]?.[item.label] || "–";
                      return (
                        <div key={item.label} className={`flex items-center justify-between py-1.5 px-2 rounded mb-1 ${idx % 2 === 0 ? "bg-muted/20" : ""}`}>
                          <div>
                            <div className="text-xs font-medium">{item.label}</div>
                            <div className="text-[11px] text-muted-foreground">{item.spec}</div>
                          </div>
                          <select
                            value={val}
                            onChange={e => setChecklistStatus(p, item.label, e.target.value)}
                            className={`text-xs px-2 py-1 rounded border border-border ml-2 ${statusStyle(val)}`}
                          >
                            {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                          </select>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}
