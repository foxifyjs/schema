import Schema, { SchemaError } from "../src";

it("should fail", () => {
  expect.assertions(2);

  try {
    Schema.number().validate("some string");
  } catch (error) {
    expect(error).toBeInstanceOf(SchemaError);
    expect(error.details).toEqual("Expected to be a valid number");
  }
});

it("should pass", () => {
  const result = Schema.number().validate(56);

  expect(result).toEqual(56);
});

describe(".port", () => {
  it("should fail", () => {
    expect.assertions(2);

    try {
      Schema.number().port().validate(100000);
    } catch (error) {
      expect(error).toBeInstanceOf(SchemaError);
      expect(error.details).toEqual("Expected to be a valid port (0 - 65535)");
    }
  });

  it("should pass", () => {
    const result = Schema.number().port().validate(80);

    expect(result).toEqual(80);
  });
});

describe(".integer", () => {
  it("should fail (integer)", () => {
    expect.assertions(2);

    try {
      Schema.number().integer().validate(1.5);
    } catch (error) {
      expect(error).toBeInstanceOf(SchemaError);
      expect(error.details).toEqual("Expected to be an integer");
    }
  });

  it("should fail (floating point)", () => {
    expect.assertions(2);

    try {
      Schema.number().integer(false).validate(1);
    } catch (error) {
      expect(error).toBeInstanceOf(SchemaError);
      expect(error.details).toEqual("Expected to be a floating point");
    }
  });

  it("should pass (integer)", () => {
    const result = Schema.number().integer().validate(22);

    expect(result).toEqual(22);
  });

  it("should pass (floating point)", () => {
    const result = Schema.number().integer(false).validate(22.22);

    expect(result).toEqual(22.22);
  });
});

describe(".positive", () => {
  it("should fail (positive)", () => {
    expect.assertions(2);

    try {
      Schema.number().positive().validate(-1);
    } catch (error) {
      expect(error).toBeInstanceOf(SchemaError);
      expect(error.details).toEqual("Expected to be a positive number");
    }
  });

  it("should fail (negative)", () => {
    expect.assertions(2);

    try {
      Schema.number().positive(false).validate(1);
    } catch (error) {
      expect(error).toBeInstanceOf(SchemaError);
      expect(error.details).toEqual("Expected to be a negative number");
    }
  });

  it("should pass (integer)", () => {
    const result = Schema.number().positive().validate(22);

    expect(result).toEqual(22);
  });

  it("should pass (negative)", () => {
    const result = Schema.number().positive(false).validate(-22);

    expect(result).toEqual(-22);
  });
});

describe(".max", () => {
  it("should fail", () => {
    expect.assertions(2);

    try {
      Schema.number().max(5).validate(10);
    } catch (error) {
      expect(error).toBeInstanceOf(SchemaError);
      expect(error.details).toEqual("Expected to be less than 5");
    }
  });

  it("should pass", () => {
    const result = Schema.number().max(5).validate(4);

    expect(result).toEqual(4);
  });
});

describe(".min", () => {
  it("should fail", () => {
    expect.assertions(2);

    try {
      Schema.number().min(5).validate(2);
    } catch (error) {
      expect(error).toBeInstanceOf(SchemaError);
      expect(error.details).toEqual("Expected to be greater than 5");
    }
  });

  it("should pass", () => {
    const result = Schema.number().min(5).validate(6);

    expect(result).toEqual(6);
  });
});

describe(".precision", () => {
  it("should fail", () => {
    expect.assertions(2);

    try {
      Schema.number().precision(2).validate(15.854);
    } catch (error) {
      expect(error).toBeInstanceOf(SchemaError);
      expect(error.details).toEqual(
        "Expected to have at most 2 decimal places",
      );
    }
  });

  it("should pass", () => {
    const result = Schema.number().precision(2).validate(15.85);

    expect(result).toEqual(15.85);
  });
});

describe(".multiple", () => {
  it("should fail", () => {
    expect.assertions(2);

    try {
      Schema.number().multiple(3).validate(15.854);
    } catch (error) {
      expect(error).toBeInstanceOf(SchemaError);
      expect(error.details).toEqual("Expected to be multiple of 3");
    }
  });

  it("should pass", () => {
    const result = Schema.number().multiple(3).validate(15);

    expect(result).toEqual(15);
  });
});
