---
description: TypeScript ready object schema validation
---

# Getting Started

[![NPM Version](https://img.shields.io/npm/v/@foxify/schema.svg)](https://www.npmjs.com/package/@foxify/schema) [![TypeScript Version](https://img.shields.io/npm/types/@foxify/schema.svg)](https://www.typescriptlang.org) [![Tested With Jest](https://img.shields.io/badge/tested_with-jest-99424f.svg)](https://github.com/facebook/jest) [![Pull Requests](https://img.shields.io/badge/PRs-Welcome-brightgreen.svg)](https://github.com/foxifyjs/schema/pulls) [![License](https://img.shields.io/github/license/foxifyjs/schema.svg)](https://github.com/foxifyjs/schema/blob/master/LICENSE) [![Build Status](https://github.com/foxifyjs/schema/workflows/Test/badge.svg)](https://github.com/foxifyjs/odin/actions) [![Coverage Status](https://codecov.io/gh/foxifyjs/schema/branch/master/graph/badge.svg)](https://codecov.io/gh/foxifyjs/schema) [![Package Quality](http://npm.packagequality.com/shield/%40foxify%2Fschema.svg)](http://packagequality.com/#?package=@foxify/schema) [![Dependencies Status](https://david-dm.org/foxifyjs/schema.svg)](https://david-dm.org/foxifyjs/schema) [![NPM Total Downloads](https://img.shields.io/npm/dt/@foxify/schema.svg)](https://www.npmjs.com/package/@foxify/schema) [![NPM Monthly Downloads](https://img.shields.io/npm/dm/@foxify/schema.svg)](https://www.npmjs.com/package/@foxify/schema) [![Open Issues](https://img.shields.io/github/issues-raw/foxifyjs/schema.svg)](https://github.com/foxifyjs/schema/issues?q=is%3Aopen+is%3Aissue) [![Closed Issues](https://img.shields.io/github/issues-closed-raw/foxifyjs/schema.svg)](https://github.com/foxifyjs/schema/issues?q=is%3Aissue+is%3Aclosed) [![known vulnerabilities](https://snyk.io/test/github/foxifyjs/schema/badge.svg?targetFile=package.json)](https://snyk.io/test/github/foxifyjs/schema?targetFile=package.json) [![Github Stars](https://img.shields.io/github/stars/foxifyjs/schema.svg?style=social)](https://github.com/foxifyjs/schema) [![Github Forks](https://img.shields.io/github/forks/foxifyjs/schema.svg?style=social&label=Fork)](https://github.com/foxifyjs/schema)

### Installation

NPM:

```
npm i @foxify/schema
```

Yarn:

```bash
yarn add @foxify/schema
```

Github Packages:

```bash
npm i @foxifyjs/schema
```

### Usage

```typescript
import Schema from "@foxify/schema";

const schema = {
  username: Schema.string()
    .alphanum()
    .required(),
  name: Schema.object().keys({
    first: Schema.string()
      .min(3)
      .required(),
    last: Schema.string().min(3),
  }).required(),
  datetime: Schema.date().default(Date.now),
};

try {
  const result = Schema.object().keys(schema).validate(value);
} catch (error) {
  // your error handler
}
```

{% hint style="info" %}
For more details please read [the documents](documents/basics/).
{% endhint %}

### Sponsors

Support this project by becoming a sponsor. Your logo will show up here. \[[Become a sponsor](https://opencollective.com/foxify#sponsor)\]

[![Sponsors](https://opencollective.com/foxify/sponsors.svg?width=890)](https://opencollective.com/foxify#sponsors)

### Authors

* **Ardalan Amini** - _Core Maintainer_ - [@ardalanamini](https://github.com/ardalanamini)

See also the list of [contributors](https://github.com/foxifyjs/schema/contributors) who participated in this project.

### Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [releases](https://github.com/foxifyjs/schema/releases).

### License

This project is licensed under the MIT License - see the [LICENSE](https://github.com/foxifyjs/schema/blob/master/LICENSE) file for details

