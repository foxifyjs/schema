import * as Schema from "../src";

test("port", () => {
  const schema = {
    bar: Schema.number().port(),
    foo: Schema.number().port(),
  };

  const value = {
    bar: 80,
    foo: 100000,
  };

  const result = Schema.validate(schema, value);

  expect(result.errors).toEqual({ foo: ["Must be a valid port (0 - 65535)"] });
  expect(result.value).toEqual({ bar: 80, foo: 100000 });
});

test("integer", () => {
  const schema = {
    bar: Schema.number().integer(),
    foo: Schema.number().integer(),
  };

  const value = {
    bar: 1,
    foo: 1.5,
  };

  const result = Schema.validate(schema, value);

  expect(result.errors).toEqual({ foo: ["Must be an integer"] });
  expect(result.value).toEqual({ bar: 1, foo: 1.5 });
});

test("positive", () => {
  const schema = {
    bar: Schema.number().positive(),
    foo: Schema.number().positive(),
  };

  const value = {
    bar: 1,
    foo: -1,
  };

  const result = Schema.validate(schema, value);

  expect(result.errors).toEqual({ foo: ["Must be a positive number"] });
  expect(result.value).toEqual({ bar: 1, foo: -1 });
});

test("negative", () => {
  const schema = {
    bar: Schema.number().negative(),
    foo: Schema.number().negative(),
  };

  const value = {
    bar: -1,
    foo: 1,
  };

  const result = Schema.validate(schema, value);

  expect(result.errors).toEqual({ foo: ["Must be a negative number"] });
  expect(result.value).toEqual({ bar: -1, foo: 1 });
});

test("min", () => {
  const schema = {
    bar: Schema.number().min(1),
    foo: Schema.number().min(10.4),
  };

  const value = {
    bar: 1,
    foo: 5.8,
  };

  const result = Schema.validate(schema, value);

  expect(result.errors).toEqual({ foo: ["Must be at least 10.4"] });
  expect(result.value).toEqual({ bar: 1, foo: 5.8 });
});

test("max", () => {
  const schema = {
    bar: Schema.number().max(5),
    foo: Schema.number().max(10.4),
  };

  const value = {
    bar: 4.9,
    foo: 15,
  };

  const result = Schema.validate(schema, value);

  expect(result.errors).toEqual({ foo: ["Must be at most 10.4"] });
  expect(result.value).toEqual({ bar: 4.9, foo: 15 });
});

test("precision", () => {
  const schema = {
    bar: Schema.number().precision(1),
    foo: Schema.number().precision(2),
  };

  const value = {
    bar: 4,
    foo: 15.854,
  };

  const result = Schema.validate(schema, value);

  expect(result.errors).toEqual({
    foo: ["Must be have at most 2 decimal places"],
  });
  expect(result.value).toEqual({ bar: 4, foo: 15.854 });
});

test("multipliedBy", () => {
  const schema = {
    bar: Schema.number().multipliedBy(2),
    foo: Schema.number().multipliedBy(3),
    something: Schema.number(),
  };

  const value = {
    bar: 4,
    foo: 15.854,
    something: "else",
  };

  const result = Schema.validate(schema, value);

  expect(result.errors).toEqual({
    foo: ["Must be a multiple of 3"],
    something: ["Must be a number"],
  });
  expect(result.value).toEqual({ bar: 4, foo: 15.854, something: "else" });
});
