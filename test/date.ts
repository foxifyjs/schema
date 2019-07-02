import * as Schema from "../src";

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

it("should fail to cast boolean to date", () => {
  const schema = {
    foo: Schema.date(),
  };

  const value = {
    foo: true,
  };

  const result = Schema.validate(schema, value);

  expect(result.errors).toEqual({ foo: ["Expected to be a valid date"] });
  expect(result.value).toEqual({ foo: true });
});

it("should convert default value (number) to date", () => {
  const now = Date.now();

  const schema = {
    foo: Schema.date().default(now),
  };

  const value = {};

  const result = Schema.validate(schema, value);

  expect(result.errors).toBe(null);
  expect(result.value).toEqual({ foo: new Date(now) });
});

it("should convert default value (string) to date", () => {
  const date = "2018-12-26";

  const schema = {
    foo: Schema.date().default(date),
  };

  const value = {};

  const result = Schema.validate(schema, value);

  expect(result.errors).toBe(null);
  expect(result.value).toEqual({ foo: new Date(date) });
});

it("should convert default value returning number to date", () => {
  let now;

  const schema = {
    foo: Schema.date().default(() => {
      now = Date.now();

      return now;
    }),
  };

  const value = {};

  const result = Schema.validate(schema, value);

  expect(result.errors).toBe(null);
  expect(result.value).toEqual({ foo: new Date(now as any) });
});

it("should convert default value returning string to date", () => {
  const date = "2018-12-26";

  const schema = {
    foo: Schema.date().default(() => date),
  };

  const value = {};

  const result = Schema.validate(schema, value);

  expect(result.errors).toBe(null);
  expect(result.value).toEqual({ foo: new Date(date) });
});

it("should convert number to date", () => {
  const now = Date.now();

  const schema = {
    foo: Schema.date(),
  };

  const value = {
    foo: now,
  };

  const result = Schema.validate(schema, value);

  expect(result.errors).toBe(null);
  expect(result.value).toEqual({ foo: new Date(now) });
});

it("should convert string to date", () => {
  const schema = {
    foo: Schema.date(),
  };

  const date = "2018-12-26";

  const value = {
    foo: date,
  };

  const result = Schema.validate(schema, value);

  expect(result.errors).toBe(null);
  expect(result.value).toEqual({ foo: new Date(date) });
});

test("min", async () => {
  expect.assertions(5);

  const now = Date.now();

  await sleep(1000);

  const schema = {
    bar: Schema.date()
      .default(now)
      .min("2018-01-01"),
    foo: Schema.date().min(Date.now),
  };

  const value = {
    foo: now,
  };

  const result = Schema.validate(schema, value);

  expect(result.errors).toBeInstanceOf(Object);
  expect((result.errors as any).foo).toBeInstanceOf(Array);
  expect((result.errors as any).foo.length).toBe(1);
  expect(typeof (result.errors as any).foo[0]).toBe("string");
  expect(result.value).toEqual({ bar: new Date(now), foo: new Date(now) });
});

test("max", async () => {
  expect.assertions(5);

  const date = "2018-01-01";

  const schema = {
    bar: Schema.date()
      .default(date)
      .max(Date.now),
    foo: Schema.date().max(Date.now()),
  };

  await sleep(1000);

  const now = Date.now();

  const value = {
    foo: now,
  };

  const result = Schema.validate(schema, value);

  expect(result.errors).toBeInstanceOf(Object);
  expect((result.errors as any).foo).toBeInstanceOf(Array);
  expect((result.errors as any).foo.length).toBe(1);
  expect(typeof (result.errors as any).foo[0]).toBe("string");
  expect(result.value).toEqual({ bar: new Date(date), foo: new Date(now) });
});

test("complex", async () => {
  expect.assertions(7);

  const now = Date.now();

  await sleep(1000);

  const schema = {
    bar: Schema.date(),
    foo: Schema.date()
      .min(Date.now())
      .max("2018-01-01"),
  };

  const value = {
    bar: "hi there!",
    foo: now,
  };

  const result = Schema.validate(schema, value);

  expect(result.errors).toBeInstanceOf(Object);
  expect((result.errors as any).bar).toEqual(["Expected to be a valid date"]);
  expect((result.errors as any).foo).toBeInstanceOf(Array);
  expect((result.errors as any).foo.length).toBe(2);
  expect(typeof (result.errors as any).foo[0]).toBe("string");
  expect(typeof (result.errors as any).foo[1]).toBe("string");
  expect(result.value).toEqual({ bar: "hi there!", foo: new Date(now) });
});
