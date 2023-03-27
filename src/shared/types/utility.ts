import { Dayjs } from 'dayjs';
import { Store } from 'effector';

export type GetFilteredKeys<T, Type> = {
  [K in keyof T]: T[K] extends Type ? K : never;
}[keyof T];

export type WithFilteredKeys<T, Type> = Omit<
  T,
  Exclude<keyof T, GetFilteredKeys<T, Type>>
>;

export type ChildrenProp = {
  children?: React.ReactNode;
};

export type InferStoreValues<T> = {
  [key in keyof T]: T[key] extends Store<infer U> ? U : never;
};

export type LabelValue<T> = { label: string; value: T };

export type FormDate = Dayjs | null;
