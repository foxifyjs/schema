import Schema, { SchemaError } from "../../src";

test(".token", () => {
  expect.assertions(2);

  const schema = {
    bar: Schema.string().token(),
    foo: Schema.string().token(),
  };

  const value = {
    bar: "dfsASDdf43_",
    foo: "$asdasf498_",
  };

  try {
    Schema.object().keys(schema).validate(value);
  } catch (error) {
    expect(error).toBeInstanceOf(SchemaError);
    expect(error.details).toEqual({
      foo: "Expected foo to only contain a-z, A-Z, 0-9, underscore (_)",
    });
  }
});

test(".alphanum", () => {
  expect.assertions(2);

  const schema = {
    bar: Schema.string().alphanum(),
    foo: Schema.string().alphanum(),
  };

  const value = {
    bar: "dfsdf43ASAD",
    foo: "$asdasf498_",
  };

  try {
    Schema.object().keys(schema).validate(value);
  } catch (error) {
    expect(error).toBeInstanceOf(SchemaError);
    expect(error.details).toEqual({
      foo: "Expected foo to only contain a-z, A-Z, 0-9",
    });
  }
});

test(".numeral", () => {
  expect.assertions(2);

  const schema = {
    bar: Schema.string().numeral(),
    foo: Schema.string().numeral(),
  };

  const value = {
    bar: "65464",
    foo: "$asdasf498_",
  };

  try {
    Schema.object().keys(schema).validate(value);
  } catch (error) {
    expect(error).toBeInstanceOf(SchemaError);
    expect(error.details).toEqual({
      foo: "Expected foo to only contain numbers",
    });
  }
});

test(".ip", () => {
  expect.assertions(2);

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

  try {
    Schema.object().keys(schema).validate(value);
  } catch (error) {
    expect(error).toBeInstanceOf(SchemaError);
    expect(error.details).toEqual({
      foo: "Expected foo to be a valid ip address",
    });
  }
});

test(".ip(4)", () => {
  expect.assertions(2);

  const schema = {
    foo: Schema.string().ip(4),
    google: Schema.string().ip(4),
  };

  const value = {
    foo: "2a00:1450:4001:816::200e",
    google: "172.217.16.142",
  };

  try {
    Schema.object().keys(schema).validate(value);
  } catch (error) {
    expect(error).toBeInstanceOf(SchemaError);
    expect(error.details).toEqual({
      foo: "Expected foo to be a valid ipv4 address",
    });
  }
});

test(".ip(6)", () => {
  expect.assertions(2);

  const schema = {
    foo: Schema.string().ip(6),
    google: Schema.string().ip(6),
  };

  const value = {
    foo: "172.217.16.142",
    google: "2a00:1450:4001:816::200e",
  };

  try {
    Schema.object().keys(schema).validate(value);
  } catch (error) {
    expect(error).toBeInstanceOf(SchemaError);
    expect(error.details).toEqual({
      foo: "Expected foo to be a valid ipv6 address",
    });
  }
});

test(".email", () => {
  expect.assertions(2);

  const schema = {
    bar: Schema.string().email(),
    foo: Schema.string().email(),
  };

  const value = {
    bar: "ardalanamini22@gmail.com",
    foo: "gmail.com",
  };

  try {
    Schema.object().keys(schema).validate(value);
  } catch (error) {
    expect(error).toBeInstanceOf(SchemaError);
    expect(error.details).toEqual({
      foo: "Expected foo to be a valid email address",
    });
  }
});

test(".creditCard", () => {
  expect.assertions(2);

  const schema = {
    bar: Schema.string().creditCard(),
    foo: Schema.string().creditCard(),
  };

  const value = {
    bar: "1111-2222-3333-4444",
    foo: "2342-3423-4234-2342",
  };

  try {
    Schema.object().keys(schema).validate(value);
  } catch (error) {
    expect(error).toBeInstanceOf(SchemaError);
    expect(error.details).toEqual({
      foo: "Expected foo to be a valid credit-card",
    });
  }
});

test(".min", () => {
  expect.assertions(2);

  const schema = {
    bar: Schema.string().min(3),
    foo: Schema.string().min(5),
  };

  const value = {
    bar: "abc",
    foo: "abcd",
  };

  try {
    Schema.object().keys(schema).validate(value);
  } catch (error) {
    expect(error).toBeInstanceOf(SchemaError);
    expect(error.details).toEqual({
      foo: "Expected foo to contain at least 5 character(s)",
    });
  }
});

test(".max", () => {
  expect.assertions(2);

  const schema = {
    bar: Schema.string().max(3),
    foo: Schema.string().max(5),
  };

  const value = {
    bar: "ab",
    foo: "abcdef",
  };

  try {
    Schema.object().keys(schema).validate(value);
  } catch (error) {
    expect(error).toBeInstanceOf(SchemaError);
    expect(error.details).toEqual({
      foo: "Expected foo to contain at most 5 character(s)",
    });
  }
});

test(".length", () => {
  expect.assertions(2);

  const schema = {
    bar: Schema.string().length(3),
    foo: Schema.string().length(5),
  };

  const value = {
    bar: "abc",
    foo: "abcdef",
  };

  try {
    Schema.object().keys(schema).validate(value);
  } catch (error) {
    expect(error).toBeInstanceOf(SchemaError);
    expect(error.details).toEqual({
      foo: "Expected foo to contain exactly 5 character(s)",
    });
  }
});

test(".regex", () => {
  expect.assertions(2);

  const schema = {
    bar: Schema.string().regex(/.*/),
    foo: Schema.string().regex(/\d/),
  };

  const value = {
    bar: "sddsfsdf234234545!@#!@#%$^",
    foo: "abcdef",
  };

  try {
    Schema.object().keys(schema).validate(value);
  } catch (error) {
    expect(error).toBeInstanceOf(SchemaError);
    expect(error.details).toEqual({
      foo: "Expected foo to match /\\d/",
    });
  }
});

test(".enum", () => {
  expect.assertions(2);

  const schema = {
    bar: Schema.string().enum(["john", "doe"]),
    foo: Schema.string().enum(["john", "doe"]),
  };

  const value = {
    bar: "john",
    foo: "something else",
  };

  try {
    Schema.object().keys(schema).validate(value);
  } catch (error) {
    expect(error).toBeInstanceOf(SchemaError);
    expect(error.details).toEqual({
      foo: 'Expected foo to be one of ["john","doe"]',
    });
  }
});
