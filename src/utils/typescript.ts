/**
 * The ExaustiveMap helper is a utility type that guarantees that the map
 * has defined all the keys in the "Key" generic type.
 */
export type ExaustiveMap<
  Key extends string,
  TMap extends Record<Key, MapShape>,
  MapShape = unknown,
> = keyof TMap extends Key ? TMap : never;

/**
 * The Prettify helper is a utility type that takes an object type and makes
 * the hover overlay more readable.
 *
 * @link https://www.totaltypescript.com/concepts/the-prettify-helper
 */
export type Prettify<T> = {
  [K in keyof T]: T[K];
  // eslint-disable-next-line @typescript-eslint/ban-types
} & {};
