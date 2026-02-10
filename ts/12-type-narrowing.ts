/**
 * 12. TYPE NARROWING - Thu hẹp kiểu
 * 
 * GIẢI THÍCH CHI TIẾT:
 * Type narrowing là quá trình TypeScript tự động suy luận kiểu cụ thể hơn
 * dựa trên các điều kiện trong code
 */

// 1. typeof type guards
function printValue(value: string | number) {
    if (typeof value === "string") {
        console.log(value.toUpperCase()); // TypeScript biết value là string
    } else {
        console.log(value.toFixed(2)); // TypeScript biết value là number
    }
}

// 2. Truthiness narrowing
function printLength(str: string | null | undefined) {
    if (str) {
        console.log(str.length); // str là string
    } else {
        console.log("No string provided");
    }
}

// 3. Equality narrowing
function compare(x: string | number, y: string | boolean) {
    if (x === y) {
        // x và y đều là string (vì chỉ string là type chung)
        console.log(x.toUpperCase());
        console.log(y.toUpperCase());
    }
}

// 4. in operator narrowing
type Fish = { swim: () => void };
type Bird = { fly: () => void };

function move(animal: Fish | Bird) {
    if ("swim" in animal) {
        animal.swim(); // animal là Fish
    } else {
        animal.fly(); // animal là Bird
    }
}

// 5. instanceof narrowing
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

// 6. Type predicates - Custom type guards
function isFish(pet: Fish | Bird): pet is Fish {
    return (pet as Fish).swim !== undefined;
}

function petAction(pet: Fish | Bird) {
    if (isFish(pet)) {
        pet.swim();
    } else {
        pet.fly();
    }
}

// 7. Discriminated unions
interface Circle {
    kind: "circle";
    radius: number;
}

interface Square {
    kind: "square";
    sideLength: number;
}

type Shape = Circle | Square;

function getArea(shape: Shape): number {
    switch (shape.kind) {
        case "circle":
            return Math.PI * shape.radius ** 2;
        case "square":
            return shape.sideLength ** 2;
    }
}

// 8. Never type - Exhaustiveness checking
function assertNever(x: never): never {
    throw new Error("Unexpected object: " + x);
}

function getAreaSafe(shape: Shape): number {
    switch (shape.kind) {
        case "circle":
            return Math.PI * shape.radius ** 2;
        case "square":
            return shape.sideLength ** 2;
        default:
            return assertNever(shape); // Compile error nếu thiếu case
    }
}

export {};
