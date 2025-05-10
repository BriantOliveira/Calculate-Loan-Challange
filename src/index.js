"use strict";
class PayDateCalculator {
    calculateDueDate(fundDay, holidays, paySpan, payDay, hasDirectDeposit) {
        const minDueDate = this.addDays(fundDay, 10);
        const payDates = this.generatePayDates(paySpan, payDay, minDueDate, 365);
        for (let date of payDates) {
            if (date >= minDueDate) {
                const adjustedDate = this.adjustDate(date, holidays, hasDirectDeposit);
                return adjustedDate;
            }
        }
        throw new Error("No valid due date found.");
    }
    generatePayDates(span, start, after, limit) {
        const dates = [];
        let current = new Date(start);
        while (dates.length < limit) {
            if (current >= after)
                dates.push(new Date(current));
            if (span === "weekly")
                current = this.addDays(current, 7);
            else if (span === "bi-weekly")
                current = this.addDays(current, 14);
            else if (span === "monthly")
                current = this.addMonths(current, 1);
            else
                throw new Error("Invalid pay span");
        }
        return dates;
    }
    adjustDate(date, holidays, forward) {
        let adjusted = new Date(date);
        while (this.isWeekend(adjusted) || this.isHoliday(adjusted, holidays)) {
            adjusted = this.addDays(adjusted, forward ? 1 : -1);
        }
        return adjusted;
    }
    isWeekend(date) {
        const day = date.getDay();
        return day === 0 || day === 6;
    }
    isHoliday(date, holidays) {
        return holidays.some((h) => h.toDateString() === date.toDateString());
    }
    addDays(date, days) {
        const result = new Date(date);
        result.setDate(result.getDate() + days);
        return result;
    }
    addMonths(date, months) {
        const result = new Date(date);
        result.setMonth(result.getMonth() + months);
        return result;
    }
}
// Example usage
const calculator = new PayDateCalculator();
const dueDate = calculator.calculateDueDate(new Date('2024-05-01'), [new Date('2024-05-27'), new Date('2024-07-04')], 'bi-weekly', new Date('2024-05-10'), true);
console.log('Calculated Due Date:', dueDate.toDateString());
