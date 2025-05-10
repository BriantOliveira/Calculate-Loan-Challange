# 📅 Pay Date Calculator

A TypeScript utility that calculates the first valid loan due date based on funding date, pay schedule, holidays, and direct deposit status.

## 🚀 Features

- Supports `weekly`, `bi-weekly`, and `monthly` pay schedules
- Ensures the due date is at least 10 days after funding
- Automatically adjusts for weekends and holidays
- Respects direct deposit flag for forward/backward adjustments

## 🧪 Running Tests

```bash
npm install
npm test
```

## 🚀 Running App

```bash
npm start
```

## 🛠 Build

```
npm run build
```

## 📄 Example

```
const calculator = new PayDateCalculator();

const dueDate = calculator.calculateDueDate(
  new Date('2024-05-01'),
  [new Date('2024-05-27')],
  'bi-weekly',
  new Date('2024-05-10'),
  true
);

console.log(dueDate.toISOString()); // '2024-05-24T00:00:00.000Z'
```
