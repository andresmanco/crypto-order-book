import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { cn } from "../../lib/utils";

export function LadderView({ rows, type }) {
  return (
    <Table className="w-full">
      {type === "ask" && (
        <TableHeader>
          <TableRow className="border-0 p-0 m-0 h-auto ">
            <TableHead className="w-[100px] uppercase tepxt-[10px] text-gray-500">Market Size</TableHead>
            <TableHead className="text-right uppercase text-[10px] text-gray-500">Price(USD)</TableHead>
          </TableRow>
        </TableHeader>
      )}
      <TableBody>
        {rows.map((row, index) => {
          const rowKey = typeof row.price === "number" ? row.price : index;
          return (
            <TableRow className="border-0" key={rowKey}>
              <TableCell>{row.price}</TableCell>
              <TableCell className={cn("text-right", type === "bid" ? "text-bid" : "text-ask")}>{row.qty}</TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
