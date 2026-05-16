import { describe, it, expect } from 'vitest';
import fc from 'fast-check';
import { validateRequired, validatePhone, validateEmail } from '../ui.js';

describe('validators', () => {
  it('validateRequired unit tests', () => {
    expect(validateRequired('hello').valid).toBe(true);
    expect(validateRequired('').valid).toBe(false);
  });
  
  it('validatePhone unit tests', () => {
    expect(validatePhone('+91 1234567890').valid).toBe(true);
    expect(validatePhone('123').valid).toBe(false);
  });

  it('validateEmail unit tests', () => {
    expect(validateEmail('test@example.com').valid).toBe(true);
    expect(validateEmail('test').valid).toBe(false);
  });

  // Property 1 - phone rejection
  it('should reject invalid phone numbers', () => {
    fc.assert(
      fc.property(
        fc.string().filter(s => !/^[+\d\s\-()]{7,15}$/.test(s)),
        s => validatePhone(s).valid === false
      ),
      { numRuns: 100 }
    );
  });

  // Property 2 - phone acceptance
  it('should accept valid phone numbers', () => {
    fc.assert(
      fc.property(
        fc.stringMatching(/^[+\d\s\-()]{7,15}$/),
        s => validatePhone(s).valid === true
      ),
      { numRuns: 100 }
    );
  });

  // Property 3 - empty required fields
  it('should reject empty required fields', () => {
    fc.assert(
      fc.property(
        fc.constantFrom('name', 'phone', 'email', 'service'),
        fc.oneof(fc.constant(''), fc.string().map(s => s.trim() === '' ? s : '   ')),
        (field, value) => {
          const res = validateRequired(value);
          return res.valid === false && res.error.length > 0;
        }
      ),
      { numRuns: 100 }
    );
  });
});
