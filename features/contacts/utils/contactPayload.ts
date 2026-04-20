import type { Contact } from "@/lib/api";
import type { ContactForm } from "../types";

export function buildContactPayload(form: ContactForm, workspaceId: number) {
  return {
    workspace: workspaceId,
    name: form.name,
    phone: form.phone,
    email: form.email,
    list_name: form.list_name,
    notes: form.notes,
    tags: parseTags(form.tags),
    is_active: true,
  };
}

export function parseTags(value: string) {
  return value
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
}

export function contactToForm(contact: Contact): ContactForm {
  return {
    name: contact.name,
    phone: contact.phone,
    email: contact.email,
    list_name: contact.list_name,
    notes: contact.notes,
    tags: contact.tags.join(", "),
  };
}
