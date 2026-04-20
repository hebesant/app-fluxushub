type ContactSegmentsPanelProps = {
  lists: string[];
  tags: string[];
  activeList: string;
  activeTags: string[];
  onSelectList: (listName: string) => void;
  onToggleTag: (tag: string) => void;
  onClear: () => void;
};

export function ContactSegmentsPanel({
  lists,
  tags,
  activeList,
  activeTags,
  onSelectList,
  onToggleTag,
  onClear,
}: ContactSegmentsPanelProps) {
  const hasFilters = Boolean(activeList || activeTags.length);

  return (
    <aside className="rounded-lg border border-border bg-muted/30 p-4 dark:border-white/10 dark:bg-white/5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-foreground dark:text-white">
            Segmentos
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Filtre por lista ou tags.
          </p>
        </div>
        {hasFilters ? (
          <button
            type="button"
            onClick={onClear}
            className="text-xs font-medium text-primary-700 hover:text-primary-600 dark:text-primary-100"
          >
            Limpar
          </button>
        ) : null}
      </div>

      <div className="mt-4 space-y-5">
        <div>
          <p className="mb-2 text-xs font-semibold uppercase text-muted-foreground">
            Listas
          </p>
          <div className="space-y-1">
            <button
              type="button"
              onClick={() => onSelectList("")}
              className={`flex min-h-9 w-full items-center justify-between rounded-lg px-3 text-left text-sm transition ${
                !activeList
                  ? "bg-primary-500/10 text-primary-700 dark:text-primary-100"
                  : "text-muted-foreground hover:bg-background hover:text-foreground dark:hover:bg-white/8 dark:hover:text-white"
              }`}
            >
              Todas
            </button>
            {lists.length ? (
              lists.map((listName) => (
                <button
                  key={listName}
                  type="button"
                  onClick={() => onSelectList(listName)}
                  className={`flex min-h-9 w-full items-center justify-between rounded-lg px-3 text-left text-sm transition ${
                    activeList === listName
                      ? "bg-primary-500/10 text-primary-700 dark:text-primary-100"
                      : "text-muted-foreground hover:bg-background hover:text-foreground dark:hover:bg-white/8 dark:hover:text-white"
                  }`}
                >
                  <span className="truncate">{listName}</span>
                </button>
              ))
            ) : (
              <p className="rounded-lg border border-dashed border-border px-3 py-2 text-xs text-muted-foreground dark:border-white/10">
                Nenhuma lista ainda.
              </p>
            )}
          </div>
        </div>

        <div>
          <p className="mb-2 text-xs font-semibold uppercase text-muted-foreground">
            Tags
          </p>
          <div className="flex flex-wrap gap-2">
            {tags.length ? (
              tags.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => onToggleTag(tag)}
                  className={`rounded-lg border px-2.5 py-1.5 text-xs transition ${
                    activeTags.includes(tag)
                      ? "border-primary-300/50 bg-primary-500/10 text-primary-700 dark:text-primary-100"
                      : "border-border bg-background text-muted-foreground hover:text-foreground dark:border-white/10 dark:bg-neutral-950/40 dark:hover:text-white"
                  }`}
                >
                  {tag}
                </button>
              ))
            ) : (
              <p className="rounded-lg border border-dashed border-border px-3 py-2 text-xs text-muted-foreground dark:border-white/10">
                Nenhuma tag ainda.
              </p>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
}
