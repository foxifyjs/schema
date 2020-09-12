import AnyType from "./Any";
import { MessageTemplate, Messages } from "../constants";

export default class NumberType extends AnyType<number, number, Template> {
  public get messages(): Messages<Template> {
    return {
      ...super.messages,
      number: "Expected {{ label }} to be a valid number",
      integer: "Expected {{ label }} to be an integer",
      float: "Expected {{ label }} to be a floating point",
      max: "Expected {{ label }} to be less than {{ max }}",
      min: "Expected {{ label }} to be greater than {{ min }}",
      multiple: "Expected {{ label }} to be multiple of {{ multiplier }}",
      port: "Expected {{ label }} to be a valid port (0 - 65535)",
      positive: "Expected {{ label }} to be a positive number",
      negative: "Expected {{ label }} to be a negative number",
      precision:
        "Expected {{ label }} to have at most {{ precision }} decimal places",
    };
  }

  public integer(integer = true): this {
    if (integer) {
      return this.pipe((value) => {
        if (Number.isInteger(value)) return value;

        this.fail(this.render("integer"));
      });
    }

    return this.pipe((value) => {
      if (!Number.isInteger(value)) return value;

      this.fail(this.render("float"));
    });
  }

  public max(max: number): this {
    return this.pipe((value) => {
      if (value <= max) return value;

      this.fail(this.render("max", { max }));
    });
  }

  public min(min: number): this {
    return this.pipe((value) => {
      if (value >= min) return value;

      this.fail(this.render("min", { min }));
    });
  }

  public multiple(multiplier: number): this {
    return this.pipe((value) => {
      if (value % multiplier === 0) return value;

      this.fail(this.render("multiple", { multiplier }));
    });
  }

  public port(): this {
    return this.pipe((value) => {
      if (value >= 0 && value <= 65535) return value;

      this.fail(this.render("port"));
    });
  }

  public positive(positive = true): this {
    if (positive) {
      return this.pipe((value) => {
        if (value >= 0) return value;

        this.fail(this.render("positive"));
      });
    }

    return this.pipe((value) => {
      if (value < 0) return value;

      this.fail(this.render("negative"));
    });
  }

  public precision(precision: number): this {
    return this.pipe((value) => {
      if ((`${value}`.split(".")[1] || "").length <= precision) return value;

      this.fail(this.render("precision", { precision }));
    });
  }

  protected initialValidator(value: unknown): number {
    if (typeof value === "number") return value;

    this.fail(this.render("number"));
  }
}

export interface Template extends MessageTemplate {
  number(): string;

  integer(): string;

  float(): string;

  max(params: { max: number }): string;

  min(params: { min: number }): string;

  multiple(params: { multiplier: number }): string;

  port(): string;

  positive(): string;

  negative(): string;

  precision(params: { precision: number }): string;
}
