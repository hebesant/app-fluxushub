import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ModalCloseButtonProps = {
  onClick: () => void;
  disabled?: boolean;
  label?: string;
  className?: string;
};

export function ModalCloseButton({
  onClick,
  disabled,
  label = "Fechar modal",
  className,
}: ModalCloseButtonProps) {
  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className={cn(
        "absolute right-4 top-4 h-9 w-9 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground dark:text-neutral-300 dark:hover:bg-white/10 dark:hover:text-white",
        className
      )}
    >
      <X className="size-4" />
    </Button>
  );
}
