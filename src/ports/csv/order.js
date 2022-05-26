import Joi from "joi";
import CsvValidator from "./core";

export class OrderCsvValidator extends CsvValidator {
  static SCHEMA = Joi.compile(
    Joi.object({
      id: Joi.string().alphanum().required(),
      currency: Joi.string().valid("IDR", "SGD"),
      price: Joi.number().integer().min(1),
    }).and("currency", "price")
  );
}
