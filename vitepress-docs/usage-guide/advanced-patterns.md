---
title: Advanced Patterns
description: Advanced usage patterns and techniques.
---

## Deep Nesting

Create deeply nested key structures:

```typescript
const keys = createKeyFactory('api', {
  v1: {
    users: {
      posts: {
        comments: (params: { postId: string }) => [params.postId],
      },
    },
  },
});

keys.v1.users.posts.comments({ postId: '123' })
// => ['api', 'v1', 'users', 'posts', 'comments', '123']

// Access any intermediate level
keys.v1.users.posts() // => ['api', 'v1', 'users', 'posts']
keys.v1.users() // => ['api', 'v1', 'users']
keys.v1() // => ['api', 'v1']
```

## Mixed Function and Array Syntax

Combine functions and arrays in the same schema:

```typescript
const keys = createKeyFactory('shop', {
  products: {
    list: ['all'], // Array shorthand
    byCategory: (params: { category: string }) => [params.category], // Function
    byId: (params: { id: string }) => [params.id], // Function
  },
  cart: ['items'], // Array shorthand
});

keys.products.list() // => ['shop', 'products', 'list', 'all']
keys.products.byCategory({ category: 'electronics' })
// => ['shop', 'products', 'byCategory', 'electronics']
keys.cart() // => ['shop', 'cart', 'items']
```

## Optional Parameters

Handle optional parameters in your key functions:

```typescript
const keys = createKeyFactory('app', {
  users: {
    search: (params: { query: string; page?: number }) => [
      params.query,
      ...(params.page ? [params.page.toString()] : []),
    ],
  },
});

keys.users.search({ query: 'test' }) // => ['app', 'users', 'search', 'test']
keys.users.search({ query: 'test', page: 2 }) // => ['app', 'users', 'search', 'test', '2']
```

## Query Invalidation Patterns

Use intermediate levels for efficient query invalidation:

```typescript
// Invalidate all user-related queries
queryClient.invalidateQueries({
  queryKey: queryKeys.users(),
});

// Invalidate all post-related queries
queryClient.invalidateQueries({
  queryKey: queryKeys.posts(),
});
```

## Merging Factories

Combine multiple factories into a single factory for better organization:

### Basic Merging

Merge factories with different top-level keys:

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

const queryKeys = mergeFactories('app', [usersKeys, postsKeys]);

// Access keys from both factories
queryKeys.users.all({}); // => ['app', 'users', 'all']
queryKeys.posts.detail({ id: '123' }); // => ['app', 'posts', 'detail', '123']
```

### Modular Organization

Organize keys by feature or module and merge them:

```typescript
// features/users/keys.ts
export const usersKeys = createKeyFactory('app', {
  users: {
    all: () => [],
    detail: (params: { id: string }) => [params.id],
    posts: (params: { userId: string }) => [params.userId, 'posts'],
  },
});

// features/posts/keys.ts
export const postsKeys = createKeyFactory('app', {
  posts: {
    all: () => [],
    detail: (params: { id: string }) => [params.id],
    comments: (params: { postId: string }) => [params.postId, 'comments'],
  },
});

// features/comments/keys.ts
export const commentsKeys = createKeyFactory('app', {
  comments: {
    all: () => [],
    detail: (params: { id: string }) => [params.id],
  },
});

// keys/index.ts
import { mergeFactories } from 'awesome-key-factory';
import { usersKeys } from '../features/users/keys';
import { postsKeys } from '../features/posts/keys';
import { commentsKeys } from '../features/comments/keys';

export const queryKeys = mergeFactories('app', [
  usersKeys,
  postsKeys,
  commentsKeys,
]);
```

### Merging Nested Structures

Merge factories with nested schemas:

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

### Conflict Prevention

The merge function automatically detects conflicts and throws an error:

```typescript
// ❌ This will throw an error - both factories define users.all
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

mergeFactories('app', [keys1, keys2]);
// Error: Factory merge conflict detected. The following keys are defined in multiple factories:
//   - Path "users.all" is defined in factories at indices: 0, 1
```

**Note**: All factories must have unique keys at all levels. Nested objects can be merged if they don't have conflicting keys at deeper levels.
