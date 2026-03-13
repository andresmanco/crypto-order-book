import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { usePriceChart } from "./usePriceChart";
import useWebSocket from "react-use-websocket";
import { useQuery } from "@tanstack/react-query";

vi.mock("react-use-websocket", () => ({
  default: vi.fn(),
  ReadyState: { UNINSTANTIATED: -1, CONNECTING: 0, OPEN: 1, CLOSING: 2, CLOSED: 3 },
}));

vi.mock("@tanstack/react-query", async (importOriginal) => {
  const actual = await importOriginal();
  return { ...actual, useQuery: vi.fn() };
});

beforeEach(() => {
  useWebSocket.mockImplementation((_url, _options) => ({
    sendJsonMessage: vi.fn(),
    readyState: 1,
  }));
  useQuery.mockReturnValue({ data: undefined, isSuccess: false, isPending: true, error: null });
});

describe("usePriceChart", () => {
  it("passes through isPending and returns empty data while REST is loading", () => {
    const { result } = renderHook(() => usePriceChart("BTC/USD", "1h"));

    expect(result.current.isPending).toBe(true);
    expect(result.current.data).toHaveLength(0);
  });

  it("sorts formatedData ascending by time when REST data arrives", async () => {
    useQuery.mockReturnValue({
      isPending: false,
      isSuccess: true,
      data: [
        { time: 3000, price: 105 },
        { time: 1000, price: 100 },
        { time: 2000, price: 102 },
      ],
      error: null,
    });

    const { result } = renderHook(() => usePriceChart("BTC/USD", "1h"));

    await waitFor(() => expect(result.current.data.length).toBe(3));
    expect(result.current.data[0].time).toBe(1000);
    expect(result.current.data[1].time).toBe(2000);
    expect(result.current.data[2].time).toBe(3000);
  });
});
