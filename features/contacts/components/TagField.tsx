import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { parseTags } from "../utils/contactPayload";

type TagFieldProps = {
  value: string;
  availableTags: string[];
  onChange: (value: string) => void;
};

export function TagField({ value, availableTags, onChange }: TagFieldProps) {
  const selectedTags = parseTags(value);

  function toggleTag(tag: string) {
    if (selectedTags.includes(tag)) {
      onChange(selectedTags.filter((currentTag) => currentTag !== tag).join(", "));
      return;
    }

    onChange([...selectedTags, tag].join(", "));
  }

  return (
    <label className="block">
      <Label>Tags</Label>
      {availableTags.length ? (
        <div className="mt-2 flex flex-wrap gap-2">
          {availableTags.map((tag) => {
            const isSelected = selectedTags.includes(tag);

            return (
              <button
                key={tag}
                type="button"
                onClick={() => toggleTag(tag)}
                className={`rounded-lg border px-2.5 py-1.5 text-xs transition ${
                  isSelected
                    ? "border-primary-300/50 bg-primary-500/10 text-primary-700 dark:text-primary-100"
                    : "border-border bg-background text-muted-foreground hover:text-foreground dark:border-white/10 dark:bg-neutral-950/40 dark:hover:text-white"
                }`}
              >
                {tag}
              </button>
            );
          })}
        </div>
      ) : null}
      <Input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="vip, promocao"
        className="mt-2 h-11"
      />
      <p className="mt-2 text-xs text-muted-foreground">
        Clique nas tags existentes ou digite novas separadas por vírgula.
      </p>
    </label>
  );
}
