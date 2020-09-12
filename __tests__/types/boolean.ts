import Schema, { SchemaError } from "../../src";

it("should fail when it's required and the value is missing", () => {
  expect.assertions(2);

  try {
    Schema.boolean().required().validate();
  } catch (error) {
    expect(error).toBeInstanceOf(SchemaError);
    expect(error.details).toEqual("Expected to have a value");
  }
});

it("should set the default value", () => {
  const result = Schema.boolean().default(false).validate();

  expect(result).toBe(false);
});

test("multiple validations", () => {
  expect.assertions(2);

  const schema = {
    bar: Schema.boolean().default(true).required(),
    boolean1: Schema.boolean().required(),
    boolean2: Schema.boolean(),
    boolean3: Schema.boolean(),
    foo: Schema.boolean().default(false),
  };

  const value = {
    boolean3: "hello",
    something: "else",
  };

  try {
    Schema.object().keys(schema).validate(value);
  } catch (error) {
    expect(error).toBeInstanceOf(SchemaError);
    expect(error.details).toEqual({
      boolean1: "Expected boolean1 to have a value",
      boolean3: "Expected boolean3 to be a boolean",
    });
  }
});
