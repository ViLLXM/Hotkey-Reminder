"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = activate;
exports.deactivate = deactivate;
const vscode = __importStar(require("vscode"));
function activate(context) {
    let t;
    let t_i;
    let time_between_messages = context.globalState.get('time_between', 1000 * 60 * 60);
    let keys = [
        'Ctrl + P - Быстрый поиск файлов',
        'Ctrl + S - Сохранить файл',
        'Alt + F - Поиск по коду',
        'Ctrl + Shift + P - Командная палитра',
        'Alt + Down / Up - Переместить строку вверх/вниз',
        'Ctrl + / - Закомментировать строку',
        'Ctrl + Shift + K - Удалить строку',
        'Ctrl + D - Выделить следующее вхождение'
    ];
    let user_hotkeys = context.globalState.get('user_hotkeys', []);
    function showHotkeys() {
        const all_hotkeys = [...keys, ...user_hotkeys];
        const message = all_hotkeys.join('\n');
        vscode.window.showInformationMessage(message, { modal: true });
    }
    const hotkeys = [
        vscode.commands.registerCommand('hotkey-reminder.show_hotkeys', showHotkeys),
        vscode.commands.registerCommand('hotkey-reminder.start_timer', () => {
            t = setTimeout(() => showHotkeys(), time_between_messages);
            vscode.window.showInformationMessage("Timer started");
        }),
        vscode.commands.registerCommand('hotkey-reminder.start_interval_timer', () => {
            t_i = setInterval(() => showHotkeys(), time_between_messages);
            vscode.window.showInformationMessage("Interval timer started");
        }),
        vscode.commands.registerCommand('hotkey-reminder.end_timer', () => {
            if (t) {
                clearTimeout(t);
            }
            if (t_i) {
                clearInterval(t_i);
            }
            vscode.window.showInformationMessage("All timers ended");
        }),
        vscode.commands.registerCommand('hotkey-reminder.add_hotkey', async () => {
            const input = await vscode.window.showInputBox({
                prompt: 'Input new hotkey:',
                placeHolder: 'Ctrl + Shift + K - Удалить строку'
            });
            if (!input || !input.trim()) {
                vscode.window.showWarningMessage("Void hotkey can't be added");
                return;
            }
            user_hotkeys.push(input);
            await context.globalState.update('user_hotkeys', user_hotkeys);
            vscode.window.showInformationMessage(`Hotkey "${input}" was added`);
        }),
        vscode.commands.registerCommand('hotkey-reminder.delete_hotkey', async () => {
            if (user_hotkeys.length === 0) {
                vscode.window.showWarningMessage("No user hotkeys to delete");
                return;
            }
            const deleted = user_hotkeys.pop();
            await context.globalState.update('user_hotkeys', user_hotkeys);
            vscode.window.showInformationMessage(`Hotkey "${deleted}" was deleted`);
        }),
        vscode.commands.registerCommand('hotkey-reminder.delete_all_hotkey', async () => {
            user_hotkeys = [];
            await context.globalState.update('user_hotkeys', user_hotkeys);
            vscode.window.showInformationMessage('All hotkeys were deleted');
        }),
        vscode.commands.registerCommand('hotkey-reminder.change_time_in_timers', async () => {
            const input = await vscode.window.showInputBox({
                prompt: 'Input new time in seconds:',
                placeHolder: '3600'
            });
            if (!input || !input.trim()) {
                vscode.window.showWarningMessage("Time value cannot be empty");
                return;
            }
            const temp = parseFloat(input);
            if (isNaN(temp) || temp <= 0) {
                vscode.window.showWarningMessage("Please enter a valid positive number");
                return;
            }
            time_between_messages = 1000 * temp;
            await context.globalState.update('time_between', time_between_messages);
            vscode.window.showInformationMessage(`Time changed to ${input} seconds`);
        })
    ];
    context.subscriptions.push(...hotkeys);
}
function deactivate() { }
//# sourceMappingURL=extension.js.map