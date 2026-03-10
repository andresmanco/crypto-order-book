import { cn } from "../lib/utils";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

export function CryptoDropdown({ options, selected, onSelect }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="bg-gray-800 border-gray-400, m-3" variant="outline">
          {selected}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-gray-900" align="start">
        <DropdownMenuGroup className="text-gray-300">
          <DropdownMenuLabel className="text-xs">Crypto Pairs</DropdownMenuLabel>
          {options &&
            options.map((option) => {
              return (
                <DropdownMenuItem
                  className={cn("cursor-pointer hover:bg-gray-700", selected === option && "bg-gray-300")}
                  key={option.id}
                  onSelect={() => onSelect(option.id)}
                >
                  {option.id}
                </DropdownMenuItem>
              );
            })}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
