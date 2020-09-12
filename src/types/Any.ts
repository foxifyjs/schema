import {
  MessageTemplate,
  Messages,
  Validator,
  DefaultType,
  DefaultValue,
  WithDefault,
  WithRequired,
  Result,
  MessageArgs,
} from "../constants";
import SchemaError, { ErrorDetails } from "../Error";

export default abstract class AnyType<
  T,
  I = T,
  M extends MessageTemplate = MessageTemplate
> {
  protected _pipeline: Validator<T>[] = [];

  protected _label?: string;

  public getDefault: DefaultType<I> = () => null;

  public isRequired = false;

  public get messages(): Messages<M> {
    return {
      required: "Expected {{ label }} to have a value",
    } as Messages<M>;
  }

  public constructor() {
    this.pipe(this.initialValidator);
  }

  public label(label: string): this {
    this._label = label;

    return this;
  }

  public pipe(...validators: Validator<T>[]): this {
    this._pipeline = this._pipeline.concat(validators);

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
      if (this.isRequired) this.fail<string>(this.render("required"));

      return null as Result<T, I, this, V>;
    }

    return this._pipeline.reduce(
      (result: T, validator) => validator.call(this, result),
      value as never,
    ) as Result<T, I, this, V>;
  }

  protected render<Message extends keyof Messages<M>>(
    message: Message,
    params: MessageArgs<M[Message]> = {} as never,
  ): string {
    const label = this._label;
    const template = this.messages[message].replace(
      /{{ *label *}} ?/g,
      label == null ? "" : `${label} `,
    );

    return Object.keys(params).reduce(
      (prev, key) =>
        prev.replace(new RegExp(`{{ *${key} *}}`, "g"), params[key] as string),
      template,
    );
  }

  protected fail<D = T>(details: ErrorDetails<D>): never {
    throw new SchemaError<D>(details);
  }

  protected abstract initialValidator(value: unknown): T;
}
