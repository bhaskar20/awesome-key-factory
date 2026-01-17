---
title: Custom Types
description: Using custom TypeScript types with Awesome key factory.
---

## Defining Parameter Interfaces

You can define interfaces for your parameters:

```typescript
interface UserParams {
  id: string;
  includePosts?: boolean;
}

interface PostParams {
  id: string;
  includeComments?: boolean;
}

const queryKeys = createKeyFactory('app', {
  users: {
    detail: (params: UserParams) => [
      params.id,
      ...(params.includePosts ? ['posts'] : []),
    ],
  },
  posts: {
    detail: (params: PostParams) => [
      params.id,
      ...(params.includeComments ? ['comments'] : []),
    ],
  },
});
```

## Reusing Types

You can reuse types across multiple keys:

```typescript
interface IDParams {
  id: string;
}

const queryKeys = createKeyFactory('app', {
  users: {
    detail: (params: IDParams) => [params.id],
  },
  posts: {
    detail: (params: IDParams) => [params.id],
  },
  comments: {
    detail: (params: IDParams) => [params.id],
  },
});
```

## Complex Types

Use complex types for advanced scenarios:

```typescript
interface SearchParams {
  query: string;
  filters?: {
    category?: string;
    priceRange?: [number, number];
  };
  pagination?: {
    page: number;
    limit: number;
  };
}

const queryKeys = createKeyFactory('shop', {
  products: {
    search: (params: SearchParams) => [
      params.query,
      ...(params.filters?.category ? [params.filters.category] : []),
      ...(params.pagination ? [`page-${params.pagination.page}`] : []),
    ],
  },
});
```
