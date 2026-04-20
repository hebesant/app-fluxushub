import type { ContactForm, ImportErrorRow } from "../types";

export function parseContactsCsv(
  content: string,
  fallbackList = ""
): { validRows: ContactForm[]; invalidRows: ImportErrorRow[] } {
  const table = parseCsv(content);

  if (table.length < 2) {
    return { validRows: [], invalidRows: [] };
  }

  const headers = table[0].map((header) => normalizeHeader(header));
  const missingColumns: string[] = [];

  if (!headers.some((header) => ["name", "nome"].includes(header))) {
    missingColumns.push("name ou nome");
  }

  if (!headers.some((header) => ["phone", "telefone", "whatsapp"].includes(header))) {
    missingColumns.push("phone, telefone ou whatsapp");
  }

  if (missingColumns.length) {
    throw new Error(
      `Colunas obrigatorias ausentes: ${missingColumns.join("; ")}. Ajuste o cabecalho do CSV e tente novamente.`
    );
  }

  const seenPhones = new Set<string>();
  const validRows: ContactForm[] = [];
  const invalidRows: ImportErrorRow[] = [];

  table.slice(1).forEach((columns, index) => {
    const row = Object.fromEntries(
      headers.map((header, headerIndex) => [
        header,
        columns[headerIndex]?.trim() ?? "",
      ])
    );
    const contact = {
      name: row.name || row.nome || "",
      phone: row.phone || row.telefone || row.whatsapp || "",
      email: row.email || "",
      list_name: fallbackList || row.list || row.lista || row.list_name || "",
      tags: row.tags || "",
      notes: row.notes || row.observacoes || row.observacao || "",
    };
    const lineNumber = index + 2;
    const phoneValidation = normalizeImportPhone(contact.phone);

    if (!contact.name) {
      invalidRows.push({ ...contact, lineNumber, error: "Nome obrigatorio." });
      return;
    }

    if (!contact.phone) {
      invalidRows.push({ ...contact, lineNumber, error: "Telefone obrigatorio." });
      return;
    }

    if (!phoneValidation.ok) {
      invalidRows.push({
        ...contact,
        lineNumber,
        error: phoneValidation.error,
      });
      return;
    }

    if (seenPhones.has(phoneValidation.phone)) {
      invalidRows.push({
        ...contact,
        phone: phoneValidation.phone,
        lineNumber,
        error: "Telefone duplicado dentro do CSV.",
      });
      return;
    }

    seenPhones.add(phoneValidation.phone);
    validRows.push({ ...contact, phone: phoneValidation.phone });
  });

  return { validRows, invalidRows };
}

export function buildImportErrorsCsv(invalidRows: ImportErrorRow[]) {
  const headers = ["line", "name", "phone", "email", "list", "tags", "notes", "error"];

  return [
    headers.join(","),
    ...invalidRows.map((row) =>
      [
        row.lineNumber,
        row.name,
        row.phone,
        row.email,
        row.list_name,
        row.tags,
        row.notes,
        row.error,
      ]
        .map(escapeCsvCell)
        .join(",")
    ),
  ].join("\n");
}

function normalizeImportPhone(value: string):
  | { ok: true; phone: string }
  | { ok: false; error: string } {
  if (/[a-zA-Z]/.test(value)) {
    return { ok: false, error: "Telefone nao deve conter letras." };
  }

  let normalized = value.replace(/\D/g, "");

  if (normalized.length === 10 || normalized.length === 11) {
    normalized = `55${normalized}`;
  }

  if (normalized.length < 12 || normalized.length > 15) {
    return {
      ok: false,
      error: "Use um telefone com DDI e DDD, como 5511999999999.",
    };
  }

  return { ok: true, phone: normalized };
}

function escapeCsvCell(value: unknown) {
  const text = String(value ?? "");

  if (/[",\n\r]/.test(text)) {
    return `"${text.replace(/"/g, '""')}"`;
  }

  return text;
}

function parseCsv(content: string): string[][] {
  const rows: string[][] = [];
  let currentRow: string[] = [];
  let currentCell = "";
  let insideQuotes = false;

  for (let index = 0; index < content.length; index += 1) {
    const character = content[index];
    const nextCharacter = content[index + 1];

    if (character === '"' && insideQuotes && nextCharacter === '"') {
      currentCell += '"';
      index += 1;
      continue;
    }

    if (character === '"') {
      insideQuotes = !insideQuotes;
      continue;
    }

    if (character === "," && !insideQuotes) {
      currentRow.push(currentCell);
      currentCell = "";
      continue;
    }

    if ((character === "\n" || character === "\r") && !insideQuotes) {
      if (character === "\r" && nextCharacter === "\n") {
        index += 1;
      }

      currentRow.push(currentCell);
      rows.push(currentRow);
      currentRow = [];
      currentCell = "";
      continue;
    }

    currentCell += character;
  }

  currentRow.push(currentCell);
  rows.push(currentRow);

  return rows.filter((row) => row.some((cell) => cell.trim()));
}

function normalizeHeader(header: string) {
  return header
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}
