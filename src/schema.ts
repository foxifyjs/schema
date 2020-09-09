import {
  ArrayType,
  BooleanType,
  DateType,
  NumberType,
  ObjectType,
  StringType,
} from "./types";

const SCHEMA = {
  array<T = unknown>(): ArrayType<T> {
    return new ArrayType<T>();
  },
  boolean(): BooleanType {
    return new BooleanType();
  },
  date(): DateType {
    return new DateType();
  },
  number(): NumberType {
    return new NumberType();
  },
  object<
    T extends Record<string, unknown> = Record<string, unknown>
  >(): ObjectType<T> {
    return new ObjectType<T>();
  },
  string(): StringType {
    return new StringType();
  },
};

export default SCHEMA;
