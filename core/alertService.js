/**
 * AlertService - Smart Alerts Engine for V3.
 * Monitors data for critical thresholds (expiry, temperature, etc.)
 */
import { stateManager } from './stateManager.js';

class AlertService {
    constructor() {
        this.alerts = [];
        this.checkInterval = 1000 * 60 * 5; // Every 5 minutes
    }

    start() {
        this.checkAlerts();
        setInterval(() => this.checkAlerts(), this.checkInterval);
    }

    checkAlerts() {
        const data = stateManager.getState().currentData;
        if (!data) return;

        const newAlerts = [];

        // 1. Check Stock Expiry (Within 30 days)
        if (data.stock) {
            const expiringStock = data.stock.filter(s => {
                const diff = (new Date(s.expiry) - new Date()) / (1000 * 60 * 60 * 24);
                return diff > 0 && diff <= 30;
            });
            expiringStock.forEach(s => newAlerts.push({
                type: 'stock',
                priority: 'warning',
                title: 'قرب انتهاء صلاحية',
                message: `الصنف ${s.name} سينتهي في خلال أقل من شهر`,
                data: s
            }));
        }

        // 2. Check Temperature Criticals
        if (data.temp) {
            const criticalTemp = data.temp.filter(t => t.status === 'Critical');
            criticalTemp.forEach(t => newAlerts.push({
                type: 'temp',
                priority: 'danger',
                title: 'تنبيه حرارة حرج!',
                message: `المعدة ${t.equipment} سجلت درجة حرارة حرجة (${t.reading}°C)`,
                data: t
            }));
        }

        // 3. Check Health Certificates
        if (data.health) {
            const expiringHealth = data.health.filter(h => {
                const diff = (new Date(h.expiry) - new Date()) / (1000 * 60 * 60 * 24);
                return diff > 0 && diff <= 45;
            });
            expiringHealth.forEach(h => newAlerts.push({
                type: 'health',
                priority: 'warning',
                title: 'تجديد شهادة صحية',
                message: `الموظف ${h.name} يحتاج لتجديد شهادته الصحية`,
                data: h
            }));
        }

        this.alerts = newAlerts;
        this.notify(newAlerts);
    }

    notify(alerts) {
        if (alerts.length === 0) return;
        
        // In V3 we can use browser notifications or subtle UI banners
        console.log('Smart Alerts:', alerts);
        
        // Trigger a custom event for the UI to listen to
        const event = new CustomEvent('app-alerts', { detail: alerts });
        window.dispatchEvent(event);
    }

    getAlerts() {
        return this.alerts;
    }
}

export const alertService = new AlertService();
