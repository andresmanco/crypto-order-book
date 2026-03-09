import { useState } from "react";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { MAX_BOOK_ROWS, PAIRS } from "./constants";
import { PriceChart } from "./components/PriceChart";

// const loadingBids = new Array(MAX_BOOK_ROWS).fill({ "---.--": "--.---" });
// const loadingAsks = new Array(MAX_BOOK_ROWS).fill({ "---.--": "--.---" });

const queryClient = new QueryClient();

function App() {
  const [cryptoPair, setCryptoPair] = useState(PAIRS.BTC);
  const [aggregation, setAggregation] = useState(0.01);

  return (
    <QueryClientProvider client={queryClient}>
      <div className="dark min-h-screen bg-gray-950 text-gray-50">
        <PriceChart pair={cryptoPair} />
      </div>
    </QueryClientProvider>
  );
}

export default App;
