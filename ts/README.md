# TypeScript Learning Examples

Bộ tài liệu học TypeScript từ cơ bản đến nâng cao với 15 file ví dụ chi tiết.

## 📚 Danh sách Files

### 🟢 Cơ bản (Dễ hiểu)

| File | Chủ đề | Mức độ | Mô tả |
|------|--------|--------|-------|
| [01-basic-types.ts](./01-basic-types.ts) | Kiểu dữ liệu cơ bản | ⭐ | String, number, boolean, array, tuple, enum, any, unknown, void, never |
| [02-interfaces.ts](./02-interfaces.ts) | Interfaces | ⭐⭐ | Interface cơ bản, kế thừa, optional properties, readonly, index signature |
| [03-type-aliases.ts](./03-type-aliases.ts) | Type Aliases | ⭐⭐ | Union types, intersection types, type guards |
| [04-classes.ts](./04-classes.ts) | Classes | ⭐⭐ | OOP, inheritance, abstract class, access modifiers, getters/setters |
| [11-enums.ts](./11-enums.ts) | Enums | ⭐ | Numeric enum, string enum, const enum |

### 🟡 Trung bình (Cần chú ý)

| File | Chủ đề | Mức độ | Mô tả |
|------|--------|--------|-------|
| [05-generics.ts](./05-generics.ts) | Generics | ⭐⭐⭐ | Generic functions, classes, constraints, keyof, utility types |
| [08-modules.ts](./08-modules.ts) | Modules | ⭐⭐ | Import/export, module resolution, namespace, ambient modules |
| [09-async-patterns.ts](./09-async-patterns.ts) | Async Patterns | ⭐⭐⭐ | Promise, async/await, generators, retry, timeout patterns |
| [10-utility-types.ts](./10-utility-types.ts) | Utility Types | ⭐⭐⭐ | Partial, Pick, Omit, Record, ReturnType, Parameters, và nhiều hơn |

### 🔴 Nâng cao (Khó, có giải thích chi tiết)

| File | Chủ đề | Mức độ | Mô tả |
|------|--------|--------|-------|
| [06-advanced-types.ts](./06-advanced-types.ts) | Advanced Types | ⭐⭐⭐⭐ | Union, intersection, type guards, conditional types, infer, recursive types |
| [07-decorators.ts](./07-decorators.ts) | Decorators | ⭐⭐⭐⭐ | Class, method, property, parameter decorators, decorator composition |
| [12-type-narrowing.ts](./12-type-narrowing.ts) | Type Narrowing | ⭐⭐⭐⭐ | typeof, instanceof, in operator, type predicates, discriminated unions |
| [13-mapped-types.ts](./13-mapped-types.ts) | Mapped Types | ⭐⭐⭐⭐⭐ | Transform types, key remapping, conditional mapping |
| [14-conditional-types.ts](./14-conditional-types.ts) | Conditional Types | ⭐⭐⭐⭐⭐ | Conditional types, infer keyword, distributive types |
| [15-template-literal-types.ts](./15-template-literal-types.ts) | Template Literal Types | ⭐⭐⭐ | String manipulation types, event handlers, route types |

## 🎯 Lộ trình học tập đề xuất

### Tuần 1: Nền tảng
1. ✅ `01-basic-types.ts` - Làm quen với các kiểu dữ liệu
2. ✅ `02-interfaces.ts` - Hiểu về interfaces
3. ✅ `03-type-aliases.ts` - Type aliases và union/intersection
4. ✅ `04-classes.ts` - OOP trong TypeScript
5. ✅ `11-enums.ts` - Sử dụng enums

### Tuần 2: Trung cấp
6. ✅ `05-generics.ts` - **Quan trọng!** Generics là nền tảng cho nhiều pattern nâng cao
7. ✅ `10-utility-types.ts` - Các utility types built-in
8. ✅ `08-modules.ts` - Tổ chức code với modules
9. ✅ `09-async-patterns.ts` - Xử lý bất đồng bộ

### Tuần 3-4: Nâng cao
10. ✅ `12-type-narrowing.ts` - Thu hẹp kiểu
11. ✅ `06-advanced-types.ts` - **Khó!** Đọc kỹ phần giải thích
12. ✅ `13-mapped-types.ts` - **Rất khó!** Transform types
13. ✅ `14-conditional-types.ts` - **Rất khó!** Conditional types với infer
14. ✅ `15-template-literal-types.ts` - String manipulation
15. ✅ `07-decorators.ts` - Decorators (experimental)

## 💡 Lưu ý quan trọng

### Cấu hình TypeScript
File `tsconfig.json` đã được cấu hình để:
- ✅ Mỗi file là một module riêng biệt (không conflict)
- ✅ Hỗ trợ decorators (`experimentalDecorators: true`)
- ✅ Strict mode enabled
- ✅ Hỗ trợ DOM APIs (console, setTimeout, etc.)

### Các file khó cần đọc kỹ
Các file sau có **GIẢI THÍCH CHI TIẾT** ở đầu file:
- 📖 `05-generics.ts` - Giải thích về type parameters, constraints
- 📖 `06-advanced-types.ts` - Giải thích union, intersection, infer
- 📖 `07-decorators.ts` - Giải thích cách decorators hoạt động
- 📖 `12-type-narrowing.ts` - Giải thích type narrowing
- 📖 `13-mapped-types.ts` - Giải thích mapped types
- 📖 `14-conditional-types.ts` - Giải thích conditional types

### Một số lỗi có thể bỏ qua
- File `08-modules.ts`: Lỗi về module declarations (chỉ để demo)
- File `15-template-literal-types.ts`: Một số conflicts do override built-in types (để demo)

## 🚀 Cách sử dụng

### Chạy từng file riêng lẻ
```bash
# Sử dụng script run.sh (Đơn giản nhất)
./run.sh 01-basic-types.ts
./run.sh 05-generics.ts

# Hoặc compile thủ công
npx tsc 01-basic-types.ts --lib ES2018,DOM --target ES2020 --module commonjs
node 01-basic-types.js
```

### Kiểm tra type checking
```bash
# Check tất cả files
npm run check
# hoặc
tsc --noEmit

# ⚠️ LƯU Ý: Không chạy tsc với tên file cụ thể
# tsc --noEmit 05-generics.ts  ← SAI! Sẽ bỏ qua tsconfig.json
```

## 📖 Tài nguyên bổ sung

- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [TypeScript Deep Dive](https://basarat.gitbook.io/typescript/)
- [Type Challenges](https://github.com/type-challenges/type-challenges)

## ✨ Tips học tập

1. **Đừng vội vàng**: Bắt đầu từ file cơ bản, hiểu thật kỹ trước khi chuyển sang file khó hơn
2. **Thực hành**: Sửa đổi code, thử nghiệm để hiểu rõ hơn
3. **Đọc giải thích**: Các file khó đều có phần giải thích chi tiết ở đầu file
4. **Generics là chìa khóa**: File `05-generics.ts` rất quan trọng, nắm vững nó trước khi học các file nâng cao
5. **Kiên nhẫn với file khó**: `13-mapped-types.ts` và `14-conditional-types.ts` cần thời gian để hiểu

---

**Chúc bạn học tốt! 🎉**
