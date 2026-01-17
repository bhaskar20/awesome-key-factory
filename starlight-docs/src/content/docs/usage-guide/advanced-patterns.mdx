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
