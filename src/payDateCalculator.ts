/**
 * A utility class to calculate the next valid loan due date
 * based on pay schedule, funding date, holidays, and deposit method.
 */

class PayDateCalculator {
    /**
     * Calculates the first valid due date after a loan is funded.
     *
     * Rules:
     * - Due date must be at least 10 days after the fund date
     * - Must fall on a pay date based on the user's frequency
     * - Must avoid weekends and holidays
     * - If adjustment is needed:
     *   - move forward if hasDirectDeposit is true
     *   - move backward if hasDirectDeposit is false
     *
     * @param fundDay - The date the loan was funded
     * @param holidays - List of holidays to avoid
     * @param paySpan - Frequency of pay dates ("weekly", "bi-weekly", "monthly")
     * @param payDay - A known recurring pay day
     * @param hasDirectDeposit - Determines direction of adjustment if needed
     * @returns A valid due date
   */
    public calculateDueDate(
        fundDay: Date,
        holidays: Date[],
        paySpan: string,
        payDay: Date,
        hasDirectDeposit: boolean
    ): Date {
        const minDueDate = this.addDays(fundDay, 10);
        let dueDate = this.calculateNextPayDate(minDueDate, paySpan, payDay);
        return this.adjustDate(dueDate, holidays, hasDirectDeposit);
    }

    /**
     * Finds the next pay date after a given date, based on a recurring pay schedule.
     *
     * @param afterDate - The date after which to find the next pay date
     * @param paySpan - Frequency of pay ("weekly", "bi-weekly", or "monthly")
     * @param referencePayDate - A known valid pay date to use as anchor
     * @returns The next pay date on or after the given date
   */
    private calculateNextPayDate(afterDate: Date, paySpan: string, referencePayDate: Date): Date {
        const normalizedAfter = this.normalize(afterDate);
        let payDate = this.normalize(referencePayDate);

        if (paySpan === "bi-weekly") {
            const daysDiff = (normalizedAfter.getTime() - payDate.getTime()) / (1000 * 60 * 60 * 24);
            const periods = Math.ceil(daysDiff / 14);
            payDate = this.addDays(payDate, periods * 14);

            if (payDate.getTime() === normalizedAfter.getTime()) {
                payDate = this.addDays(payDate, 14);
            }
        } else if (paySpan === "weekly") {
            const daysDiff = (normalizedAfter.getTime() - payDate.getTime()) / (1000 * 60 * 60 * 24);
            const periods = Math.ceil(daysDiff / 7);
            payDate = this.addDays(payDate, periods * 7);

            if (payDate.getTime() === normalizedAfter.getTime()) {
                payDate = this.addDays(payDate, 7);
            }
        } else if (paySpan === "monthly") {
            const refDay = referencePayDate.getUTCDate();
            let year = normalizedAfter.getUTCFullYear();
            let month = normalizedAfter.getUTCMonth();

            if (refDay <= normalizedAfter.getUTCDate()) {
                month += 1;
                if (month > 11) {
                    month = 0;
                    year += 1;
                }
            }

            let tentative = new Date(Date.UTC(year, month, refDay));

            // Adjust backward if the month overflowed
            while (tentative.getUTCMonth() !== month) {
                tentative = this.addDays(tentative, -1);
            }

            payDate = this.normalize(tentative);

            // Fixed the syntax error in this condition
            const isSameMonth = payDate.getUTCMonth() === normalizedAfter.getUTCMonth();
            const isNextMonth = payDate.getUTCMonth() === ((normalizedAfter.getUTCMonth() + 1) % 12);

            // If the month has changed unexpectedly (e.g., invalid day like Feb 30), correct it
            if (!isSameMonth && !isNextMonth) {
                payDate = this.addDays(payDate, -1);
            }
        } else {
            throw new Error(`Invalid paySpan: ${paySpan}`);
        }

        return payDate;
    }

    /**
     * Adjusts a given date to skip weekends and holidays.
     *
     * @param date - The initial date
     * @param holidays - List of holidays to avoid
     * @param reverse - If true, adjusts backward; otherwise forward
     * @returns A valid business day  
   */
    private adjustDate(date: Date, holidays: Date[], forward: boolean): Date {
        let adjusted = this.normalize(date);
        while (this.isWeekend(adjusted) || this.isHoliday(adjusted, holidays)) {
            adjusted = this.addDays(adjusted, forward ? 1 : -1);
        }

        return adjusted;
    }

    /**
     * Checks if a given date falls on a weekend.
     *
     * @param date - Date to check  
     * @returns True if it's Saturday or Sunday
    */
    private isWeekend(date: Date): boolean {
        const day = date.getUTCDay();
        return day === 0 || day === 6;
    }

    /**
     * Checks if a given date matches any holiday in the list.
     *  
     * @param date - Date to check
     * @param holidays - List of holiday dates
     * @returns True if the date is a holiday
   */
    private isHoliday(date: Date, holidays: Date[]): boolean {
        const normalizedDate = this.normalize(date);
        return holidays.some(h => this.normalize(h).getTime() === normalizedDate.getTime());
    }

    /**
     * Adds a number of days to a given date.
     *
     * @param date - Starting date 
     * @param days - Number of days to add (can be negative)
     * @returns A new normalized date 
   */
    private addDays(date: Date, days: number): Date {
        const result = new Date(date);
        result.setUTCDate(result.getUTCDate() + days);
        return this.normalize(result);
    }

    /**
     * Adds a number of months to a given date.
     *
     * @param date - Starting date  
     * @param months - Number of months to add  
     * @returns A new normalized date
    */
    private addMonths(date: Date, months: number): Date {
        const result = new Date(date);
        result.setUTCMonth(result.getUTCMonth() + months);
        return this.normalize(result);
    }

    /**
     * Normalizes a date to midnight UTC (00:00:00).
     *
     * @param date - Date to normalize
     * @returns A new Date at UTC midnight
    */
    private normalize(date: Date): Date {
        return new Date(Date.UTC(
            date.getUTCFullYear(),
            date.getUTCMonth(),
            date.getUTCDate()
        ));
    }
}

export default PayDateCalculator;