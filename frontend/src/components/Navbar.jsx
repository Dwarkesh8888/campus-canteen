import React from 'react';
import { NavLink } from 'react-router-dom';

export default function Navbar({ cartCount = 0 }) {
  return (
    <header className="navbar">
      <div className="nav-container">
        <div className="nav-brand">
          <span className="brand-icon">🍱</span>
          <span className="brand-title">Campus Canteen</span>
        </div>
        <nav className="nav-links">
          <NavLink
            to="/"
            className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
          >
            Menu
          </NavLink>
          <NavLink
            to="/order"
            className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
          >
            Order {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </NavLink>
          <NavLink
            to="/specials"
            className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
          >
            Specials Board
          </NavLink>
        </nav>
      </div>
    </header>
  );
}
