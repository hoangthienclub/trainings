/**
 * 14. CONDITIONAL TYPES - Kiểu có điều kiện
 * 
 * GIẢI THÍCH CHI TIẾT:
 * Conditional types cho phép chọn type dựa trên điều kiện
 * Syntax: T extends U ? X : Y
 */

// 1. Basic conditional type
type IsString<T> = T extends string ? true : false;

type A = IsString<string>; // true
type B = IsString<number>; // false

// 2. Conditional type với union
type ToArray<T> = T extends any ? T[] : never;

type StrOrNumArray = ToArray<string | number>;
// string[] | number[]

// 3. Infer keyword - Suy luận type
type ReturnType<T> = T extends (...args: any[]) => infer R ? R : never;

function getUser() {
    return { id: 1, name: "An" };
}

type UserType = ReturnType<typeof getUser>;

// 4. Extract parameters
type Parameters<T> = T extends (...args: infer P) => any ? P : never;

function createUser(name: string, age: number) {
    return { name, age };
}

type CreateUserParams = Parameters<typeof createUser>; // [string, number]

// 5. Flatten array type
type Flatten<T> = T extends Array<infer U> ? U : T;

type Str = Flatten<string[]>; // string
type Num = Flatten<number>; // number

// 6. Nested conditional types
type TypeName<T> =
    T extends string ? "string" :
    T extends number ? "number" :
    T extends boolean ? "boolean" :
    T extends undefined ? "undefined" :
    T extends Function ? "function" :
    "object";

type T1 = TypeName<string>; // "string"
type T2 = TypeName<() => void>; // "function"

// 7. Distributive conditional types
type BoxedValue<T> = T extends any ? { value: T } : never;

type BoxedStrOrNum = BoxedValue<string | number>;
// { value: string } | { value: number }

// 8. Non-distributive conditional types
type BoxedArray<T> = [T] extends [any] ? { value: T } : never;

type BoxedUnion = BoxedArray<string | number>;
// { value: string | number }

// 9. Exclude implementation
type MyExclude<T, U> = T extends U ? never : T;

type T3 = MyExclude<"a" | "b" | "c", "a">; // "b" | "c"

// 10. Extract implementation
type MyExtract<T, U> = T extends U ? T : never;

type T4 = MyExtract<"a" | "b" | "c", "a" | "f">; // "a"

export {};
