#!/bin/bash
# Script để chạy từng file TypeScript riêng lẻ

FILE=$1

if [ -z "$FILE" ]; then
    echo "Usage: ./run.sh <filename.ts>"
    echo "Example: ./run.sh 01-basic-types.ts"
    exit 1
fi

# Compile và chạy file
echo "🔨 Compiling $FILE..."
npx tsc "$FILE" --lib ES2018,DOM --target ES2020 --module commonjs

# Lấy tên file .js
JS_FILE="${FILE%.ts}.js"

if [ -f "$JS_FILE" ]; then
    echo "▶️  Running $JS_FILE..."
    node "$JS_FILE"
    
    # Xóa file .js sau khi chạy (optional)
    # rm "$JS_FILE"
else
    echo "❌ Compilation failed"
    exit 1
fi
