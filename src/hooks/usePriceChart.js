import { useRef, useEffect, useReducer } from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";
import { WS_ENDPOINT, REST_ENDPOINT } from "../constants";
import { useQuery } from "@tanstack/react-query";

const granularity = 60;
const candleNumber = 60;
const dataPointLength = 1;

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

export const usePriceChart = (pair, increment) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const prevPair = useRef(pair);
  const readyStateRef = useRef(ReadyState.UNINSTANTIATED);

  const endTime = new Date();
  const startTime = new Date(endTime.getTime() - granularity * candleNumber * 1000);
  const since = Math.floor(startTime.getTime() / 1000);

  const url = `${REST_ENDPOINT}?pair=${pair}&interval=${dataPointLength}&since=${since}`;

  const { data, isSuccess, isPending, error } = useQuery({
    queryKey: ["priceHistory", pair],
    queryFn: async () => {
      const raw = await fetch(url).then((res) => res.json());
      return raw.result[pair]
        .map(([timestamp, _, high, low]) => {
          return {
            // time: timestamp,
            time: timestamp * 1000,
            price: (Number(high) + Number(low)) / 2,
          };
        })
        .reverse();
    },
  });

  useEffect(() => {
    if (isSuccess && data) {
      // const mapData = new Map(data);
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
          interval: dataPointLength,
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
            interval: dataPointLength,
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
    if (prevPair.current === pair) return;
    if (readyStateRef.current === ReadyState.OPEN) {
      sendJsonMessage({
        method: "unsubscribe",
        params: {
          channel: "ohlc",
          symbol: [prevPair.current],
          interval: dataPointLength,
        },
      });
      prevPair.current = pair;
    }
  }, [sendJsonMessage, pair]);

  const formatedData = Array.from(state.dataPoints, ([time, price]) => ({ time, price })).sort(
    (a, b) => a.time - b.time,
  );
  return { data: formatedData, isPending, error };
};
