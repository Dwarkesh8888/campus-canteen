require('dotenv').config();
const mongoose = require('mongoose');
const Menu = require('./models/Menu');
const formatValidationError = require('./utils/formatValidationError');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/campus_canteen';

async function seedDatabase() {
  console.log('--- Campus Canteen: Seed Database Script ---');

  try {
    console.log(`Connecting to MongoDB at: ${MONGODB_URI}...`);
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000
    });
    console.log('✓ Successfully connected to MongoDB.');

    // 1. Clean existing test seed items if needed
    await Menu.deleteMany({ name: { $in: ['Special Masala Dosa', 'Invalid Super Giant Drink'] } });

    // 2. Save one valid menu item
    console.log('\n[Step 1] Saving one valid menu item...');
    const validItem = new Menu({
      name: 'Special Masala Dosa',
      price: 65.00,
      category: 'snack',
      available: true,
      caloriesPer100g: 175,
      weightG: 180
    });

    const savedDoc = await validItem.save();
    console.log('✓ Saved Valid Document Successfully:');
    console.log(JSON.stringify(savedDoc, null, 2));

    // 3. Attempt to save one deliberately invalid menu item
    // Invalid reasons:
    // - name missing or > 50 chars
    // - price < 0
    // - category 'drink' but weightG > 500 (e.g. 750g)
    // - caloriesPer100g > 900
    console.log('\n[Step 2] Attempting to save a deliberately invalid item...');
    const invalidItem = new Menu({
      name: 'Invalid Super Giant Drink With An Excessively Long Name Exceeding Fifty Characters Long',
      price: -10,
      category: 'drink',
      available: true,
      caloriesPer100g: 950,
      weightG: 750 // violates drink max weight limit of 500g
    });

    try {
      await invalidItem.save();
      console.warn('⚠️ Warning: Invalid item unexpectedly saved without validation error.');
    } catch (valErr) {
      console.log('✓ Caught Expected Mongoose ValidationError.');
      console.log('Formatted ValidationError Output:');
      const formatted = formatValidationError(valErr);
      console.log(JSON.stringify(formatted, null, 2));
    }

    console.log('\n✓ Seeding script completed successfully.');
  } catch (err) {
    if (err.name === 'MongooseServerSelectionError' || err.message.includes('ECONNREFUSED')) {
      console.error('\n❌ MongoDB Connection Setup Error:');
      console.error('Could not connect to MongoDB server. Please ensure MongoDB is running or specify MONGODB_URI in your environment.');
      console.error('Example: export MONGODB_URI="mongodb://localhost:27017/campus_canteen"');
    } else {
      console.error('\n❌ Unexpected error occurred:', err);
    }
  } finally {
    try {
      await mongoose.disconnect();
      console.log('✓ Disconnected cleanly from MongoDB.');
    } catch (discErr) {
      console.error('Error during disconnect:', discErr);
    }
  }
}

if (require.main === module) {
  seedDatabase();
}

module.exports = seedDatabase;
