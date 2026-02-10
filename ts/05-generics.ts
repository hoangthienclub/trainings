/**
 * 05. GENERICS - Kiểu dữ liệu tổng quát
 * 
 * GIẢI THÍCH CHI TIẾT:
 * Generics cho phép tạo các component có thể làm việc với nhiều kiểu dữ liệu khác nhau
 * thay vì chỉ một kiểu cụ thể. Điều này giúp code linh hoạt hơn và tái sử dụng được.
 * 
 * Ký hiệu: <T> là type parameter, có thể đặt tên bất kỳ (T, U, K, V...)
 * nhưng quy ước thường dùng T (Type), K (Key), V (Value), E (Element)
 */

// Generic Function - Hàm generic cơ bản
function identity<T>(arg: T): T {
    return arg;
}

// Sử dụng:
let output1 = identity<string>("Hello"); // Chỉ định rõ kiểu
let output2 = identity(42); // TypeScript tự suy luận kiểu là number

// Generic với Array
function getFirstElement<T>(arr: T[]): T | undefined {
    return arr[0];
}

const firstNumber = getFirstElement([1, 2, 3]); // number | undefined
const firstName = getFirstElement(["An", "Bình", "Chi"]); // string | undefined

// Generic Interface
interface Box<T> {
    value: T;
    getValue: () => T;
}

const numberBox: Box<number> = {
    value: 123,
    getValue: () => 123
};

const stringBox: Box<string> = {
    value: "Hello",
    getValue: () => "Hello"
};

// Generic Class
class DataStorage<T> {
    private data: T[] = [];

    addItem(item: T): void {
        this.data.push(item);
    }

    removeItem(item: T): void {
        const index = this.data.indexOf(item);
        if (index > -1) {
            this.data.splice(index, 1);
        }
    }

    getItems(): T[] {
        return [...this.data];
    }
}

const textStorage = new DataStorage<string>();
textStorage.addItem("Apple");
textStorage.addItem("Banana");
console.log(textStorage.getItems());

const numberStorage = new DataStorage<number>();
numberStorage.addItem(1);
numberStorage.addItem(2);
console.log(numberStorage.getItems());

// Generic Constraints - Ràng buộc generic
// Đôi khi cần giới hạn kiểu T phải có một số thuộc tính nhất định
interface Lengthwise {
    length: number;
}

function logLength<T extends Lengthwise>(arg: T): T {
    console.log(arg.length); // OK vì T phải có property 'length'
    return arg;
}

logLength("Hello"); // OK, string có length
logLength([1, 2, 3]); // OK, array có length
logLength({ length: 10, value: 3 }); // OK, object có length
// logLength(123); // Error: number không có length

// Multiple Type Parameters - Nhiều type parameter
function merge<T, U>(obj1: T, obj2: U): T & U {
    return { ...obj1, ...obj2 };
}

const merged = merge(
    { name: "An" },
    { age: 25 }
);
console.log(merged.name, merged.age); // OK

// Generic với keyof - Lấy key của object
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
    return obj[key];
}

const person = {
    name: "Nguyễn Văn A",
    age: 30,
    email: "a@example.com"
};

const personName = getProperty(person, "name"); // string
const personAge = getProperty(person, "age"); // number
// const invalid = getProperty(person, "address"); // Error: "address" không tồn tại

// Generic Utility Types
type User = {
    id: number;
    name: string;
    email: string;
    password: string;
};

// Partial - Tất cả properties thành optional
type PartialUser = Partial<User>;
const updateUser: PartialUser = { name: "New Name" };

// Required - Tất cả properties thành required
type RequiredUser = Required<User>;

// Readonly - Tất cả properties thành readonly
type ReadonlyUser = Readonly<User>;

// Pick - Chọn một số properties
type UserPreview = Pick<User, "id" | "name">;

// Omit - Loại bỏ một số properties
type UserWithoutPassword = Omit<User, "password">;

// Record - Tạo object type với key và value type
type Roles = "admin" | "user" | "guest";
type RolePermissions = Record<Roles, string[]>;

const permissions: RolePermissions = {
    admin: ["read", "write", "delete"],
    user: ["read", "write"],
    guest: ["read"]
};

// Generic với Promise
async function fetchData<T>(url: string): Promise<T> {
    const response = await fetch(url);
    return response.json();
}

// Sử dụng:
interface TodoItem {
    id: number;
    title: string;
    completed: boolean;
}

// const todo = await fetchData<TodoItem>("https://api.example.com/todo/1");

// Advanced: Conditional Types với Generics
type NonNullable<T> = T extends null | undefined ? never : T;

type A = NonNullable<string | null>; // string
type B = NonNullable<number | undefined>; // number
type C = NonNullable<string | null | undefined>; // string

// Mapped Types với Generics
type Nullable<T> = {
    [P in keyof T]: T[P] | null;
};

type NullableUser = Nullable<User>;
// Tất cả properties của User có thể là null

export {};
