import * as React from "react";
import { ToggleGroup, ToggleGroupItem } from "../ui/toggle-group";

export function IntervalControll({ interval, handleChange }) {
  return (
    <ToggleGroup
      type="single"
      defaultValue="1h"
      variant="outline"
      className="absolute top-3 left-3 z-10 bg-muted/50 p-1 rounded-lg"
    >
      <ToggleGroupItem aria-label="1 hour" value="1h">
        1h
      </ToggleGroupItem>
      <ToggleGroupItem aria-label="1 day" value="1d">
        1d
      </ToggleGroupItem>
      <ToggleGroupItem aria-label="1 month" value="1m">
        1m
      </ToggleGroupItem>
    </ToggleGroup>
  );
}
