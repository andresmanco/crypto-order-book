import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import { useMemo } from "react";
import { usePriceChart } from "../../hooks/usePriceChart";

function formatTimestamp(timestamp) {
  const date = new Date(timestamp);
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

const CustomTooltip = ({ active, payload, label }) => {
  const isVisible = active && payload && payload.length;
  const price = payload[0]?.value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const date = new Date(label).toLocaleString([], {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
  return (
    <div
      className="bg-gray-800 border border-gray-700 rounded p-2 text-xs"
      style={{ visibility: isVisible ? "visible" : "hidden" }}
    >
      <div className="text-bid">${price}</div>
      <div className="text-gray-400">{date}</div>
    </div>
  );
};

export const PriceChart = ({ pair }) => {
  const { data, isPending, error } = usePriceChart(pair);

  const domainRange = useMemo(() => {
    if (!data?.length) return ["auto", "auto"];
    const prices = data.map((d) => d.price);
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    const extra = (max - min) * 0.05;
    return [min - extra, max + extra];
  }, [data]);

  if (error) return <span>Error: {error.message}</span>;

  if (isPending) return <span>Loading. . .</span>;
  return (
    <LineChart
      data={data}
      responsive
      margin={{ top: 5, right: 0, left: 0, bottom: 5 }}
      className="h-full"
      style={{ width: "100%" }}
    >
      <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
      <XAxis
        dataKey="time"
        tickFormatter={formatTimestamp}
        tick={{ fill: "#6b7280", fontSize: 10 }}
        minTickGap={50}
        interval="preserveStartEnd"
        axisLine={false}
        tickLine={false}
      />
      <YAxis
        domain={domainRange}
        tickFormatter={(v) => Math.trunc(v).toLocaleString("en-US")}
        tick={{ fill: "#6b7280", fontSize: 10 }}
        width={60}
        axisLine={false}
        tickLine={false}
      />
      <Tooltip content={CustomTooltip} cursor={{ stroke: "#374151" }} />
      <Line
        type="step"
        dataKey="price"
        stroke="#6AE160"
        dot={{
          fill: "#6AE160",
        }}
        activeDot={{ r: 5, stroke: "red", fill: "red" }}
      />
    </LineChart>
  );
};
