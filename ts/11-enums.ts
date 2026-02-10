/**
 * 11. ENUMS - Kiểu liệt kê
 */

// Numeric Enum
enum Direction {
    Up,    // 0
    Down,  // 1
    Left,  // 2
    Right  // 3
}

let dir: Direction = Direction.Up;

// Enum với giá trị tùy chỉnh
enum Status {
    Pending = 1,
    Approved = 2,
    Rejected = 3
}

// String Enum
enum Color {
    Red = "RED",
    Green = "GREEN",
    Blue = "BLUE"
}

// Heterogeneous Enum (ít dùng)
enum Mixed {
    No = 0,
    Yes = "YES"
}

// Const Enum - Tối ưu hơn, bị inline khi compile
const enum HttpStatus {
    OK = 200,
    NotFound = 404,
    ServerError = 500
}

let status = HttpStatus.OK; // Compile thành: let status = 200

// Enum as object
enum LogLevel {
    Error,
    Warning,
    Info,
    Debug
}

function log(level: LogLevel, message: string) {
    console.log(`[${LogLevel[level]}] ${message}`);
}

log(LogLevel.Error, "Something went wrong");

// Reverse mapping (chỉ numeric enum)
console.log(Direction[0]); // "Up"
console.log(Direction.Up); // 0

export {};
