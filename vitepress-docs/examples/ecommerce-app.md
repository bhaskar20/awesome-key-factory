---
title: E-commerce Application
description: Example of using Awesome key factory in an e-commerce application.
---

## Key Factory Setup

### Single Factory Approach

```typescript
const queryKeys = createKeyFactory('shop', {
  products: {
    all: () => [],
    byCategory: (params: { category: string }) => [params.category],
    byId: (params: { id: string }) => [params.id],
    search: (params: { query: string }) => ['search', params.query],
  },
  cart: {
    items: () => [],
    count: () => ['count'],
  },
  orders: {
    all: () => [],
    byId: (params: { id: string }) => [params.id],
    byStatus: (params: { status: string }) => [params.status],
  },
});
```

### Modular Approach with mergeFactories

For larger applications, organize keys by feature and merge them:

```typescript
import { createKeyFactory, mergeFactories } from 'awesome-key-factory';

// features/products/keys.ts
export const productsKeys = createKeyFactory('shop', {
  products: {
    all: () => [],
    byCategory: (params: { category: string }) => [params.category],
    byId: (params: { id: string }) => [params.id],
    search: (params: { query: string }) => ['search', params.query],
  },
});

// features/cart/keys.ts
export const cartKeys = createKeyFactory('shop', {
  cart: {
    items: () => [],
    count: () => ['count'],
  },
});

// features/orders/keys.ts
export const ordersKeys = createKeyFactory('shop', {
  orders: {
    all: () => [],
    byId: (params: { id: string }) => [params.id],
    byStatus: (params: { status: string }) => [params.status],
  },
});

// keys/index.ts
export const queryKeys = mergeFactories('shop', [
  productsKeys,
  cartKeys,
  ordersKeys,
]);
```

## Usage Examples

### Product Listing

```typescript
function ProductsByCategory({ category }: { category: string }) {
  const { data } = useQuery({
    queryKey: queryKeys.products.byCategory({ category }),
    queryFn: () => fetchProductsByCategory(category),
  });

  return (
    <div>
      {data?.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
```

### Product Search

```typescript
function ProductSearch({ query }: { query: string }) {
  const { data } = useQuery({
    queryKey: queryKeys.products.search({ query }),
    queryFn: () => searchProducts(query),
    enabled: query.length > 0,
  });

  return (
    <div>
      {data?.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
```

### Shopping Cart

```typescript
function Cart() {
  const { data: items } = useQuery({
    queryKey: queryKeys.cart.items({}),
    queryFn: fetchCartItems,
  });

  const { data: count } = useQuery({
    queryKey: queryKeys.cart.count({}),
    queryFn: fetchCartCount,
  });

  return (
    <div>
      <h2>Cart ({count})</h2>
      {/* ... */}
    </div>
  );
}
```
