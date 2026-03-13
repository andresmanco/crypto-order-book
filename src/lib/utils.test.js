import { describe, it, expect } from "vitest";
import { formatPrice, cn } from "./utils";

describe("when use formatPrice", () => {
  it("formats the price with comma separators and 2 decimal places", () => {
    expect(formatPrice(65000)).toBe("65,000.00");
  });
});

describe("when use cn", () => {
  it("deduplicates conflicting Tailwind classes, keeping the last one", () => {
    expect(cn("p-2", "p-4")).toBe("p-4");
  });

  it("allow Tailwind classes to use conditions for style", () => {
    const addMargin = true;
    expect(cn("p-2", addMargin && "m-2")).toBe("p-2 m-2");
  });
});
