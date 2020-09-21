# Label

This method will set a label that can be used in validation error details and messages

```typescript
import Schema from "@foxify/schema";

const Validator = Schema.number().label("age");
```

{% hint style="warning" %}
Schema types array & object will override the given type labels in items & keys methods
{% endhint %}

