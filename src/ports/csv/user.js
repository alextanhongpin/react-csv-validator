import Joi from "joi";
import CsvValidator from "./core";

export class UserCsvValidator extends CsvValidator {
  static SCHEMA = Joi.compile(
    Joi.object({
      name: Joi.string().alphanum().required(),
      age: Joi.number().min(13).max(200).required(),
      married: Joi.boolean(),
    })
  );

  static validateRow(row = {}, columns = {}) {
    const newRow = super.validateRow(row, columns);

    // Sometimes we want to be able to perform validation on multiple columns.
    const { married, age } = newRow;
    if (married && age < 17) {
      throw new Error("invalid legal married age");
    }
    console.log("validating row", newRow);
    return newRow;
  }
}
