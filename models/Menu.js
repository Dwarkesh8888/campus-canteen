const mongoose = require('mongoose');

const menuSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [50, 'Name cannot exceed 50 characters']
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price must be greater than or equal to 0']
  },
  category: {
    type: String,
    enum: {
      values: ['snack', 'meal', 'drink'],
      message: 'Category must be one of: snack, meal, drink'
    },
    default: 'snack'
  },
  available: {
    type: Boolean,
    default: true
  },
  caloriesPer100g: {
    type: Number,
    required: [true, 'caloriesPer100g is required'],
    min: [0, 'caloriesPer100g must be at least 0'],
    max: [900, 'caloriesPer100g cannot exceed 900']
  },
  weightG: {
    type: Number,
    default: 100,
    min: [1, 'weightG must be at least 1 g'],
    max: [2000, 'weightG cannot exceed 2000 g'],
    validate: {
      validator: function (val) {
        // If category is drink, weight cannot exceed 500 g
        if (this.category === 'drink' && val > 500) {
          return false;
        }
        return true;
      },
      message: 'For drink category, maximum weight cannot exceed 500 g'
    }
  }
}, {
  timestamps: true
});

module.exports = mongoose.models.Menu || mongoose.model('Menu', menuSchema);
