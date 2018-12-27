# API References <!-- omit in toc -->

TypeScript ready object schema validation

## Table of Content <!-- omit in toc -->

- [Schema Definition](#schema-definition)
  - [Basics](#basics)
    - [`.required`](#required)
    - [`.default(value: any)`](#defaultvalue-any)
  - [Array](#array)
    - [`.min(min: number)`](#minmin-number)
    - [`.max(max: number)`](#maxmax-number)
    - [`.length(length: number)`](#lengthlength-number)
    - [`.of(type: Schema Type)`](#oftype-schema-type)
  - [Boolean](#boolean)
  - [Date](#date)
    - [`.min(date: Date)`](#mindate-date)
    - [`.max(date: number)`](#maxdate-number)
  - [Number](#number)
    - [`.integer`](#integer)
    - [`.positive`](#positive)
    - [`.negative`](#negative)
    - [`.min(num: number)`](#minnum-number)
    - [`.max(num: number)`](#maxnum-number)
    - [`.precision(precision: number)`](#precisionprecision-number)
    - [`.multipliedBy(num: number)`](#multipliedbynum-number)
  - [Object](#object)
    - [`.keys(keys: object)`](#keyskeys-object)
  - [String](#string)
    - [`.token`](#token)
    - [`.alphanum`](#alphanum)
    - [`.numeral`](#numeral)
    - [`.ip`](#ip)
    - [`.ipv4`](#ipv4)
    - [`.ipv6`](#ipv6)
    - [`.email`](#email)
    - [`.creditCard`](#creditcard)
    - [`.min(length: number)`](#minlength-number)
    - [`.max(length: number)`](#maxlength-number)
    - [`.length(num: number)`](#lengthnum-number)
    - [`.regex(regex: RegExp)`](#regexregex-regexp)
    - [`.enum(enum: string[])`](#enumenum-string)
    - [`.truncate(length: number, truncateString: string = ".")`](#truncatelength-number-truncatestring-string--%22%22)
    - [`.replace(pattern: string | RegExp, replacement: string)`](#replacepattern-string--regexp-replacement-string)
- [Validation](#validation)

### Schema Definition

Define the schema to validate the desired value.

#### Basics

```typescript
import * as Schema from "@foxify/schema";
```

##### `.required`

Insures that the given value exists.

```typescript
const schema = {
  foo: Schema.boolean.required,
};
```

##### `.default(value: any)`

If the value doesn't exist, it will become the value.

> This method will be applied before required.

```typescript
const schema = {
  foo: Schema.boolean.default(false),
};
```

#### Array

Insures that the given value is an array

```typescript
const schema = {
  foo: Schema.array,
};
```

##### `.min(min: number)`

Insures that the given array contains at least `min` items

```typescript
const schema = {
  foo: Schema.array.min(2),
};
```

##### `.max(max: number)`

Insures that the given array contains at most `max` items

```typescript
const schema = {
  foo: Schema.array.max(2),
};
```

##### `.length(length: number)`

Insures that the given array contains exactly `length` items

```typescript
const schema = {
  foo: Schema.array.length(2),
};
```

##### `.of(type: Schema Type)`

Insures that the given array contains values of type "`type`"

```typescript
const schema = {
  foo: Schema.array.of(Schema.boolean),
};
```

#### Boolean

Insures that the given value is a boolean

> It will not cast truthy or falsey values to boolean

```typescript
const schema = {
  foo: Schema.boolean,
};
```

#### Date

Insures that the given value is a date

> It will cast string o number to date instance

```typescript
const schema = {
  foo: Schema.date,
};
```

##### `.min(date: Date)`

Insures that the given date is equal or after `date`

```typescript
const schema = {
  foo: Schema.date.min(Date.now),
  // foo: Schema.date.min(new Date()),
  // foo: Schema.date.min("2018-01-01 12:00:00"),
};
```

##### `.max(date: number)`

Insures that the given date is equal or before `date`

```typescript
const schema = {
  foo: Schema.date.max(Date.now),
  // foo: Schema.date.max(new Date()),
  // foo: Schema.date.max("2018-01-01 12:00:00"),
};
```

#### Number

Insures that the given value is a number

```typescript
const schema = {
  foo: Schema.number,
};
```

##### `.integer`

Insures that the given number is an integer

```typescript
const schema = {
  foo: Schema.number.integer,
};
```

##### `.positive`

Insures that the given number is a positive number

```typescript
const schema = {
  foo: Schema.number.positive,
};
```

##### `.negative`

Insures that the given number is a negative number

```typescript
const schema = {
  foo: Schema.number.negative,
};
```

##### `.min(num: number)`

Insures that the given number is `>= num`

```typescript
const schema = {
  foo: Schema.number.min(22),
};
```

##### `.max(num: number)`

Insures that the given number is `<= num`

```typescript
const schema = {
  foo: Schema.number.max(22),
};
```

##### `.precision(precision: number)`

Insures that the given number has at most `precision` decimal places

```typescript
const schema = {
  foo: Schema.number.precision(3),
};
```

##### `.multipliedBy(num: number)`

Insures that the given number is a multiple of `num`

```typescript
const schema = {
  foo: Schema.number.multipliedBy(3),
};
```

#### Object

Insures that the given value is an object

```typescript
const schema = {
  foo: Schema.object,
};
```

##### `.keys(keys: object)`

Insures that the given object matches the given `keys` which is another schema

```typescript
const schema = {
  foo: Schema.object.keys({
    bar: Schema.boolean.required,
  }).default({ bar: false }).required,
};
```

#### String

Insures that the given value is an string

```typescript
const schema = {
  foo: Schema.string,
};
```

##### `.token`

Insures that the given string only contains a-z, A-Z, 0-9, and underscore (_)

```typescript
const schema = {
  foo: Schema.string.token,
};
```

##### `.alphanum`

Insures that the given string only contains a-z, A-Z, 0-9

```typescript
const schema = {
  foo: Schema.string.alphanum,
};
```

##### `.numeral`

Insures that the given string only contains 0-9

```typescript
const schema = {
  foo: Schema.string.numeral,
};
```

##### `.ip`

Insures that the given string is an ipv4 or ipv6

```typescript
const schema = {
  foo: Schema.string.ip,
};
```

##### `.ipv4`

Insures that the given string is an ipv4

```typescript
const schema = {
  foo: Schema.string.ipv4,
};
```

##### `.ipv6`

Insures that the given string is an ipv6

```typescript
const schema = {
  foo: Schema.string.ipv6,
};
```

##### `.email`

Insures that the given string is an email address

```typescript
const schema = {
  foo: Schema.string.email,
};
```

##### `.creditCard`

Insures that the given string is a credit-card

```typescript
const schema = {
  foo: Schema.string.creditCard,
};
```

##### `.min(length: number)`

Insures that the given string contains at least `length` characters

```typescript
const schema = {
  foo: Schema.string.min(2),
};
```

##### `.max(length: number)`

Insures that the given string contains at most `length` characters

```typescript
const schema = {
  foo: Schema.string.max(2),
};
```

##### `.length(num: number)`

Insures that the given string contains exactly `num` characters

```typescript
const schema = {
  foo: Schema.string.length(2),
};
```

##### `.regex(regex: RegExp)`

Insures that the given string matches `regex`

```typescript
const schema = {
  foo: Schema.string.regex(/^Hello/),
};
```

##### `.enum(enum: string[])`

Insures that the given string is one of the given `enum` values

```typescript
const schema = {
  foo: Schema.string.enum(["Hello", "World"]),
};
```

##### `.truncate(length: number, truncateString: string = ".")`

Converts the given string to a truncated string with the given `length` and the `truncateString`

```typescript
const schema = {
  foo: Schema.string.truncate(8, "*"),
};
```

##### `.replace(pattern: string | RegExp, replacement: string)`

Replaces everything that matches `pattern` in the given string with the given `replacement`

```typescript
const schema = {
  foo: Schema.string.replace("Hello!", "Hello World!"),
};
```

### Validation

Validates the given value according to the given schema

```typescript
const result = Schema.validate(schema, value);
/*
 * {
 *   errors: { [path to the wrong value]: Array<error string> } | null,
 *   value: object,
 * }
 */
```