import AnyType from "./Any";
import ArrayType from "./Array";
import BooleanType from "./Boolean";
import DateType from "./Date";
import NumberType from "./Number";
import ObjectType from "./Object";
import StringType from "./String";

export function validate<T extends { [key: string]: AnyType } = any>(
  schema: T | ObjectType<T>,
  value: object,
) {
  if (!(schema instanceof ObjectType)) schema = object(schema);

  return (schema as ObjectType<T>).validate(value);
}

export function array<T = any>() {
  return new ArrayType<T>();
}

export function boolean() {
  return new BooleanType();
}

export function date() {
  return new DateType();
}

export function number() {
  return new NumberType();
}

export function object<T extends object = object>(obj?: T) {
  return new ObjectType<T>(obj);
}

export function string() {
  return new StringType();
}
