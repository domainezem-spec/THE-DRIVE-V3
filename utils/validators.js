/**
 * Validators - Utility for form validation.
 */
export const validators = {
    required(value) {
        return value !== null && value !== undefined && String(value).trim() !== '';
    },
    
    email(value) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(value).toLowerCase());
    },
    
    number(value) {
        return !isNaN(parseFloat(value)) && isFinite(value);
    },
    
    date(value) {
        return !isNaN(Date.parse(value));
    },

    minLength(value, length) {
        return String(value).length >= length;
    }
};
