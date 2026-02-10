/**
 * 10. UTILITY TYPES - Các kiểu tiện ích built-in
 * 
 * GIẢI THÍCH CHI TIẾT:
 * TypeScript cung cấp nhiều utility types giúp transform types dễ dàng
 */

type User = {
    id: number;
    name: string;
    email: string;
    password: string;
    age?: number;
};

// 1. Partial<T> - Tất cả properties thành optional
type PartialUser = Partial<User>;
const updateUser: PartialUser = { name: "New Name" };

// 2. Required<T> - Tất cả properties thành required
type RequiredUser = Required<User>;

// 3. Readonly<T> - Tất cả properties thành readonly
type ReadonlyUser = Readonly<User>;
const user: ReadonlyUser = {
    id: 1,
    name: "An",
    email: "an@example.com",
    password: "123"
};
// user.name = "Bình"; // Error

// 4. Pick<T, K> - Chọn một số properties
type UserPreview = Pick<User, "id" | "name">;

// 5. Omit<T, K> - Loại bỏ một số properties
type UserWithoutPassword = Omit<User, "password">;

// 6. Record<K, T> - Tạo object type với key và value type
type Roles = "admin" | "user" | "guest";
type Permissions = Record<Roles, string[]>;

const permissions: Permissions = {
    admin: ["read", "write", "delete"],
    user: ["read", "write"],
    guest: ["read"]
};

// 7. Exclude<T, U> - Loại bỏ types từ union
type T1 = Exclude<"a" | "b" | "c", "a">; // "b" | "c"

// 8. Extract<T, U> - Lấy types từ union
type T2 = Extract<"a" | "b" | "c", "a" | "f">; // "a"

// 9. NonNullable<T> - Loại bỏ null và undefined
type T3 = NonNullable<string | number | null | undefined>; // string | number

// 10. ReturnType<T> - Lấy return type của function
function getUser() {
    return { id: 1, name: "An" };
}
type UserType = ReturnType<typeof getUser>;

// 11. Parameters<T> - Lấy parameters type của function
function createUser(name: string, age: number) {
    return { name, age };
}
type CreateUserParams = Parameters<typeof createUser>; // [string, number]

// 12. ConstructorParameters<T> - Lấy parameters của constructor
class Person {
    constructor(public name: string, public age: number) {}
}
type PersonParams = ConstructorParameters<typeof Person>; // [string, number]

// 13. InstanceType<T> - Lấy instance type của class
type PersonInstance = InstanceType<typeof Person>;

// 14. Awaited<T> - Lấy type của Promise
type AwaitedUser = Awaited<Promise<User>>; // User

export {};
