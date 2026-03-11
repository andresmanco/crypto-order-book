import { useState } from "react";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { PAIRS } from "./constants";
import { PriceChart } from "./components/PriceChart";
import { CryptoDropdown } from "./components/CryptoDropdown";
import { OrderBook } from "./components/order-book/OrderBook";

const queryClient = new QueryClient();

function App() {
  const [selectedPair, setSelectedPair] = useState(PAIRS[0]);
  // const [aggregation, setAggregation] = useState(0.01);

  return (
    <QueryClientProvider client={queryClient}>
      <div className="dark h-screen bg-gray-950 text-gray-50 flex flex-col">
        <header className="flex items-center justify-between px-6 bg-gray-900 border-b border-gray-800">
          <h1 className="text-gray-300 font-extrabold uppercase">Crypto Order Book</h1>
          <CryptoDropdown options={PAIRS} onSelect={setSelectedPair} selected={selectedPair} />
        </header>
        <main className="flex-1 min-h-0 grid grid-cols-[1fr_360px] overflow-hidden">
          <section aria-label="Price chart" className="h-full border-r border-gray-800 overflow-hidden">
            <PriceChart pair={selectedPair} />
          </section>
          <section aria-label="Order book" className="flex flex-col overflow-hidden">
            <OrderBook pair={selectedPair} />
          </section>
        </main>
      </div>
    </QueryClientProvider>
  );
}

export default App;
