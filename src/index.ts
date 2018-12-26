import { size } from "prototyped.js/es6/object/methods";
import ArrayType from "./Array";
import BooleanType from "./Boolean";
import DateType from "./Date";
import NumberType from "./Number";
import ObjectType from "./Object";
import StringType from "./String";

namespace Schema { }

const Schema = {
  validate: <P extends object = object>(
    schema: object,
    value: object,
  ): { errors: object | null, value: P } => {
    schema = new ObjectType().keys(schema);

    const result = (schema as any)._validate("", value);

    let errors: { [key: string]: string[] } | null = result.errors;

    if (!size(errors as object)) errors = null;

    return { errors, value: result.value };
  },

  get array() {
    return new ArrayType();
  },
  get boolean() {
    return new BooleanType();
  },
  get date() {
    return new DateType();
  },
  get number() {
    return new NumberType();
  },
  get object() {
    return new ObjectType();
  },
  get string() {
    return new StringType();
  },
};

export = Schema;
