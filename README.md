# awesome-key-factory

A type-safe key factory for managing react-query keys with full TypeScript support.

## 📚 Documentation

- **[Starlight Documentation Site](./starlight-docs/)** - Beautiful, interactive documentation built with [Starlight](https://starlight.astro.build/) (recommended)
- **[Full Documentation](./DOCUMENTATION.md)** - Complete guide with all features and examples

## Installation

```bash
yarn add awesome-key-factory
# or
npm install awesome-key-factory
```

## Usage

### Basic Example

```typescript
import { createKeyFactory } from 'awesome-key-factory';

const keys = createKeyFactory('baseKey', {
  a: (params: {}) => ['key1', 'key2'],
  b: {
    c: ['key3', 'key4'],
  },
});

// Access any level
keys.a({}) // => ['baseKey', 'a', 'key1', 'key2']
keys.b.c() // => ['baseKey', 'b', 'c', 'key3', 'key4']
keys.b() // => ['baseKey', 'b'] (any level can be called as a function)
```

### With Parameters

```typescript
const queryKeys = createKeyFactory('app', {
  users: {
    all: () => [],
    detail: (params: { id: string }) => [params.id],
    posts: (params: { userId: string }) => [params.userId, 'posts'],
  },
  posts: {
    all: () => [],
    detail: (params: { id: string }) => [params.id],
  },
});

// Usage in react-query
useQuery({
  queryKey: queryKeys.users.detail({ id: '123' }),
  queryFn: () => fetchUser('123'),
});

useQuery({
  queryKey: queryKeys.users.posts({ userId: '456' }),
  queryFn: () => fetchUserPosts('456'),
});
```

### Array Shorthand

You can use arrays as a shorthand for functions that return static keys:

```typescript
const keys = createKeyFactory('shop', {
  products: {
    list: ['all'], // equivalent to () => ['all']
    byId: (params: { id: string }) => [params.id],
  },
});

keys.products.list() // => ['shop', 'products', 'list', 'all']
```

### Deep Nesting

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

keys.v1.users.posts() // => ['api', 'v1', 'users', 'posts']
keys.v1.users() // => ['api', 'v1', 'users']
keys.v1() // => ['api', 'v1']
```

## Features

- ✅ **Fully TypeScript typed** - Get autocomplete and type safety for all your keys
- ✅ **Nested key access** - Access nested keys through the full path (`keys.b.c`)
- ✅ **Function parameters** - Pass typed parameters to your key functions
- ✅ **Array shorthand** - Use arrays for static key lists
- ✅ **Any level access** - Call any level in the hierarchy as a function to get its path

## API

### `createKeyFactory<BaseKey, Schema>(baseKey, schema)`

Creates a type-safe key factory.

**Parameters:**
- `baseKey` (string): The base key that will be prepended to all generated keys
- `schema` (object): An object defining the key structure with nested objects and functions

**Returns:** A factory object where each level can be accessed as a function

## Documentation

For complete documentation, examples, and best practices, see:

- **[Starlight Documentation](./starlight-docs/)** - Beautiful, modern documentation site with search, dark mode, and more
- **[DOCUMENTATION.md](./DOCUMENTATION.md)** - Comprehensive markdown documentation

## License

MIT
