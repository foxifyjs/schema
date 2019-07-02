import * as Schema from "../src";

test("min", () => {
  const schema = {
    bar: Schema.array().min(2),
    foo: Schema.array().min(1),
  };

  const value = {
    bar: [1, 2],
    foo: [],
  };

  const result = Schema.validate(schema, value);

  expect(result.errors).toEqual({
    foo: ["Expected to contain at least 1 item(s)"],
  });
  expect(result.value).toEqual({ bar: [1, 2], foo: [] });
});

test("max", () => {
  const schema = {
    bar: Schema.array().max(2),
    foo: Schema.array().max(1),
  };

  const value = {
    bar: [1, 2],
    foo: [1, 2],
  };

  const result = Schema.validate(schema, value);

  expect(result.errors).toEqual({
    foo: ["Expected to contain at most 1 item(s)"],
  });
  expect(result.value).toEqual({ bar: [1, 2], foo: [1, 2] });
});

test("length", () => {
  const schema = {
    bar: Schema.array().length(3),
    foo: Schema.array().length(1),
  };

  const value = {
    bar: [1, 2, 3],
    foo: [1, 2],
  };

  const result = Schema.validate(schema, value);

  expect(result.errors).toEqual({
    foo: ["Expected to contain exactly 1 item(s)"],
  });
  expect(result.value).toEqual({ bar: [1, 2, 3], foo: [1, 2] });
});

test("items", () => {
  const schema = {
    bar: Schema.array().items(Schema.string()),
    foo: Schema.array().items(Schema.number()),
  };

  const value = {
    bar: [1],
    foo: [1, 2],
  };

  const result = Schema.validate(schema, value);

  expect(result.errors).toEqual({ "bar[0]": ["Expected to be an string"] });
  expect(result.value).toEqual({ bar: [1], foo: [1, 2] });
});

test("complex", () => {
  const schema = {
    array1: Schema.array(),
    bar: Schema.array()
      .min(1)
      .max(3)
      .default([1, 2]),
    foo: Schema.array().length(1),
  };

  const value = {
    array1: "not an array",
    foo: [1, 2],
  };

  const result = Schema.validate(schema, value);

  expect(result.errors).toEqual({
    array1: ["Expected to be an array"],
    foo: ["Expected to contain exactly 1 item(s)"],
  });
  expect(result.value).toEqual({
    array1: "not an array",
    bar: [1, 2],
    foo: [1, 2],
  });
});
