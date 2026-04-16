"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { MessageCircle, Plus, QrCode, RefreshCcw, Trash2 } from "lucide-react";
import Image from "next/image";
import QRCode from "qrcode";
import { Button } from "@/components/ui/button";
import {
  apiRequest,
  formatApiError,
  getAccessToken,
  type WhatsAppActionResponse,
  type WhatsAppInstance,
  type Workspace,
} from "@/lib/api";

type InstanceForm = {
  name: string;
};

type ToastState = {
  type: "success" | "error";
  message: string;
};

const initialForm: InstanceForm = {
  name: "",
};

const statusLabels: Record<WhatsAppInstance["status"], string> = {
  disconnected: "Desconectado",
  connecting: "Conectando",
  connected: "Conectado",
  error: "Erro",
};

const statusClasses: Record<WhatsAppInstance["status"], string> = {
  connected: "border-emerald-300/40 bg-emerald-500/20 text-emerald-100",
  connecting: "border-sky-300/40 bg-sky-500/20 text-sky-100",
  disconnected: "border-red-300/40 bg-red-500/20 text-red-100",
  error: "border-red-300/50 bg-red-600/30 text-red-50",
};

export function WhatsAppPage() {
  const [instances, setInstances] = useState<WhatsAppInstance[]>([]);
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [form, setForm] = useState(initialForm);
  const [formError, setFormError] = useState("");
  const [toast, setToast] = useState<ToastState | null>(null);
  const [qrCodes, setQrCodes] = useState<Record<number, string>>({});
  const [busyInstanceId, setBusyInstanceId] = useState<number | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<WhatsAppInstance | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const activeWorkspace = useMemo(() => workspaces[0], [workspaces]);

  const showToast = useCallback((type: ToastState["type"], message: string) => {
    setToast({ type, message });
  }, []);

  useEffect(() => {
    if (!toast) {
      return;
    }

    const timeoutId = window.setTimeout(() => setToast(null), 3800);
    return () => window.clearTimeout(timeoutId);
  }, [toast]);

  const loadData = useCallback(async () => {
    const token = getAccessToken();

    if (!token) {
      return;
    }

    setIsLoading(true);
    setFormError("");

    try {
      const [workspaceData, instanceData] = await Promise.all([
        apiRequest<Workspace[]>("/api/workspaces/", { token }),
        apiRequest<WhatsAppInstance[]>("/api/whatsapp-instances/", { token }),
      ]);

      setWorkspaces(workspaceData);
      setInstances(instanceData);
    } catch (requestError) {
      showToast("error", formatApiError(requestError));
    } finally {
      setIsLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  function updateField(field: keyof InstanceForm, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const token = getAccessToken();

    if (!token || !activeWorkspace) {
      setFormError("Workspace nao encontrado para este usuario.");
      return;
    }

    setIsSubmitting(true);
    setFormError("");

    try {
      await apiRequest<WhatsAppInstance>("/api/whatsapp-instances/", {
        method: "POST",
        token,
        body: JSON.stringify({
          workspace: activeWorkspace.id,
          name: form.name,
          phone_number: "",
          status: "disconnected",
          is_active: true,
        }),
      });

      setForm(initialForm);
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
      const response = await apiRequest<WhatsAppActionResponse>(
        `/api/whatsapp-instances/${instance.id}/connect/`,
        {
          method: "POST",
          token,
        }
      );

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

  const refreshInstanceStatus = useCallback(async (
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
      const response = await apiRequest<WhatsAppActionResponse>(
        `/api/whatsapp-instances/${instance.id}/status/`,
        { token }
      );

      setInstances((current) =>
        current.map((item) => (item.id === instance.id ? response.instance : item))
      );
      if (response.instance.status === "connected") {
        setQrCodes((current) => {
          const next = { ...current };
          delete next[instance.id];
          return next;
        });
      }
      if (!options.silent) {
        showToast("success", `Status atualizado: ${statusLabels[response.instance.status]}.`);
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
  }, [showToast]);

  useEffect(() => {
    const hasConnectingInstance = instances.some(
      (instance) => instance.status === "connecting"
    );

    if (!hasConnectingInstance) {
      return;
    }

    const intervalId = window.setInterval(() => {
      instances
        .filter((instance) => instance.status === "connecting")
        .forEach((instance) => {
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
      const response = await apiRequest<WhatsAppActionResponse>(
        `/api/whatsapp-instances/${instance.id}/disconnect/`,
        {
          method: "POST",
          token,
        }
      );

      setInstances((current) =>
        current.map((item) => (item.id === instance.id ? response.instance : item))
      );
      setQrCodes((current) => {
        const next = { ...current };
        delete next[instance.id];
        return next;
      });
      showToast("success", "Instancia desconectada.");
    } catch (requestError) {
      showToast("error", formatApiError(requestError));
    } finally {
      setBusyInstanceId(null);
    }
  }

  async function handleDeleteConfirmed() {
    const token = getAccessToken();

    if (!token || !deleteTarget) {
      return;
    }

    setBusyInstanceId(deleteTarget.id);
    setFormError("");

    try {
      await apiRequest<null>(`/api/whatsapp-instances/${deleteTarget.id}/`, {
        method: "DELETE",
        token,
      });

      setInstances((current) => current.filter((item) => item.id !== deleteTarget.id));
      setQrCodes((current) => {
        const next = { ...current };
        delete next[deleteTarget.id];
        return next;
      });
      setDeleteTarget(null);
      showToast("success", "Instancia excluida.");
    } catch (requestError) {
      showToast("error", formatApiError(requestError));
    } finally {
      setBusyInstanceId(null);
    }
  }

  return (
    <div className="space-y-6">
      <section className="rounded-lg border border-white/10 bg-white/8 p-6 backdrop-blur">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase text-primary-300">WhatsApp</p>
            <h2 className="mt-2 text-3xl font-semibold text-white">
              Gerencie suas instancias
            </h2>
            <p className="mt-3 max-w-2xl leading-7 text-neutral-300">
              Por enquanto criamos e organizamos a instancia. Na proxima fase,
              este painel chama a Evolution API e exibe o QR Code real.
            </p>
          </div>

          <Button
            variant="outline"
            onClick={loadData}
            className="border-white/10 bg-white/8 text-white hover:bg-white/15"
          >
            <RefreshCcw className="size-4" />
            Atualizar
          </Button>
        </div>
      </section>

      <section className="rounded-lg border border-white/10 bg-white/8 p-5 backdrop-blur">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-lg bg-primary-500 text-white">
              <MessageCircle className="size-4" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Nova instancia</h3>
              <p className="text-sm text-neutral-400">
                Crie a conexao e gere o QR Code no card abaixo.
              </p>
            </div>
          </div>

          <form className="grid gap-3 lg:min-w-[520px] lg:grid-cols-[1fr_auto]" onSubmit={handleSubmit}>
            <label className="block min-w-0">
              <span className="text-sm font-medium text-neutral-200">Nome</span>
              <input
                value={form.name}
                onChange={(event) => updateField("name", event.target.value)}
                placeholder="WhatsApp Loja"
                required
                className="mt-2 h-11 w-full rounded-lg border border-white/10 bg-neutral-950/60 px-3 text-sm text-white outline-none placeholder:text-neutral-500 focus:border-primary-400 focus:ring-3 focus:ring-primary-500/20"
              />
            </label>

            <Button
              disabled={isSubmitting}
              className="mt-7 h-11 rounded-lg bg-primary-500 px-5 text-white hover:bg-primary-400"
            >
              <Plus className="size-4" />
              {isSubmitting ? "Criando..." : "Criar instancia"}
            </Button>
          </form>
        </div>

        {formError ? (
          <p className="mt-4 rounded-lg border border-red-400/30 bg-red-500/10 px-3 py-2 text-sm text-red-100">
            {formError}
          </p>
        ) : null}
      </section>

      <section className="rounded-lg border border-white/10 bg-white/8 p-5 backdrop-blur">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold text-white">Instancias</h3>
              <p className="mt-1 text-sm text-neutral-400">
                {instances.length} instancia{instances.length === 1 ? "" : "s"} cadastrada
                {instances.length === 1 ? "" : "s"}.
              </p>
            </div>
          </div>

          <div className="mt-5 grid gap-4 xl:grid-cols-2">
            {isLoading ? (
              <p className="rounded-lg border border-white/10 p-4 text-sm text-neutral-300">
                Carregando instancias...
              </p>
            ) : instances.length ? (
              instances.map((instance) => (
                <article
                  key={instance.id}
                  className="rounded-lg border border-white/10 bg-neutral-950/50 p-4"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex size-14 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-white/10 bg-white/8 text-lg font-semibold text-white">
                      {instance.profile_picture_url ? (
                        <Image
                          src={instance.profile_picture_url}
                          alt={`Foto de ${instance.name}`}
                          width={56}
                          height={56}
                          unoptimized
                          className="size-14 object-cover"
                        />
                      ) : (
                        instance.name.charAt(0).toUpperCase()
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-3">
                        <h4 className="font-semibold text-white">{instance.name}</h4>
                        <span
                          className={`rounded-lg border px-2 py-1 text-xs font-semibold ${statusClasses[instance.status]}`}
                        >
                          {statusLabels[instance.status]}
                        </span>
                      </div>
                      <p className="mt-2 text-sm text-neutral-400">
                        Numero: {instance.phone_number || "Aguardando conexao"}
                      </p>
                      <p className="mt-1 break-all text-xs text-neutral-500">
                        {instance.evolution_instance_id}
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 flex min-h-80 flex-col items-center justify-center rounded-lg border border-dashed border-white/15 bg-white/5 p-5 text-center">
                    {qrCodes[instance.id] ? (
                      <Image
                        src={qrCodes[instance.id]}
                        alt={`QR Code de ${instance.name}`}
                        width={256}
                        height={256}
                        unoptimized
                        className="size-64 rounded-lg bg-white p-3"
                      />
                    ) : (
                      <>
                        <QrCode className="size-9 text-primary-200" />
                        <p className="mt-3 text-sm font-medium text-white">QR Code</p>
                        <p className="mt-1 text-xs leading-5 text-neutral-400">
                          Clique em conectar para gerar.
                        </p>
                      </>
                    )}
                    <div className="mt-4 grid w-full gap-2 sm:grid-cols-3">
                      <Button
                        onClick={() => handleConnect(instance)}
                        disabled={busyInstanceId === instance.id}
                        className="h-9 rounded-lg bg-primary-500 text-white hover:bg-primary-400"
                      >
                        Conectar
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => handleDisconnect(instance)}
                        disabled={busyInstanceId === instance.id}
                        className="h-9 border-white/10 bg-white/8 text-white hover:bg-white/15"
                      >
                        Desconectar
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setDeleteTarget(instance)}
                        disabled={busyInstanceId === instance.id}
                        className="h-9 border-red-300/30 bg-red-500/10 text-red-100 hover:bg-red-500/20"
                      >
                        <Trash2 className="size-4" />
                        Excluir
                      </Button>
                    </div>
                  </div>
                </article>
              ))
            ) : (
              <p className="rounded-lg border border-white/10 p-4 text-sm text-neutral-300">
                Nenhuma instancia ainda. Crie a primeira para preparar o QR Code.
              </p>
            )}
          </div>
      </section>

      {deleteTarget ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-lg border border-white/10 bg-neutral-950 p-5 text-white shadow-[0_24px_90px_rgba(0,0,0,0.45)]">
            <div className="flex items-start gap-3">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-red-500/15 text-red-100">
                <Trash2 className="size-5" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Excluir instancia</h3>
                <p className="mt-2 text-sm leading-6 text-neutral-300">
                  A instancia {deleteTarget.name} sera desconectada na Evolution e
                  removida do Fluxus Hub.
                </p>
              </div>
            </div>

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <Button
                variant="outline"
                onClick={() => setDeleteTarget(null)}
                className="h-10 border-white/10 bg-white/8 text-white hover:bg-white/15"
              >
                Cancelar
              </Button>
              <Button
                onClick={handleDeleteConfirmed}
                disabled={busyInstanceId === deleteTarget.id}
                className="h-10 bg-red-500 text-white hover:bg-red-400"
              >
                {busyInstanceId === deleteTarget.id ? "Excluindo..." : "Excluir"}
              </Button>
            </div>
          </div>
        </div>
      ) : null}

      {toast ? (
        <div className="fixed right-4 top-4 z-[60] w-[min(calc(100vw-2rem),380px)]">
          <div
            className={`rounded-lg border px-4 py-3 text-sm shadow-[0_20px_70px_rgba(0,0,0,0.35)] backdrop-blur-2xl ${
              toast.type === "success"
                ? "border-emerald-300/30 bg-emerald-500/15 text-emerald-50"
                : "border-red-300/30 bg-red-500/15 text-red-50"
            }`}
          >
            <div className="flex items-start justify-between gap-4">
              <p className="leading-6">{toast.message}</p>
              <button
                type="button"
                onClick={() => setToast(null)}
                className="rounded-lg px-2 text-lg leading-none text-white/70 transition hover:bg-white/10 hover:text-white"
                aria-label="Fechar aviso"
              >
                x
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
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
