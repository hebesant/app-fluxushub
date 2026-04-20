"use client";

import { useCallback } from "react";
import { toast as sonnerToast } from "sonner";
import { useWhatsAppActions } from "../hooks/useWhatsAppActions";
import { useWhatsAppData } from "../hooks/useWhatsAppData";
import { DeleteWhatsAppInstanceDialog } from "./DeleteWhatsAppInstanceDialog";
import { EditWhatsAppInstanceDialog } from "./EditWhatsAppInstanceDialog";
import { WhatsAppCreateCard } from "./WhatsAppCreateCard";
import { WhatsAppHeader } from "./WhatsAppHeader";
import { WhatsAppInstancesList } from "./WhatsAppInstancesList";

export function WhatsAppPage() {
  const showToast = useCallback((type: "success" | "error", message: string) => {
    sonnerToast[type](message);
  }, []);

  const whatsappData = useWhatsAppData({ showToast });
  const whatsappActions = useWhatsAppActions({
    activeWorkspace: whatsappData.activeWorkspace,
    instances: whatsappData.instances,
    setInstances: whatsappData.setInstances,
    loadData: whatsappData.loadData,
    showToast,
  });

  return (
    <div className="space-y-6">
      <WhatsAppHeader onRefresh={whatsappData.loadData} />

      <WhatsAppCreateCard
        form={whatsappActions.form}
        formError={whatsappActions.formError}
        isSubmitting={whatsappActions.isSubmitting}
        onChange={whatsappActions.updateField}
        onSubmit={whatsappActions.handleSubmit}
      />

      <WhatsAppInstancesList
        instances={whatsappData.instances}
        isLoading={whatsappData.isLoading}
        qrCodes={whatsappActions.qrCodes}
        busyInstanceId={whatsappActions.busyInstanceId}
        onConnect={whatsappActions.handleConnect}
        onDisconnect={whatsappActions.handleDisconnect}
        onEdit={whatsappActions.openEditModal}
        onDelete={whatsappActions.openDeleteDialog}
      />

      {whatsappActions.deleteTarget ? (
        <DeleteWhatsAppInstanceDialog
          instance={whatsappActions.deleteTarget}
          isBusy={whatsappActions.busyInstanceId === whatsappActions.deleteTarget.id}
          onCancel={whatsappActions.closeDeleteDialog}
          onConfirm={whatsappActions.handleDeleteConfirmed}
        />
      ) : null}

      {whatsappActions.editTarget ? (
        <EditWhatsAppInstanceDialog
          name={whatsappActions.editName}
          isBusy={whatsappActions.busyInstanceId === whatsappActions.editTarget.id}
          onNameChange={whatsappActions.setEditName}
          onCancel={whatsappActions.closeEditModal}
          onSubmit={whatsappActions.handleEditConfirmed}
        />
      ) : null}
    </div>
  );
}
