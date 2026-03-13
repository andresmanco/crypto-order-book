import { useRef, useEffect, useReducer, useMemo } from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";
import { WS_ENDPOINT, MAX_BOOK_ROWS } from "../constants";

const initialState = { asks: new Map(), bids: new Map() };

const reducer = (state, action) => {
  switch (action.type) {
    case "SNAPSHOT":
      return { asks: action.asks, bids: action.bids };
    case "UPDATE":
      const asks = new Map(state.asks);
      const bids = new Map(state.bids);
      for (const [price, qty] of action.asks) {
        if (qty === 0) {
          asks.delete(price);
        } else {
          asks.set(price, qty);
        }
      }
      for (const [price, qty] of action.bids) {
        if (qty === 0) {
          bids.delete(price);
        } else {
          bids.set(price, qty);
        }
      }
      return { asks, bids };
    case "CLEAR":
      return { asks: action.asks, bids: action.bids };
    default:
      return state;
  }
};

export const useOrderBook = (pair, increment) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const prevPair = useRef(pair);
  const readyStateRef = useRef(ReadyState.UNINSTANTIATED);

  const { sendJsonMessage, readyState } = useWebSocket(WS_ENDPOINT, {
    onOpen: () => {
      sendJsonMessage({
        method: "subscribe",
        params: {
          channel: "book",
          symbol: [pair],
          depth: 25,
        },
      });
    },
    onMessage: (e) => {
      let msg = JSON.parse(e.data);
      if (msg.method === "unsubscribe" && msg.success) {
        dispatch("CLEAR", new Map(), new Map());
        sendJsonMessage({
          method: "subscribe",
          params: { channel: "book", symbol: [pair], depth: 25, snapshot: true },
        });
      }
      if (msg.channel !== "book" || !msg.data || msg.data[0].symbol !== pair) return;
      const data = msg.data[0];
      const asks = new Map();
      const bids = new Map();
      for (const { price, qty } of data.asks) {
        asks.set(price, qty);
      }
      for (const { price, qty } of data.bids) {
        bids.set(price, qty);
      }
      if (msg.type === "snapshot") {
        dispatch({ type: "SNAPSHOT", asks, bids });
      } else if (msg.type === "update") {
        dispatch({
          type: "UPDATE",
          asks,
          bids,
        });
      }
    },
  });

  readyStateRef.current = readyState;

  useEffect(() => {
    if (prevPair.current === pair) return;
    if (readyStateRef.current === ReadyState.OPEN) {
      sendJsonMessage({
        method: "unsubscribe",
        params: { channel: "book", symbol: [prevPair.current], depth: 25 },
      });
      prevPair.current = pair;
    }
  }, [sendJsonMessage, pair]);

  const formatList = (rows, side) => {
    const combinedRoundedRows = new Map();

    for (const [price, qty] of rows) {
      const roundedPrice = Math.round(price / increment) * increment;

      combinedRoundedRows.set(roundedPrice, combinedRoundedRows.get(roundedPrice) || 0 + qty);
    }

    const list = Array.from(combinedRoundedRows, ([price, qty]) => ({ price, qty })).sort((a, b) => b.price - a.price);
    return side === "ask" ? list.slice(-MAX_BOOK_ROWS) : list.slice(0, MAX_BOOK_ROWS);
  };

  const sortedAsks = useMemo(() => formatList(state.asks, "ask"), [state.asks, increment]);
  const sortedBids = useMemo(() => formatList(state.bids, "bid"), [state.bids, increment]);

  return {
    asks: sortedAsks,
    bids: sortedBids,
    bestAsk: sortedAsks[sortedAsks.length - 1],
    bestBid: sortedBids[0],
    isConnected: readyState === ReadyState.OPEN,
  };
};
