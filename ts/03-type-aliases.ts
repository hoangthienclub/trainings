/**
 * 03. TYPE ALIASES - Đặt tên cho các kiểu dữ liệu
 * Type aliases linh hoạt hơn interface, có thể dùng cho union, intersection, primitives
 */

// Type alias cơ bản
type ID = string | number;

let userId: ID = "user123";
let productId: ID = 456;

// Type alias cho object
type Point = {
    x: number;
    y: number;
};

const point: Point = { x: 10, y: 20 };

// Union Types - Một trong nhiều kiểu
type Status = "pending" | "approved" | "rejected";
let orderStatus: Status = "pending";
// orderStatus = "cancelled"; // Error: Type '"cancelled"' is not assignable to type 'Status'

// Intersection Types - Kết hợp nhiều kiểu
type Person = {
    name: string;
    age: number;
};

type Employee = {
    employeeId: string;
    department: string;
};

type Staff = Person & Employee;

const staff: Staff = {
    name: "Lê Văn C",
    age: 28,
    employeeId: "EMP002",
    department: "HR"
};

// Function type
type MathOperation = (a: number, b: number) => number;

const add: MathOperation = (a, b) => a + b;
const multiply: MathOperation = (a, b) => a * b;

// Generic type alias
type Container<T> = {
    value: T;
    getValue: () => T;
};

const numberContainer: Container<number> = {
    value: 42,
    getValue: () => 42
};

const stringContainer: Container<string> = {
    value: "Hello",
    getValue: () => "Hello"
};

// Conditional Types - Kiểu có điều kiện
type IsString<T> = T extends string ? "yes" : "no";

type A = IsString<string>; // "yes"
type B = IsString<number>; // "no"

// Mapped Types - Tạo type mới từ type cũ
type ReadOnly<T> = {
    readonly [P in keyof T]: T[P];
};

type User = {
    name: string;
    age: number;
};

type ReadOnlyUser = ReadOnly<User>;

const user: ReadOnlyUser = {
    name: "Phạm Thị D",
    age: 25
};

// user.name = "New Name"; // Error: Cannot assign to 'name' because it is a read-only property

// Utility Types
type PartialUser = Partial<User>; // Tất cả properties thành optional
type RequiredUser = Required<User>; // Tất cả properties thành required
type PickedUser = Pick<User, "name">; // Chỉ lấy property 'name'
type OmittedUser = Omit<User, "age">; // Loại bỏ property 'age'

// Type guards
type Fish = { swim: () => void };
type Bird = { fly: () => void };

function isFish(pet: Fish | Bird): pet is Fish {
    return (pet as Fish).swim !== undefined;
}

function move(pet: Fish | Bird) {
    if (isFish(pet)) {
        pet.swim();
    } else {
        pet.fly();
    }
}

export {};
