import {
  apiRequest,
  type Contact,
  type ContactList,
  type ContactTag,
  type PaginatedResponse,
  type Workspace,
} from "@/lib/api";
import type { ContactForm } from "../types";
import { buildContactPayload } from "../utils/contactPayload";

export type ContactsQuery = {
  page: number;
  pageSize: number;
  search: string;
  selectedList: string;
  selectedTags: string[];
};

export async function fetchContactsScreenData(token: string, query: ContactsQuery) {
  const contactParams = new URLSearchParams({
    page: String(query.page),
    page_size: String(query.pageSize),
  });

  if (query.search.trim()) {
    contactParams.set("search", query.search.trim());
  }

  if (query.selectedTags.length) {
    contactParams.set("tags", query.selectedTags.join(","));
  }

  if (query.selectedList) {
    contactParams.set("list_name", query.selectedList);
  }

  const [workspaces, contacts, lists, tags] = await Promise.all([
    apiRequest<Workspace[]>("/api/workspaces/", { token }),
    apiRequest<PaginatedResponse<Contact>>(`/api/contacts/?${contactParams}`, {
      token,
    }),
    apiRequest<PaginatedResponse<ContactList> | ContactList[]>(
      "/api/contact-lists/",
      { token }
    ),
    apiRequest<PaginatedResponse<ContactTag> | ContactTag[]>("/api/contact-tags/", {
      token,
    }),
  ]);
  const listItems = normalizeMaybePaginated(lists);
  const tagItems = normalizeMaybePaginated(tags);

  return {
    workspaces,
    contacts,
    listNames: listItems.map((list) => list.name),
    tagNames: tagItems.map((tag) => tag.name),
  };
}

function normalizeMaybePaginated<T>(response: PaginatedResponse<T> | T[]) {
  return Array.isArray(response) ? response : response.results;
}

export function createContact(
  token: string,
  form: ContactForm,
  workspaceId: number
) {
  return apiRequest<Contact>("/api/contacts/", {
    method: "POST",
    token,
    body: JSON.stringify(buildContactPayload(form, workspaceId)),
  });
}

export function updateContact(
  token: string,
  contactId: number,
  form: ContactForm,
  workspaceId: number
) {
  return apiRequest<Contact>(`/api/contacts/${contactId}/`, {
    method: "PATCH",
    token,
    body: JSON.stringify(buildContactPayload(form, workspaceId)),
  });
}

export function deleteContact(token: string, contactId: number) {
  return apiRequest<null>(`/api/contacts/${contactId}/`, {
    method: "DELETE",
    token,
  });
}
