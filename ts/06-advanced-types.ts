/**
 * 06. ADVANCED TYPES - Các kiểu dữ liệu nâng cao
 * 
 * GIẢI THÍCH CHI TIẾT:
 * File này chứa các pattern và kỹ thuật TypeScript nâng cao
 * giúp viết code type-safe và linh hoạt hơn
 */

// 1. UNION TYPES - Kiểu hợp
type StringOrNumber = string | number;

function formatValue(value: StringOrNumber): string {
    if (typeof value === "string") {
        return value.toUpperCase();
    }
    return value.toFixed(2);
}

// Discriminated Unions - Union với property phân biệt
interface Circle {
    kind: "circle"; // Discriminant property
    radius: number;
}

interface Square {
    kind: "square";
    sideLength: number;
}

interface Triangle {
    kind: "triangle";
    base: number;
    height: number;
}

type Shape = Circle | Square | Triangle;

function getArea(shape: Shape): number {
    switch (shape.kind) {
        case "circle":
            return Math.PI * shape.radius ** 2;
        case "square":
            return shape.sideLength ** 2;
        case "triangle":
            return (shape.base * shape.height) / 2;
    }
}

// 2. INTERSECTION TYPES - Kiểu giao
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
    name: "Nguyễn Văn A",
    age: 30,
    employeeId: "EMP001",
    department: "IT"
};

// 3. TYPE GUARDS - Bảo vệ kiểu
// typeof guard
function processValue(value: string | number) {
    if (typeof value === "string") {
        return value.trim(); // TypeScript biết value là string
    }
    return value.toFixed(2); // TypeScript biết value là number
}

// instanceof guard
class Dog {
    bark() { console.log("Woof!"); }
}

class Cat {
    meow() { console.log("Meow!"); }
}

function makeSound(animal: Dog | Cat) {
    if (animal instanceof Dog) {
        animal.bark();
    } else {
        animal.meow();
    }
}

// Custom type guard
interface Fish {
    swim: () => void;
}

interface Bird {
    fly: () => void;
}

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

// 4. CONDITIONAL TYPES - Kiểu có điều kiện
/**
 * Syntax: T extends U ? X : Y
 * Nếu T có thể gán cho U thì trả về X, ngược lại trả về Y
 */

type IsString<T> = T extends string ? true : false;

type A = IsString<string>; // true
type B = IsString<number>; // false

// Ví dụ thực tế: Extract return type
type ReturnType<T> = T extends (...args: any[]) => infer R ? R : never;

function getUser() {
    return { name: "An", age: 25 };
}

type UserReturnType = ReturnType<typeof getUser>; // { name: string; age: number; }

// 5. MAPPED TYPES - Kiểu ánh xạ
/**
 * Tạo type mới bằng cách transform từng property của type cũ
 */

type Readonly<T> = {
    readonly [P in keyof T]: T[P];
};

type Optional<T> = {
    [P in keyof T]?: T[P];
};

type Nullable<T> = {
    [P in keyof T]: T[P] | null;
};

type User = {
    id: number;
    name: string;
    email: string;
};

type ReadonlyUser = Readonly<User>;
type OptionalUser = Optional<User>;
type NullableUser = Nullable<User>;

// 6. TEMPLATE LITERAL TYPES - Kiểu chuỗi mẫu
type Color = "red" | "green" | "blue";
type Shade = "light" | "dark";

type ColorShade = `${Shade}-${Color}`;
// "light-red" | "light-green" | "light-blue" | "dark-red" | "dark-green" | "dark-blue"

// Ví dụ thực tế: Event names
type EventName = "click" | "focus" | "blur";
type EventHandler = `on${Capitalize<EventName>}`;
// "onClick" | "onFocus" | "onBlur"

// 7. INDEXED ACCESS TYPES - Truy cập kiểu theo index
type Person2 = {
    name: string;
    age: number;
    address: {
        street: string;
        city: string;
    };
};

type PersonName = Person2["name"]; // string
type PersonAge = Person2["age"]; // number
type PersonAddress = Person2["address"]; // { street: string; city: string; }
type PersonCity = Person2["address"]["city"]; // string

// 8. UTILITY TYPES - Các kiểu tiện ích built-in
type User2 = {
    id: number;
    name: string;
    email: string;
    password: string;
    role: "admin" | "user";
};

// Partial - Tất cả optional
type PartialUser = Partial<User2>;

// Required - Tất cả required
type RequiredUser = Required<User2>;

// Pick - Chọn properties
type UserPreview = Pick<User2, "id" | "name">;

// Omit - Loại bỏ properties
type UserWithoutPassword = Omit<User2, "password">;

// Record - Tạo object type
type PageInfo = {
    title: string;
    url: string;
};

type Pages = "home" | "about" | "contact";
type PageMap = Record<Pages, PageInfo>;

const pages: PageMap = {
    home: { title: "Trang chủ", url: "/" },
    about: { title: "Giới thiệu", url: "/about" },
    contact: { title: "Liên hệ", url: "/contact" }
};

// Exclude - Loại bỏ types từ union
type T1 = Exclude<"a" | "b" | "c", "a">; // "b" | "c"

// Extract - Lấy types từ union
type T2 = Extract<"a" | "b" | "c", "a" | "f">; // "a"

// NonNullable - Loại bỏ null và undefined
type T3 = NonNullable<string | number | null | undefined>; // string | number

// 9. INFER KEYWORD - Suy luận kiểu
/**
 * 'infer' cho phép TypeScript tự động suy luận kiểu trong conditional types
 */

// Lấy kiểu return của function
type GetReturnType<T> = T extends (...args: any[]) => infer R ? R : never;

function createUser() {
    return { id: 1, name: "An" };
}

type UserType = GetReturnType<typeof createUser>; // { id: number; name: string; }

// Lấy kiểu parameter của function
type GetFirstParam<T> = T extends (first: infer F, ...args: any[]) => any ? F : never;

function greet(name: string, age: number) {
    return `Hello ${name}, you are ${age} years old`;
}

type FirstParam = GetFirstParam<typeof greet>; // string

// Lấy kiểu element của Array
type Unpacked<T> = T extends (infer U)[] ? U : T;

type T4 = Unpacked<string[]>; // string
type T5 = Unpacked<number>; // number

// 10. RECURSIVE TYPES - Kiểu đệ quy
type JSONValue =
    | string
    | number
    | boolean
    | null
    | JSONValue[]
    | { [key: string]: JSONValue };

const jsonData: JSONValue = {
    name: "An",
    age: 25,
    hobbies: ["reading", "coding"],
    address: {
        city: "Hanoi",
        coordinates: [21.0285, 105.8542]
    }
};

// Tree structure
type TreeNode<T> = {
    value: T;
    children?: TreeNode<T>[];
};

const tree: TreeNode<string> = {
    value: "root",
    children: [
        {
            value: "child1",
            children: [
                { value: "grandchild1" },
                { value: "grandchild2" }
            ]
        },
        { value: "child2" }
    ]
};

export {};
