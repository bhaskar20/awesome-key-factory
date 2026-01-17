---
title: mergeFactories
description: Complete API reference for mergeFactories.
---

## Function Signature

```typescript
function mergeFactories<BaseKey, Factories>(
  baseKey: BaseKey,
  factories: Factories
): KeyFactory<MergeSchemas<ExtractSchemasFromTuple<Factories>>, BaseKey>
```

## Parameters

### `baseKey`

- **Type**: `BaseKey extends string`
- **Required**: Yes
- **Description**: The base key that will be used for the merged factory. All factories being merged should ideally use the same base key, though the merged factory will use this specified base key.

### `factories`

- **Type**: `readonly [KeyFactory<any, any>, ...KeyFactory<any, any>[]]` (at least one factory required)
- **Required**: Yes
- **Description**: An array of `KeyFactory` objects to merge. Must contain at least one factory. All factories must have unique keys at all levels to avoid conflicts.

## Returns

A merged factory object (`KeyFactory<MergedSchema, BaseKey>`) that combines all the schemas from the input factories. The merged factory has access to all keys from all input factories.

## Type Parameters

- **`BaseKey`**: The type of the base key string for the merged factory
- **`Factories`**: A tuple type of the factories being merged, used for type inference

## Behavior

### Conflict Detection

The function performs deep conflict detection to ensure that no two factories define the same key path. A conflict occurs when:

- The same key path exists in multiple factories and the values are functions or arrays
- The same key path exists in multiple factories with incompatible types (e.g., one is a function and another is an object)

Nested objects can be merged if they don't have conflicting keys at deeper levels.

### Error Handling

If conflicts are detected, the function throws an error with details about which paths conflict and in which factories:

```typescript
Error: Factory merge conflict detected. The following keys are defined in multiple factories:
  - Path "users.all" is defined in factories at indices: 0, 1

All factories must have unique keys at all levels.
```

## Examples

### Basic Merging

Merge two factories with different top-level keys:

```typescript
import { createKeyFactory, mergeFactories } from 'awesome-key-factory';

const usersKeys = createKeyFactory('app', {
  users: {
    all: () => [],
    detail: (params: { id: string }) => [params.id],
  },
});

const postsKeys = createKeyFactory('app', {
  posts: {
    all: () => [],
    detail: (params: { id: string }) => [params.id],
  },
});

const merged = mergeFactories('app', [usersKeys, postsKeys]);

// Access keys from both factories
merged.users.all({}); // => ['app', 'users', 'all']
merged.posts.detail({ id: '123' }); // => ['app', 'posts', 'detail', '123']
```

### Merging Multiple Factories

Merge three or more factories:

```typescript
const usersKeys = createKeyFactory('app', {
  users: {
    all: () => [],
  },
});

const postsKeys = createKeyFactory('app', {
  posts: {
    all: () => [],
  },
});

const commentsKeys = createKeyFactory('app', {
  comments: {
    all: () => [],
  },
});

const merged = mergeFactories('app', [usersKeys, postsKeys, commentsKeys]);

merged.users.all({}); // => ['app', 'users', 'all']
merged.posts.all({}); // => ['app', 'posts', 'all']
merged.comments.all({}); // => ['app', 'comments', 'all']
```

### Merging Nested Schemas

Factories with nested structures can be merged if they don't conflict:

```typescript
const apiV1Keys = createKeyFactory('api', {
  v1: {
    users: {
      all: () => [],
    },
  },
});

const apiV2Keys = createKeyFactory('api', {
  v2: {
    users: {
      all: () => [],
    },
  },
});

const merged = mergeFactories('api', [apiV1Keys, apiV2Keys]);

merged.v1.users.all({}); // => ['api', 'v1', 'users', 'all']
merged.v2.users.all({}); // => ['api', 'v2', 'users', 'all']
```

### Conflict Example

This will throw an error because both factories define `users.all`:

```typescript
const keys1 = createKeyFactory('app', {
  users: {
    all: () => [],
  },
});

const keys2 = createKeyFactory('app', {
  users: {
    all: () => [],
  },
});

// ❌ Error: Factory merge conflict detected
mergeFactories('app', [keys1, keys2]);
```

### Modular Key Organization

Use `mergeFactories` to organize keys across different modules:

```typescript
// users/keys.ts
export const usersKeys = createKeyFactory('app', {
  users: {
    all: () => [],
    detail: (params: { id: string }) => [params.id],
  },
});

// posts/keys.ts
export const postsKeys = createKeyFactory('app', {
  posts: {
    all: () => [],
    detail: (params: { id: string }) => [params.id],
  },
});

// keys/index.ts
import { mergeFactories } from 'awesome-key-factory';
import { usersKeys } from '../users/keys';
import { postsKeys } from '../posts/keys';

export const queryKeys = mergeFactories('app', [usersKeys, postsKeys]);
```

## Type Safety

The merged factory maintains full type safety. TypeScript will:

- Infer all parameter types from the original factories
- Provide autocomplete for all merged keys
- Enforce type checking on all function calls

```typescript
const merged = mergeFactories('app', [usersKeys, postsKeys]);

// ✅ Type-safe: TypeScript knows the exact parameter shape
merged.users.detail({ id: '123' }); // ✅
merged.users.detail({ id: 123 }); // ❌ Type error: id must be string
merged.users.detail({}); // ❌ Type error: id is required
```

## Best Practices

1. **Use consistent base keys**: All factories being merged should use the same base key for consistency
2. **Organize by feature**: Create separate factories for different features/modules and merge them
3. **Avoid conflicts**: Ensure all factories have unique key paths before merging
4. **Type inference**: Let TypeScript infer types - the merged factory will have the correct types automatically
