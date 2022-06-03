import { AggregateError } from "ports/error";
import { useEffect, useState } from "react";
import { CsvRowError } from "./error";

export function useCsv(validator, file) {
  const [result, setResult] = useState([]);
  const [error, setError] = useState();

  useEffect(() => {
    if (!file) return;

    async function parse() {
      // Clear previous errors.
      setResult([]);
      setError();

      try {
        const result = await validator.fromCSV(file);
        setResult(result);
      } catch (error) {
        if (error instanceof AggregateError) {
          const message = [
            `Found ${error.errors.length} error(s)`,
            ...error.errors.map((error) => error.toString()),
          ];
          setError(message.join("\r\n"));
          setResult(
            error.errors
              .filter((error) => error instanceof CsvRowError)
              .map((error) => ({
                row: error.row,
                ...error.data,
              }))
          );
        } else {
          setError(error.message);
        }
      }
    }
    parse();
  }, [validator, file]);

  return {
    error,
    result,
    header: validator.headerFromRow(result?.[0]),
  };
}
