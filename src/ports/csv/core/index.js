import Papa from "papaparse";
import { CsvRowError } from "./error";
import { AggregateError } from "ports/error";
export { useCsv } from "./hook";

export { CsvRowError };

export default class CsvValidator {
  static HEADER_BY_FIELD = {};
  static MAX_ERRORS = 7;

  static headerFromRow(row) {
    if (row === null || row === undefined) return [];
    return Object.keys(row).map((col) => this.HEADER_BY_FIELD[col] ?? col);
  }

  static fieldByHeader() {
    const result = {};
    for (const [field, header] of Object.entries(this.HEADER_BY_FIELD)) {
      result[header] = field;
    }
    return result;
  }

  static parse(row) {
    return row;
  }

  static validate(row) {
    return row;
  }

  static toCSV(data = []) {
    return Papa.unparse(data);
  }

  static async fromCSV(file, options = {}) {
    return new Promise((resolve, reject) => {
      const result = [];
      const errors = [];
      let line = 0;

      const headers = this.fieldByHeader();

      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        transformHeader: (header) => headers[header] ?? header,
        step: (row, parser) => {
          line++;

          const data = this.parse(row.data);

          try {
            result.push(this.validate(data));
          } catch (error) {
            errors.push(new CsvRowError(line, data, { cause: error }));
            if (errors.length >= this.MAX_ERRORS) {
              parser.abort();
            }
          }
        },
        complete: () => {
          errors.length ? reject(new AggregateError(errors)) : resolve(result);
        },
        ...options,
      });
    });
  }
}
