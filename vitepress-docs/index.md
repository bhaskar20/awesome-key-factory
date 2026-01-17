---
layout: home

hero:
  name: Awesome key factory
  text: Type-safe key factory
  tagline: A type-safe key factory for managing react-query keys with full TypeScript support.
  actions:
    - theme: brand
      text: Get Started
      link: /guides/quick-start
    - theme: alt
      text: API Reference
      link: /api-reference/create-key-factory
    - theme: alt
      text: Examples
      link: /examples/react-query-setup

features:
  - icon: 🔒
    title: Fully TypeScript typed
    details: Get autocomplete and type safety for all your keys
  - icon: 📁
    title: Nested key access
    details: Access nested keys through the full path (keys.b.c)
  - icon: ⚙️
    title: Function parameters
    details: Pass typed parameters to your key functions
  - icon: 📝
    title: Array shorthand
    details: Use arrays for static key lists
  - icon: 🎯
    title: Any level access
    details: Call any level in the hierarchy as a function to get its path
---

## Quick Example

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

// Usage in React Query
useQuery({
  queryKey: queryKeys.users.detail({ id: '123' }),
  queryFn: () => fetchUser('123'),
});
```
