import Papa from "papaparse";
import Joi from "joi";
import { CsvRowError } from "./error";
import { AggregateError } from "ports/error";

export { CsvRowError };

export default class CsvValidator {
  static HEADER_BY_FIELD = {};
  static MAX_ERRORS = 7;
  static SCHEMA = Joi.any();

  static headerFromRow(row) {
    if (row === null || row === undefined) return [];
    return Object.keys(row).map((col) => this.HEADER_BY_FIELD[col] ?? col);
  }

  static validateBody(rows = []) {
    const result = [];
    const errors = [];

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];

      try {
        result.push(this.validateRow(row));
      } catch (error) {
        errors.push(new CsvRowError(i + 1, { cause: error }));
        if (errors.length >= this.MAX_ERRORS) {
          break;
        }
      }
    }

    if (errors.length) {
      throw new AggregateError(errors);
    }

    return result;
  }

  static validateRow(row = {}) {
    const { value, error } = this.SCHEMA.validate(row, { abortEarly: false });
    if (error) {
      throw error;
    }

    return value;
  }

  static validate(data = []) {
    if (!data.length) {
      return [];
    }

    return this.validateBody(data);
  }

  static parse(row) {
    return row;
  }

  static toCSV(data = []) {
    return Papa.unparse(data);
  }

  static fieldByHeader() {
    const result = {};
    for (const [field, header] of Object.entries(this.HEADER_BY_FIELD)) {
      result[header] = field;
    }
    return result;
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
        transformHeader: (header) => {
          return headers[header] ?? header;
        },
        step: (row, parser) => {
          line++;

          const data = this.parse(row.data);

          try {
            result.push(this.validateRow(data));
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
