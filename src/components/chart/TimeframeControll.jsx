import { memo } from "react";
import { Button } from "../ui/button";
import { cn } from "../../lib/utils";

export const TimeframeControll = memo(function TimeframeControll({ timeframe, handleChange }) {
  return (
    <div className="absolute top-3 left-3 z-10 bg-muted/50 p-1 rounded-lg">
      <Button
        aria-label="1 hour"
        value="1h"
        className={cn("cursor-pointer hover:bg-gray-700", timeframe === "1h" && "bg-gray-700")}
        onClick={() => handleChange("1h")}
      >
        1h
      </Button>
      <Button
        aria-label="1 day"
        value="1d"
        className={cn("cursor-pointer hover:bg-gray-700", timeframe === "1d" && "bg-gray-700")}
        onClick={() => handleChange("1d")}
      >
        1d
      </Button>
      <Button
        aria-label="1 month"
        value="1m"
        className={cn("cursor-pointer hover:bg-gray-700", timeframe === "1m" && "bg-gray-700")}
        onClick={() => handleChange("1m")}
      >
        1m
      </Button>
    </div>
  );
});
