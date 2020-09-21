# Validate

Validate any value by using this method which exists on all Schema types

```typescript
import Schema, { SchemaError } from "@foxify/schema";

Schema.number().validate(1); // returns 1

try {
  Schema.number().validate("not number"); // fails
} catch (error) {
  if (error instanceof SchemaError) {
    // validation error
  }
  
  // not validation error
}
```

