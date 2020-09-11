import AnyType from "./Any";

export default class BooleanType extends AnyType<boolean> {
  protected initialValidator(value: unknown): boolean {
    if (typeof value === "boolean") return value;

    const label = this._label;

    this.fail(
      label == null
        ? "Expected to be a boolean"
        : `Expected ${label} to be a boolean`,
    );
  }
}
