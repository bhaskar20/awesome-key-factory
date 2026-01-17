import { createKeyFactory, type KeyFactory, __schemaTypeMarker } from "./index";

/**
 * Configuration for a factory to be merged
 * @deprecated Use KeyFactory directly instead
 */
export interface FactoryConfig<
  BaseKey extends string = string,
  Schema extends Record<string, any> = Record<string, any>
> {
  baseKey: BaseKey;
  schema: Schema;
}

/**
 * Breakthrough approach: Use a symbol for the type marker!
 * 
 * The key insight: String index signatures `[key: string]: any` don't affect
 * symbol properties. By using a symbol for the schema type marker, we can
 * extract it reliably even when the type has a string index signature.
 * 
 * This should finally allow us to extract the schema type from KeyFactory!
 */
type ExtractSchema<T> = 
  // Extract from symbol-based marker (not affected by string index signature)
  // Symbols are separate from string index signatures, so we can extract reliably
  T extends { readonly [__schemaTypeMarker]: infer S }
    ? S extends Record<string, any>
      ? S
      : never
    // Also try non-readonly version
    : T extends { [__schemaTypeMarker]: infer S }
    ? S extends Record<string, any>
      ? S
      : never
    // Fallback: Try KeyFactory match (may fail due to index signature)
    : T extends KeyFactory<infer S, any>
    ? S extends Record<string, any>
      ? S
      : never
    : never;

/**
 * Helper type to extract schema types from a tuple of factories
 */
type ExtractSchemasFromTuple<T extends readonly KeyFactory<any, any>[]> = {
  [K in keyof T]: ExtractSchema<T[K]>;
};

/**
 * Type helper to merge multiple schemas recursively
 */
type MergeSchemas<T extends readonly Record<string, any>[]> = T extends readonly [
  infer First,
  ...infer Rest
]
  ? First extends Record<string, any>
    ? Rest extends readonly Record<string, any>[]
      ? First & MergeSchemas<Rest>
      : First
    : never
  : {};

/**
 * Gets the type of a schema value (function, array, or object)
 */
function getValueType(value: unknown): "function" | "array" | "object" | "other" {
  if (typeof value === "function") {
    return "function";
  }
  if (Array.isArray(value)) {
    return "array";
  }
  if (value && typeof value === "object") {
    return "object";
  }
  return "other";
}

/**
 * Recursively checks for conflicts in nested schemas
 * A conflict occurs when the same key path exists in multiple schemas
 * and the values cannot be merged (e.g., both are functions/arrays, or different types)
 */
function checkConflicts(
  schemas: Record<string, any>[],
  path: string[] = [],
  factoryIndices: number[] = []
): string[] {
  const conflicts: string[] = [];
  const keyMap = new Map<
    string,
    { indices: number[]; types: Array<"function" | "array" | "object" | "other"> }
  >();

  // Collect all keys at this level from all schemas
  schemas.forEach((schema, schemaIndex) => {
    if (!schema || typeof schema !== "object" || Array.isArray(schema)) {
      return;
    }

    for (const key in schema) {
      const fullPath = [...path, key].join(".");
      const factoryIndex = factoryIndices[schemaIndex] ?? schemaIndex;
      const value = schema[key];
      const valueType = getValueType(value);

      if (keyMap.has(key)) {
        const entry = keyMap.get(key)!;
        if (!entry.indices.includes(factoryIndex)) {
          entry.indices.push(factoryIndex);
          entry.types.push(valueType);
        }

        // Check if there's a conflict:
        // - If both are functions or arrays, it's a conflict
        // - If one is function/array and the other is object, it's a conflict
        // - If both are objects, they can be merged (no conflict at this level)
        const hasConflict =
          (valueType === "function" || valueType === "array") &&
          entry.types.some((t) => t === "function" || t === "array") &&
          entry.types.some((t) => t !== valueType);

        if (!hasConflict && entry.types.length > 1) {
          // Check if all are objects (can merge) or if there's a mix
          const allObjects = entry.types.every((t) => t === "object");
          const hasNonObject = entry.types.some((t) => t !== "object");
          if (allObjects) {
            // All are objects, can merge - no conflict
          } else if (hasNonObject && entry.types.some((t) => t === "object")) {
            // Mix of objects and non-objects - conflict
            if (!conflicts.includes(fullPath)) {
              conflicts.push(fullPath);
            }
          } else if (entry.types.some((t) => t === "function" || t === "array")) {
            // Multiple functions/arrays - conflict
            if (!conflicts.includes(fullPath)) {
              conflicts.push(fullPath);
            }
          }
        } else if (hasConflict && !conflicts.includes(fullPath)) {
          conflicts.push(fullPath);
        }
      } else {
        keyMap.set(key, {
          indices: [factoryIndex],
          types: [valueType],
        });
      }
    }
  });

  // Recursively check nested objects
  keyMap.forEach((entry, key) => {
    // Only recurse if all values at this key are objects (can be merged)
    if (entry.types.every((t) => t === "object") && entry.indices.length > 1) {
      const nestedSchemas: Record<string, any>[] = [];
      const nestedIndices: number[] = [];

      schemas.forEach((schema, schemaIndex) => {
        if (
          schema &&
          typeof schema === "object" &&
          !Array.isArray(schema) &&
          key in schema &&
          typeof schema[key] === "object" &&
          !Array.isArray(schema[key])
        ) {
          nestedSchemas.push(schema[key] as Record<string, any>);
          nestedIndices.push(factoryIndices[schemaIndex] ?? schemaIndex);
        }
      });

      if (nestedSchemas.length > 1) {
        const nestedConflicts = checkConflicts(
          nestedSchemas,
          [...path, key],
          nestedIndices
        );
        conflicts.push(...nestedConflicts);
      }
    }
  });

  return conflicts;
}

