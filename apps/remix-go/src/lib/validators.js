export function isEmail(value) {
  if (!value) return null;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? null : 'Invalid email address';
}

export function isRequired(value) {
  return value !== null && value !== undefined && String(value).trim() !== ''
    ? null
    : 'This field is required';
}

export function isNumber(value) {
  return !isNaN(parseFloat(value)) && isFinite(value) ? null : 'Must be a number';
}

export function isURL(value) {
  try {
    new URL(value);
    return null;
  } catch {
    return 'Invalid URL';
  }
}

export function isMinLength(min) {
  return (value) => (!value || value.length < min) ? `Must be at least ${min} characters` : null;
}

export function isMaxLength(max) {
  return (value) => (value && value.length > max) ? `Must be at most ${max} characters` : null;
}

export function isPositive(value) {
  return parseFloat(value) > 0 ? null : 'Must be positive';
}

export function matchField(value, values, fieldName) {
  return value === values[fieldName] ? null : 'Fields do not match';
}

export function validate(value, validators) {
  for (const validator of validators) {
    if (typeof validator === 'function') {
      const error = validator(value);
      if (error) return error;
    }
  }
  return null;
}

// Boolean versions for direct use
export function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export function isNonEmpty(value) {
  return value !== null && value !== undefined && String(value).trim() !== '';
}

export function isValidURL(value) {
  try { new URL(value); return true; } catch { return false; }
}

export default {
  isEmail,
  isRequired,
  isNumber,
  isURL,
  isMinLength,
  isMaxLength,
  isPositive,
  matchField,
  validate,
  isValidEmail,
  isNonEmpty,
  isValidURL,
};
