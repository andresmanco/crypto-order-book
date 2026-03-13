export const WS_ENDPOINT = "wss://ws.kraken.com/v2";

export const REST_ENDPOINT = "https://api.kraken.com/0/public/OHLC";

export const MAX_BOOK_ROWS = 15;

export const oldPAIRS = [{ kId: "BTC/USD" }, { kId: "ETH/USD" }, { kId: "LTC/USD" }, { kId: "BCH/USD" }];

export const PAIRS = ["BTC/USD", "ETH/USD", "LTC/USD", "BCH/USD"];

export const INCREMENTS = [0.01, 0.05, 0.1, 0.25, 0.5, 1.0];

export const INTERVALS = {
  "1h": 1, // 60 candles
  "1d": 30, // 48 candles
  "1m": 1440, // 30 candles
};
