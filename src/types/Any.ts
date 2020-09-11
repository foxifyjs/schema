import {
  Validator,
  DefaultType,
  DefaultValue,
  WithDefault,
  WithRequired,
  Result,
} from "../constants";
import SchemaError, { ErrorDetails } from "../Error";

export default abstract class AnyType<T, I = T> {
  protected _pipeline: Validator<T>[] = [];

  protected _label?: string;

  public getDefault: DefaultType<I> = () => null;

  public isRequired = false;

  constructor() {
    this.pipe(this.initialValidator.bind(this));
  }

  public label(label: string): this {
    this._label = label;

    return this;
  }

  public pipe(validator: Validator<T>): this {
    this._pipeline.push(validator);

    return this;
  }

  public default<V extends I>(
    value: V | (() => V),
  ): WithDefault<this, () => V> {
    if (typeof value === "function") this.getDefault = value as () => V;
    else this.getDefault = () => value;

    return this as WithDefault<this, () => V>;
  }

  public required<R extends boolean = true>(
    required: R = true as R,
  ): WithRequired<this, R> {
    this.isRequired = required;

    return this as WithRequired<this, R>;
  }

  public validate<V = DefaultValue<this>>(
    value: V = this.getDefault() as never,
  ): Result<T, I, this, V> {
    if (value == null) {
      if (this.isRequired) {
        const label = this._label;

        this.fail<string>(
          label == null
            ? "Expected to have a value"
            : `Expected ${label} to have a value`,
        );
      }

      return null as Result<T, I, this, V>;
    }

    return this._pipeline.reduce(
      (result: T, validator) => validator(result),
      value as never,
    ) as Result<T, I, this, V>;
  }

  protected fail<D = T>(details: ErrorDetails<D>): never {
    throw new SchemaError<D>(details);
  }

  protected abstract initialValidator(value: unknown): T;
}
