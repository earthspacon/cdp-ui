import { Rule } from 'effector-forms';
import { z } from 'zod';

export function createRule<V>({
  schema,
  name,
}: {
  schema: z.Schema<V>;
  name: string;
}): Rule<V> {
  return {
    name,
    validator: (value) => {
      const parsedValue = schema.safeParse(value);
      if (parsedValue.success) {
        return {
          isValid: true,
          value: parsedValue.data,
        };
      } else {
        return {
          isValid: false,
          value: value,
          errorText: parsedValue.error.issues[0].message,
        };
      }
    },
  };
}
