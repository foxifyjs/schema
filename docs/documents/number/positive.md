---
description: Check if the value is positive or negative
---

# Positive

### Positive

Checks if the given number is a valid port number

```typescript
import Schema from "@foxify/schema";

const Validator = Schema.number().positive();
const Validator = Schema.number().positive(true); // same result
```

### Negative

Checks if the given number is a valid port number

```typescript
import Schema from "@foxify/schema";

const Validator = Schema.number().positive(false);
```

