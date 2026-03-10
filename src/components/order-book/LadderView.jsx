import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { cn } from "../../lib/utils";
const invoices = [
  {
    invoice: "INV001",
    paymentStatus: "Paid",
    totalAmount: "$250.00",
    paymentMethod: "Credit Card",
  },
  {
    invoice: "INV002",
    paymentStatus: "Pending",
    totalAmount: "$150.00",
    paymentMethod: "PayPal",
  },
  {
    invoice: "INV003",
    paymentStatus: "Unpaid",
    totalAmount: "$350.00",
    paymentMethod: "Bank Transfer",
  },
  {
    invoice: "INV004",
    paymentStatus: "Paid",
    totalAmount: "$450.00",
    paymentMethod: "Credit Card",
  },
  {
    invoice: "INV005",
    paymentStatus: "Paid",
    totalAmount: "$550.00",
    paymentMethod: "PayPal",
  },
  {
    invoice: "INV006",
    paymentStatus: "Pending",
    totalAmount: "$200.00",
    paymentMethod: "Bank Transfer",
  },
  {
    invoice: "INV007",
    paymentStatus: "Unpaid",
    totalAmount: "$300.00",
    paymentMethod: "Credit Card",
  },
];

export function LadderView({ type }) {
  return (
    <Table className="w-full">
      {type === "offer" && (
        <TableHeader>
          <TableRow className="border-0 p-0 m-0 h-auto ">
            <TableHead className="w-[100px] uppercase text-[10px] text-gray-500">Market Size</TableHead>
            <TableHead className="text-right uppercase text-[10px] text-gray-500">Price(USD)</TableHead>
          </TableRow>
        </TableHeader>
      )}
      <TableBody>
        {invoices.map((invoice) => (
          <TableRow className="border-0" key={invoice.invoice}>
            <TableCell>{invoice.totalAmount}</TableCell>
            <TableCell className={cn("text-right", type === "bid" ? "text-bid" : "text-offer")}>
              {invoice.invoice}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
