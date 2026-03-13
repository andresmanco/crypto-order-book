import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { SpreadRow } from "../../components/order-book/SpreadRow";

describe("When SpreadRow is called", () => {
  it("with a number, it shows the formatted spread value", () => {
    render(<SpreadRow spread={0.5} />);
    expect(screen.getByText(0.5)).toBeInTheDocument();
  });

  it("shows the placeholder when spread is undefined", () => {
    render(<SpreadRow spread={undefined} />);
    expect(screen.getByText("--.--")).toBeInTheDocument();
  });
});
