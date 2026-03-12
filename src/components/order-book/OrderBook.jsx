import { useState } from "react";
import { TopOfBook } from "./TopOfBook";
import { LadderView } from "./LadderView";
import { AggregationControl } from "./AggregationControl";
import { SpreadRow } from "./SpreadRow";
import { MAX_BOOK_ROWS } from "../../constants";
import { useOrderBook } from "../..//hooks/useOrderBook";

const loadingRows = new Array(MAX_BOOK_ROWS).fill({ price: "---.--", qty: "--.---" });

export const OrderBook = ({ pair }) => {
  const [selectedIncrement, setSelectedIncrement] = useState(0.01);
  const { asks, bids, bestAsk, bestBid, isConnected } = useOrderBook(pair);

  return (
    <>
      <TopOfBook bestBid={bestBid} bestAsk={bestAsk} isConnected={isConnected} />
      <LadderView rows={asks.length > 0 ? Array.from(asks) : loadingRows} type="ask" />
      <SpreadRow spread={bestAsk?.price - bestBid?.price} />
      <LadderView rows={bids.length > 0 ? Array.from(bids) : loadingRows} type="bid" />
      <AggregationControl increment={selectedIncrement} handleChange={setSelectedIncrement} />
    </>
  );
};
