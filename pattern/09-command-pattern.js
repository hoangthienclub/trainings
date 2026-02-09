/**
 * COMMAND PATTERN
 * ===============
 * 
 * Định nghĩa:
 * Command Pattern đóng gói một request thành một object, cho phép bạn
 * parameterize clients với các requests khác nhau, queue requests,
 * log requests, và hỗ trợ undo operations.
 * 
 * Khi nào sử dụng:
 * - Khi muốn queue operations
 * - Khi cần undo/redo functionality
 * - Khi muốn log changes
 * - Khi muốn decouple sender và receiver
 * 
 * Ưu điểm:
 * - Decoupling giữa invoker và receiver
 * - Dễ dàng thêm commands mới
 * - Hỗ trợ undo/redo
 * - Có thể compose commands
 * 
 * Nhược điểm:
 * - Tăng số lượng classes
 * - Code phức tạp hơn
 */

// ============================================
// VÍ DỤ 1: Text Editor với Undo/Redo
// ============================================

class Command {
    execute() {
        throw new Error('execute() must be implemented');
    }

    undo() {
        throw new Error('undo() must be implemented');
    }
}

class TextEditor {
    constructor() {
        this.content = '';
    }

    write(text) {
        this.content += text;
    }

    delete(length) {
        this.content = this.content.slice(0, -length);
    }

    getContent() {
        return this.content;
    }
}

class WriteCommand extends Command {
    constructor(editor, text) {
        super();
        this.editor = editor;
        this.text = text;
    }

    execute() {
        this.editor.write(this.text);
        console.log(`✏️  Wrote: "${this.text}"`);
    }

    undo() {
        this.editor.delete(this.text.length);
        console.log(`↩️  Undid write: "${this.text}"`);
    }
}

class CommandHistory {
    constructor() {
        this.history = [];
        this.currentIndex = -1;
    }

    execute(command) {
        command.execute();
        this.history = this.history.slice(0, this.currentIndex + 1);
        this.history.push(command);
        this.currentIndex++;
    }

    undo() {
        if (this.currentIndex >= 0) {
            this.history[this.currentIndex].undo();
            this.currentIndex--;
        } else {
            console.log('❌ Nothing to undo');
        }
    }

    redo() {
        if (this.currentIndex < this.history.length - 1) {
            this.currentIndex++;
            this.history[this.currentIndex].execute();
            console.log('↪️  Redid last action');
        } else {
            console.log('❌ Nothing to redo');
        }
    }
}

// ============================================
// VÍ DỤ 2: Remote Control
// ============================================

class Light {
    constructor(location) {
        this.location = location;
        this.isOn = false;
    }

    on() {
        this.isOn = true;
        console.log(`💡 ${this.location} light is ON`);
    }

    off() {
        this.isOn = false;
        console.log(`🌑 ${this.location} light is OFF`);
    }
}

class LightOnCommand extends Command {
    constructor(light) {
        super();
        this.light = light;
    }

    execute() {
        this.light.on();
    }

    undo() {
        this.light.off();
    }
}

class LightOffCommand extends Command {
    constructor(light) {
        super();
        this.light = light;
    }

    execute() {
        this.light.off();
    }

    undo() {
        this.light.on();
    }
}

class RemoteControl {
    constructor() {
        this.commands = {};
        this.history = [];
    }

    setCommand(button, command) {
        this.commands[button] = command;
    }

    pressButton(button) {
        if (this.commands[button]) {
            this.commands[button].execute();
            this.history.push(this.commands[button]);
        }
    }

    pressUndo() {
        if (this.history.length > 0) {
            const command = this.history.pop();
            command.undo();
        }
    }
}

// ============================================
// DEMO
// ============================================

console.log('\n========== COMMAND PATTERN DEMO ==========\n');

// Test 1: Text Editor
console.log('--- Text Editor with Undo/Redo ---');
const editor = new TextEditor();
const history = new CommandHistory();

history.execute(new WriteCommand(editor, 'Hello '));
history.execute(new WriteCommand(editor, 'World'));
console.log('Content:', editor.getContent());

history.undo();
console.log('After undo:', editor.getContent());

history.redo();
console.log('After redo:', editor.getContent());

// Test 2: Remote Control
console.log('\n--- Remote Control ---');
const livingRoomLight = new Light('Living Room');
const remote = new RemoteControl();

remote.setCommand('1', new LightOnCommand(livingRoomLight));
remote.setCommand('2', new LightOffCommand(livingRoomLight));

remote.pressButton('1');
remote.pressButton('2');
remote.pressUndo();
