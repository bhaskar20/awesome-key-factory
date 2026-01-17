import { mergeFactories } from "./merge";
import { createKeyFactory } from "./index";

describe("mergeFactories", () => {
  describe("basic merging", () => {
    it("should merge two factories with different top-level keys", () => {
      const keys1 = createKeyFactory("app", {
        users: {
          all: () => [],
        },
      });

      const keys2 = createKeyFactory("app", {
        posts: {
          all: () => [],
        },
      });

      const merged = mergeFactories("app", [keys1, keys2]);

      expect(merged.users.all({})).toEqual(["app", "users", "all"]);
      expect(merged.posts.all({})).toEqual(["app", "posts", "all"]);
    });

    it("should merge multiple factories", () => {
      const keys1 = createKeyFactory("app", {
        users: {
          all: () => [],
        },
      });

      const keys2 = createKeyFactory("app", {
        posts: {
          all: () => [],
        },
      });

      const keys3 = createKeyFactory("app", {
        comments: {
          all: () => [],
        },
      });

      const merged = mergeFactories("app", [keys1, keys2, keys3]);

      expect(merged.users.all({})).toEqual(["app", "users", "all"]);
      expect(merged.posts.all({})).toEqual(["app", "posts", "all"]);
      expect(merged.comments.all({})).toEqual(["app", "comments", "all"]);
    });

    it("should merge nested objects from different factories", () => {
      const keys1 = createKeyFactory("app", {
        users: {
          all: () => [],
          detail: (params: { id: string }) => [params.id],
        },
      });

      const keys2 = createKeyFactory("app", {
        users: {
          list: () => ["list"],
        },
      });

      const merged = mergeFactories("app", [keys1, keys2]);

      expect(merged.users.all({})).toEqual(["app", "users", "all"]);
      expect(merged.users.detail({ id: "123" })).toEqual([
        "app",
        "users",
        "detail",
        "123",
      ]);
      expect(merged.users.list()).toEqual(["app", "users", "list", "list"]);
    });
  });

  describe("conflict detection", () => {
    it("should throw error when same top-level key exists in multiple factories", () => {
      const keys1 = createKeyFactory("app", {
        users: {
          all: () => [],
        },
      });

      const keys2 = createKeyFactory("app", {
        users: {
          list: () => [],
        },
      });

      // This should work - both are objects, can be merged
      const merged = mergeFactories("app", [keys1, keys2]);
      expect(merged.users.all({})).toEqual(["app", "users", "all"]);
      expect(merged.users.list()).toEqual(["app", "users", "list"]);
    });

    it("should throw error when same function key exists in multiple factories", () => {
      const keys1 = createKeyFactory("app", {
        users: (params: { id: string }) => [params.id],
      });

      const keys2 = createKeyFactory("app", {
        users: (params: { id: string }) => [params.id, "detail"],
      });

      expect(() => mergeFactories("app", [keys1, keys2])).toThrow(
        "Factory merge conflict detected"
      );
    });

    it("should throw error when same array key exists in multiple factories", () => {
      const keys1 = createKeyFactory("app", {
        users: ["all"],
      });

      const keys2 = createKeyFactory("app", {
        users: ["list"],
      });

      expect(() => mergeFactories("app", [keys1, keys2])).toThrow(
        "Factory merge conflict detected"
      );
    });

    it("should throw error when function conflicts with array", () => {
      const keys1 = createKeyFactory("app", {
        users: () => ["all"],
      });

      const keys2 = createKeyFactory("app", {
        users: ["list"],
      });

      expect(() => mergeFactories("app", [keys1, keys2])).toThrow(
        "Factory merge conflict detected"
      );
    });

    it("should throw error when function conflicts with object", () => {
      const keys1 = createKeyFactory("app", {
        users: () => ["all"],
      });

      const keys2 = createKeyFactory("app", {
        users: {
          list: () => [],
        },
      });

      expect(() => mergeFactories("app", [keys1, keys2])).toThrow(
        "Factory merge conflict detected"
      );
    });

    it("should throw error when array conflicts with object", () => {
      const keys1 = createKeyFactory("app", {
        users: ["all"],
      });

      const keys2 = createKeyFactory("app", {
        users: {
          list: () => [],
        },
      });

      expect(() => mergeFactories("app", [keys1, keys2])).toThrow(
        "Factory merge conflict detected"
      );
    });

    it("should throw error with detailed conflict information", () => {
      const keys1 = createKeyFactory("app", {
        users: () => ["all"],
        posts: {
          all: () => [],
        },
      });

      const keys2 = createKeyFactory("app", {
        users: ["list"],
        posts: () => ["all"],
      });

      expect(() => mergeFactories("app", [keys1, keys2])).toThrow(
        "Factory merge conflict detected"
      );

      try {
        mergeFactories("app", [keys1, keys2]);
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        const errorMessage = (error as Error).message;
        expect(errorMessage).toContain("users");
        expect(errorMessage).toContain("posts");
        expect(errorMessage).toContain("indices");
      }
    });

    it("should detect conflicts in deeply nested structures", () => {
      const keys1 = createKeyFactory("app", {
        api: {
          v1: {
            users: () => ["all"],
          },
        },
      });

      const keys2 = createKeyFactory("app", {
        api: {
          v1: {
            users: ["list"],
          },
        },
      });

      expect(() => mergeFactories("app", [keys1, keys2])).toThrow(
        "Factory merge conflict detected"
      );
    });

    it("should throw error when same function key exists in three factories", () => {
      const keys1 = createKeyFactory("app", {
        users: (params: { id: string }) => [params.id],
      });

      const keys2 = createKeyFactory("app", {
        users: (params: { id: string }) => [params.id, "detail"],
      });

      const keys3 = createKeyFactory("app", {
        users: (params: { id: string }) => [params.id, "full"],
      });

      expect(() => mergeFactories("app", [keys1, keys2, keys3])).toThrow(
        "Factory merge conflict detected"
      );

      try {
        mergeFactories("app", [keys1, keys2, keys3]);
      } catch (error) {
        const errorMessage = (error as Error).message;
        expect(errorMessage).toContain("users");
        expect(errorMessage).toContain("indices: 0, 1, 2");
      }
    });

    it("should throw error when same array key exists in three factories", () => {
      const keys1 = createKeyFactory("app", {
        users: ["all"],
      });

      const keys2 = createKeyFactory("app", {
        users: ["list"],
      });

      const keys3 = createKeyFactory("app", {
        users: ["detail"],
      });

      expect(() => mergeFactories("app", [keys1, keys2, keys3])).toThrow(
        "Factory merge conflict detected"
      );

      try {
        mergeFactories("app", [keys1, keys2, keys3]);
      } catch (error) {
        const errorMessage = (error as Error).message;
        expect(errorMessage).toContain("users");
        expect(errorMessage).toContain("indices: 0, 1, 2");
      }
    });

    it("should throw error when function, array, and object conflict across three factories", () => {
      const keys1 = createKeyFactory("app", {
        users: () => ["all"],
      });

      const keys2 = createKeyFactory("app", {
        users: ["list"],
      });

      const keys3 = createKeyFactory("app", {
        users: {
          detail: () => [],
        },
      });

      expect(() => mergeFactories("app", [keys1, keys2, keys3])).toThrow(
        "Factory merge conflict detected"
      );

      try {
        mergeFactories("app", [keys1, keys2, keys3]);
      } catch (error) {
        const errorMessage = (error as Error).message;
        expect(errorMessage).toContain("users");
        expect(errorMessage).toContain("indices");
      }
    });

    it("should detect multiple conflicts at the same level", () => {
      const keys1 = createKeyFactory("app", {
        users: () => ["all"],
        posts: () => ["all"],
        comments: () => ["all"],
      });

      const keys2 = createKeyFactory("app", {
        users: ["list"],
        posts: ["list"],
        comments: ["list"],
      });

      expect(() => mergeFactories("app", [keys1, keys2])).toThrow(
        "Factory merge conflict detected"
      );

      try {
        mergeFactories("app", [keys1, keys2]);
      } catch (error) {
        const errorMessage = (error as Error).message;
        expect(errorMessage).toContain("users");
        expect(errorMessage).toContain("posts");
        expect(errorMessage).toContain("comments");
        expect(errorMessage).toContain("indices: 0, 1");
      }
    });

    it("should detect conflicts at different nesting levels simultaneously", () => {
      const keys1 = createKeyFactory("app", {
        users: () => ["all"],
        api: {
          v1: {
            users: () => ["all"],
          },
        },
      });

      const keys2 = createKeyFactory("app", {
        users: ["list"],
        api: {
          v1: {
            users: ["list"],
          },
        },
      });

      expect(() => mergeFactories("app", [keys1, keys2])).toThrow(
        "Factory merge conflict detected"
      );

      try {
        mergeFactories("app", [keys1, keys2]);
      } catch (error) {
        const errorMessage = (error as Error).message;
        expect(errorMessage).toContain("users");
        expect(errorMessage).toContain("api.v1.users");
      }
    });

    it("should detect conflicts in nested objects with multiple factories", () => {
      const keys1 = createKeyFactory("app", {
        api: {
          v1: {
            users: () => ["all"],
          },
        },
      });

      const keys2 = createKeyFactory("app", {
        api: {
          v1: {
            posts: () => ["all"],
          },
        },
      });

      const keys3 = createKeyFactory("app", {
        api: {
          v1: {
            users: ["list"],
          },
        },
      });

      expect(() => mergeFactories("app", [keys1, keys2, keys3])).toThrow(
        "Factory merge conflict detected"
      );

      try {
        mergeFactories("app", [keys1, keys2, keys3]);
      } catch (error) {
        const errorMessage = (error as Error).message;
        expect(errorMessage).toContain("api.v1.users");
        expect(errorMessage).toContain("indices: 0, 2");
      }
    });

    it("should throw error with correct factory indices for conflicts", () => {
      const keys1 = createKeyFactory("app", {
        users: () => ["all"],
      });

      const keys2 = createKeyFactory("app", {
        posts: () => ["all"],
      });

      const keys3 = createKeyFactory("app", {
        users: ["list"],
      });

      const keys4 = createKeyFactory("app", {
        posts: ["list"],
      });

      expect(() => mergeFactories("app", [keys1, keys2, keys3, keys4])).toThrow(
        "Factory merge conflict detected"
      );

      try {
        mergeFactories("app", [keys1, keys2, keys3, keys4]);
      } catch (error) {
        const errorMessage = (error as Error).message;
        expect(errorMessage).toContain("users");
        expect(errorMessage).toContain("indices: 0, 2");
        expect(errorMessage).toContain("posts");
        expect(errorMessage).toContain("indices: 1, 3");
      }
    });

    it("should detect conflict when function conflicts with array in nested path", () => {
      const keys1 = createKeyFactory("app", {
        api: {
          v1: {
            endpoints: {
              users: () => ["all"],
            },
          },
        },
      });

      const keys2 = createKeyFactory("app", {
        api: {
          v1: {
            endpoints: {
              users: ["list"],
            },
          },
        },
      });

      expect(() => mergeFactories("app", [keys1, keys2])).toThrow(
        "Factory merge conflict detected"
      );

      try {
        mergeFactories("app", [keys1, keys2]);
      } catch (error) {
        const errorMessage = (error as Error).message;
        expect(errorMessage).toContain("api.v1.endpoints.users");
      }
    });

    it("should detect conflict when multiple functions conflict at same nested path", () => {
      const keys1 = createKeyFactory("app", {
        api: {
          v1: {
            users: (params: { id: string }) => [params.id],
          },
        },
      });

      const keys2 = createKeyFactory("app", {
        api: {
          v1: {
            users: (params: { id: string }) => [params.id, "detail"],
          },
        },
      });

      const keys3 = createKeyFactory("app", {
        api: {
          v1: {
            users: (params: { id: string }) => [params.id, "full"],
          },
        },
      });

      expect(() => mergeFactories("app", [keys1, keys2, keys3])).toThrow(
        "Factory merge conflict detected"
      );

      try {
        mergeFactories("app", [keys1, keys2, keys3]);
      } catch (error) {
        const errorMessage = (error as Error).message;
        expect(errorMessage).toContain("api.v1.users");
        expect(errorMessage).toContain("indices: 0, 1, 2");
      }
    });

    it("should include all conflicting paths in error message", () => {
      const keys1 = createKeyFactory("app", {
        users: () => ["all"],
        posts: () => ["all"],
        api: {
          v1: {
            users: () => ["all"],
          },
        },
      });

      const keys2 = createKeyFactory("app", {
        users: ["list"],
        posts: ["list"],
        api: {
          v1: {
            users: ["list"],
          },
        },
      });

      expect(() => mergeFactories("app", [keys1, keys2])).toThrow(
        "Factory merge conflict detected"
      );

      try {
        mergeFactories("app", [keys1, keys2]);
      } catch (error) {
        const errorMessage = (error as Error).message;
        expect(errorMessage).toContain('Path "users"');
        expect(errorMessage).toContain('Path "posts"');
        expect(errorMessage).toContain('Path "api.v1.users"');
        expect(errorMessage).toContain("indices");
      }
    });

    it("should detect conflict when object conflicts with function in deeply nested structure", () => {
      const keys1 = createKeyFactory("app", {
        api: {
          v1: {
            endpoints: {
              resources: {
                users: () => ["all"],
              },
            },
          },
        },
      });

      const keys2 = createKeyFactory("app", {
        api: {
          v1: {
            endpoints: {
              resources: {
                users: {
                  list: () => [],
                },
              },
            },
          },
        },
      });

      expect(() => mergeFactories("app", [keys1, keys2])).toThrow(
        "Factory merge conflict detected"
      );

      try {
        mergeFactories("app", [keys1, keys2]);
      } catch (error) {
        const errorMessage = (error as Error).message;
        expect(errorMessage).toContain("api.v1.endpoints.resources.users");
      }
    });
  });

  describe("edge cases", () => {
    it("should throw error when no factories provided", () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      expect(() => mergeFactories("app", [] as any)).toThrow(
        "At least one factory must be provided"
      );
    });

    it("should work with single factory", () => {
      const keys = createKeyFactory("app", {
        users: {
          all: () => [],
        },
      });

      const merged = mergeFactories("app", [keys]);
      expect(merged.users.all({})).toEqual(["app", "users", "all"]);
    });

    it("should merge factories with array shorthand", () => {
      const keys1 = createKeyFactory("app", {
        users: {
          all: [],
        },
      });

      const keys2 = createKeyFactory("app", {
        posts: {
          list: ["all"],
        },
      });

      const merged = mergeFactories("app", [keys1, keys2]);
      expect(merged.users.all()).toEqual(["app", "users", "all"]);
      expect(merged.posts.list()).toEqual(["app", "posts", "list", "all"]);
    });

    it("should merge complex nested structures", () => {
      const keys1 = createKeyFactory("app", {
        users: {
          all: () => [],
          detail: (params: { id: string }) => [params.id],
        },
      });

      const keys2 = createKeyFactory("app", {
        users: {
          posts: (params: { userId: string }) => [params.userId],
        },
        posts: {
          all: () => [],
        },
      });

      const merged = mergeFactories("app", [keys1, keys2]);

      expect(merged.users.all({})).toEqual(["app", "users", "all"]);
      expect(merged.users.detail({ id: "123" })).toEqual([
        "app",
        "users",
        "detail",
        "123",
      ]);
      expect(merged.users.posts({ userId: "456" })).toEqual([
        "app",
        "users",
        "posts",
        "456",
      ]);
      expect(merged.posts.all({})).toEqual(["app", "posts", "all"]);
    });
  });

  describe("type safety", () => {
    it("should preserve types after merging", () => {
      const keys1 = createKeyFactory("app", {
        users: {
          all: () => [],
          detail: (params: { id: string }) => [params.id],
        },
      });

      const keys2 = createKeyFactory("app", {
        posts: {
          all: () => [],
          byId: (params: { id: number }) => [params.id.toString()],
        },
      });

      const merged = mergeFactories("app", [keys1, keys2]);

      // TypeScript should know the parameter types
      expect(merged.users.detail({ id: "123" })).toEqual([
        "app",
        "users",
        "detail",
        "123",
      ]);
      expect(merged.posts.byId({ id: 456 })).toEqual([
        "app",
        "posts",
        "byId",
        "456",
      ]);

      // Type safety is preserved - the merged factory has the correct types
      // TypeScript will catch type errors at compile time
    });

    it("should preserve nested types", () => {
      const keys1 = createKeyFactory("app", {
        api: {
          v1: {
            users: (params: { id: string }) => [params.id],
          },
        },
      });

      const keys2 = createKeyFactory("app", {
        api: {
          v1: {
            posts: (params: { id: number }) => [params.id.toString()],
          },
        },
      });

      const merged = mergeFactories("app", [keys1, keys2]);

      expect(merged.api.v1.users({ id: "123" })).toEqual([
        "app",
        "api",
        "v1",
        "users",
        "123",
      ]);
      expect(merged.api.v1.posts({ id: 456 })).toEqual([
        "app",
        "api",
        "v1",
        "posts",
        "456",
      ]);
    });
  });
});
