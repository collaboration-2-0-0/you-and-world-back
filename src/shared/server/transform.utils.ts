/* eslint-disable indent */
/**
 * {              |  {
 *  KEY1: value1, |    KEY1: KEY1,
 *  KEY2: value2, |    KEY2: KEY2,
 * }              |  }
 */
export const getEnumFromMap = <
  T extends Record<string | number, unknown>,
  Q extends Record<keyof T, keyof T>,
>(
  map: T,
): Q =>
  Object.keys(map).reduce((obj, key) => {
    const value = Number.isNaN(+key) ? key : +key;
    Object.assign(obj, { [key]: value });
    return obj;
  }, {} as Q);

/**
 * {              |  {
 *  VALUE1: KEY1, |    KEY1: VALUE1,
 *  VALUE2: KEY2, |    KEY2: VALUE2,
 * }              |  }
 */
export const createEnumFromMap = <
  T extends Record<string | number, string | number>,
  Q extends Record<T[keyof T], keyof T>,
>(
  map: T,
): Q =>
  Object.keys(map).reduce((obj, key) => {
    const value = Number.isNaN(+key) ? key : +key;
    Object.assign(obj, { [map[key] as string | number]: value });
    return obj;
  }, {} as Q);

/**
 * [      |  {
 *  KEY1, |    KEY1: KEY1,
 *  KEY2, |    KEY2: KEY2,
 * ]      |  }
 */
export const createEnumFromArray = <
  T extends readonly (string | number)[],
  Q extends Record<T[number], T[number]>,
>(
  array: T,
): Q =>
  array.reduce((obj, key) => {
    const value = Number.isNaN(+key) ? key : +key;
    Object.assign(obj, { [key]: value });
    return obj;
  }, {} as Q);
