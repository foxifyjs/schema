import * as Schema from "../src";

test("keys", () => {
  const keys = {
    hello: Schema.string().default("world"),
    something: Schema.string().required(),
  };

  let schema: object;
  try {
    schema = {
      bar: keys,
      foo: Schema.object(keys),
      fooBar1: Schema.object({ something: 1 }).required(),
    };
  } catch (error) {
    expect(error.message).toBe(
      "Expected obj's values to be object or instance of AnyType",
    );
  }

  schema = {
    bar: keys,
    foo: Schema.object(keys),
    fooBar1: Schema.object(keys).required(),
  };

  const value = {
    bar: { something: "something" },
    foo: { hello: "there!" },
    fooBar1: "not an object",
  };

  const result = Schema.validate(schema, value);

  expect(result.errors).toEqual({
    "foo.something": ["Must be provided"],
    fooBar1: ["Must be an object"],
  });
  expect(result.value).toEqual({
    bar: { hello: "world", something: "something" },
    foo: { hello: "there!" },
    fooBar1: "not an object",
  });
});

test("min", () => {
  const schema = {
    foo: Schema.object().min(1),
    bar: Schema.object().min(1),
  };

  const value = {
    foo: {},
    bar: { something: "something" },
  };

  const result = Schema.validate(schema, value);

  expect(result.errors).toEqual({
    foo: ["Must have at least 1 key(s)"],
  });
  expect(result.value).toEqual({
    foo: {},
    bar: { something: "something" },
  });
});

test("max", () => {
  const schema = {
    foo: Schema.object().max(1),
    bar: Schema.object().max(1),
  };

  const value = {
    foo: { hello: "world", something: "something" },
    bar: {},
  };

  const result = Schema.validate(schema, value);

  expect(result.errors).toEqual({
    foo: ["Must have at most 1 key(s)"],
  });
  expect(result.value).toEqual({
    foo: { hello: "world", something: "something" },
    bar: {},
  });
});

test("length", () => {
  const schema = {
    foo: Schema.object().length(1),
    bar: Schema.object().length(1),
  };

  const value = {
    foo: { hello: "world", something: "something" },
    bar: { something: "something" },
  };

  const result = Schema.validate(schema, value);

  expect(result.errors).toEqual({
    foo: ["Must have exactly 1 key(s)"],
  });
  expect(result.value).toEqual({
    foo: { hello: "world", something: "something" },
    bar: { something: "something" },
  });
});
