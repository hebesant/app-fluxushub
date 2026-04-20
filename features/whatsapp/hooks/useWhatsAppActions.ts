import {
  useCallback,
  useEffect,
  useState,
  type Dispatch,
  type FormEvent,
  type SetStateAction,
} from "react";
import QRCode from "qrcode";
import {
  formatApiError,
  getAccessToken,
  type WhatsAppInstance,
  type Workspace,
} from "@/lib/api";
import {
  connectWhatsAppInstance,
  createWhatsAppInstance,
  deleteWhatsAppInstance,
  disconnectWhatsAppInstance,
  refreshWhatsAppInstanceStatus,
  updateWhatsAppInstance,
} from "../api/whatsappApi";
import { whatsappStatusLabels } from "../constants";
import { type InstanceForm, initialInstanceForm } from "../types";

type UseWhatsAppActionsParams = {
  activeWorkspace?: Workspace;
  instances: WhatsAppInstance[];
  setInstances: Dispatch<SetStateAction<WhatsAppInstance[]>>;
  loadData: () => Promise<void>;
  showToast: (type: "success" | "error", message: string) => void;
};

export function useWhatsAppActions({
  activeWorkspace,
  instances,
  setInstances,
  loadData,
  showToast,
}: UseWhatsAppActionsParams) {
  const [form, setForm] = useState(initialInstanceForm);
  const [formError, setFormError] = useState("");
  const [qrCodes, setQrCodes] = useState<Record<number, string>>({});
  const [busyInstanceId, setBusyInstanceId] = useState<number | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<WhatsAppInstance | null>(null);
  const [editTarget, setEditTarget] = useState<WhatsAppInstance | null>(null);
  const [editName, setEditName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  function updateField(field: keyof InstanceForm, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const token = getAccessToken();

    if (!token || !activeWorkspace) {
      setFormError("Workspace nao encontrado para este usuario.");
      return;
    }

    setIsSubmitting(true);
    setFormError("");

    try {
      await createWhatsAppInstance(token, form, activeWorkspace.id);

      setForm(initialInstanceForm);
      showToast("success", "Instancia criada.");
      await loadData();
    } catch (requestError) {
      showToast("error", formatApiError(requestError));
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleConnect(instance: WhatsAppInstance) {
    const token = getAccessToken();

    if (!token) {
      return;
    }

    setBusyInstanceId(instance.id);
    setFormError("");

    try {
      const response = await connectWhatsAppInstance(token, instance.id);

      setInstances((current) =>
        current.map((item) => (item.id === instance.id ? response.instance : item))
      );

      if (response.qrcode) {
        const dataUrl = await buildQrCodeDataUrl(response.qrcode);
        setQrCodes((current) => ({ ...current, [instance.id]: dataUrl }));
        showToast("success", "QR Code gerado. Escaneie pelo WhatsApp.");
      } else {
        showToast("success", "Instancia enviada para conexao.");
      }
    } catch (requestError) {
      showToast("error", formatApiError(requestError));
    } finally {
      setBusyInstanceId(null);
    }
  }

  const refreshInstanceStatus = useCallback(
    async (
      instance: WhatsAppInstance,
      options: { silent?: boolean } = {}
    ) => {
      const token = getAccessToken();

      if (!token) {
        return;
      }

      if (!options.silent) {
        setBusyInstanceId(instance.id);
        setFormError("");
      }

      try {
        const response = await refreshWhatsAppInstanceStatus(token, instance.id);

        setInstances((current) =>
          current.map((item) => (item.id === instance.id ? response.instance : item))
        );
        if (response.instance.status === "connected") {
          removeQrCode(instance.id);
        }
        if (!options.silent) {
          showToast(
            "success",
            `Status atualizado: ${whatsappStatusLabels[response.instance.status]}.`
          );
        }
      } catch (requestError) {
        if (!options.silent) {
          showToast("error", formatApiError(requestError));
        }
      } finally {
        if (!options.silent) {
          setBusyInstanceId(null);
        }
      }
    },
    [setInstances, showToast]
  );

  useEffect(() => {
    const instancesToWatch = instances.filter(
      (instance) =>
        instance.status === "connecting" || instance.status === "disconnected"
    );

    if (!instancesToWatch.length) {
      return;
    }

    const intervalId = window.setInterval(() => {
      instancesToWatch.forEach((instance) => {
        refreshInstanceStatus(instance, { silent: true });
      });
    }, 5000);

    return () => window.clearInterval(intervalId);
  }, [instances, refreshInstanceStatus]);

  async function handleDisconnect(instance: WhatsAppInstance) {
    const token = getAccessToken();

    if (!token) {
      return;
    }

    setBusyInstanceId(instance.id);
    setFormError("");

    try {
      const response = await disconnectWhatsAppInstance(token, instance.id);

      setInstances((current) =>
        current.map((item) => (item.id === instance.id ? response.instance : item))
      );
      removeQrCode(instance.id);
      showToast("success", "Instancia desconectada.");
    } catch (requestError) {
      showToast("error", formatApiError(requestError));
    } finally {
      setBusyInstanceId(null);
    }
  }

  function openDeleteDialog(instance: WhatsAppInstance) {
    setDeleteTarget(instance);
  }

  function closeDeleteDialog() {
    setDeleteTarget(null);
  }

  async function handleDeleteConfirmed() {
    const token = getAccessToken();

    if (!token || !deleteTarget) {
      return;
    }

    setBusyInstanceId(deleteTarget.id);
    setFormError("");

    try {
      await deleteWhatsAppInstance(token, deleteTarget.id);

      setInstances((current) =>
        current.filter((item) => item.id !== deleteTarget.id)
      );
      removeQrCode(deleteTarget.id);
      setDeleteTarget(null);
      showToast("success", "Instancia excluida.");
    } catch (requestError) {
      showToast("error", formatApiError(requestError));
    } finally {
      setBusyInstanceId(null);
    }
  }

  function openEditModal(instance: WhatsAppInstance) {
    setEditTarget(instance);
    setEditName(instance.name);
  }

  function closeEditModal() {
    setEditTarget(null);
    setEditName("");
  }

  async function handleEditConfirmed(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const token = getAccessToken();

    if (!token || !editTarget) {
      return;
    }

    setBusyInstanceId(editTarget.id);
    setFormError("");

    try {
      const updatedInstance = await updateWhatsAppInstance(
        token,
        editTarget.id,
        editName
      );

      setInstances((current) =>
        current.map((item) =>
          item.id === updatedInstance.id ? updatedInstance : item
        )
      );
      closeEditModal();
      showToast("success", "Nome da instancia atualizado.");
    } catch (requestError) {
      showToast("error", formatApiError(requestError));
    } finally {
      setBusyInstanceId(null);
    }
  }

  function removeQrCode(instanceId: number) {
    setQrCodes((current) => {
      const next = { ...current };
      delete next[instanceId];
      return next;
    });
  }

  return {
    form,
    formError,
    qrCodes,
    busyInstanceId,
    deleteTarget,
    editTarget,
    editName,
    isSubmitting,
    setEditName,
    updateField,
    handleSubmit,
    handleConnect,
    handleDisconnect,
    openDeleteDialog,
    closeDeleteDialog,
    handleDeleteConfirmed,
    openEditModal,
    closeEditModal,
    handleEditConfirmed,
  };
}

async function buildQrCodeDataUrl(value: string) {
  if (value.startsWith("data:image")) {
    return value;
  }

  if (/^[A-Za-z0-9+/]+=*$/.test(value) && value.length > 200) {
    return `data:image/png;base64,${value}`;
  }

  return QRCode.toDataURL(value, {
    margin: 1,
    width: 512,
    color: {
      dark: "#030712",
      light: "#ffffff",
    },
  });
}
