import { Readable } from 'node:stream';

export type TPrimitiv = string | number | boolean | null | undefined;

export interface IObject {
  [key: string | number | symbol]:
    | TPrimitiv
    | Date
    | TPrimitiv[]
    | IObject[]
    | Readable
    | IObject;
}
