# Extend

Add new Schema types using the `extend` method

```typescript
import Schema from "@foxify/schema";

class NewType extends AnyType<boolean> {
  protected initialValidator(value: unknown): boolean {
    if (typeof value === "boolean") return value;

    this.fail("Expected to be a boolean");
  }
}

const NewSchema = Schema.extend("name", () => new NewType());

NewSchema.name().validate();
```

{% hint style="warning" %}
This method will return the extended Schema and will not affect the original Schema
{% endhint %}



