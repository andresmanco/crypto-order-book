export const TopOfBook = ({ bestBid, bestOffer, isConnected }) => {
  const formatAmount = (price) => price.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <div
      aria-label="Top of book"
      className="p-2 flex items-center justify-between px-3 bg-gray-900 border-b border-gray-800"
    >
      <div>
        <p className="text-xs pb-1 text-gray-500 uppercase">Best Bid</p>
        <p className="text-xl text-bid font-bold">${(bestBid && formatAmount(bestBid)) || "---.--"}</p>
      </div>
      <div className="flex items-center gap-1">
        <span className={`w-2 h-2 rounded-full ${isConnected ? "bg-green-400" : "bg-gray-600"}`} />
        <span className="text-xs text-gray-500">{isConnected ? "Live" : "Connecting"}</span>
      </div>
      <div>
        <p className="text-xs  text-gray-500 uppercase text-right">Best Offer</p>
        <p className="text-xl text-offer font-bold">${(bestOffer && formatAmount(bestOffer)) || "---.--"}</p>
      </div>
    </div>
  );
};
