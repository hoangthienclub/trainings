/**
 * 08. MODULES - Hệ thống module trong TypeScript
 * 
 * GIẢI THÍCH CHI TIẾT:
 * Modules giúp tổ chức code thành các file riêng biệt, dễ maintain và tái sử dụng.
 * TypeScript hỗ trợ cả ES6 modules (import/export) và CommonJS (require/module.exports)
 */

// ============================================
// EXPORT - Xuất ra ngoài module
// ============================================

// 1. Named Exports - Export có tên
export const PI = 3.14159;
export const E = 2.71828;

export function add(a: number, b: number): number {
    return a + b;
}

export function subtract(a: number, b: number): number {
    return a - b;
}

export class Calculator {
    multiply(a: number, b: number): number {
        return a * b;
    }
}

export interface User {
    id: number;
    name: string;
    email: string;
}

export type Status = "active" | "inactive" | "pending";

// 2. Export với alias
function internalFunction() {
    return "internal";
}

export { internalFunction as publicFunction };

// 3. Re-export - Export lại từ module khác
// export { User, Product } from './types';
// export * from './utils';
// export * as utils from './utils';

// 4. Default Export - Export mặc định (chỉ 1 default export per file)
export default class DefaultCalculator {
    add(a: number, b: number): number {
        return a + b;
    }
}

// Hoặc export default sau khi define
class AnotherClass {
    // ...
}
// export default AnotherClass;

// ============================================
// IMPORT - Nhập vào module
// ============================================

// 1. Named Imports
// import { PI, add, Calculator } from './math';
// import { User, Status } from './types';

// 2. Import với alias
// import { add as addition } from './math';
// import { User as UserType } from './types';

// 3. Import tất cả
// import * as MathUtils from './math';
// MathUtils.add(1, 2);
// MathUtils.PI;

// 4. Import default export
// import DefaultCalculator from './calculator';
// import MyCalculator from './calculator'; // Có thể đặt tên bất kỳ

// 5. Import cả default và named
// import DefaultCalculator, { PI, add } from './calculator';

// 6. Import chỉ để side effects (không import gì cả)
// import './polyfills';

// 7. Dynamic Import - Import động
async function loadModule() {
    const module = await import('./math');
    module.add(1, 2);
}

// ============================================
// MODULE RESOLUTION - Cách TypeScript tìm modules
// ============================================

/**
 * TypeScript có 2 strategies để resolve modules:
 * 
 * 1. Classic (ít dùng):
 *    - Relative imports: tìm file .ts, .tsx, .d.ts
 *    - Non-relative: tìm từ thư mục hiện tại lên parent
 * 
 * 2. Node (phổ biến):
 *    - Giống Node.js resolution
 *    - Tìm trong node_modules
 *    - Hỗ trợ package.json
 */

// Relative imports (bắt đầu với ./ hoặc ../)
// import { User } from './types';
// import { Config } from '../config';

// Non-relative imports (không bắt đầu với ./ hoặc ../)
// import { Component } from '@angular/core';
// import * as React from 'react';

// ============================================
// NAMESPACE - Tổ chức code (cách cũ, ít dùng)
// ============================================

namespace Validation {
    export interface StringValidator {
        isValid(s: string): boolean;
    }

    export class EmailValidator implements StringValidator {
        isValid(s: string): boolean {
            return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
        }
    }

    export class PhoneValidator implements StringValidator {
        isValid(s: string): boolean {
            return /^\d{10}$/.test(s);
        }
    }
}

// Sử dụng namespace
const emailValidator = new Validation.EmailValidator();
console.log(emailValidator.isValid("test@example.com"));

// Namespace lồng nhau
namespace Company {
    export namespace HR {
        export class Employee {
            constructor(public name: string) {}
        }
    }

    export namespace IT {
        export class Developer {
            constructor(public name: string) {}
        }
    }
}

const dev = new Company.IT.Developer("An");

// ============================================
// AMBIENT MODULES - Khai báo module từ bên ngoài
// ============================================

/**
 * Dùng để khai báo type cho thư viện JavaScript không có types
 * Thường đặt trong file .d.ts
 */

declare module "my-library" {
    export function doSomething(value: string): void;
    export default class MyClass {
        constructor(config: any);
    }
}

// Sau đó có thể import
// import MyClass, { doSomething } from 'my-library';

// Wildcard module declarations
declare module "*.json" {
    const value: any;
    export default value;
}

declare module "*.css" {
    const content: { [className: string]: string };
    export default content;
}

// ============================================
// BEST PRACTICES
// ============================================

/**
 * 1. Ưu tiên ES6 modules (import/export) thay vì namespace
 * 2. Sử dụng named exports cho multiple exports
 * 3. Sử dụng default export cho main export của module
 * 4. Tránh circular dependencies
 * 5. Tổ chức code theo feature/domain
 * 6. Sử dụng barrel exports (index.ts) để đơn giản hóa imports
 */

// Ví dụ barrel export trong index.ts:
// export * from './user';
// export * from './product';
// export * from './order';
// 
// Thay vì:
// import { User } from './models/user';
// import { Product } from './models/product';
// 
// Có thể:
// import { User, Product } from './models';

// ============================================
// EXAMPLE: File structure tốt
// ============================================

/**
 * src/
 * ├── models/
 * │   ├── user.ts
 * │   ├── product.ts
 * │   └── index.ts (barrel export)
 * ├── services/
 * │   ├── user.service.ts
 * │   ├── product.service.ts
 * │   └── index.ts
 * ├── utils/
 * │   ├── validation.ts
 * │   ├── formatting.ts
 * │   └── index.ts
 * └── index.ts (main entry point)
 */

// File này đã có export default ở trên nên không cần export {} thêm
