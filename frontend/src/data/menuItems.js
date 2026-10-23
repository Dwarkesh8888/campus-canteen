export const menuItems = [
  {
    id: "item-1",
    name: "Samosa",
    category: "snack",
    price: 25.00,
    caloriesPer100g: 260,
    weightG: 100,
    available: true
  },
  {
    id: "item-2",
    name: "Masala Chai",
    category: "drink",
    price: 15.00,
    caloriesPer100g: 50,
    weightG: 150,
    available: true
  },
  {
    id: "item-3",
    name: "Veg Thali",
    category: "meal",
    price: 120.00,
    caloriesPer100g: 150,
    weightG: 350,
    available: true
  },
  {
    id: "item-4",
    name: "Cold Coffee",
    category: "drink",
    price: 40.00,
    caloriesPer100g: 70,
    weightG: 200,
    available: false
  },
  {
    id: "item-5",
    name: "Paneer Roll",
    category: "snack",
    price: 90.00,
    caloriesPer100g: 210,
    // weightG intentionally omitted to test fallback to 100g
    available: true
  },
  {
    id: "item-6",
    name: "Sandwich",
    category: "snack",
    price: 50.00,
    caloriesPer100g: 180,
    weightG: 120,
    available: false
  }
];

export const calculateEnergy = (item) => {
  const weight = item.weightG ?? 100;
  return Math.round((item.caloriesPer100g * weight) / 100);
};
