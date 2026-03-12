import { useRef, useEffect, useReducer } from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";
import { WS_ENDPOINT, MAX_BOOK_ROWS } from "../constants";

const initialState = { asks: new Map(), bids: new Map() };

const reducer = (state, action) => {
  switch (action.type) {
    case "SNAPSHOT":
      return { asks: action.asks, bids: action.bids };
    case "FLUSH":
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
  const pendingAsks = useRef(new Map());
  const pendingBids = useRef(new Map());
  const hasPending = useRef(false);
  const rafRef = useRef(null);
  const prevPair = useRef(pair.kId);
  const readyStateRef = useRef(ReadyState.UNINSTANTIATED);

  const { sendJsonMessage, readyState } = useWebSocket(WS_ENDPOINT, {
    onOpen: () => {
      sendJsonMessage({
        method: "subscribe",
        params: {
          channel: "book",
          symbol: [pair.kId],
          depth: 25,
        },
      });
    },
    onMessage: (e) => {
      let msg = JSON.parse(e.data);
      if (msg.method === "unsubscribe" && msg.success) {
        dispatch("CLEAR", new Map(), new Map());
        pendingAsks.current.clear();
        pendingBids.current.clear();
        sendJsonMessage({
          method: "subscribe",
          params: { channel: "book", symbol: [pair.kId], depth: 25, snapshot: true },
        });
      }
      if (msg.channel !== "book" || !msg.data || msg.data[0].symbol !== pair.kId) return;
      const data = msg.data[0];
      if (msg.type === "snapshot") {
        const asks = new Map();
        const bids = new Map();
        for (const { price, qty } of data.asks) {
          asks.set(price, qty);
        }
        for (const { price, qty } of data.bids) {
          bids.set(price, qty);
        }
        dispatch({ type: "SNAPSHOT", asks, bids });
      } else if (msg.type === "update") {
        for (const { price, qty } of data.asks) {
          pendingAsks.current.set(price, qty);
        }
        for (const { price, qty } of data.bids) {
          pendingBids.current.set(price, qty);
        }
        hasPending.current = true;
      }
    },
  });

  useEffect(() => {
    const flush = () => {
      if (hasPending.current) {
        dispatch({
          type: "FLUSH",
          asks: new Map(pendingAsks.current),
          bids: new Map(pendingBids.current),
        });
        hasPending.current = false;
        pendingAsks.current.clear();
        pendingBids.current.clear();
      }
      rafRef.current = requestAnimationFrame(flush);
    };
    requestAnimationFrame(flush);
    return () => {
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  useEffect(() => {
    readyStateRef.current = readyState;
  }, [readyState]);

  useEffect(() => {
    if (prevPair.current === pair.kId) return;
    if (readyStateRef.current === ReadyState.OPEN) {
      hasPending.current = false;
      sendJsonMessage({
        method: "unsubscribe",
        params: { channel: "book", symbol: [prevPair.current], depth: 25 },
      });
      prevPair.current = pair.kId;
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

  const sortedAsks = formatList(state.asks, "ask");
  const sortedBids = formatList(state.bids, "bid");

  return {
    asks: sortedAsks,
    bids: sortedBids,
    bestAsk: sortedAsks[sortedAsks.length - 1],
    bestBid: sortedBids[0],
    isConnected: readyState === ReadyState.OPEN,
  };
};
