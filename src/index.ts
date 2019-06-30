import { size } from "prototyped.js/es6/object/methods";
import ArrayType from "./Array";
import BooleanType from "./Boolean";
import DateType from "./Date";
import NumberType from "./Number";
import ObjectType from "./Object";
import StringType from "./String";

export function validate<P extends object = object>(
  schema: object | ObjectType<P>,
  value: object,
): { errors: object | null; value: P } {
  if (!(schema instanceof ObjectType)) schema = object(schema);

  const result = (schema as any)._validate("", value);

  let errors: { [key: string]: string[] } | null = result.errors;

  if (!size(errors as object)) errors = null;

  return { errors, value: result.value };
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
