import { ValidationError } from "yup";

export class CsvRowError extends Error {
  constructor(row, data, options) {
    super("", options);
    this.name = this.constructor.name;
    this.row = row;
    this.data = data;
  }

  toString() {
    const error = this.cause;
    if (!error) {
      throw new Error(
        "CsvRowError: 'cause' cannot be empty: new CSVRowError(row, { cause: error })"
      );
    }

    if (error instanceof ValidationError) {
      const num = error.errors.length;
      const msg = error.errors.join(", ");
      const count = num === 1 ? "1 error" : `${num} errors`;
      return `row ${this.row} invalid, found ${count} - ${msg}`;
    }

    return `row ${this.row} invalid, ${error}`;
  }
}
