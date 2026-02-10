/**
 * 09. ASYNC PATTERNS - Xử lý bất đồng bộ
 */

// Promise cơ bản
function delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

function fetchUser(id: number): Promise<{ id: number; name: string }> {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (id > 0) {
                resolve({ id, name: "Nguyễn Văn A" });
            } else {
                reject(new Error("Invalid user ID"));
            }
        }, 1000);
    });
}

// Async/await
async function getUserData(id: number): Promise<string> {
    try {
        const user = await fetchUser(id);
        return `User: ${user.name}`;
    } catch (error) {
        console.error("Error:", error);
        throw error;
    }
}

// Promise.all - Chờ tất cả
async function getAllUsers() {
    const users = await Promise.all([
        fetchUser(1),
        fetchUser(2),
        fetchUser(3)
    ]);
    return users;
}

// Async Generator
async function* generateNumbers(count: number): AsyncGenerator<number> {
    for (let i = 1; i <= count; i++) {
        await delay(500);
        yield i;
    }
}

// Retry pattern
async function retry<T>(
    fn: () => Promise<T>,
    maxRetries: number = 3
): Promise<T> {
    let lastError: Error;
    for (let i = 0; i < maxRetries; i++) {
        try {
            return await fn();
        } catch (error) {
            lastError = error as Error;
        }
    }
    throw lastError!;
}

// Timeout pattern
async function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
    const timeout = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error("Timeout")), ms);
    });
    return Promise.race([promise, timeout]);
}

export {};
