import * as assert from "assert";
import { isObject, mapValues, reduce } from "prototyped.js/es6/object/methods";
import { isEmpty } from "prototyped.js/es6/string/methods";
import AnyType from "./Any";

class ObjectType<T extends object = object> extends AnyType<T> {
  protected static type = "Object";

  protected _base(value: any) {
    if (isObject(value)) return null;

    return "Must be an object";
  }

  public keys(obj: T) {
    assert(isObject(obj), "'obj' must be an object");

    obj = mapValues(
      obj,
      (value) => {
        if (ObjectType.isType(value)) return value;

        if (isObject(value)) return new ObjectType().keys(value);

        throw new TypeError(
          `'obj' must be an 'object' or 'AnyType' instance, got '${typeof value}' instead`,
        );
      },
    ) as any;

    return this
      ._cast((value: any) => reduce(
        obj,
        (prev, validator, key) => {
          const val = validator._validate("", (value as any)[key]).value;

          if (val !== undefined) prev[key] = val;

          return prev;
        },
        {},
      ))
      ._test((value: any, path) => reduce(
        obj,
        (prev, validator, key) => Object.assign(
          {},
          prev,
          validator._validate(
            isEmpty(path) ? key : `${path}.${key}`,
            value[key],
          ).errors,
        ),
        {},
      ));
  }
}

export default ObjectType;
