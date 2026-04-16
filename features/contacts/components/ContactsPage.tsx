"use client";

import { useEffect, useMemo, useState } from "react";
import { Plus, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  apiRequest,
  formatApiError,
  getAccessToken,
  type Contact,
  type Workspace,
} from "@/lib/api";

type ContactForm = {
  name: string;
  phone: string;
  email: string;
  notes: string;
  tags: string;
};

const initialForm: ContactForm = {
  name: "",
  phone: "",
  email: "",
  notes: "",
  tags: "",
};

export function ContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const activeWorkspace = useMemo(() => workspaces[0], [workspaces]);

  async function loadData() {
    const token = getAccessToken();

    if (!token) {
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const [workspaceData, contactData] = await Promise.all([
        apiRequest<Workspace[]>("/api/workspaces/", { token }),
        apiRequest<Contact[]>("/api/contacts/", { token }),
      ]);

      setWorkspaces(workspaceData);
      setContacts(contactData);
    } catch (requestError) {
      setError(formatApiError(requestError));
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  function updateField(field: keyof ContactForm, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const token = getAccessToken();

    if (!token || !activeWorkspace) {
      setError("Workspace nao encontrado para este usuario.");
      return;
    }

    setIsSubmitting(true);
    setError("");
    setSuccess("");

    try {
      await apiRequest<Contact>("/api/contacts/", {
        method: "POST",
        token,
        body: JSON.stringify({
          workspace: activeWorkspace.id,
          name: form.name,
          phone: form.phone,
          email: form.email,
          notes: form.notes,
          tags: form.tags
            .split(",")
            .map((tag) => tag.trim())
            .filter(Boolean),
          is_active: true,
        }),
      });

      setForm(initialForm);
      setSuccess("Contato criado.");
      await loadData();
    } catch (requestError) {
      setError(formatApiError(requestError));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
      <section className="rounded-lg border border-white/10 bg-white/8 p-5 backdrop-blur">
        <div>
          <p className="text-sm font-semibold uppercase text-primary-300">Contatos</p>
          <h2 className="mt-2 text-2xl font-semibold text-white">Novo contato</h2>
          <p className="mt-2 text-sm leading-6 text-neutral-300">
            Cadastre contatos do workspace ativo para validar o primeiro fluxo do app.
          </p>
        </div>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <label className="block">
            <span className="text-sm font-medium text-neutral-200">Nome</span>
            <input
              value={form.name}
              onChange={(event) => updateField("name", event.target.value)}
              required
              className="mt-2 h-11 w-full rounded-lg border border-white/10 bg-neutral-950/60 px-3 text-sm text-white outline-none focus:border-primary-400 focus:ring-3 focus:ring-primary-500/20"
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-neutral-200">WhatsApp</span>
            <input
              value={form.phone}
              onChange={(event) => updateField("phone", event.target.value)}
              placeholder="5599999999999"
              required
              className="mt-2 h-11 w-full rounded-lg border border-white/10 bg-neutral-950/60 px-3 text-sm text-white outline-none placeholder:text-neutral-500 focus:border-primary-400 focus:ring-3 focus:ring-primary-500/20"
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-neutral-200">E-mail</span>
            <input
              type="email"
              value={form.email}
              onChange={(event) => updateField("email", event.target.value)}
              className="mt-2 h-11 w-full rounded-lg border border-white/10 bg-neutral-950/60 px-3 text-sm text-white outline-none focus:border-primary-400 focus:ring-3 focus:ring-primary-500/20"
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-neutral-200">Tags</span>
            <input
              value={form.tags}
              onChange={(event) => updateField("tags", event.target.value)}
              placeholder="vip, promocao"
              className="mt-2 h-11 w-full rounded-lg border border-white/10 bg-neutral-950/60 px-3 text-sm text-white outline-none placeholder:text-neutral-500 focus:border-primary-400 focus:ring-3 focus:ring-primary-500/20"
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-neutral-200">Observacoes</span>
            <textarea
              value={form.notes}
              onChange={(event) => updateField("notes", event.target.value)}
              rows={4}
              className="mt-2 w-full resize-none rounded-lg border border-white/10 bg-neutral-950/60 px-3 py-3 text-sm text-white outline-none focus:border-primary-400 focus:ring-3 focus:ring-primary-500/20"
            />
          </label>

          {error ? (
            <p className="rounded-lg border border-red-400/30 bg-red-500/10 px-3 py-2 text-sm text-red-100">
              {error}
            </p>
          ) : null}

          {success ? (
            <p className="rounded-lg border border-emerald-400/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-100">
              {success}
            </p>
          ) : null}

          <Button
            disabled={isSubmitting}
            className="h-11 w-full rounded-lg bg-primary-500 text-white hover:bg-primary-400"
          >
            <Plus className="size-4" />
            {isSubmitting ? "Salvando..." : "Salvar contato"}
          </Button>
        </form>
      </section>

      <section className="rounded-lg border border-white/10 bg-white/8 p-5 backdrop-blur">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold text-white">Base de contatos</h2>
            <p className="mt-2 text-sm text-neutral-300">
              {contacts.length} contato{contacts.length === 1 ? "" : "s"} cadastrado
              {contacts.length === 1 ? "" : "s"}.
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

        <div className="mt-6 overflow-hidden rounded-lg border border-white/10">
          {isLoading ? (
            <p className="p-4 text-sm text-neutral-300">Carregando contatos...</p>
          ) : contacts.length ? (
            contacts.map((contact) => (
              <div
                key={contact.id}
                className="grid gap-3 border-b border-white/10 px-4 py-4 last:border-b-0 md:grid-cols-[1fr_160px_1fr]"
              >
                <div>
                  <p className="font-medium text-white">{contact.name}</p>
                  <p className="mt-1 text-sm text-neutral-400">{contact.phone}</p>
                </div>
                <p className="text-sm text-neutral-300">{contact.email || "Sem e-mail"}</p>
                <div className="flex flex-wrap gap-2">
                  {contact.tags.length ? (
                    contact.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-lg border border-primary-300/20 bg-primary-500/10 px-2 py-1 text-xs text-primary-100"
                      >
                        {tag}
                      </span>
                    ))
                  ) : (
                    <span className="text-sm text-neutral-500">Sem tags</span>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p className="p-4 text-sm text-neutral-300">
              Nenhum contato ainda. Cadastre o primeiro para testar a API.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
