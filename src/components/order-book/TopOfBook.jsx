import { formatPrice } from "../../lib/utils";

export const TopOfBook = ({ bestBid, bestAsk, isConnected }) => {
  return (
    <div
      aria-label="Top of book"
      className="p-2 flex items-center justify-between px-3 bg-gray-900 border-b border-gray-800"
    >
      <div>
        <p className="text-xs text-gray-500 uppercase">Best bid</p>
        <p className="text-xl py-1 text-bid font-bold">${(bestBid && formatPrice(bestBid.price)) || "---.--"}</p>
        <p className="text-xs text-gray-500 uppercase">Size</p>
        <p className="text-sm">{bestBid ? bestBid.qty : "--.--"}</p>
      </div>
      <div className="flex items-center gap-1">
        <span className={`w-2 h-2 rounded-full ${isConnected ? "bg-green-400" : "bg-gray-600"}`} />
        <span className="text-xs text-gray-500">{isConnected ? "Live" : "Connecting"}</span>
      </div>
      <div>
        <p className="text-xs  text-gray-500 uppercase text-right">Best ask</p>
        <p className="text-xl py-1 text-ask font-bold">${(bestAsk && formatPrice(bestAsk.price)) || "---.--"}</p>
        <p className="text-xs text-gray-500 uppercase text-right">Size</p>
        <p className="text-sm text-right">{bestAsk ? bestAsk.qty : "--.--"}</p>
      </div>
    </div>
  );
};
