import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import MenuPage from './pages/MenuPage';
import OrderPage from './pages/OrderPage';
import SpecialsPage from './pages/SpecialsPage';
import { calculateEnergy } from './data/menuItems';
import './App.css';

export default function App() {
  const [customerName, setCustomerName] = useState('');
  const [cart, setCart] = useState([]);
  const [calorieError, setCalorieError] = useState('');

  // Handle adding an item to the cart with strict availability & 1000 kcal checking
  const handleAddToCart = (item) => {
    // Requirement Task 2.C: Only items with available === true can be added.
    // Unavailable items must not be added, even if the add handler is called directly.
    if (!item || !item.available) {
      return;
    }

    const itemEnergy = calculateEnergy(item);
    const currentCartEnergy = cart.reduce((sum, line) => sum + line.energy, 0);
    const newTotalEnergy = currentCartEnergy + itemEnergy;

    // Requirement Task 2.E: The maximum permitted cart energy is 1000 kcal.
    // If the new total would exceed 1000 kcal, do not add the item and display the exact message.
    if (newTotalEnergy > 1000) {
      setCalorieError('Calorie limit of 1000 kcal exceeded');
      return;
    }

    // Clear any previous calorie limit error upon successful addition
    setCalorieError('');

    const newCartLine = {
      cartLineId: `${item.id}-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      id: item.id,
      name: item.name,
      price: Number(item.price),
      energy: itemEnergy,
      category: item.category
    };

    setCart((prevCart) => [...prevCart, newCartLine]);
  };

  // Handle removing an item from the cart
  const handleRemoveFromCart = (cartLineId) => {
    setCart((prevCart) => prevCart.filter((line) => line.cartLineId !== cartLineId));
    // Clear calorie error if space is made
    setCalorieError('');
  };

  return (
    <BrowserRouter>
      <div className="app-shell">
        <Navbar cartCount={cart.length} />
        <main className="main-content">
          <Routes>
            <Route
              path="/"
              element={<MenuPage onAddToCart={handleAddToCart} />}
            />
            <Route
              path="/order"
              element={
                <OrderPage
                  cart={cart}
                  customerName={customerName}
                  onCustomerNameChange={setCustomerName}
                  onAddToCart={handleAddToCart}
                  onRemoveFromCart={handleRemoveFromCart}
                  calorieError={calorieError}
                />
              }
            />
            <Route path="/specials" element={<SpecialsPage />} />
          </Routes>
        </main>
        <footer className="app-footer">
          <p>© 2026 Campus Canteen Management System • Student Services</p>
        </footer>
      </div>
    </BrowserRouter>
  );
}
