/**
 * Formats a Mongoose ValidationError into a clean, JSON-serializable plain object.
 *
 * @param {Error} err - The Mongoose ValidationError
 * @returns {Object} { error: "Validation failed", details: [ { field: string, message: string } ] }
 */
function formatValidationError(err) {
  const details = [];

  if (err && err.errors && typeof err.errors === 'object') {
    for (const [fieldName, errorObj] of Object.entries(err.errors)) {
      details.push({
        field: fieldName,
        message: errorObj && errorObj.message ? String(errorObj.message) : 'Invalid value'
      });
    }
  } else if (err && err.message) {
    details.push({
      field: 'general',
      message: String(err.message)
    });
  }

  return {
    error: 'Validation failed',
    details
  };
}

module.exports = formatValidationError;
