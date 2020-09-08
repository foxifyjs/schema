import * as Schema from "../src";

it("should have an error because of the required field", () => {
  const schema = Schema.object({
    foo: Schema.boolean().required(),
  });

  const value = {};

  const result = Schema.validate(schema, value);

  expect(result.errors).toEqual({ foo: ["Expected to be provided"] });
  expect(result.value).toEqual({});
});

it("should set the default value", () => {
  const schema = {
    foo: Schema.boolean().default(false),
  };

  const value = {};

  const result = Schema.validate(schema, value);

  expect(result.errors).toBe(null);
  expect(result.value).toEqual({ foo: false });
});

test("multiple checks", () => {
  const schema = {
    bar: Schema.boolean()
      .default(true)
      .required(),
    boolean1: Schema.boolean().required(),
    boolean2: Schema.boolean(),
    boolean3: Schema.boolean(),
    foo: Schema.boolean().default(false),
  };

  const value = {
    boolean3: "hello",
    something: "else",
  };

  const result = Schema.validate(schema, value);

  expect(result.errors).toEqual({
    boolean1: ["Expected to be provided"],
    boolean3: ["Expected to be a boolean"],
  });
  expect(result.value).toEqual({ bar: true, foo: false, boolean3: "hello" });
});
