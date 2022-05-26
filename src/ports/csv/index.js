import CsvValidator from "./core";
import { AggregateError } from "ports/error";
import { UserCsvValidator } from "./user";
import { OrderCsvValidator } from "./order";

export { UserCsvValidator, OrderCsvValidator };

// Assumed that all parsed CSV fields are string.
const rows = [
  { age: "13", name: "john", married: "true" },
  { age: "1", name: "", married: "false" },
  {},
  { age: "non-legal-age" },
  { married: "yes" },
  { age: "non-legal-age", name: "", married: "yes" },
];

try {
  const result = UserCsvValidator.validate(rows);
  console.log("got result");
  console.table(result);
} catch (error) {
  if (error instanceof AggregateError) {
    console.log(
      `Found ${error.errors.length} error(s) out of ${rows.length} row(s)`
    );
    const pretty = error.errors.map((error) => error.toString());
    console.log(pretty);
  } else {
    console.log(error);
  }
}

// Assumed that all parsed CSV fields are string.
const orderRows = [
  {},
  { id: "order1", currency: "IDR" },
  { id: "order2", currency: "IDR", price: "100" },
  { id: "order3", currency: "IDR", price: "100.100" },
  { id: "order4", price: "100.0" },
];

try {
  const result = OrderCsvValidator.validate(orderRows);
  console.log("got result");
  console.table(result);
} catch (error) {
  if (error instanceof AggregateError) {
    console.log(
      `Found ${error.errors.length} error(s) out of ${orderRows.length} row(s)`
    );
    const pretty = error.errors.map((error) => error.toString());
    console.log(pretty);
  } else {
    console.log(error);
  }
}
