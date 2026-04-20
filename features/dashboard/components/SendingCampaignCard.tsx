import { Clock3 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { Campaign } from "@/lib/api";

type SendingCampaignCardProps = {
  campaign: Campaign;
};

export function SendingCampaignCard({ campaign }: SendingCampaignCardProps) {
  return (
    <Card className="border-primary-300/40 bg-primary-500/10 p-5 backdrop-blur dark:border-primary-300/30 dark:bg-primary-500/12">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="flex items-center gap-2 text-sm font-semibold text-primary-700 dark:text-primary-100">
            <Clock3 className="size-4" />
            Enviando agora
          </div>
          <h3 className="mt-2 text-xl font-semibold text-foreground dark:text-white">
            {campaign.name}
          </h3>
          <p className="mt-2 text-sm text-muted-foreground">
            {campaign.sent_count} enviados, {campaign.failed_count} falhas,{" "}
            {campaign.pending_count} pendentes.
          </p>
        </div>
        <Button asChild variant="outline" className="h-10">
          <Link href="/campaigns">Ver campanha</Link>
        </Button>
      </div>
    </Card>
  );
}

