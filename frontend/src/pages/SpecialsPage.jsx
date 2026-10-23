import React, { useState, useEffect, useCallback } from 'react';

const SPECIALS_API_URL = 'https://jsonplaceholder.typicode.com/todos?_limit=10';

export default function SpecialsPage() {
  const [specials, setSpecials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchSpecials = useCallback(async () => {
    setLoading(true);
    setError(false);
    // Clear any previous specials to avoid displaying stale data on failure
    setSpecials([]);

    try {
      const response = await fetch(SPECIALS_API_URL);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();

      // Stable sort: available (completed === false) first, preserve original order within each group
      const availableItems = data.filter((item) => !item.completed);
      const soldOutItems = data.filter((item) => item.completed);
      const sorted = [...availableItems, ...soldOutItems];

      setSpecials(sorted);
      setLoading(false);
    } catch (err) {
      setError(true);
      setLoading(false);
    }
  }, []);

  // Request the endpoint exactly once on page mount
  useEffect(() => {
    let isMounted = true;
    fetchSpecials();
    return () => {
      isMounted = false;
    };
  }, [fetchSpecials]);

  // Count available and total items
  const totalCount = specials.length;
  const availableCount = specials.filter((item) => !item.completed).length;

  return (
    <div className="page-container specials-page">
      <div className="page-header">
        <h2>Today's Specials Board</h2>
        <p className="page-subtitle">Chef's daily recommendations and limited specials.</p>
      </div>

      {loading && (
        <div className="status-box loading-box">
          <p className="loading-text">Loading specials...</p>
        </div>
      )}

      {error && !loading && (
        <div className="status-box error-box">
          <p className="error-text">Could not load specials</p>
          <button
            type="button"
            className="btn-retry"
            onClick={fetchSpecials}
          >
            Retry
          </button>
        </div>
      )}

      {!loading && !error && specials.length > 0 && (
        <div className="specials-content">
          <div className="specials-counter-badge">
            {availableCount} of {totalCount} available
          </div>

          <div className="specials-list">
            {specials.map((todo) => {
              const isAvailable = !todo.completed;
              return (
                <div
                  key={todo.id}
                  className={`special-card ${isAvailable ? 'special-available' : 'special-soldout'}`}
                >
                  <div className="special-title">{todo.title}</div>
                  <span className={`special-tag ${isAvailable ? 'tag-available' : 'tag-soldout'}`}>
                    {isAvailable ? 'Available' : 'Sold out'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
