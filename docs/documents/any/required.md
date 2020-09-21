---
description: Mark the value as required
---

# Required

### Make required

Checks if the given value is not `null` or `undefined`

```typescript
import Schema from "@foxify/schema";

const Validator = Schema.number().required();
const Validator = Schema.number().required(true); // same result

// All these cases fail just because it's required
Validator.validate(); // defaults to the default value which is null by default!
Validator.validate(null);
Validator.validate(undefined);
```

### Override

Change an already required validator into a non-required one

```typescript
import Schema from "@foxify/schema";

let Validator = Schema.number().required();

Validator = Validator.required(false); // make it not required again

// All these cases will succeed and return null
// Just because it's not required anymore
Validator.validate();
Validator.validate(null);
Validator.validate(undefined);
```

