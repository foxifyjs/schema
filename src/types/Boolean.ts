import AnyType from "./Any";
import { MessageTemplate, Messages } from "../constants";

export default class BooleanType extends AnyType<boolean, boolean, Template> {
  public get messages(): Messages<Template> {
    return {
      ...super.messages,
      boolean: "Expected {{ label }} to be a boolean",
    };
  }

  protected initialValidator(value: unknown): boolean {
    if (typeof value === "boolean") return value;

    this.fail(this.render("boolean"));
  }
}

export interface Template extends MessageTemplate {
  boolean(): string;
}
