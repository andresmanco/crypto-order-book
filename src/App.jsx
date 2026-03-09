import { useState } from "react";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { MAX_BOOK_ROWS, PAIRS } from "./constants";
import { PriceChart } from "./components/PriceChart";
import { CryptoDropdown } from "./components/CryptoDropdown";
import { LadderView } from "./components/LadderView";

// const loadingBids = new Array(MAX_BOOK_ROWS).fill({ "---.--": "--.---" });
// const loadingAsks = new Array(MAX_BOOK_ROWS).fill({ "---.--": "--.---" });

const queryClient = new QueryClient();

function App() {
  const [cryptoPair, setCryptoPair] = useState(PAIRS[0].id);
  // const [aggregation, setAggregation] = useState(0.01);

  return (
    <QueryClientProvider client={queryClient}>
      <div className="dark min-h-screen bg-gray-950 text-gray-50 flex flex-col">
        <header className="flex items-center justify-between px-6 bg-gray-900 border-b border-gray-800">
          <h1 className="text-gray-300 font-extrabold uppercase">Crypto Order Book</h1>
          <CryptoDropdown options={PAIRS} onSelect={setCryptoPair} selected={cryptoPair} />
        </header>
        <main className="flex-1 grid grid-cols-[1fr_360px] min-h-0 max-h-full overflow-hidden">
          <section aria-label="Price chart" className="h-full border-r border-gray-800 overflow-hidden">
            <PriceChart pair={cryptoPair} />
          </section>
          <section aria-label="Order book" className="flex flex-col overflow-hidden">
            <LadderView />
          </section>
        </main>
      </div>
    </QueryClientProvider>
  );
}

export default App;
