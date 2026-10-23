const express = require('express');
const crypto = require('crypto');
const { MENU_CALORIES_PER_100G } = require('../data/menuData');

const router = express.Router();

// In-memory orders store
const orders = [];

// POST /api/v1/orders
router.post('/', (req, res) => {
  let { itemName, qty, weightG } = req.body || {};

  // 1. itemName validation
  if (!itemName || typeof itemName !== 'string' || !MENU_CALORIES_PER_100G.hasOwnProperty(itemName)) {
    return res.status(400).json({
      error: 'Invalid or missing itemName. Must be one of: Samosa, Masala Chai, Veg Thali, Cold Coffee'
    });
  }

  // 2. qty validation: defaults to 1, must be whole number from 1 to 10
  if (qty === undefined || qty === null) {
    qty = 1;
  }
  if (typeof qty !== 'number' || !Number.isInteger(qty) || qty < 1 || qty > 10) {
    return res.status(400).json({
      error: 'Invalid qty. Must be a whole number between 1 and 10 inclusive'
    });
  }

  // 3. weightG validation: defaults to 100, must be a number > 0
  if (weightG === undefined || weightG === null) {
    weightG = 100;
  }
  if (typeof weightG !== 'number' || isNaN(weightG) || weightG <= 0) {
    return res.status(400).json({
      error: 'Invalid weightG. Must be a number greater than 0'
    });
  }

  // Calculate kcal: Math.round(caloriesPer100g * weightG / 100 * qty)
  const caloriesPer100g = MENU_CALORIES_PER_100G[itemName];
  const kcal = Math.round((caloriesPer100g * weightG / 100) * qty);

  const newOrder = {
    id: crypto.randomUUID(),
    itemName,
    qty,
    weightG,
    kcal
  };

  orders.push(newOrder);

  return res.status(201).json(newOrder);
});

// GET /api/v1/orders
router.get('/', (req, res) => {
  return res.status(200).json(orders);
});

// GET /api/v1/orders/:id
router.get('/:id', (req, res) => {
  const order = orders.find((o) => o.id === req.params.id);
  if (!order) {
    return res.status(404).json({ error: 'Order not found' });
  }
  return res.status(200).json(order);
});

// DELETE /api/v1/orders/:id
router.delete('/:id', (req, res) => {
  const index = orders.findIndex((o) => o.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Order not found' });
  }
  const deleted = orders.splice(index, 1)[0];
  return res.status(200).json({ message: 'Order deleted successfully', id: deleted.id });
});

module.exports = router;
