# Default

This method will set a default value that will be used when you pass `null` or `undefined` or even when you don't pass any value to the `validate` method 

```typescript
import Schema from "@foxify/schema";

const Validator = Schema.number().default(0);

// All these cases will return 0
Validator.validate();
Validator.validate(null);
Validator.validate(undefined);
```

{% hint style="info" %}
Once the default value is set, there's no use to make the validator required anymore
{% endhint %}

{% hint style="warning" %}
The default value must match all the validation rules as it's treated as a normal value
{% endhint %}



