import { Readable } from 'node:stream';

export type TPrimitiv = string | number | boolean | null;

export interface IObject {
  [key: string | number | symbol]:
    | TPrimitiv
    | IObject
    | Date
    | TPrimitiv[]
    | IObject[]
    | Readable;
}
