import React, { useState } from 'react';
import MenuCard from '../components/MenuCard';
import { menuItems } from '../data/menuItems';

export default function MenuPage({ onAddToCart }) {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredItems = selectedCategory === 'all'
    ? menuItems
    : menuItems.filter((i) => i.category === selectedCategory);

  return (
    <div className="page-container menu-page">
      <div className="page-header">
        <h2>Canteen Menu</h2>
        <p className="page-subtitle">Browse delicious snacks, wholesome meals, and refreshing drinks.</p>
      </div>

      <div className="filter-bar">
        {['all', 'snack', 'meal', 'drink'].map((cat) => (
          <button
            key={cat}
            type="button"
            className={`filter-btn ${selectedCategory === cat ? 'active' : ''}`}
            onClick={() => setSelectedCategory(cat)}
          >
            {cat.charAt(0).toUpperCase() + cat.slice(1)}s
          </button>
        ))}
      </div>

      <div className="menu-grid">
        {filteredItems.map((item) => (
          <MenuCard
            key={item.id}
            item={item}
            onAddToCart={onAddToCart}
          />
        ))}
      </div>
    </div>
  );
}
