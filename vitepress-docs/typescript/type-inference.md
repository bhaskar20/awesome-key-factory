---
title: Type Inference
description: How TypeScript type inference works with Awesome key factory.
---

The library provides full type inference. You don't need to manually specify types:

```typescript
const keys = createKeyFactory('app', {
  users: {
    detail: (params: { id: string }) => [params.id],
  },
});

// TypeScript knows the exact shape
keys.users.detail({ id: '123' }); // ✅ Type-safe
keys.users.detail({ id: 123 }); // ❌ Type error: id must be string
keys.users.detail({ wrong: '123' }); // ❌ Type error: wrong property
```

## Automatic Type Inference

TypeScript automatically infers:

- Parameter types from your function signatures
- Return types from your key arrays
- The complete structure of your factory

## Type Safety Benefits

- **Compile-time errors**: Catch mistakes before runtime
- **Autocomplete**: IDE suggestions for all available keys
- **Refactoring**: Safe renaming and restructuring
- **Documentation**: Types serve as inline documentation

## Example

```typescript
const queryKeys = createKeyFactory('app', {
  users: {
    detail: (params: { id: string; includePosts?: boolean }) => [
      params.id,
      ...(params.includePosts ? ['posts'] : []),
    ],
  },
});

// TypeScript enforces the parameter shape
queryKeys.users.detail({ id: '123' }); // ✅
queryKeys.users.detail({ id: '123', includePosts: true }); // ✅
queryKeys.users.detail({ id: 123 }); // ❌ Type error
```
