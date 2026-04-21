import { Ban, Edit3, Eye, MoreHorizontal, RotateCcw, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Campaign } from "@/lib/api";

type CampaignActionsMenuProps = {
  campaign: Campaign;
  isBusy: boolean;
  onEdit: () => void;
  onCancel: () => void;
  onSend: () => void;
  onRetryFailed: () => void;
  onDetails: () => void;
};

export function CampaignActionsMenu({
  campaign,
  isBusy,
  onEdit,
  onCancel,
  onSend,
  onRetryFailed,
  onDetails,
}: CampaignActionsMenuProps) {
  const canEdit = campaign.status === "draft";
  const canSend = ["draft", "failed", "ready"].includes(campaign.status);
  const canRetryFailed = campaign.status === "failed" && campaign.failed_count > 0;
  const canCancel = !["sent", "canceled"].includes(campaign.status);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="outline"
          size="icon"
          disabled={isBusy}
          className="h-9 w-9"
          aria-label="Acoes da campanha"
        >
          <MoreHorizontal className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onSelect={onDetails}>
          <Eye className="size-4" />
          Ver detalhes
        </DropdownMenuItem>

        {canSend ? (
          <DropdownMenuItem onSelect={onSend}>
            <Send className="size-4" />
            Enviar disparo
          </DropdownMenuItem>
        ) : null}

        {canRetryFailed ? (
          <DropdownMenuItem onSelect={onRetryFailed}>
            <RotateCcw className="size-4" />
            Reenviar falhas
          </DropdownMenuItem>
        ) : null}

        {canEdit ? (
          <DropdownMenuItem onSelect={onEdit}>
            <Edit3 className="size-4" />
            Editar rascunho
          </DropdownMenuItem>
        ) : null}

        {canCancel ? (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive" onSelect={onCancel}>
              <Ban className="size-4" />
              Cancelar disparo
            </DropdownMenuItem>
          </>
        ) : null}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
