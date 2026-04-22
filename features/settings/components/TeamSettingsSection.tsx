"use client";

import { Copy, Link2, MailPlus, Shield } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { type Invitation, type Membership } from "@/lib/api";
import {
  type MvpAssignableRole,
  SettingsPanel,
  getRoleLabel,
} from "./settingsShared";

export function TeamSettingsSection({
  canManageTeam,
  inviteEmail,
  onInviteEmailChange,
  inviteRole,
  onInviteRoleChange,
  inviteExpiry,
  onInviteExpiryChange,
  isCreatingInvite,
  onInviteSubmit,
  latestInviteLink,
  onCopyInviteLink,
  isLoadingTeam,
  workspaceMemberships,
  workspaceInvitations,
  visibleRoleOptions,
  pendingActionId,
  onMembershipRoleChange,
  onMembershipRemove,
  onInvitationDelete,
}: {
  canManageTeam: boolean;
  inviteEmail: string;
  onInviteEmailChange: (value: string) => void;
  inviteRole: MvpAssignableRole;
  onInviteRoleChange: (value: MvpAssignableRole) => void;
  inviteExpiry: 30 | 120 | 1440 | 10080;
  onInviteExpiryChange: (value: 30 | 120 | 1440 | 10080) => void;
  isCreatingInvite: boolean;
  onInviteSubmit: () => void;
  latestInviteLink: string;
  onCopyInviteLink: (link: string) => void;
  isLoadingTeam: boolean;
  workspaceMemberships: Membership[];
  workspaceInvitations: Invitation[];
  visibleRoleOptions: Array<{ value: MvpAssignableRole; label: string }>;
  pendingActionId: number | null;
  onMembershipRoleChange: (
    membershipId: number,
    role: Membership["role"]
  ) => void;
  onMembershipRemove: (membershipId: number) => void;
  onInvitationDelete: (invitationId: number) => void;
}) {
  return (
    <SettingsPanel
      icon={Shield}
      title="Equipe"
      description="Controle quem entra no workspace e qual papel cada pessoa possui."
    >
      <div className="space-y-5">
        {canManageTeam ? (
          <div className="rounded-lg border border-border bg-muted/45 p-4 dark:border-white/10 dark:bg-neutral-950/40">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 flex size-9 items-center justify-center rounded-lg bg-primary-500/15 text-primary-700 dark:text-primary-100">
                <MailPlus className="size-4" />
              </div>
              <div className="flex-1 space-y-4">
                <div>
                  <p className="font-medium text-foreground dark:text-white">
                    Gerar link de convite
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Gere um link compartilhavel com papel e expiracao definidos.
                  </p>
                </div>

                <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_170px_170px_auto] lg:items-end">
                  <Input
                    type="email"
                    placeholder="Opcional: nome@empresa.com"
                    value={inviteEmail}
                    onChange={(event) => onInviteEmailChange(event.target.value)}
                    className="h-11"
                  />
                  <Select
                    value={inviteRole}
                    onValueChange={(value) =>
                      onInviteRoleChange(value as MvpAssignableRole)
                    }
                  >
                    <SelectTrigger className="h-11">
                      <SelectValue placeholder="Papel" />
                    </SelectTrigger>
                    <SelectContent>
                      {visibleRoleOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select
                    value={String(inviteExpiry)}
                    onValueChange={(value) =>
                      onInviteExpiryChange(Number(value) as 30 | 120 | 1440 | 10080)
                    }
                  >
                    <SelectTrigger className="h-11">
                      <SelectValue placeholder="Expiracao" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="30">30 min</SelectItem>
                      <SelectItem value="120">2 horas</SelectItem>
                      <SelectItem value="1440">24 horas</SelectItem>
                      <SelectItem value="10080">7 dias</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    type="button"
                    onClick={onInviteSubmit}
                    disabled={isCreatingInvite}
                    className="h-11 bg-primary-500 text-white hover:bg-primary-400"
                  >
                    {isCreatingInvite ? "Gerando..." : "Gerar link"}
                  </Button>
                </div>

                {latestInviteLink ? (
                  <div className="rounded-lg border border-border bg-muted/45 p-4 dark:border-white/10 dark:bg-neutral-950/40">
                    <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                      <div className="min-w-0">
                        <p className="font-medium text-foreground dark:text-white">
                          Ultimo link gerado
                        </p>
                        <p className="mt-1 truncate text-sm text-muted-foreground">
                          {latestInviteLink}
                        </p>
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => onCopyInviteLink(latestInviteLink)}
                        className="h-10"
                      >
                        <Copy className="size-4" />
                        Copiar link
                      </Button>
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        ) : (
          <div className="rounded-lg border border-border bg-muted/45 px-4 py-3 text-sm text-muted-foreground dark:border-white/10 dark:bg-neutral-950/40">
            Somente owners podem gerenciar membros, convites e papeis deste
            workspace.
          </div>
        )}

        <section className="space-y-3">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h4 className="font-medium text-foreground dark:text-white">
                Membros
              </h4>
              <p className="text-sm text-muted-foreground">
                Pessoas com acesso atual ao workspace.
              </p>
            </div>
            <Badge variant="outline">{workspaceMemberships.length}</Badge>
          </div>

          <div className="space-y-3">
            {isLoadingTeam ? (
              <div className="rounded-lg border border-border bg-muted/45 px-4 py-3 text-sm text-muted-foreground dark:border-white/10 dark:bg-neutral-950/40">
                Carregando membros...
              </div>
            ) : workspaceMemberships.length ? (
              workspaceMemberships.map((membership) => (
                <div
                  key={membership.id}
                  className="grid gap-3 rounded-lg border border-border bg-muted/45 p-4 dark:border-white/10 dark:bg-neutral-950/40 lg:grid-cols-[1fr_180px_auto]"
                >
                  <div>
                    <p className="font-medium text-foreground dark:text-white">
                      {membership.user_full_name || membership.user_email}
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {membership.user_email}
                    </p>
                  </div>

                  <Select
                    value={membership.role === "admin" ? "member" : membership.role}
                    onValueChange={(value) =>
                      onMembershipRoleChange(
                        membership.id,
                        value as MvpAssignableRole
                      )
                    }
                    disabled={!canManageTeam || pendingActionId === membership.id}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {visibleRoleOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <div className="flex items-center justify-end">
                    <Button
                      type="button"
                      variant="destructive"
                      onClick={() => onMembershipRemove(membership.id)}
                      disabled={!canManageTeam || pendingActionId === membership.id}
                    >
                      Remover
                    </Button>
                  </div>

                  {membership.role === "admin" ? (
                    <p className="text-xs text-muted-foreground lg:col-span-3">
                      Papel legado preservado no backend. No MVP, o app trabalha
                      apenas com Owner e Member nas novas atribuicoes.
                    </p>
                  ) : null}
                </div>
              ))
            ) : (
              <div className="rounded-lg border border-border bg-muted/45 px-4 py-3 text-sm text-muted-foreground dark:border-white/10 dark:bg-neutral-950/40">
                Nenhum membro encontrado para este workspace.
              </div>
            )}
          </div>
        </section>

        <section className="space-y-3">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h4 className="font-medium text-foreground dark:text-white">
                Convites ativos
              </h4>
              <p className="text-sm text-muted-foreground">
                Links pendentes que ainda podem ser usados.
              </p>
            </div>
            <Badge variant="outline">{workspaceInvitations.length}</Badge>
          </div>

          <div className="space-y-3">
            {isLoadingTeam ? (
              <div className="rounded-lg border border-border bg-muted/45 px-4 py-3 text-sm text-muted-foreground dark:border-white/10 dark:bg-neutral-950/40">
                Carregando convites...
              </div>
            ) : workspaceInvitations.length ? (
              workspaceInvitations.map((invitation) => (
                <div
                  key={invitation.id}
                  className="space-y-3 rounded-lg border border-border bg-muted/45 p-4 dark:border-white/10 dark:bg-neutral-950/40"
                >
                  <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                      <p className="font-medium text-foreground dark:text-white">
                        {invitation.email || "Link aberto para novo membro"}
                      </p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Papel: {getRoleLabel(invitation.role)} · Expira em{" "}
                        {new Date(invitation.expires_at).toLocaleDateString("pt-BR")}
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => onCopyInviteLink(invitation.accept_url)}
                      >
                        <Copy className="size-4" />
                        Copiar
                      </Button>
                      <Button asChild variant="outline">
                        <Link
                          href={invitation.accept_url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Link2 className="size-4" />
                          Abrir
                        </Link>
                      </Button>
                      <Button
                        type="button"
                        variant="destructive"
                        onClick={() => onInvitationDelete(invitation.id)}
                        disabled={!canManageTeam || pendingActionId === invitation.id}
                      >
                        Revogar
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-lg border border-border bg-muted/45 px-4 py-3 text-sm text-muted-foreground dark:border-white/10 dark:bg-neutral-950/40">
                Nenhum convite pendente neste momento.
              </div>
            )}
          </div>
        </section>
      </div>
    </SettingsPanel>
  );
}
