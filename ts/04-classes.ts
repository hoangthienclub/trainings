/**
 * 04. CLASSES - Lập trình hướng đối tượng
 */

// Class cơ bản
class Person {
    // Properties
    name: string;
    age: number;

    // Constructor
    constructor(name: string, age: number) {
        this.name = name;
        this.age = age;
    }

    // Method
    introduce(): string {
        return `Xin chào, tôi là ${this.name}, ${this.age} tuổi`;
    }
}

const person1 = new Person("Nguyễn Văn A", 25);
console.log(person1.introduce());

// Access Modifiers: public, private, protected
class BankAccount {
    public accountNumber: string;
    private balance: number;
    protected owner: string;

    constructor(accountNumber: string, owner: string, initialBalance: number) {
        this.accountNumber = accountNumber;
        this.owner = owner;
        this.balance = initialBalance;
    }

    public deposit(amount: number): void {
        this.balance += amount;
    }

    public getBalance(): number {
        return this.balance;
    }

    private calculateInterest(): number {
        return this.balance * 0.05;
    }
}

const account = new BankAccount("123456", "Trần Văn B", 1000);
account.deposit(500);
console.log(account.getBalance());
// console.log(account.balance); // Error: Property 'balance' is private

// Readonly modifier
class Car {
    readonly brand: string;
    model: string;

    constructor(brand: string, model: string) {
        this.brand = brand;
        this.model = model;
    }
}

const car = new Car("Toyota", "Camry");
// car.brand = "Honda"; // Error: Cannot assign to 'brand' because it is a read-only property

// Parameter properties - Cách viết ngắn gọn
class Product {
    constructor(
        public id: number,
        public name: string,
        private price: number
    ) {}

    getPrice(): number {
        return this.price;
    }
}

// Inheritance - Kế thừa
class Animal {
    constructor(public name: string) {}

    move(distance: number = 0): void {
        console.log(`${this.name} di chuyển ${distance}m`);
    }
}

class Dog extends Animal {
    constructor(name: string, public breed: string) {
        super(name); // Gọi constructor của class cha
    }

    bark(): void {
        console.log("Woof! Woof!");
    }

    // Override method
    move(distance: number = 5): void {
        console.log("Chạy...");
        super.move(distance);
    }
}

const dog = new Dog("Buddy", "Golden Retriever");
dog.bark();
dog.move(10);

// Abstract class - Class trừu tượng
abstract class Shape {
    constructor(public color: string) {}

    abstract getArea(): number; // Method trừu tượng phải được implement ở class con

    describe(): string {
        return `Đây là hình ${this.color}`;
    }
}

class Circle extends Shape {
    constructor(color: string, public radius: number) {
        super(color);
    }

    getArea(): number {
        return Math.PI * this.radius ** 2;
    }
}

class Rectangle extends Shape {
    constructor(color: string, public width: number, public height: number) {
        super(color);
    }

    getArea(): number {
        return this.width * this.height;
    }
}

const circle = new Circle("đỏ", 5);
console.log(circle.getArea());
console.log(circle.describe());

// Static members
class MathUtils {
    static PI: number = 3.14159;

    static calculateCircleArea(radius: number): number {
        return this.PI * radius ** 2;
    }
}

console.log(MathUtils.PI);
console.log(MathUtils.calculateCircleArea(5));

// Getters and Setters
class Employee {
    private _salary: number = 0;

    get salary(): number {
        return this._salary;
    }

    set salary(value: number) {
        if (value < 0) {
            throw new Error("Lương không thể âm");
        }
        this._salary = value;
    }
}

const emp = new Employee();
emp.salary = 5000;
console.log(emp.salary);

export {};
