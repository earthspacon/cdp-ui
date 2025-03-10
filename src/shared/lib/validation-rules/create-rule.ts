import { Rule } from 'effector-forms';
import { z } from 'zod';

export function createRule<V>({
  schema,
  name,
}: {
  schema: z.ZodType<V>;
  name: string;
}): Rule<V> {
  return {
    name,
    validator: (value) => {
      const parsedValue = schema.safeParse(value);
      if (parsedValue.success) {
        return { isValid: true };
      } else {
        return {
          isValid: false,
          errorText: parsedValue.error.issues[0].message,
        };
      }
    },
  };
}
