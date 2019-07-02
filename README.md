# schema <!-- omit in toc -->

TypeScript ready object schema validation

[![NPM Version](https://img.shields.io/npm/v/@foxify/schema.svg)](https://www.npmjs.com/package/@foxify/schema)
[![TypeScript Version](https://img.shields.io/npm/types/@foxify/schema.svg)](https://www.typescriptlang.org)
[![Tested With Jest](https://img.shields.io/badge/tested_with-jest-99424f.svg)](https://github.com/facebook/jest)
[![Pull Requests](https://img.shields.io/badge/PRs-Welcome-brightgreen.svg)](https://github.com/foxifyjs/schema/pulls)
[![License](https://img.shields.io/github/license/foxifyjs/schema.svg)](https://github.com/foxifyjs/schema/blob/master/LICENSE)
[![Build Status](https://api.travis-ci.com/foxifyjs/schema.svg?branch=master)](https://travis-ci.com/foxifyjs/schema)
[![Coverage Status](https://codecov.io/gh/foxifyjs/schema/branch/master/graph/badge.svg)](https://codecov.io/gh/foxifyjs/schema)
[![Package Quality](http://npm.packagequality.com/shield/%40foxify%2Fschema.svg)](http://packagequality.com/#?package=@foxify/schema)
[![Dependencies Status](https://david-dm.org/foxifyjs/schema.svg)](https://david-dm.org/foxifyjs/schema)
[![NPM Total Downloads](https://img.shields.io/npm/dt/@foxify/schema.svg)](https://www.npmjs.com/package/@foxify/schema)
[![NPM Monthly Downloads](https://img.shields.io/npm/dm/@foxify/schema.svg)](https://www.npmjs.com/package/@foxify/schema)
[![Open Issues](https://img.shields.io/github/issues-raw/foxifyjs/schema.svg)](https://github.com/foxifyjs/schema/issues?q=is%3Aopen+is%3Aissue)
[![Closed Issues](https://img.shields.io/github/issues-closed-raw/foxifyjs/schema.svg)](https://github.com/foxifyjs/schema/issues?q=is%3Aissue+is%3Aclosed)
[![known vulnerabilities](https://snyk.io/test/github/foxifyjs/schema/badge.svg?targetFile=package.json)](https://snyk.io/test/github/foxifyjs/schema?targetFile=package.json)
[![Github Stars](https://img.shields.io/github/stars/foxifyjs/schema.svg?style=social)](https://github.com/foxifyjs/schema)
[![Github Forks](https://img.shields.io/github/forks/foxifyjs/schema.svg?style=social&label=Fork)](https://github.com/foxifyjs/schema)

## Table of Content <!-- omit in toc -->

- [Getting Started](#Getting-Started)
  - [Prerequisites](#Prerequisites)
  - [Installation](#Installation)
  - [Usage](#Usage)
- [Versioning](#Versioning)
- [Authors](#Authors)
- [License](#License)
- [Support](#Support)

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/en/download).

### Installation

```bash
npm i -s @foxify/schema
```

### Usage

```javascript
const Schema = require("@foxify/schema");

const schema = {
  username: Schema.string()
    .alphanum()
    .required(),
  name: {
    first: Schema.string()
      .min(3)
      .required(),
    last: Schema.string().min(3),
  }, // since "name" has a required field, "name" itself would become required too
  datetime: Schema.date().default(Date.now),
};

Schema.validate(schema, value);
// returns -> { errors, value }
// error -> null : you're good to go
// error -> { [path: string]: string[] } : you have a problem
```

> for more details see [the documents](https://schema.js.org)

## Versioning

We use [SemVer](http://semver.org) for versioning. For the versions available, see the [tags on this repository](https://github.com/foxifyjs/schema/tags).

## Authors

- **Ardalan Amini** - _Core Maintainer_ - [@ardalanamini](https://github.com/ardalanamini)

See also the list of [contributors](https://github.com/foxifyjs/schema/contributors) who participated in this project.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details

## Support

If my work helps you, please consider

[![Buy Me A Coffee](https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png)](https://www.buymeacoffee.com/ardalanamini)
[![Become A Patron](https://c5.patreon.com/external/logo/become_a_patron_button.png)](https://www.patreon.com/ardalanamini)
