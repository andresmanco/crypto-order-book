import { Button } from "../ui/button";
import { Table, TableBody, TableCell, TableRow } from "../ui/table";
import { INCREMENTS } from "../../constants";

export function AggregationControl({ increment, handleChange }) {
  return (
    <Table>
      <TableBody className="w-full text-center items-center">
        <TableRow className="border border-gray-700 text-gray-500">
          <TableCell className="p-1">
            <div className="flex flex-row items-center w-full">
              <div className="flex-1 flex justify-start">
                <Button className=" bg-gray-800 border-gray-400, m-1 text-gray-300 hover:bg-gray-600" variant="outline">
                  -
                </Button>
              </div>
              <div className="flex-none">
                <p className="text-gray-300">0.01</p>
              </div>
              <div className="flex-1 flex justify-end">
                <Button className=" bg-gray-800 border-gray-400 m-1 text-gray-300 hover:bg-gray-600 " variant="outline">
                  +
                </Button>
              </div>
            </div>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}
