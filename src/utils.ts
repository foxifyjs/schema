import { object, string } from "prototyped.js/es6/methods";
import Type from "./Any";

const { forEach, isPlainObject, reduce } = object;
const { isString } = string;

export * from "prototyped.js/es6/methods";

export const NULL = null;

export const enum TYPE {
  ANY = "ANY",
  ARRAY = "ARRAY",
  BOOLEAN = "BOOLEAN",
  DATE = "DATE",
  NUMBER = "NUMBER",
  OBJECT = "OBJECT",
  STRING = "STRING",
}

function reduceErrors<T = any>(
  errors: Type.ValidationResult<T>["errors"],
): Type.ValidationResult<T>["errors"] {
  return reduce(
    errors as any,
    (prev: any, error: any, key: string) => {
      if (error == null) return prev;

      if (prev == null) prev = {};

      if (isPlainObject(error)) {
        forEach(
          reduceErrors(error as any) as any,
          (subValue, subKey: string) => {
            prev[`${key}${/^\[/.test(subKey) ? "" : "."}${subKey}`] = subValue;
          },
        );
      } else {
        prev[key] = error;
      }

      return prev;
    },
    NULL,
  );
}

export function mergeErrors<T = any>(
  prev: Type.ValidationResult<T>["errors"],
  errors: Type.ValidationResult<T>["errors"],
): Type.ValidationResult<T>["errors"] {
  if (errors == null) return prev;

  if (isString(errors)) errors = [errors];

  if (prev == null) {
    if (Array.isArray(errors)) return errors;

    return reduceErrors(errors);
  }

  if (Array.isArray(errors)) {
    if (Array.isArray(prev)) {
      return prev.concat(errors);
    }

    (prev as any)[""] = errors;

    return prev;
  }

  errors = reduceErrors(errors);

  if (errors == null) return prev;

  if (Array.isArray(prev)) {
    return Object.assign({ "": prev }, errors);
  }

  return reduce(
    errors as any,
    (prev2, error, key) => {
      if (prev2[key] != null) return prev2[key].concat(error);

      prev2[key] = error;

      return prev2;
    },
    prev as any,
  );
}
