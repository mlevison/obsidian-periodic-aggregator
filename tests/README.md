# Tests

This directory contains unit tests for the Obsidian Periodic Aggregator plugin.

## Test Structure

```
tests/
├── README.md           # This file
└── utils/
    └── quarter-utils.test.ts  # Tests for quarter utility functions
```

## Running Tests

To run all tests:
```bash
npm test
```

To run tests in watch mode during development:
```bash
npm run test -- --watch
```

To run tests with coverage:
```bash
npm run test -- --coverage
```

## Test Framework

- **Jest**: Testing framework with built-in assertion library
- **ts-jest**: TypeScript transformer for Jest
- **@types/jest**: TypeScript definitions for Jest

## Test Categories

### quarter-utils.test.ts

Comprehensive unit tests for the `generateQuarters()` function, covering:

- **Basic functionality**: Default behavior, parameter handling, edge cases
- **Quarter structure**: Validation of QuarterInfo interface properties
- **Timing and ordering**: Chronological order, correct start/end dates
- **Date scenarios**: Testing with different quarters (Q1-Q4)
- **Year boundaries**: Leap years, year transitions
- **Label formatting**: String format validation
- **Edge cases**: Very early/late dates, boundary conditions
- **Consistency**: Deterministic behavior, sequence integrity

Also includes tests for the `getCurrentQuarter()` function.

## Writing New Tests

When adding new test files:

1. Place them in the appropriate subdirectory under `tests/`
2. Use the `.test.ts` suffix for TypeScript test files
3. Follow the existing naming pattern: `[module-name].test.ts`
4. Use descriptive `describe` blocks to group related tests
5. Write clear, specific test descriptions
6. Include edge cases and error conditions

Example test structure:
```typescript
describe('MyModule', () => {
  describe('basic functionality', () => {
    test('should do something when given valid input', () => {
      // Test implementation
    });
  });
  
  describe('edge cases', () => {
    test('should handle invalid input gracefully', () => {
      // Test implementation
    });
  });
});
```

## Best Practices

- **Arrange, Act, Assert**: Structure tests with clear setup, execution, and verification
- **Test one thing**: Each test should verify a single behavior
- **Use descriptive names**: Test names should explain what is being tested
- **Mock dependencies**: Use Jest mocks for external dependencies
- **Test edge cases**: Include boundary conditions and error scenarios
- **Keep tests independent**: Tests should not depend on each other