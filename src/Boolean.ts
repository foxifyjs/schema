import { isBoolean } from "prototyped.js/es6/boolean/methods";
import AnyType from "./Any";

class BooleanType extends AnyType<boolean> {
  protected static type = "Boolean";

  protected _base(value: any) {
    if (isBoolean(value)) return null;

    return "Must be a boolean";
  }
}

export default BooleanType;
