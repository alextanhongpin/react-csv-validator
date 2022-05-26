export class AggregateError extends Error {
  constructor(errors, options) {
    super("AggregateError", options);
    this.name = this.constructor.name;
    this.errors = errors;
  }
}
