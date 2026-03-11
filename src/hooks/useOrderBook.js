import { useRef, useEffect, useReducer } from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";
import { WS_ENDPOINT } from "../constants";

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
      return { asks: new Map(), bids: new Map() };

    default:
      return state;
  }
};

export const useOrderBook = (pair) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const pendingAsks = useRef(new Map());
  const pendingBids = useRef(new Map());
  const hasPending = useRef(false);
  const rafRef = useRef(null);
  const prevPair = useRef(null);

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
      prevPair.current = pair;
    },
    onMessage: (e) => {
      let msg = JSON.parse(e.data);
      if (msg.channel !== "book" || !msg.data) return;
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
        dispatch({ type: "SNAPSHOT", bids, asks });
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
    if (prevPair.current === pair) return;

    if (readyState === ReadyState.OPEN) {
      sendJsonMessage({
        method: "unsubscribe",
        params: { channel: "book", symbol: [pair.kId] },
      });
    }
  }, [sendJsonMessage, pair]);

  const bestAsk =
    state.asks.size > 0
      ? {
          price: Math.min(...state.asks.keys()),
          qty: state.asks.get(Math.min(...state.asks.keys())),
        }
      : null;
  const bestBid =
    state.bids.size > 0
      ? {
          price: Math.max(...state.bids.keys()),
          qty: state.bids.get(Math.max(...state.bids.keys())),
        }
      : null;

  const formatList = (rows) => {
    // for (const [price, qty] of rows) {
    //   if (isNaN(price) || isNaN(qty) || qty === 0) continue;
    // }
    const sortedList = Array.from(rows, ([price, qty]) => ({ price, qty })).sort((a, b) => b.price - a.price);
    return sortedList;
  };

  const sortedAsks = formatList(state.asks);
  const sortedBids = formatList(state.bids);

  return {
    bids: sortedAsks,
    asks: sortedBids,
    bestAsk,
    bestBid,
    isConnected: readyState === ReadyState.OPEN,
  };
};
