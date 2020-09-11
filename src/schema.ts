import {
  ArrayType,
  BooleanType,
  DateType,
  NumberType,
  ObjectType,
  StringType,
} from "./types";
import { SchemaType } from "./constants";

const SCHEMA = {
  array<T = unknown>(): SchemaType<ArrayType<T>> {
    return new ArrayType<T>() as SchemaType<ArrayType<T>>;
  },
  boolean(): SchemaType<BooleanType> {
    return new BooleanType() as SchemaType<BooleanType>;
  },
  date(): SchemaType<DateType> {
    return new DateType() as SchemaType<DateType>;
  },
  number(): SchemaType<NumberType> {
    return new NumberType() as SchemaType<NumberType>;
  },
  object<
    T extends Record<string, unknown> = Record<string, unknown>
  >(): SchemaType<ObjectType<T>> {
    return new ObjectType<T>() as SchemaType<ObjectType<T>>;
  },
  string(): SchemaType<StringType> {
    return new StringType() as SchemaType<StringType>;
  },
};

export default SCHEMA;
