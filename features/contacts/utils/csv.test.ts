import { describe, expect, it } from "vitest";
import { buildImportErrorsCsv, parseContactsCsv } from "./csv";

describe("parseContactsCsv", () => {
  it("normalizes valid contacts and applies the fallback list", () => {
    const result = parseContactsCsv(
      [
        "nome,telefone,email,tags,observacoes",
        "Maria Cliente,(11) 99999-9999,maria@example.com,\"vip, lead\",Cliente quente",
        "Joao Cliente,5511988887777,joao@example.com,frio,",
      ].join("\n"),
      "livia"
    );

    expect(result.invalidRows).toHaveLength(0);
    expect(result.validRows).toEqual([
      {
        name: "Maria Cliente",
        phone: "5511999999999",
        email: "maria@example.com",
        list_name: "livia",
        tags: "vip, lead",
        notes: "Cliente quente",
      },
      {
        name: "Joao Cliente",
        phone: "5511988887777",
        email: "joao@example.com",
        list_name: "livia",
        tags: "frio",
        notes: "",
      },
    ]);
  });

  it("reports invalid rows without blocking valid rows", () => {
    const result = parseContactsCsv(
      [
        "name,phone,email",
        "Sem Telefone,,sem@example.com",
        "Com Letra,55abc,letra@example.com",
        "Duplicado,5511999999999,dup@example.com",
        "Duplicado 2,5511999999999,dup2@example.com",
      ].join("\n")
    );

    expect(result.validRows).toHaveLength(1);
    expect(result.invalidRows.map((row) => row.error)).toEqual([
      "Telefone obrigatorio.",
      "Telefone nao deve conter letras.",
      "Telefone duplicado dentro do CSV.",
    ]);
  });

  it("throws a clear error when required columns are missing", () => {
    expect(() => parseContactsCsv("email,tags\nmaria@example.com,vip")).toThrow(
      "Colunas obrigatorias ausentes: name ou nome; phone, telefone ou whatsapp."
    );
  });
});

describe("buildImportErrorsCsv", () => {
  it("exports invalid rows with escaped csv cells", () => {
    const csv = buildImportErrorsCsv([
      {
        lineNumber: 2,
        name: "Maria, Cliente",
        phone: "abc",
        email: "maria@example.com",
        list_name: "livia",
        tags: "vip",
        notes: "Disse \"oi\"",
        error: "Telefone nao deve conter letras.",
      },
    ]);

    expect(csv).toContain('"Maria, Cliente"');
    expect(csv).toContain('"Disse ""oi"""');
    expect(csv).toContain("Telefone nao deve conter letras.");
  });
});
