import Base from "./Any";
import { boolean, NULL, TYPE } from "./utils";

const { isBoolean } = boolean;

class Type extends Base<boolean> {
  protected static type = TYPE.BOOLEAN;

  protected _base(value: any) {
    if (isBoolean(value)) return NULL;

    return "Expected to be a boolean";
  }
}

export default Type;
