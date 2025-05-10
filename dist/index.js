"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const payDateCalculator_1 = __importDefault(require("./payDateCalculator"));
const calculator = new payDateCalculator_1.default();
const fundDay = new Date('2024-05-01');
const holidays = [new Date('2024-05-27')]; // Memorial Day
const paySpan = 'bi-weekly';
const payDay = new Date('2024-05-10'); // Friday
const hasDirectDeposit = true;
const dueDate = calculator.calculateDueDate(fundDay, holidays, paySpan, payDay, hasDirectDeposit);
console.log('Calculated Due Date:', dueDate.toUTCString());
// Expected Output: "Fri May 24 2024"
