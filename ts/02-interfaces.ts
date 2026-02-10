/**
 * 02. INTERFACES - Định nghĩa cấu trúc của object
 */

// Interface cơ bản
interface User {
    id: number;
    name: string;
    email: string;
    age?: number; // Optional property (có thể có hoặc không)
    readonly createdAt: Date; // Readonly property (chỉ đọc)
}

const user1: User = {
    id: 1,
    name: "Nguyễn Văn A",
    email: "a@example.com",
    createdAt: new Date()
};

// user1.createdAt = new Date(); // Error: Cannot assign to 'createdAt' because it is a read-only property

// Interface với function
interface Calculator {
    add(a: number, b: number): number;
    subtract(a: number, b: number): number;
}

const calculator: Calculator = {
    add: (a, b) => a + b,
    subtract: (a, b) => a - b
};

// Interface kế thừa (extends)
interface Person {
    name: string;
    age: number;
}

interface Employee extends Person {
    employeeId: string;
    department: string;
}

const employee: Employee = {
    name: "Trần Thị B",
    age: 30,
    employeeId: "EMP001",
    department: "IT"
};

// Interface với index signature - cho phép thêm properties động
interface Dictionary {
    [key: string]: string;
}

const translations: Dictionary = {
    hello: "xin chào",
    goodbye: "tạm biệt",
    thanks: "cảm ơn"
};

// Interface cho function type
interface SearchFunc {
    (source: string, subString: string): boolean;
}

const mySearch: SearchFunc = (src, sub) => {
    return src.includes(sub);
};

// Interface với class
interface Animal {
    name: string;
    makeSound(): void;
}

class Dog implements Animal {
    name: string;

    constructor(name: string) {
        this.name = name;
    }

    makeSound(): void {
        console.log("Woof! Woof!");
    }
}

// Hybrid Types - Kết hợp nhiều kiểu
interface Counter {
    (start: number): string;
    interval: number;
    reset(): void;
}

function getCounter(): Counter {
    let counter = function(start: number) {
        return `Started at ${start}`;
    } as Counter;
    
    counter.interval = 123;
    counter.reset = function() {
        console.log("Reset counter");
    };
    
    return counter;
}

export {};
