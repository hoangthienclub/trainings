/**
 * 07. DECORATORS - Decorator pattern
 * 
 * GIẢI THÍCH CHI TIẾT:
 * Decorators là một tính năng experimental trong TypeScript cho phép
 * thêm metadata hoặc modify classes, methods, properties, parameters.
 * 
 * Để sử dụng decorators, cần enable trong tsconfig.json:
 * {
 *   "compilerOptions": {
 *     "experimentalDecorators": true,
 *     "emitDecoratorMetadata": true
 *   }
 * }
 * 
 * Decorators được execute khi class được define, không phải khi instance được tạo
 */

// 1. CLASS DECORATOR
/**
 * Class decorator nhận constructor của class làm tham số
 * Có thể modify hoặc replace class definition
 */

function sealed(constructor: Function) {
    console.log("Sealing the constructor");
    Object.seal(constructor);
    Object.seal(constructor.prototype);
}

@sealed
class BugReport {
    type = "report";
    title: string;

    constructor(title: string) {
        this.title = title;
    }
}

// Class decorator với parameters (decorator factory)
function Component(config: { selector: string; template: string }) {
    return function <T extends { new(...args: any[]): {} }>(constructor: T) {
        return class extends constructor {
            selector = config.selector;
            template = config.template;
        };
    };
}

@Component({
    selector: "app-user",
    template: "<div>User Component</div>"
})
class UserComponent {
    name = "User";
}

// 2. METHOD DECORATOR
/**
 * Method decorator nhận 3 tham số:
 * - target: prototype của class (static method) hoặc constructor (instance method)
 * - propertyKey: tên của method
 * - descriptor: Property Descriptor của method
 */

function log(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;

    descriptor.value = function (...args: any[]) {
        console.log(`Calling ${propertyKey} with arguments:`, args);
        const result = originalMethod.apply(this, args);
        console.log(`Result:`, result);
        return result;
    };

    return descriptor;
}

class Calculator {
    @log
    add(a: number, b: number): number {
        return a + b;
    }

    @log
    multiply(a: number, b: number): number {
        return a * b;
    }
}

const calc = new Calculator();
calc.add(2, 3); // Sẽ log ra console

// Method decorator với parameters
function measure(unit: string = "ms") {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        const originalMethod = descriptor.value;

        descriptor.value = async function (...args: any[]) {
            const start = performance.now();
            const result = await originalMethod.apply(this, args);
            const end = performance.now();
            console.log(`${propertyKey} took ${(end - start).toFixed(2)} ${unit}`);
            return result;
        };

        return descriptor;
    };
}

class DataService {
    @measure("ms")
    async fetchData() {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        return { data: "some data" };
    }
}

// 3. PROPERTY DECORATOR
/**
 * Property decorator nhận 2 tham số:
 * - target: prototype của class
 * - propertyKey: tên của property
 */

function format(formatString: string) {
    return function (target: any, propertyKey: string) {
        let value: string;

        const getter = function () {
            return value;
        };

        const setter = function (newVal: string) {
            value = formatString.replace("{value}", newVal);
        };

        Object.defineProperty(target, propertyKey, {
            get: getter,
            set: setter,
            enumerable: true,
            configurable: true
        });
    };
}

class Greeter {
    @format("Hello, {value}!")
    greeting: string;

    constructor(message: string) {
        this.greeting = message;
    }
}

const greeter = new Greeter("World");
console.log(greeter.greeting); // "Hello, World!"

// Validation decorator
function MinLength(length: number) {
    return function (target: any, propertyKey: string) {
        let value: string;

        const getter = function () {
            return value;
        };

        const setter = function (newVal: string) {
            if (newVal.length < length) {
                throw new Error(`${propertyKey} must be at least ${length} characters`);
            }
            value = newVal;
        };

        Object.defineProperty(target, propertyKey, {
            get: getter,
            set: setter,
            enumerable: true,
            configurable: true
        });
    };
}

class User {
    @MinLength(3)
    username: string;

    @MinLength(8)
    password: string;

    constructor(username: string, password: string) {
        this.username = username;
        this.password = password;
    }
}

// 4. PARAMETER DECORATOR
/**
 * Parameter decorator nhận 3 tham số:
 * - target: prototype của class
 * - propertyKey: tên của method
 * - parameterIndex: vị trí của parameter (0-based)
 */

function required(target: any, propertyKey: string, parameterIndex: number) {
    const existingRequiredParameters: number[] = 
        Reflect.getOwnMetadata("required", target, propertyKey) || [];
    
    existingRequiredParameters.push(parameterIndex);
    
    Reflect.defineMetadata(
        "required",
        existingRequiredParameters,
        target,
        propertyKey
    );
}

function validate(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const method = descriptor.value;

    descriptor.value = function (...args: any[]) {
        const requiredParameters: number[] = 
            Reflect.getOwnMetadata("required", target, propertyKey) || [];

        for (const parameterIndex of requiredParameters) {
            if (parameterIndex >= args.length || args[parameterIndex] === undefined) {
                throw new Error(`Missing required argument at position ${parameterIndex}`);
            }
        }

        return method.apply(this, args);
    };
}

class UserService {
    @validate
    createUser(@required name: string, @required email: string, age?: number) {
        return { name, email, age };
    }
}

// 5. ACCESSOR DECORATOR
/**
 * Accessor decorator giống method decorator
 * Áp dụng cho getter/setter
 */

function configurable(value: boolean) {
    return function (
        target: any,
        propertyKey: string,
        descriptor: PropertyDescriptor
    ) {
        descriptor.configurable = value;
    };
}

class Point {
    private _x: number;
    private _y: number;

    constructor(x: number, y: number) {
        this._x = x;
        this._y = y;
    }

    @configurable(false)
    get x() {
        return this._x;
    }

    @configurable(false)
    get y() {
        return this._y;
    }
}

// 6. DECORATOR COMPOSITION - Kết hợp nhiều decorators
/**
 * Khi có nhiều decorators, chúng được evaluate theo thứ tự:
 * 1. Top-down: Decorator expressions được evaluate từ trên xuống
 * 2. Bottom-up: Kết quả được apply từ dưới lên
 */

function first() {
    console.log("first(): factory evaluated");
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        console.log("first(): called");
    };
}

function second() {
    console.log("second(): factory evaluated");
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        console.log("second(): called");
    };
}

class ExampleClass {
    @first()
    @second()
    method() {
        console.log("method called");
    }
}

// Output khi class được define:
// first(): factory evaluated
// second(): factory evaluated
// second(): called
// first(): called

// 7. PRACTICAL EXAMPLE - Ví dụ thực tế
function Autobind(target: any, methodName: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    const adjDescriptor: PropertyDescriptor = {
        configurable: true,
        enumerable: false,
        get() {
            return originalMethod.bind(this);
        }
    };
    return adjDescriptor;
}

class Printer {
    message = "This works!";

    @Autobind
    showMessage() {
        console.log(this.message);
    }
}

const printer = new Printer();
const button = document.createElement("button");
button.addEventListener("click", printer.showMessage); // 'this' vẫn trỏ đúng đến printer

export {};
