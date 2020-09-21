# Keys

Checks if all keys of the given object match the given object schema

```typescript
import Schema from "@foxify/schema";

const Validator = Schema.object().keys({
  foo: Schema.number().min(56).integer().required(),
  bar: Schema.boolean().default(false),
});
```

{% hint style="info" %}
If this method is used, then there can not be any unknown keys in the given object in the validate method
{% endhint %}

