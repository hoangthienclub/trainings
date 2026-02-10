/**
 * 13. MAPPED TYPES - Kiểu ánh xạ
 * 
 * GIẢI THÍCH CHI TIẾT:
 * Mapped types cho phép tạo type mới bằng cách transform từng property
 * của type cũ theo một pattern nhất định
 */

type User = {
    id: number;
    name: string;
    email: string;
};

// 1. Readonly mapper
type MyReadonly<T> = {
    readonly [P in keyof T]: T[P];
};

type ReadonlyUser = MyReadonly<User>;

// 2. Optional mapper
type MyPartial<T> = {
    [P in keyof T]?: T[P];
};

type PartialUser = MyPartial<User>;

// 3. Nullable mapper
type Nullable<T> = {
    [P in keyof T]: T[P] | null;
};

type NullableUser = Nullable<User>;

// 4. Pick implementation
type MyPick<T, K extends keyof T> = {
    [P in K]: T[P];
};

type UserPreview = MyPick<User, "id" | "name">;

// 5. Record implementation
type MyRecord<K extends string | number | symbol, T> = {
    [P in K]: T;
};

type Roles = "admin" | "user" | "guest";
type RolePermissions = MyRecord<Roles, string[]>;

// 6. Mapping modifiers
type Mutable<T> = {
    -readonly [P in keyof T]: T[P]; // Loại bỏ readonly
};

type Required<T> = {
    [P in keyof T]-?: T[P]; // Loại bỏ optional
};

// 7. Key remapping với 'as'
type Getters<T> = {
    [P in keyof T as `get${Capitalize<string & P>}`]: () => T[P];
};

type UserGetters = Getters<User>;
// {
//   getId: () => number;
//   getName: () => string;
//   getEmail: () => string;
// }

// 8. Conditional mapping
type OnlyStrings<T> = {
    [P in keyof T]: T[P] extends string ? T[P] : never;
};

type UserStrings = OnlyStrings<User>;

// 9. Exclude keys
type ExcludeId<T> = {
    [P in keyof T as Exclude<P, "id">]: T[P];
};

type UserWithoutId = ExcludeId<User>;

export {};
