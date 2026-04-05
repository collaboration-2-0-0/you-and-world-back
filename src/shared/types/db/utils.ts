export type OuterJoin<T> = { [key in keyof T]: T[key] | null };
