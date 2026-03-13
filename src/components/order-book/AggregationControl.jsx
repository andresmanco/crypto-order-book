import { memo, useCallback } from "react";
import { Button } from "../ui/button";
import { Table, TableBody, TableCell, TableRow } from "../ui/table";
import { INCREMENTS } from "../../constants";

export const AggregationControl = memo(function AggregationControl({ increment, handleChange }) {
  const currentIndex = INCREMENTS.indexOf(increment);

  const handleDecrease = useCallback(() => {
    if (currentIndex > 0) {
      handleChange(INCREMENTS[currentIndex - 1]);
    }
  }, [currentIndex, handleChange]);

  const handleIncrease = useCallback(() => {
    if (currentIndex < INCREMENTS.length - 1) {
      handleChange(INCREMENTS[currentIndex + 1]);
    }
  }, [currentIndex, handleChange]);

  return (
    <Table>
      <TableBody className="w-full text-center items-center">
        <TableRow className="border border-gray-700 text-gray-300">
          <TableCell className="p-1">
            <div className="flex flex-row items-center w-full">
              <div className="flex-1 flex justify-start">
                <Button
                  disabled={currentIndex === 0}
                  onClick={handleDecrease}
                  className=" bg-gray-800 border-gray-400, m-1 text-gray-300 hover:bg-gray-600"
                  variant="outline"
                  aria-label="Decrease aggregation"
                >
                  -
                </Button>
              </div>
              <div className="flex-none">
                <p className="text-gray-300">{increment}</p>
              </div>
              <div className="flex-1 flex justify-end">
                <Button
                  disabled={currentIndex === INCREMENTS.length - 1}
                  onClick={handleIncrease}
                  className=" bg-gray-800 border-gray-400 m-1 text-gray-300 hover:bg-gray-600 "
                  variant="outline"
                  aria-label="Increase aggregation"
                >
                  +
                </Button>
              </div>
            </div>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
});
