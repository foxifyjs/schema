import ArrayType from "./Array";
import BooleanType from "./Boolean";
import DateType from "./Date";
import NumberType from "./Number";
import ObjectType from "./Object";
import StringType from "./String";

export = {
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
