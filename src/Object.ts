import * as assert from "assert";
import { isObject } from "prototyped.js/es6/object/methods";
import AnyType from "./Any";

class ObjectType extends AnyType<object> {
  protected static type = "Object";

  protected _base(value: any) {
    if (isObject(value)) return null;

    return "Must be an object";
  }

  // TODO: handle keys
  public keys(obj: object) {
    assert(isObject(obj), "'obj' must be an object");

    return this;
  }
}

export default ObjectType;
