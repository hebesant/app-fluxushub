export type ContactForm = {
  name: string;
  phone: string;
  email: string;
  list_name: string;
  notes: string;
  tags: string;
};

export type ImportContactsResult = {
  imported: number;
  failed: number;
  errors: string[];
};

export type ImportErrorRow = ContactForm & {
  lineNumber: number;
  error: string;
};

export type BulkAction = "list" | "add_tags" | "remove_tags";

export const initialContactForm: ContactForm = {
  name: "",
  phone: "",
  email: "",
  list_name: "",
  notes: "",
  tags: "",
};
