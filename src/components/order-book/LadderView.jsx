import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { cn, formatPrice } from "../../lib/utils";

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
          const rowKey = typeof row.price === "number" ? `${type}-${formatPrice(row.price)}` : index;
          const price = typeof row.price === "number" ? formatPrice(row.price) : row.price; //---.--
          return (
            <TableRow className="border-0" key={rowKey}>
              <TableCell>{row.qty}</TableCell>
              <TableCell className={cn("text-right", type === "bid" ? "text-bid" : "text-ask")}>{price}</TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
