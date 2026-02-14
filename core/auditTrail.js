/**
 * AuditTrail - Tracks user actions within the system for security and compliance.
 */
import { apiService } from './apiService.js';
import { stateManager } from './stateManager.js';

class AuditTrail {
    constructor() {
        this.logs = [];
    }

    /**
     * Log an action
     * @param {string} action - Action name (e.g., 'ADD_STOCK', 'DELETE_AUDIT')
     * @param {Object} details - Additional details
     */
    async log(action, details = {}) {
        const user = stateManager.getState().currentUser;
        const entry = {
            timestamp: new Date().toISOString(),
            userId: user ? user.id : 'anonymous',
            userName: user ? user.fullName : 'Anonymous',
            action: action,
            details: details,
            userAgent: navigator.userAgent
        };

        console.log('Audit Log:', entry);

        // Optionally send to backend specifically
        try {
            await apiService.submitData('audit_logs', entry);
        } catch (e) {
            // Silently fail if log submission fails, or queue locally
            console.warn('Failed to send audit log to backend');
        }
    }
}

export const auditTrail = new AuditTrail();
