export type IToken = { token: string };

export type Nullable<T> = T | null;
export type OmitNull<T> = T extends null ? never : T;

export type IEmpty = Record<string, any>;

export type TParameter<T extends any[]> = T[0];

export type TPromiseExecutor<T> = TParameter<
  ConstructorParameters<typeof Promise<T>>
>;
