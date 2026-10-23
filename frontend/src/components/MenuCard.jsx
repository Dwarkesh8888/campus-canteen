import React from 'react';

export default function MenuCard({ item, onAddToCart }) {
  if (!item) return null;

  const portionWeight = item.weightG ?? 100;
  const energyKcal = Math.round((item.caloriesPer100g * portionWeight) / 100);
  const formattedPrice = `₹${Number(item.price).toFixed(2)}`;
  const availabilityText = item.available ? 'Available' : 'Not Available';

  return (
    <div className={`menu-card ${item.available ? 'is-available' : 'is-unavailable'}`}>
      <div className="card-header">
        <h3 className="item-name">{item.name}</h3>
        <span className={`category-tag category-${item.category}`}>
          {item.category}
        </span>
      </div>

      <div className="card-details">
        <div className="detail-row">
          <span className="detail-label">Price:</span>
          <span className="detail-value price-value">{formattedPrice}</span>
        </div>
        <div className="detail-row">
          <span className="detail-label">Portion Weight:</span>
          <span className="detail-value">{portionWeight} g</span>
        </div>
        <div className="detail-row">
          <span className="detail-label">Energy:</span>
          <span className="detail-value energy-value">{energyKcal} kcal</span>
        </div>
        <div className="detail-row">
          <span className="detail-label">Status:</span>
          <span className={`status-badge ${item.available ? 'status-available' : 'status-unavailable'}`}>
            {availabilityText}
          </span>
        </div>
      </div>

      {onAddToCart && (
        <div className="card-actions">
          <button
            type="button"
            className="btn-add-cart"
            disabled={!item.available}
            onClick={() => onAddToCart(item)}
          >
            {item.available ? 'Add to Order' : 'Unavailable'}
          </button>
        </div>
      )}
    </div>
  );
}
