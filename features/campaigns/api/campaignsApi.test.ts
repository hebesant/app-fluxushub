import { describe, expect, it } from "vitest";
import { normalizeDetailCollection } from "./campaignsApi";

describe("normalizeDetailCollection", () => {
  it("wraps legacy array responses in the detail collection shape", () => {
    expect(normalizeDetailCollection(["a", "b"], 1, 20)).toEqual({
      items: ["a", "b"],
      count: 2,
      next: null,
      previous: null,
      page: 1,
      pageSize: 20,
    });
  });

  it("keeps DRF paginated response metadata", () => {
    expect(
      normalizeDetailCollection(
        {
          count: 30,
          next: "http://localhost:8000/api/campaigns/1/events/?page=2",
          previous: null,
          results: [{ id: 1 }],
        },
        1,
        20
      )
    ).toEqual({
      items: [{ id: 1 }],
      count: 30,
      next: "http://localhost:8000/api/campaigns/1/events/?page=2",
      previous: null,
      page: 1,
      pageSize: 20,
    });
  });
});
