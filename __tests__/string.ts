import * as Schema from "../src";

test("token", () => {
  const schema = {
    bar: Schema.string().token(),
    foo: Schema.string().token(),
  };

  const value = {
    bar: "dfsASDdf43_",
    foo: "$asdasf498_",
  };

  const result = Schema.validate(schema, value);

  expect(result.errors).toEqual({
    foo: ["Expected to only contain a-z, A-Z, 0-9, and underscore (_)"],
  });
  expect(result.value).toEqual({ bar: "dfsASDdf43_", foo: "$asdasf498_" });
});

test("alphanum", () => {
  const schema = {
    bar: Schema.string().alphanum(),
    foo: Schema.string().alphanum(),
  };

  const value = {
    bar: "dfsdf43ASAD",
    foo: "$asdasf498_",
  };

  const result = Schema.validate(schema, value);

  expect(result.errors).toEqual({
    foo: ["Expected to only contain a-z, A-Z, 0-9"],
  });
  expect(result.value).toEqual({ bar: "dfsdf43ASAD", foo: "$asdasf498_" });
});

test("numeral", () => {
  const schema = {
    bar: Schema.string().numeral(),
    foo: Schema.string().numeral(),
  };

  const value = {
    bar: "65464",
    foo: "$asdasf498_",
  };

  const result = Schema.validate(schema, value);

  expect(result.errors).toEqual({
    foo: ["Expected to only contain numbers"],
  });
  expect(result.value).toEqual({ bar: "65464", foo: "$asdasf498_" });
});

test("ip", () => {
  const schema = {
    foo: Schema.string().ip(),
    googleIpv4: Schema.string().ip(),
    googleIpv6: Schema.string().ip(),
  };

  const value = {
    foo: "$asdasf498_",
    googleIpv4: "172.217.16.142",
    googleIpv6: "2a00:1450:4001:816::200e",
  };

  const result = Schema.validate(schema, value);

  expect(result.errors).toEqual({
    foo: ["Expected to be a valid ip address"],
  });
  expect(result.value).toEqual({
    foo: "$asdasf498_",
    googleIpv4: "172.217.16.142",
    googleIpv6: "2a00:1450:4001:816::200e",
  });
});

test("ipv4", () => {
  const schema = {
    foo: Schema.string().ip(4),
    google: Schema.string().ip(4),
  };

  const value = {
    foo: "2a00:1450:4001:816::200e",
    google: "172.217.16.142",
  };

  const result = Schema.validate(schema, value);

  expect(result.errors).toEqual({
    foo: ["Expected to be a valid ipv4 address"],
  });
  expect(result.value).toEqual({
    foo: "2a00:1450:4001:816::200e",
    google: "172.217.16.142",
  });
});

test("ipv6", () => {
  const schema = {
    foo: Schema.string().ip(6),
    google: Schema.string().ip(6),
  };

  const value = {
    foo: "172.217.16.142",
    google: "2a00:1450:4001:816::200e",
  };

  const result = Schema.validate(schema, value);

  expect(result.errors).toEqual({
    foo: ["Expected to be a valid ipv6 address"],
  });
  expect(result.value).toEqual({
    foo: "172.217.16.142",
    google: "2a00:1450:4001:816::200e",
  });
});

test("email", () => {
  const schema = {
    bar: Schema.string().email(),
    foo: Schema.string().email(),
  };

  const value = {
    bar: "ardalanamini22@gmail.com",
    foo: "gmail.com",
  };

  const result = Schema.validate(schema, value);

  expect(result.errors).toEqual({
    foo: ["Expected to be a valid email address"],
  });
  expect(result.value).toEqual({
    bar: "ardalanamini22@gmail.com",
    foo: "gmail.com",
  });
});

test("creditCard", () => {
  const schema = {
    bar: Schema.string().creditCard(),
    foo: Schema.string().creditCard(),
  };

  const value = {
    bar: "1111-2222-3333-4444",
    foo: "2342-3423-4234-2342",
  };

  const result = Schema.validate(schema, value);

  expect(result.errors).toEqual({
    foo: ["Expected to be a valid credit-card"],
  });
  expect(result.value).toEqual({
    bar: "1111-2222-3333-4444",
    foo: "2342-3423-4234-2342",
  });
});

test("min", () => {
  const schema = {
    bar: Schema.string().min(3),
    foo: Schema.string().min(5),
  };

  const value = {
    bar: "abc",
    foo: "abcd",
  };

  const result = Schema.validate(schema, value);

  expect(result.errors).toEqual({
    foo: ["Expected to have at least 5 character(s)"],
  });
  expect(result.value).toEqual(value);
});

test("max", () => {
  const schema = {
    bar: Schema.string().max(3),
    foo: Schema.string().max(5),
  };

  const value = {
    bar: "ab",
    foo: "abcdef",
  };

  const result = Schema.validate(schema, value);

  expect(result.errors).toEqual({
    foo: ["Expected to have at most 5 character(s)"],
  });
  expect(result.value).toEqual(value);
});

test("length", () => {
  const schema = {
    bar: Schema.string().length(3),
    foo: Schema.string().length(5),
  };

  const value = {
    bar: "abc",
    foo: "abcdef",
  };

  const result = Schema.validate(schema, value);

  expect(result.errors).toEqual({
    foo: ["Expected to have exactly 5 character(s)"],
  });
  expect(result.value).toEqual(value);
});

test("regex", () => {
  const schema = {
    bar: Schema.string().regex(/.*/),
    foo: Schema.string().regex(/\d/),
  };

  const value = {
    bar: "sddsfsdf234234545!@#!@#%$^",
    foo: "abcdef",
  };

  const result = Schema.validate(schema, value);

  expect(result.errors).toEqual({ foo: ["Expected to match /\\d/"] });
  expect(result.value).toEqual(value);
});

test("enum", () => {
  const schema = {
    bar: Schema.string().enum(["john", "doe"]),
    foo: Schema.string().enum(["john", "doe"]),
  };

  const value = {
    bar: "john",
    foo: "something else",
  };

  const result = Schema.validate(schema, value);

  expect(result.errors).toEqual({
    foo: ["Expected to be one of [\"john\",\"doe\"]"],
  });
  expect(result.value).toEqual(value);
});

test("truncate", () => {
  const schema = {
    bar: Schema.string().truncate(7),
    foo: Schema.string().truncate(7),
  };

  const value = {
    bar: "john",
    foo: "something",
  };

  const result = Schema.validate(schema, value);

  expect(result.errors).toBe(null);
  expect(result.value).toEqual({ bar: "john", foo: "some..." });
});

test("replace", () => {
  const schema = {
    bar: Schema.string().replace("john", "hello"),
    foo: Schema.string().replace(/something else/, "world"),
  };

  const value = {
    bar: "john",
    foo: "something",
  };

  const result = Schema.validate(schema, value);

  expect(result.errors).toBe(null);
  expect(result.value).toEqual({ bar: "hello", foo: "something" });
});
