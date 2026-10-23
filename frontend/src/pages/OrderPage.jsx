import React, { useState, useMemo } from 'react';
import { menuItems, calculateEnergy } from '../data/menuItems';

export default function OrderPage({
  cart,
  customerName,
  onCustomerNameChange,
  onAddToCart,
  onRemoveFromCart,
  calorieError
}) {
  // Derived totals - strictly calculated directly from cart, never stored as separate state variables
  const { totalItemCount, totalPrice, totalEnergy } = useMemo(() => {
    const count = cart.length;
    const priceSum = cart.reduce((acc, line) => acc + Number(line.price), 0);
    const energySum = cart.reduce((acc, line) => acc + Number(line.energy), 0);
    return {
      totalItemCount: count,
      totalPrice: priceSum,
      totalEnergy: energySum
    };
  }, [cart]);

  return (
    <div className="page-container order-page">
      <div className="page-header">
        <h2>Place Your Order</h2>
        <p className="page-subtitle">Select available items and manage your cart (Max 1000 kcal).</p>
      </div>

      {/* Customer Name Section */}
      <section className="customer-section">
        <label htmlFor="customer-name-input" className="input-label">
          Customer Name:
        </label>
        <input
          id="customer-name-input"
          type="text"
          className="text-input"
          placeholder="Enter your name"
          value={customerName}
          onChange={(e) => onCustomerNameChange(e.target.value)}
        />
        <div className="customer-display">
          Order for: {customerName}
        </div>
      </section>

      {/* Calorie Limit Alert */}
      {calorieError && (
        <div className="alert-box error-alert" role="alert">
          ⚠️ {calorieError}
        </div>
      )}

      <div className="order-content-layout">
        {/* Quick Add Available Items */}
        <section className="available-items-panel">
          <h3>Available Menu Items</h3>
          <div className="items-list">
            {menuItems.map((item) => {
              const energy = calculateEnergy(item);
              return (
                <div
                  key={item.id}
                  className={`order-item-row ${item.available ? 'item-available' : 'item-disabled'}`}
                >
                  <div className="order-item-info">
                    <strong>{item.name}</strong>
                    <span className="item-meta">
                      ₹{Number(item.price).toFixed(2)} • {energy} kcal • ({item.category})
                    </span>
                  </div>
                  <button
                    type="button"
                    className="btn-add-item"
                    disabled={!item.available}
                    onClick={() => onAddToCart(item)}
                  >
                    {item.available ? '+ Add' : 'Unavailable'}
                  </button>
                </div>
              );
            })}
          </div>
        </section>

        {/* Current Cart */}
        <section className="cart-panel">
          <h3>Your Cart</h3>

          {cart.length === 0 ? (
            <div className="empty-cart-message">Your cart is currently empty.</div>
          ) : (
            <div className="cart-lines-list">
              {cart.map((line) => (
                <div key={line.cartLineId} className="cart-line-item">
                  <div className="cart-line-details">
                    <span className="cart-line-name">{line.name}</span>
                    <span className="cart-line-stats">
                      ₹{Number(line.price).toFixed(2)} | {line.energy} kcal
                    </span>
                  </div>
                  <button
                    type="button"
                    className="btn-remove-line"
                    onClick={() => onRemoveFromCart(line.cartLineId)}
                    title="Remove item"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Derived Totals Display */}
          <div className="cart-totals-summary">
            <h4>Order Summary</h4>
            <div className="total-row">
              <span>Total Item Count:</span>
              <strong className="total-count-value">{totalItemCount}</strong>
            </div>
            <div className="total-row">
              <span>Total Price:</span>
              <strong className="total-price-value">₹{totalPrice.toFixed(2)}</strong>
            </div>
            <div className="total-row">
              <span>Total Energy:</span>
              <strong className={`total-energy-value ${totalEnergy > 900 ? 'near-limit' : ''}`}>
                {totalEnergy} kcal / 1000 kcal
              </strong>
            </div>
            <div className="energy-progress-bar">
              <div
                className="energy-progress-fill"
                style={{ width: `${Math.min(100, (totalEnergy / 1000) * 100)}%` }}
              />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
