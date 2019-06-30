import Base from "./Any";
import { boolean, TYPE } from "./utils";

const { isBoolean } = boolean;

class Type extends Base<boolean> {
  protected static type = TYPE.BOOLEAN;

  protected _base(value: any) {
    if (isBoolean(value)) return null;

    return "Must be a boolean";
  }
}

export default Type;
