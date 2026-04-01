import { useState } from "react";

interface CopyButtonProps {
  text: string;
  label?: string;
  className?: string;
}

export function CopyButton({ text, label = "📋", className = "" }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <button
      onClick={handleCopy}
      disabled={!text}
      className={`text-[11px] border border-border rounded px-1.5 py-0.5 cursor-pointer hover:bg-muted transition-colors disabled:opacity-30 ${className}`}
    >
      {copied ? "✅" : label}
    </button>
  );
}

interface CopyAllButtonProps {
  texts: string[];
  label?: string;
}

export function CopyAllButton({ texts, label = "📋 Kopírovat vše" }: CopyAllButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const nonEmpty = texts.filter(Boolean);
    if (nonEmpty.length === 0) return;
    await navigator.clipboard.writeText(nonEmpty.join("\n"));
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <button
      onClick={handleCopy}
      disabled={texts.filter(Boolean).length === 0}
      className="text-xs bg-muted hover:bg-muted/80 text-foreground border border-border rounded-md px-3 py-1.5 cursor-pointer font-medium transition-colors disabled:opacity-30"
    >
      {copied ? "✅ Zkopírováno!" : label}
    </button>
  );
}
