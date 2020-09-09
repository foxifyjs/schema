import SchemaError, { ErrorDetails } from "../Error";

export default abstract class AnyType<T, I = T> {
  protected _pipeline: Validator<T>[] = [];

  protected _label?: string;

  public defaultValue: I | null = null;

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

  public default<V extends I>(value: V): ThisWithDefault<T, I, this, V> {
    this.defaultValue = value;

    return this as ThisWithDefault<T, I, this, V>;
  }

  public required<R extends boolean = true>(
    required: R = true as R,
  ): ThisWithRequired<T, I, this, R> {
    this.isRequired = required;

    return this as ThisWithRequired<T, I, this, R>;
  }

  public validate<V = this["defaultValue"]>(
    value: V = this.defaultValue as never,
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

export type Validator<T> = (value: T) => T;

export type ThisWithDefault<T, I, A extends AnyType<T, I>, V extends I> = A & {
  defaultValue: V;
};

export type ThisWithRequired<
  T,
  I,
  A extends AnyType<T, I>,
  R extends boolean
> = A & {
  isRequired: R;
};

export type Result<
  T,
  I,
  A extends AnyType<T, I>,
  V
> = A["isRequired"] extends true
  ? A["defaultValue"] extends I
    ? T
    : V extends null | undefined
    ? never
    : V extends I
    ? T
    : never
  : V extends I
  ? T
  : V extends null | undefined
  ? null
  : never;