/**
 * Merges multiple key factories into a single factory, throwing an error if there are any conflicts.
 * Only accepts already-created KeyFactory objects.
 *
 * @param baseKey - The base key for the merged factory
 * @param factories - Array of already-created KeyFactory objects to merge
 * @returns A merged factory object
 * @throws Error if there are any key conflicts between the factories
 *
 * @example
 * ```typescript
 * const keys1 = createKeyFactory("app", { users: { all: () => [] } });
 * const keys2 = createKeyFactory("app", { posts: { all: () => [] } });
 * const merged = mergeFactories("app", [keys1, keys2]);
 *
 * merged.users.all({}) // => ["app", "users", "all"]
 * merged.posts.all({}) // => ["app", "posts", "all"]
 * ```
 *
 * @example
 * ```typescript
 * // This will throw an error due to conflict
 * const keys1 = createKeyFactory("app", { users: { all: () => [] } });
 * const keys2 = createKeyFactory("app", { users: { list: () => [] } });
 * mergeFactories("app", [keys1, keys2]); // Error: Conflict detected
 * ```
 */
/**
 * Completely different approach: Instead of extracting schemas from factories,
 * we use a helper type that reconstructs the schema from the factory's property structure.
 * 
 * However, the fundamental issue remains: TypeScript cannot reliably extract types
 * from a type with an index signature.
 * 
 * Final approach: Use `any` for the schema extraction but provide better type inference
 * through function overloads that preserve the factory types more directly.
 * 
 * Actually, let's try one more thing: Use a type that matches the factory structure
 * and infers the schema by looking at the actual property types, not trying to extract
 * from the KeyFactory type itself.
 */

// Function overloads for better type inference
// These overloads help TypeScript preserve the specific factory types
export function mergeFactories<
  BaseKey extends string,
  const Factories extends readonly [KeyFactory<any, any>, ...KeyFactory<any, any>[]]
>(
  baseKey: BaseKey,
  factories: Factories
): KeyFactory<
  MergeSchemas<ExtractSchemasFromTuple<Factories>>,
  BaseKey
>;

// Implementation signature  
export function mergeFactories<
  BaseKey extends string,
  const Factories extends readonly KeyFactory<any, any>[]
>(
  baseKey: BaseKey,
  factories: Factories
): KeyFactory<
  MergeSchemas<ExtractSchemasFromTuple<Factories>>,
  BaseKey
> {
  if (factories.length === 0) {
    throw new Error("At least one factory must be provided");
  }

  // Extract schemas from factories (using __schema property)
  // Access __schema directly from the factory object, bypassing the Proxy
  const schemas = factories.map((factory) => {
    // Access the underlying target object to get __schema
    // The Proxy allows __schema access, but we need to ensure we're accessing it correctly
    const factoryAny = factory as any;
    // Try to get __schema - it should be accessible through the Proxy
    const schema = factoryAny.__schema;
    if (!schema) {
      throw new Error(
        "Factory does not contain required schema metadata. Make sure it was created with createKeyFactory."
      );
    }
    return schema as Record<string, any>;
  });
  const factoryIndices = factories.map((_, index) => index);

  // Check for conflicts at all levels
  const conflicts = checkConflicts(schemas, [], factoryIndices);

  if (conflicts.length > 0) {
    const conflictDetails = conflicts
      .map((path) => {
        // Find which factories have this path
        const factoryIndicesWithPath: number[] = [];
        schemas.forEach((schema, schemaIndex) => {
          const keys = path.split(".");
          let current: any = schema;
          let exists = true;
          for (const key of keys) {
            if (current && typeof current === "object" && key in current) {
              current = current[key];
            } else {
              exists = false;
              break;
            }
          }
          if (exists) {
            factoryIndicesWithPath.push(schemaIndex);
          }
        });
        return `  - Path "${path}" is defined in factories at indices: ${factoryIndicesWithPath.join(", ")}`;
      })
      .join("\n");

    throw new Error(
      `Factory merge conflict detected. The following keys are defined in multiple factories:\n${conflictDetails}\n\nAll factories must have unique keys at all levels.`
    );
  }

  // Merge all schemas recursively
  function deepMerge(target: Record<string, any>, source: Record<string, any>): Record<string, any> {
    const result = { ...target };

    for (const key in source) {
      if (
        source[key] &&
        typeof source[key] === "object" &&
        !Array.isArray(source[key]) &&
        key in result &&
        result[key] &&
        typeof result[key] === "object" &&
        !Array.isArray(result[key])
      ) {
        // Both are objects, merge recursively
        result[key] = deepMerge(
          result[key] as Record<string, any>,
          source[key] as Record<string, any>
        );
      } else {
        // Overwrite or add new key
        result[key] = source[key];
      }
    }

    return result;
  }

  const mergedSchema = schemas.reduce(
    (acc, schema) => {
      return deepMerge(acc, schema);
    },
    {} as Record<string, any>
  );

  return createKeyFactory(baseKey, mergedSchema) as KeyFactory<
    MergeSchemas<{ [K in keyof Factories]: ExtractSchema<Factories[K]> }>,
    BaseKey
  >;
}
