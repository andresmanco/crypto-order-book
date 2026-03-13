import { memo } from "react";
import { Table, TableBody, TableCell, TableRow } from "../ui/table";

export const SpreadRow = memo(function SpreadRow({ spread }) {
  return (
    <Table>
      <TableBody className="w-full text-center items-center">
        <TableRow className="border border-gray-700 text-gray-300">
          <TableCell className="p-1">
            Spread:{" "}
            <span className="px-2 ">
              {typeof spread === "number" && !isNaN(spread) ? spread.toLocaleString("en-US") : "--.--"}
            </span>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
});
