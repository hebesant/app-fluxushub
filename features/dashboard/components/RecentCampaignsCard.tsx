import { MessageCircle } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { Campaign } from "@/lib/api";
import {
  campaignStatusClasses,
  campaignStatusLabels,
} from "@/features/campaigns/constants";

type RecentCampaignsCardProps = {
  campaigns: Campaign[];
  isLoading: boolean;
};

export function RecentCampaignsCard({
  campaigns,
  isLoading,
}: RecentCampaignsCardProps) {
  return (
    <Card className="border-border/70 bg-card/92 p-5 backdrop-blur dark:border-white/10 dark:bg-white/8">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-foreground dark:text-white">
            Ultimas campanhas
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Status recente dos disparos.
          </p>
        </div>
        <Button asChild variant="outline" className="h-9">
          <Link href="/campaigns">Abrir campanhas</Link>
        </Button>
      </div>

      <div className="mt-5 overflow-hidden rounded-lg border border-border dark:border-white/10">
        {isLoading ? (
          <p className="p-4 text-sm text-muted-foreground">
            Carregando campanhas...
          </p>
        ) : campaigns.length ? (
          <div className="divide-y divide-border dark:divide-white/10">
            {campaigns.map((campaign) => (
              <div
                key={campaign.id}
                className="flex flex-col gap-3 bg-muted/35 px-4 py-3 dark:bg-neutral-950/35 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-foreground dark:text-white">
                    {campaign.name}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {campaign.sent_count} enviados | {campaign.failed_count} falhas
                  </p>
                </div>
                <Badge
                  variant="outline"
                  className={campaignStatusClasses[campaign.status]}
                >
                  {campaignStatusLabels[campaign.status]}
                </Badge>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-4">
            <div className="flex items-center gap-2 text-sm font-medium text-foreground dark:text-white">
              <MessageCircle className="size-4 text-primary-700 dark:text-primary-100" />
              Nenhuma campanha ainda
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              Depois de importar contatos, crie uma campanha para testar o fluxo.
            </p>
          </div>
        )}
      </div>
    </Card>
  );
}

