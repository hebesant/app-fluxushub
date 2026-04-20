import { describe, expect, it } from "vitest";
import { buildContactPayload, contactToForm, parseTags } from "./contactPayload";
import type { Contact } from "@/lib/api";

describe("parseTags", () => {
  it("trims tags and removes empty entries", () => {
    expect(parseTags(" vip, , lead ,promocao ")).toEqual([
      "vip",
      "lead",
      "promocao",
    ]);
  });
});

describe("buildContactPayload", () => {
  it("keeps the backend payload shape stable", () => {
    expect(
      buildContactPayload(
        {
          name: "Maria Cliente",
          phone: "5511999999999",
          email: "maria@example.com",
          list_name: "livia",
          notes: "Cliente quente",
          tags: "vip, lead",
        },
        7
      )
    ).toEqual({
      workspace: 7,
      name: "Maria Cliente",
      phone: "5511999999999",
      email: "maria@example.com",
      list_name: "livia",
      notes: "Cliente quente",
      tags: ["vip", "lead"],
      is_active: true,
    });
  });
});

describe("contactToForm", () => {
  it("converts API tags back to the editable text field", () => {
    const contact = {
      name: "Maria Cliente",
      phone: "5511999999999",
      email: "maria@example.com",
      list_name: "livia",
      notes: "Cliente quente",
      tags: ["vip", "lead"],
    } as Contact;

    expect(contactToForm(contact)).toEqual({
      name: "Maria Cliente",
      phone: "5511999999999",
      email: "maria@example.com",
      list_name: "livia",
      notes: "Cliente quente",
      tags: "vip, lead",
    });
  });
});
