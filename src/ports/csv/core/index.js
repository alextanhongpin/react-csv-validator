import { CsvRowError } from "./error";
import { AggregateError } from "ports/error";
import Joi from "joi";

export default class CsvValidator {
  static HEADER_BY_FIELD = {};
  static MAX_ERRORS = 7;
  static SCHEMA = Joi.any();

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

  toCSV(data = []) {
    throw new Error("not implemented");
  }

  fromCSV(data = "") {
    throw new Error("not implemented");
  }
}
