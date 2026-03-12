interface CharCountProps {
  value: string | undefined;
  max: number;
  warn: number;
}

export function CharCount({ value, max, warn }: CharCountProps) {
  const n = (value || "").length;
  const over = n > max;
  const nearLimit = n > warn;

  return (
    <span
      className={`text-[11px] ${
        over ? "text-destructive font-bold" : nearLimit ? "text-status-pending" : "text-muted-foreground"
      }`}
    >
      {n}/{max}
    </span>
  );
}
