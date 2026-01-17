---
title: Schema Structure
description: Understanding how to structure your key schema.
---

The schema defines the hierarchical structure of your keys. It can contain:

- **Functions**: Generate dynamic keys based on parameters
- **Nested Objects**: Create hierarchical key structures
- **Arrays**: Shorthand for static key lists

## Functions

Functions allow you to generate dynamic keys based on parameters:

```typescript
const keys = createKeyFactory('app', {
  users: {
    detail: (params: { id: string }) => [params.id],
  },
});
```

## Nested Objects

Nested objects create a hierarchical structure:

```typescript
const keys = createKeyFactory('app', {
  users: {
    posts: {
      comments: (params: { postId: string }) => [params.postId],
    },
  },
});
```

## Arrays

Arrays are shorthand for functions that return static keys:

```typescript
const keys = createKeyFactory('app', {
  users: {
    all: [], // Equivalent to () => []
    list: ['list'], // Equivalent to () => ['list']
  },
});
```

## Mixing All Three

You can mix functions, nested objects, and arrays:

```typescript
const keys = createKeyFactory('shop', {
  products: {
    all: [], // Array
    byId: (params: { id: string }) => [params.id], // Function
    categories: {
      list: ['all'], // Nested object with array
      byId: (params: { id: string }) => [params.id], // Nested object with function
    },
  },
});
```
