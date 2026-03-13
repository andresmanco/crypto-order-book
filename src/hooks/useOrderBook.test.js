import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useOrderBook } from "./useOrderBook";
import useWebSocket from "react-use-websocket";

vi.mock("react-use-websocket", () => ({
  default: vi.fn(),
  ReadyState: { UNINSTANTIATED: -1, CONNECTING: 0, OPEN: 1, CLOSING: 2, CLOSED: 3 },
}));

let capturedOnMessage;
let mockSend;

beforeEach(() => {
  mockSend = vi.fn();
  useWebSocket.mockImplementation((_url, { onMessage }) => {
    capturedOnMessage = onMessage;
    return { sendJsonMessage: mockSend, readyState: 1 };
  });
});

describe("useOrderBook", () => {
  it("returns empty asks/bids arrays and undefined bestAsk/bestBid on mount", () => {
    const { result } = renderHook(() => useOrderBook("BTC/USD", 0.01));

    expect(result.current.asks).toHaveLength(0);
    expect(result.current.bids).toHaveLength(0);
    expect(result.current.bestAsk).toBeUndefined();
    expect(result.current.bestBid).toBeUndefined();
    expect(result.current.isConnected).toBe(true);
  });

  it("populates and sorts asks/bids correctly from a WebSocket SNAPSHOT message", () => {
    const { result } = renderHook(() => useOrderBook("BTC/USD", 1));

    act(() => {
      capturedOnMessage({
        data: JSON.stringify({
          channel: "book",
          type: "snapshot",
          data: [
            {
              symbol: "BTC/USD",
              asks: [
                { price: 100, qty: 1 },
                { price: 200, qty: 2 },
              ],
              bids: [{ price: 90, qty: 3 }],
            },
          ],
        }),
      });
    });

    expect(result.current.asks.length).toBeGreaterThan(0);
    expect(result.current.bestAsk.price).toBe(100);
    expect(result.current.bestBid.price).toBe(90);
  });
});
