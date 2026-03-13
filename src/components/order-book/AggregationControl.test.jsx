import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AggregationControl } from "../../components/order-book/AggregationControl";

describe("AggregationControl", () => {
  it("disables the decrease button when at the minimum increment", () => {
    render(<AggregationControl increment={0.01} handleChange={vi.fn()} />);
    expect(screen.getByRole("button", { name: /decrease aggregation/i })).toBeDisabled();
  });

  it("calls handleChange with the next increment value when + is clicked", async () => {
    const handleChange = vi.fn();
    render(<AggregationControl increment={0.01} handleChange={handleChange} />);
    await userEvent.click(screen.getByRole("button", { name: /increase aggregation/i }));
    expect(handleChange).toHaveBeenCalledWith(0.05);
  });
});
