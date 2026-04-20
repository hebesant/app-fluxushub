import { CheckCircle2 } from "lucide-react";

type ImportStepIndicatorProps = {
  number: string;
  title: string;
  isActive: boolean;
  isDone: boolean;
};

export function ImportStepIndicator({
  number,
  title,
  isActive,
  isDone,
}: ImportStepIndicatorProps) {
  return (
    <div
      className={`flex items-center gap-3 rounded-lg border px-3 py-2 text-sm ${
        isActive
          ? "border-primary-300/50 bg-primary-500/10 text-primary-700 dark:text-primary-100"
          : "border-border bg-muted/35 text-muted-foreground dark:border-white/10"
      }`}
    >
      <span className="flex size-7 items-center justify-center rounded-lg bg-background text-xs font-semibold dark:bg-neutral-950/70">
        {isDone ? <CheckCircle2 className="size-4" /> : number}
      </span>
      {title}
    </div>
  );
}
