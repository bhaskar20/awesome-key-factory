# react-query-key-factory

A type-safe key factory for managing react-query keys with full TypeScript support.

## 📚 Documentation

- **[Starlight Documentation Site](./starlight-docs/)** - Beautiful, interactive documentation built with [Starlight](https://starlight.astro.build/) (recommended)
- **[Full Documentation](./DOCUMENTATION.md)** - Complete guide with all features and examples
- **[HTML Documentation Site](./docs/)** - Interactive HTML documentation site (open `docs/index.html` in your browser)

### Running the Starlight Docs

```bash
# Development server
yarn docs:dev

# Build for production
yarn docs:build

# Preview production build
yarn docs:preview
```

### Deploying to GitHub Pages

The documentation is configured for automatic deployment to GitHub Pages:

1. **Push to GitHub**: Push your repository to GitHub
2. **Enable GitHub Pages**: 
   - Go to repository Settings → Pages
   - Set source to **GitHub Actions**
3. **Automatic Deployment**: The workflow will automatically deploy on push to `main`/`master`

See [GITHUB_PAGES_SETUP.md](./GITHUB_PAGES_SETUP.md) for detailed instructions.

Your docs will be available at: `https://YOUR_USERNAME.github.io/react-query-key-factory/`

## Installation

```bash
yarn add react-query-key-factory
# or
npm install react-query-key-factory
```

## Usage

### Basic Example

```typescript
import { createKeyFactory } from 'react-query-key-factory';

const keys = createKeyFactory('baseKey', {
  a: (params: {}) => ['key1', 'key2'],
  b: {
    c: ['key3', 'key4'],
  },
});

// Direct access to any level
keys.a({}) // => ['baseKey', 'a', 'key1', 'key2']
keys.b.c({}) // => ['baseKey', 'b', 'c', 'key3', 'key4']
keys.c({}) // => ['baseKey', 'b', 'c', 'key3', 'key4'] (nested keys accessible directly)
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

keys.products.list({}) // => ['shop', 'products', 'list', 'all']
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
- ✅ **Nested key access** - Access nested keys both through the path (`keys.b.c`) and directly (`keys.c`)
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
- **[HTML Documentation Site](./docs/)** - Interactive HTML documentation site

### Quick Start with Starlight Docs

```bash
# Start the development server
yarn docs:dev

# The site will be available at http://localhost:4321
```

## License

MIT
