---
title: Key Generation
description: How keys are generated from your schema.
---

Keys are generated as arrays of strings, following the pattern:

```
[baseKey, ...path, ...additionalKeys]
```

## Generation Process

1. **Base Key**: Always the first element
2. **Path**: The path through the schema (e.g., `users`, `posts`, `detail`)
3. **Additional Keys**: Keys returned by functions or arrays

## Examples

```typescript
const keys = createKeyFactory('app', {
  users: {
    all: () => [],
    detail: (params: { id: string }) => [params.id],
  },
});

keys.users.all({})
// => ['app', 'users', 'all']
//    [baseKey, path, ...additionalKeys]

keys.users.detail({ id: '123' })
// => ['app', 'users', 'detail', '123']
//    [baseKey, path, ...additionalKeys]
```

## Nested Paths

For nested structures, the path includes all levels:

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
//    [baseKey, ...fullPath, ...additionalKeys]
```

## Intermediate Levels

You can access any intermediate level:

```typescript
keys.v1.users.posts() // => ['api', 'v1', 'users', 'posts']
keys.v1.users() // => ['api', 'v1', 'users']
keys.v1() // => ['api', 'v1']
```
