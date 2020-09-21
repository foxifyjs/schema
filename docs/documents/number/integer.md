---
description: Check if the value is an integer or a floating-point
---

# Integer

### Integer

Checks if the given number is an integer

```typescript
import Schema from "@foxify/schema";

const Validator = Schema.number().integer();
const Validator = Schema.number().integer(true); // same result
```

### Floating Point

Checks if the given number is a floating-point

```typescript
import Schema from "@foxify/schema";

const Validator = Schema.number().integer(false);
```

