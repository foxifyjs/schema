import Schema, { SchemaError } from "../../src";

test(".keys", () => {
  const keys = {
    hello: Schema.string().default("world"),
    something: Schema.string().required(),
  };

  const schema = {
    foo: Schema.object().keys(keys),
    bar: Schema.object().keys(keys).required(),
  };

  const value = {
    foo: { hello: "there!" },
    bar: "not an object",
  };

  try {
    Schema.object().keys(schema).validate(value);
  } catch (error) {
    expect(error).toBeInstanceOf(SchemaError);
    expect(error.details).toEqual({
      foo: {
        something: "Expected something to have a value",
      },
      bar: "Expected bar to be an object",
    });
  }
});

test(".length", () => {
  expect.assertions(2);

  const schema = {
    foo: Schema.object().length(1),
    bar: Schema.object().length(1),
  };

  const value = {
    foo: { hello: "world", something: "something" },
    bar: { something: "something" },
  };

  try {
    Schema.object().keys(schema).validate(value);
  } catch (error) {
    expect(error).toBeInstanceOf(SchemaError);
    expect(error.details).toEqual({
      foo: "Expected foo to contain exactly 1 key(s)",
    });
  }
});

test(".max", () => {
  const schema = {
    foo: Schema.object().max(1),
    bar: Schema.object().max(1),
  };

  const value = {
    foo: { hello: "world", something: "something" },
    bar: {},
  };

  try {
    Schema.object().keys(schema).validate(value);
  } catch (error) {
    expect(error).toBeInstanceOf(SchemaError);
    expect(error.details).toEqual({
      foo: "Expected foo to contain at most 1 key(s)",
    });
  }
});

test(".min", () => {
  const schema = {
    foo: Schema.object().min(1),
    bar: Schema.object().min(1),
  };

  const value = {
    foo: {},
    bar: { something: "something" },
  };

  try {
    Schema.object().keys(schema).validate(value);
  } catch (error) {
    expect(error).toBeInstanceOf(SchemaError);
    expect(error.details).toEqual({
      foo: "Expected foo to contain at least 1 key(s)",
    });
  }
});
