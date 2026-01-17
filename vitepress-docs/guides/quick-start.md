---
title: Quick Start
description: Get started with Awesome key factory in minutes.
---

## Basic Setup

Create your key factory:

```typescript
import { createKeyFactory } from 'awesome-key-factory';

const queryKeys = createKeyFactory('app', {
  users: {
    all: () => [],
    detail: (params: { id: string }) => [params.id],
  },
  posts: {
    all: () => [],
    detail: (params: { id: string }) => [params.id],
  },
});
```

## Usage in React Query

Use your keys in React Query hooks:

```typescript
import { useQuery } from '@tanstack/react-query';

function UserDetail({ userId }: { userId: string }) {
  const { data, isLoading } = useQuery({
    queryKey: queryKeys.users.detail({ id: userId }),
    queryFn: () => fetchUser(userId),
  });

  // ...
}
```

## What You Get

- **Type Safety**: TypeScript knows the exact shape of your keys
- **Autocomplete**: IDE suggestions for all available keys
- **Consistency**: All keys follow the same structure
- **Maintainability**: Centralized key management

That's it! You're ready to use Awesome key factory in your project.
