import * as Schema from "../src";

test("keys", () => {
  const keys = {
    hello: Schema.string.default("world"),
    something: Schema.string.required,
  };

  let schema: object;
  try {
    schema = {
      bar: keys,
      foo: Schema.object.keys(keys),
      fooBar1: Schema.object.keys({ something: 1 }).required,
    };
  } catch (error) {
    expect(error.message)
      .toBe("'obj' must be an 'object' or 'AnyType' instance, got 'number' instead");
  }

  schema = {
    bar: keys,
    foo: Schema.object.keys(keys),
    fooBar1: Schema.object.keys(keys).required,
  };

  const value = {
    bar: { something: "something" },
    foo: { hello: "there!" },
    fooBar1: "not an object",
  };

  const result = Schema.validate(schema, value);

  expect(result.errors)
    .toEqual({ "foo.something": ["Must be provided"], fooBar1: ["Must be an object"] });
  expect(result.value).toEqual({
    bar: { hello: "world", something: "something" },
    foo: { hello: "there!" },
    fooBar1: "not an object",
  });
});
