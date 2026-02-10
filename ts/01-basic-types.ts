/**
 * 01. BASIC TYPES - Các kiểu dữ liệu cơ bản
 */

// String
let fullName: string = "Nguyễn Văn A";
let greeting: string = `Xin chào, ${fullName}`;

// Number
let age: number = 25;
let price: number = 99.99;
let hexValue: number = 0xf00d;

// Boolean
let isActive: boolean = true;
let hasPermission: boolean = false;

// Array - 2 cách khai báo
let numbers: number[] = [1, 2, 3, 4, 5];
let names: Array<string> = ["An", "Bình", "Chi"];

// Tuple - Mảng với số lượng phần tử và kiểu dữ liệu cố định
let person: [string, number] = ["Nguyễn Văn A", 25];
let coordinate: [number, number, number] = [10, 20, 30];

// Enum
enum Color {
    Red,
    Green,
    Blue
}
let favoriteColor: Color = Color.Blue;

enum Status {
    Pending = "PENDING",
    Approved = "APPROVED",
    Rejected = "REJECTED"
}
let orderStatus: Status = Status.Pending;

// Any - Tránh sử dụng khi có thể
let randomValue: any = 10;
randomValue = "Hello";
randomValue = true;

// Unknown - An toàn hơn any
let userInput: unknown = "Hello";
if (typeof userInput === "string") {
    console.log(userInput.toUpperCase());
}

// Void - Không trả về giá trị
function logMessage(message: string): void {
    console.log(message);
}

// Null và Undefined
let nullValue: null = null;
let undefinedValue: undefined = undefined;

// Never - Không bao giờ trả về (throw error hoặc infinite loop)
function throwError(message: string): never {
    throw new Error(message);
}

// Object
let user: object = {
    name: "An",
    age: 25
};

// Type assertion - Ép kiểu
let someValue: unknown = "this is a string";
let strLength: number = (someValue as string).length;
// Hoặc: let strLength: number = (<string>someValue).length;

export {};
