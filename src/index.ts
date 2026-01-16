/**
 * Type helper to check if a function has no parameters
 */
type HasNoParams<T> = T extends () => any ? true : false;

/**
 * Type helper to extract the parameter type from a function
 */
type ParamsOf<T> = T extends (params: infer P) => any
  ? P
  : T extends () => any
  ? Record<string, never>
  : never;

/**
 * Type helper to create function signature with optional params when Record<string, never>
 * Functions with no parameters can be called with 0 args or with an empty object
 */
type FunctionWithParams<P, R, T> = HasNoParams<T> extends true
  ? (() => R) & ((params?: Record<string, never>) => R)
  : P extends Record<string, never>
  ? (params?: P) => R
  : (params: P) => R;

/**
 * Type helper to extract the return type from a function
 */
type ReturnOf<T> = T extends (...args: any[]) => infer R ? R : never;

/**
 * Type helper to get the key array type from a function or array
 */
type KeyArray<T> = T extends (...args: any[]) => infer R
  ? R extends readonly (infer K)[]
    ? K[]
    : never
  : T extends readonly (infer K)[]
  ? K[]
  : never;

/**
 * Check if a type is an array
 */
type IsArray<T> = T extends readonly (infer _)[] ? true : false;

/**
 * Get the function type for a specific key in the schema
 */
type GetKeyFunction<
  T,
  K extends string,
  BaseKey extends string,
  Path extends readonly string[] = []
> = K extends keyof T
  ? T[K] extends (...args: any[]) => any
    ? FunctionWithParams<
        ParamsOf<T[K]>,
        [...Path, BaseKey, K, ...KeyArray<ReturnOf<T[K]>>],
        T[K]
      >
    : IsArray<T[K]> extends true
    ? (
        params?: Record<string, never>
      ) => [...Path, BaseKey, K, ...KeyArray<T[K]>]
    : T[K] extends Record<string, any>
    ? KeyFactory<T[K], BaseKey, [...Path, BaseKey, K]> & {
        (): [...Path, BaseKey, K];
      }
    : never
  : never;

/**
 * Union of all string keys in a type
 */
type StringKeys<T> = Extract<keyof T, string>;

/**
 * Union of all function types for bracket notation access
 */
type BracketAccess<
  T,
  BaseKey extends string,
  Path extends readonly string[] = []
> = {
  [K in StringKeys<T>]: GetKeyFunction<T, K, BaseKey, Path>;
}[StringKeys<T>];

/**
 * Recursive type to transform the input schema into the output factory type
 */
type KeyFactory<
  T,
  BaseKey extends string,
  Path extends readonly string[] = []
> = {
  [K in keyof T]: T[K] extends (...args: any[]) => any
    ? FunctionWithParams<
        ParamsOf<T[K]>,
        [...Path, BaseKey, K & string, ...KeyArray<ReturnOf<T[K]>>],
        T[K]
      >
    : IsArray<T[K]> extends true
    ? (
        params?: Record<string, never>
      ) => [...Path, BaseKey, K & string, ...KeyArray<T[K]>]
    : T[K] extends Record<string, any>
    ? KeyFactory<T[K], BaseKey, [...Path, BaseKey, K & string]> & {
        (): [...Path, BaseKey, K & string];
      }
    : never;
} & {
  // Support bracket notation with proper types for string keys in the schema
  // This allows keys["key-1"] to have the correct type
  [K in StringKeys<T>]: GetKeyFunction<T, K, BaseKey, Path>;
} & {
  // Allow access to any nested key (for runtime support of direct access)
  // This is needed for nested keys that can be accessed directly
  // For bracket notation with known keys, the mapped type above takes precedence
  // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
  [key: string]: BracketAccess<T, BaseKey, Path> | any;
};

/**
 * Creates a type-safe key factory for react-query keys
 *
 * @param baseKey - The base key that will be prepended to all generated keys
 * @param schema - An object defining the key structure with nested objects and functions
 * @returns A factory object where each level can be accessed as a function
 *
 * @example
 * ```typescript
 * const keys = createKeyFactory("baseKey", {
 *   a: (params: {}) => ["key1", "key2"],
 *   b: {
 *     c: ["key3", "key4"]
 *   }
 * });
 *
 * keys.a({}) // => ["baseKey", "a", "key1", "key2"]
 * keys.b.c({}) // => ["baseKey", "b", "c", "key3", "key4"]
 * keys.b() // => ["baseKey", "b"]
 * ```
 */
export function createKeyFactory<
  BaseKey extends string,
  Schema extends Record<string, any>
>(baseKey: BaseKey, schema: Schema): KeyFactory<Schema, BaseKey> {
  function createFactory(
    currentSchema: any,
    currentBaseKey: string,
    currentPath: string[] = []
  ): any {
    const factory: any = {};

    // Add a function to get the current path
    factory.__call = () => [...currentPath, currentBaseKey];

    for (const key in currentSchema) {
      const value = currentSchema[key];

      if (typeof value === "function") {
        // It's a function that returns keys
        factory[key] = (params?: any) => {
          const keys = value(params);
          return [...currentPath, currentBaseKey, key, ...keys];
        };
      } else if (
        typeof value === "object" &&
        value !== null &&
        !Array.isArray(value)
      ) {
        // It's a nested object
        const nestedFactory = createFactory(value, key, [
          ...currentPath,
          currentBaseKey,
        ]);

        // Also add a direct accessor that returns the path to this level
        factory[key] = Object.assign(
          () => [...currentPath, currentBaseKey, key],
          nestedFactory
        );
      } else if (Array.isArray(value)) {
        // It's an array of keys (shorthand for a function that returns the array)
        factory[key] = (_params?: Record<string, never>) => [
          ...currentPath,
          currentBaseKey,
          key,
          ...value,
        ];
      }
    }

    // Make the factory callable
    return new Proxy(factory, {
      get(target, prop) {
        if (prop === "__call") {
          return target.__call;
        }
        if (prop in target) {
          return target[prop as string];
        }
        throw new Error(
          `Key "${String(
            prop
          )}" does not exist at this level. Access it through the proper hierarchy.`
        );
      },
      apply(target, _thisArg, _argumentsList) {
        return target.__call();
      },
    });
  }

  return createFactory(schema, baseKey) as KeyFactory<Schema, BaseKey>;
}
