import { createKeyFactory } from "./index";

describe("createKeyFactory", () => {
  describe("basic functionality", () => {
    it("should create keys with base key and function", () => {
      const keys = createKeyFactory("baseKey", {
        a: (_params: Record<string, never>) => ["key1", "key2"],
      });

      expect(keys.a({})).toEqual(["baseKey", "a", "key1", "key2"]);
    });

    it("should use params to create keys dynamically", () => {
      interface Params {
        id: string;
        status: string;
      }

      const keys = createKeyFactory("baseKey", {
        a: (params: Params) => [params.id, params.status, "key1"],
      });

      expect(keys.a({ id: "123", status: "active" })).toEqual([
        "baseKey",
        "a",
        "123",
        "active",
        "key1",
      ]);
    });

    it("should create keys with nested objects", () => {
      const keys = createKeyFactory("baseKey", {
        b: {
          c: ["key3", "key4"],
        },
      });

      expect(keys.b.c()).toEqual(["baseKey", "b", "c", "key3", "key4"]);
    });

    it("should allow accessing intermediate levels", () => {
      const keys = createKeyFactory("baseKey", {
        b: {
          c: ["key3", "key4"],
        },
      });

      expect(keys.b()).toEqual(["baseKey", "b"]);
    });

    it("should handle the example from the requirements", () => {
      const keys = createKeyFactory("baseKey", {
        a: () => ["key1", "key2"],
        b: {
          c: () => ["key3", "key4"],
        },
      });

      expect(keys.a({})).toEqual(["baseKey", "a", "key1", "key2"]);
      expect(keys.b.c()).toEqual(["baseKey", "b", "c", "key3", "key4"]);
      expect(() => keys.c()).toThrow();
      expect(keys.b()).toEqual(["baseKey", "b"]);
    });
  });

  describe("function parameters", () => {
    it("should pass parameters to key functions", () => {
      interface Params {
        id: string;
        type: string;
      }

      const keys = createKeyFactory("users", {
        byId: (params: Params) => [params.id, params.type],
      });

      expect(keys.byId({ id: "123", type: "admin" })).toEqual([
        "users",
        "byId",
        "123",
        "admin",
      ]);
    });

    it("should handle empty parameters", () => {
      const keys = createKeyFactory("posts", {
        all: (_params: Record<string, never>) => [],
      });

      expect(keys.all({})).toEqual(["posts", "all"]);
    });

    it("should handle multiple parameters", () => {
      interface Params {
        userId: string;
        postId: string;
      }

      const keys = createKeyFactory("users", {
        posts: {
          byId: (params: Params) => [params.userId, params.postId],
        },
      });

      expect(keys.posts.byId({ userId: "1", postId: "2" })).toEqual([
        "users",
        "posts",
        "byId",
        "1",
        "2",
      ]);
    });
  });

  describe("nested structures", () => {
    it("should handle deeply nested objects", () => {
      const keys = createKeyFactory("app", {
        users: {
          posts: {
            comments: ["all"],
          },
        },
      });

      expect(keys.users.posts.comments()).toEqual([
        "app",
        "users",
        "posts",
        "comments",
        "all",
      ]);
      expect(keys.users.posts()).toEqual(["app", "users", "posts"]);
      expect(keys.users()).toEqual(["app", "users"]);
    });

    it("should handle multiple nested levels with functions", () => {
      const keys = createKeyFactory("api", {
        v1: {
          users: (params: { id: string }) => [params.id],
          posts: {
            list: (params: { page: number }) => [params.page.toString()],
            detail: (params: { id: string }) => [params.id],
          },
        },
      });

      expect(keys.v1.users({ id: "123" })).toEqual([
        "api",
        "v1",
        "users",
        "123",
      ]);
      expect(keys.v1.posts.list({ page: 1 })).toEqual([
        "api",
        "v1",
        "posts",
        "list",
        "1",
      ]);
      expect(keys.v1.posts.detail({ id: "456" })).toEqual([
        "api",
        "v1",
        "posts",
        "detail",
        "456",
      ]);
      expect(keys.v1.posts()).toEqual(["api", "v1", "posts"]);
      expect(keys.v1()).toEqual(["api", "v1"]);
    });
  });

  describe("array shorthand", () => {
    it("should handle array shorthand syntax", () => {
      const keys = createKeyFactory("base", {
        items: ["list"],
      });

      expect(keys.items()).toEqual(["base", "items", "list"]);
    });

    it("should handle multiple items in array", () => {
      const keys = createKeyFactory("base", {
        items: ["list", "all"],
      });

      expect(keys.items()).toEqual(["base", "items", "list", "all"]);
    });

    it("should handle empty arrays", () => {
      const keys = createKeyFactory("base", {
        items: [],
      });

      expect(keys.items()).toEqual(["base", "items"]);
    });
  });

  describe("complex real-world scenarios", () => {
    it("should work with a typical react-query setup", () => {
      const queryKeys = createKeyFactory("app", {
        users: {
          all: () => [],
          lists: () => ["list"],
          detail: (params: { id: string }) => [params.id],
          posts: (params: { userId: string }) => [params.userId, "posts"],
        },
        posts: {
          all: () => [],
          detail: (params: { id: string }) => [params.id],
          comments: (params: { postId: string }) => [params.postId, "comments"],
        },
      });

      expect(queryKeys.users.all({})).toEqual(["app", "users", "all"]);
      expect(queryKeys.users.lists({})).toEqual([
        "app",
        "users",
        "lists",
        "list",
      ]);
      expect(queryKeys.users.detail({ id: "123" })).toEqual([
        "app",
        "users",
        "detail",
        "123",
      ]);
      expect(queryKeys.users.posts({ userId: "456" })).toEqual([
        "app",
        "users",
        "posts",
        "456",
        "posts",
      ]);
      expect(queryKeys.users()).toEqual(["app", "users"]);

      expect(queryKeys.posts.all({})).toEqual(["app", "posts", "all"]);
      expect(queryKeys.posts.detail({ id: "789" })).toEqual([
        "app",
        "posts",
        "detail",
        "789",
      ]);
      expect(queryKeys.posts.comments({ postId: "101" })).toEqual([
        "app",
        "posts",
        "comments",
        "101",
        "comments",
      ]);
      expect(queryKeys.posts()).toEqual(["app", "posts"]);
    });

    it("should handle mixed function and array syntax", () => {
      const keys = createKeyFactory("shop", {
        products: {
          list: ["all"],
          byCategory: (params: { category: string }) => [params.category],
          byId: (params: { id: string }) => [params.id],
        },
        cart: ["items"],
      });

      expect(keys.products.list()).toEqual(["shop", "products", "list", "all"]);
      expect(keys.products.byCategory({ category: "electronics" })).toEqual([
        "shop",
        "products",
        "byCategory",
        "electronics",
      ]);
      expect(keys.products.byId({ id: "123" })).toEqual([
        "shop",
        "products",
        "byId",
        "123",
      ]);
      expect(keys.products()).toEqual(["shop", "products"]);
      expect(keys.cart()).toEqual(["shop", "cart", "items"]);
    });
  });

  describe("edge cases", () => {
    it("should handle single level with no nesting", () => {
      const keys = createKeyFactory("simple", {
        item: () => ["single"],
      });

      expect(keys.item({})).toEqual(["simple", "item", "single"]);
    });

    it("should handle multiple keys at the same level", () => {
      const keys = createKeyFactory("base", {
        a: () => ["1"],
        b: () => ["2"],
        c: () => ["3"],
      });

      expect(keys.a({})).toEqual(["base", "a", "1"]);
      expect(keys.b({})).toEqual(["base", "b", "2"]);
      expect(keys.c({})).toEqual(["base", "c", "3"]);
    });

    it("should handle numeric and special characters in keys", () => {
      const keys = createKeyFactory("base", {
        "key-1": () => ["value"],
        key_2: () => ["value2"],
      });

      expect(keys["key-1"]({})).toEqual(["base", "key-1", "value"]);
      expect(keys["key_2"]({})).toEqual(["base", "key_2", "value2"]);
    });

    it("should support bracket notation with proper types for function parameters", () => {
      interface Params {
        id: string;
        type: string;
      }

      const keys = createKeyFactory("base", {
        "key-with-params": (params: Params) => [params.id, params.type],
        "another-key": () => ["static"],
      });

      // Bracket notation should work with proper types
      const keyWithParams = keys["key-with-params"];
      const anotherKey = keys["another-key"];

      // TypeScript should know the parameter types
      expect(keyWithParams({ id: "123", type: "admin" })).toEqual([
        "base",
        "key-with-params",
        "123",
        "admin",
      ]);
      expect(anotherKey({})).toEqual(["base", "another-key", "static"]);
    });
  });
});
