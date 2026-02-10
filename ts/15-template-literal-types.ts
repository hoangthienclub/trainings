/**
 * 15. TEMPLATE LITERAL TYPES - Kiểu chuỗi mẫu
 * 
 * GIẢI THÍCH CHI TIẾT:
 * Template literal types cho phép tạo string types mới
 * bằng cách kết hợp các string literal types
 */

// 1. Basic template literal
type World = "world";
type Greeting = `hello ${World}`; // "hello world"

// 2. Union trong template
type Color = "red" | "green" | "blue";
type Shade = "light" | "dark";
type ColorShade = `${Shade}-${Color}`;
// "light-red" | "light-green" | "light-blue" | "dark-red" | ...

// 3. Event handlers
type EventName = "click" | "focus" | "blur";
type EventHandler = `on${Capitalize<EventName>}`;
// "onClick" | "onFocus" | "onBlur"

// 4. String manipulation types
type Uppercase<S extends string> = intrinsic;
type Lowercase<S extends string> = intrinsic;
type Capitalize<S extends string> = intrinsic;
type Uncapitalize<S extends string> = intrinsic;

type UpperHello = Uppercase<"hello">; // "HELLO"
type LowerHello = Lowercase<"HELLO">; // "hello"
type CapHello = Capitalize<"hello">; // "Hello"
type UncapHello = Uncapitalize<"Hello">; // "hello"

// 5. Getter/Setter types
type PropEventSource<T> = {
    on<K extends string & keyof T>(
        eventName: `${K}Changed`,
        callback: (newValue: T[K]) => void
    ): void;
};

type User = {
    name: string;
    age: number;
};

declare function makeWatchedObject<T>(obj: T): T & PropEventSource<T>;

const user = makeWatchedObject({
    name: "An",
    age: 25
});

user.on("nameChanged", (newName) => {
    console.log(newName.toUpperCase());
});

// 6. Route paths
type Route = "/users" | "/products" | "/orders";
type RouteWithId = `${Route}/:id`;
// "/users/:id" | "/products/:id" | "/orders/:id"

// 7. CSS properties
type CSSProperty = "color" | "background" | "border";
type CSSValue = string;
type CSSRule = `${CSSProperty}: ${CSSValue}`;

// 8. API endpoints
type Method = "GET" | "POST" | "PUT" | "DELETE";
type Endpoint = "/api/users" | "/api/products";
type APIRoute = `${Method} ${Endpoint}`;

export {};
