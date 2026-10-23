const Menu = require('../models/Menu');
const formatValidationError = require('../utils/formatValidationError');

function assert(condition, message) {
  if (!condition) {
    throw new Error(`Assertion failed: ${message}`);
  }
}

async function runTask5UnitTests() {
  console.log('=== Running Task 5: Schema & ValidationError Tests ===');

  // Test 1: Valid document passes validation
  console.log('Test 1: Valid menu item validation');
  const validDoc = new Menu({
    name: '  Samosa Chaat  ', // should be trimmed
    price: 35.00,
    category: 'snack',
    caloriesPer100g: 220,
    weightG: 150
  });

  const validErr = validDoc.validateSync();
  assert(!validErr, `Expected no validation error, got: ${validErr}`);
  assert(validDoc.name === 'Samosa Chaat', `Expected trimmed name, got "${validDoc.name}"`);
  assert(validDoc.available === true, 'Expected default available to be true');
  console.log('✓ Passed');

  // Test 2: Category defaults to snack
  console.log('Test 2: Default category is snack');
  const defaultCatDoc = new Menu({
    name: 'Puff',
    price: 20,
    caloriesPer100g: 180
  });
  defaultCatDoc.validateSync();
  assert(defaultCatDoc.category === 'snack', `Expected category 'snack', got '${defaultCatDoc.category}'`);
  assert(defaultCatDoc.weightG === 100, `Expected default weightG 100, got ${defaultCatDoc.weightG}`);
  console.log('✓ Passed');

  // Test 3: Drink weight <= 500g passes
  console.log('Test 3: Drink weight at 500g passes validation');
  const drink500 = new Menu({
    name: 'Fresh Lime Soda',
    price: 30,
    category: 'drink',
    caloriesPer100g: 40,
    weightG: 500
  });
  const drink500Err = drink500.validateSync();
  assert(!drink500Err, `Drink at 500g should pass, got error: ${drink500Err}`);
  console.log('✓ Passed');

  // Test 4: Drink weight > 500g fails
  console.log('Test 4: Drink weight > 500g fails validation');
  const drink600 = new Menu({
    name: 'Mega Shake',
    price: 80,
    category: 'drink',
    caloriesPer100g: 120,
    weightG: 600
  });
  const drink600Err = drink600.validateSync();
  assert(drink600Err, 'Drink at 600g must fail validation');
  assert(drink600Err.errors.weightG, 'Expected weightG validation error');
  console.log('✓ Passed');

  // Test 5: Meal with 600g passes (only drinks restricted to 500g)
  console.log('Test 5: Meal weight at 600g passes (max 2000g)');
  const meal600 = new Menu({
    name: 'Special Lunch Platter',
    price: 150,
    category: 'meal',
    caloriesPer100g: 130,
    weightG: 600
  });
  const meal600Err = meal600.validateSync();
  assert(!meal600Err, `Meal at 600g should pass, got error: ${meal600Err}`);
  console.log('✓ Passed');

  // Test 6: Invalid category fails
  console.log('Test 6: Invalid category fails');
  const invalidCat = new Menu({
    name: 'Invalid Item',
    price: 50,
    category: 'dessert',
    caloriesPer100g: 100
  });
  const invalidCatErr = invalidCat.validateSync();
  assert(invalidCatErr && invalidCatErr.errors.category, 'Expected category error');
  console.log('✓ Passed');

  // Test 7: caloriesPer100g > 900 fails
  console.log('Test 7: caloriesPer100g > 900 fails');
  const highCal = new Menu({
    name: 'Super Fat',
    price: 50,
    category: 'snack',
    caloriesPer100g: 950
  });
  const highCalErr = highCal.validateSync();
  assert(highCalErr && highCalErr.errors.caloriesPer100g, 'Expected caloriesPer100g error');
  console.log('✓ Passed');

  // Test 8: formatValidationError output structure
  console.log('Test 8: formatValidationError returns exact required object structure');
  const multiInvalid = new Menu({
    name: '', // missing
    price: -5, // negative
    category: 'invalid',
    caloriesPer100g: -10,
    weightG: 0
  });
  const multiErr = multiInvalid.validateSync();
  const formatted = formatValidationError(multiErr);

  assert(formatted.error === 'Validation failed', `Expected error "Validation failed", got "${formatted.error}"`);
  assert(Array.isArray(formatted.details), 'Expected details to be an array');
  assert(formatted.details.length >= 4, 'Expected multiple detail objects');
  assert(formatted.details.every((d) => typeof d.field === 'string' && typeof d.message === 'string'), 'Each detail must have string field and message');

  // Must be JSON-serializable without Error instances
  const jsonStr = JSON.stringify(formatted);
  const parsedBack = JSON.parse(jsonStr);
  assert(parsedBack.error === 'Validation failed', 'JSON roundtrip failed');
  console.log('✓ Passed');

  console.log('\n🎉 ALL TASK 5 TESTS PASSED SUCCESSFULLY!\n');
}

if (require.main === module) {
  runTask5UnitTests();
}

module.exports = runTask5UnitTests;
