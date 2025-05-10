import PayDateCalculator from '../src/payDateCalculator';

describe('PayDateCalculator', () => {
    const calculator = new PayDateCalculator();

    const holidays = [
        new Date('2024-05-27'), // Memorial Day
        new Date('2024-07-04')  // Independence Day
    ];

    test('should calculate bi-weekly due date at least 10 days after fund date with direct deposit', () => {
        const result = calculator.calculateDueDate(
            new Date('2024-05-01'),
            holidays,
            'bi-weekly',
            new Date('2024-05-10'),
            true
        );

        expect(result.toISOString().slice(0, 10)).toBe('2024-05-24');
    });

    test('should calculate weekly due date and adjust for weekend if no direct deposit', () => {
        const result = calculator.calculateDueDate(
            new Date('2024-05-01'),
            holidays,
            'weekly',
            new Date('2024-05-10'), // Friday
            false // no direct deposit, so adjust backward
        );

        expect(result.toISOString().slice(0, 10)).toBe('2024-05-17');
    });

    test('should calculate monthly due date with holiday adjustment', () => {
        const result = calculator.calculateDueDate(
            new Date('2024-06-01'),
            [new Date('2024-06-27')],
            'monthly',
            new Date('2024-06-27'),
            true
        );

        expect(result.toISOString().slice(0, 10)).toBe('2024-06-28');
    });

    test('should skip over holiday and adjust forward', () => {
        const result = calculator.calculateDueDate(
            new Date('2024-05-15'),
            [new Date('2024-05-27')],
            'monthly',
            new Date('2024-05-27'),
            true //adjust forward
        );

        expect(result.toISOString().slice(0, 10)).toBe('2024-05-28');
    });

    test('should throw on invalid paySpan', () => {
        expect(() => {
            calculator.calculateDueDate(
                new Date('2024-05-01'),
                holidays,
                'quarterly', // Invalid
                new Date('2024-05-10'),
                true
            );
        }).toThrow('Invalid paySpan');
    });
});
