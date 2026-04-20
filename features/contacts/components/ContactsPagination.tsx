import { Button } from "@/components/ui/button";

type ContactsPaginationProps = {
  page: number;
  totalPages: number;
  isLoading: boolean;
  onPageChange: (page: number) => void;
};

export function ContactsPagination({
  page,
  totalPages,
  isLoading,
  onPageChange,
}: ContactsPaginationProps) {
  return (
    <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-neutral-400">
        Pagina {page} de {totalPages}
      </p>
      <div className="flex gap-2">
        <Button
          variant="outline"
          onClick={() => onPageChange(Math.max(1, page - 1))}
          disabled={page <= 1 || isLoading}
          className="h-9"
        >
          Anterior
        </Button>
        <Button
          variant="outline"
          onClick={() => onPageChange(Math.min(totalPages, page + 1))}
          disabled={page >= totalPages || isLoading}
          className="h-9"
        >
          Proxima
        </Button>
      </div>
    </div>
  );
}
