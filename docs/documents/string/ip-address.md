---
description: Check if the value is an IP address
---

# IP Address

### IPv4 & IPv6

Checks if the given string is an IP address regardless of version

```typescript
import Schema from "@foxify/schema";

const Validator = Schema.string().ip();
```

### IPv4

Checks if the given string is an IPv4 address

```typescript
import Schema from "@foxify/schema";

const Validator = Schema.string().ip(4);
```

### IPv6

Checks if the given string is an IPv6 address

```typescript
import Schema from "@foxify/schema";

const Validator = Schema.string().ip(6);
```

