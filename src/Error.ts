export type ErrorDetails<T> = T extends Array<infer U>
  ? string | { [index: number]: ErrorDetails<U> }
  : T extends Record<string, unknown>
  ? string | { [K in keyof T]?: ErrorDetails<T[K]> }
  : string;

export default class SchemaError<T> extends Error {
  constructor(public details: ErrorDetails<T>) {
    super("Schema validation failed.");
  }
}
