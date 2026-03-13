import { useRef, useEffect, useReducer, useMemo } from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";
import { WS_ENDPOINT, REST_ENDPOINT, INTERVALS } from "../constants";
import { useQuery } from "@tanstack/react-query";

const initialState = { dataPoints: [] };

const reducer = (state, action) => {
  switch (action.type) {
    case "REST_DATA":
      return { dataPoints: action.dataPoints };
    case "UPDATE":
      const dataPoints = new Map(state.dataPoints);
      for (const [time, price] of action.dataPoints) {
        dataPoints.set(time, price);
      }
      return { dataPoints };
    case "CLEAR":
      return { dataPoints: [] };
    default:
      return state;
  }
};

function getSince(timeframe) {
  const now = new Date();
  switch (timeframe) {
    case "1h":
      now.setHours(now.getHours() - 1);
      break;
    case "1d":
      now.setDate(now.getDate() - 1);
      break;
    case "1m":
      now.setMonth(now.getMonth() - 1);
      break;
    default:
      throw new Error("Invalid period. Use '1h', '1d', '1m'");
  }
  return Math.floor(now.getTime() / 1000);
}

export const usePriceChart = (pair, timeframe) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const prevPair = useRef(pair);
  const prevTimeframe = useRef(timeframe);
  const readyStateRef = useRef(ReadyState.UNINSTANTIATED);

  const since = getSince(timeframe);

  const url = `${REST_ENDPOINT}?pair=${pair}&interval=${INTERVALS[timeframe]}&since=${since}`;

  const { data, isSuccess, isPending, error } = useQuery({
    queryKey: ["priceHistory", pair, timeframe],
    queryFn: async () => {
      const raw = await fetch(url).then((res) => res.json());
      return raw.result[pair]
        .map(([timestamp, _, high, low]) => {
          return {
            time: timestamp * 1000,
            price: (Number(high) + Number(low)) / 2,
          };
        })
        .reverse();
    },
  });

  useEffect(() => {
    if (isSuccess && data) {
      const mapData = new Map(data.map((d) => [d.time, d.price]));
      dispatch({ type: "REST_DATA", dataPoints: mapData });
    }
  }, [isSuccess, data]);

  const { sendJsonMessage, readyState } = useWebSocket(WS_ENDPOINT, {
    onOpen: () => {
      sendJsonMessage({
        method: "subscribe",
        params: {
          channel: "ohlc",
          symbol: [pair],
          interval: INTERVALS[timeframe],
        },
      });
    },
    onMessage: (e) => {
      let msg = JSON.parse(e.data);
      if (msg.method === "unsubscribe" && msg.success) {
        dispatch("CLEAR");
        sendJsonMessage({
          method: "subscribe",
          params: {
            channel: "ohlc",
            symbol: [pair],
            interval: INTERVALS[timeframe],
          },
        });
      }
      if (msg.channel !== "ohlc" || !msg.data || msg.data[0].symbol !== pair) return;
      const data = msg.data;
      const dataPoints = new Map();
      for (const { timestamp, high, low } of data) {
        // convert to epoch
        const time = Math.floor(new Date(timestamp).getTime() / 1000) * 1000;
        const price = (high + low) / 2;
        dataPoints.set(time, price);
      }
      if (msg.type === "snapshot" || msg.type === "update") {
        dispatch({ type: "UPDATE", dataPoints });
      }
    },
  });

  readyStateRef.current = readyState;

  useEffect(() => {
    if (prevPair.current === pair && prevTimeframe.current === timeframe) return;

    if (readyStateRef.current === ReadyState.OPEN) {
      sendJsonMessage({
        method: "unsubscribe",
        params: {
          channel: "ohlc",
          symbol: [prevPair.current],
          interval: INTERVALS[prevTimeframe.current],
        },
      });
      prevPair.current = pair;
      prevTimeframe.current = timeframe;
    }
  }, [sendJsonMessage, pair, timeframe]);

  const formatedData = useMemo(
    () => Array.from(state.dataPoints, ([time, price]) => ({ time, price })).sort((a, b) => a.time - b.time),
    [state.dataPoints],
  );
  return { data: formatedData, isPending, error };
};
