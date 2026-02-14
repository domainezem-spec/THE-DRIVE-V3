/**
 * DashboardService - Handles analytics and chart data for the dashboard.
 */
export class DashboardService {
    static calculateStats(data) {
        if (!data) return { quality: 0, alerts: 0, stock: 0, tasks: 0 };

        const audit = data.audit || [];
        const temp = data.temp || [];
        const stock = data.stock || [];
        
        // Example logic
        const criticalAlerts = temp.filter(t => t.status === 'Critical').length;
        const lowStock = stock.filter(s => s.qty < 10).length;

        return {
            quality: audit.length,
            alerts: criticalAlerts,
            stock: lowStock,
            tasks: (data.checklists || []).length
        };
    }

    static initCharts(data) {
        const ctx = document.getElementById('qualityChart')?.getContext('2d');
        if (!ctx) return;

        // Initialize with empty data for fresh start
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: [], 
                datasets: [{
                    label: 'مؤشر الجودة العام',
                    data: [],
                    borderColor: '#4f46e5',
                    tension: 0.4,
                    fill: true,
                    backgroundColor: 'rgba(79, 70, 229, 0.1)'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { 
                    legend: { display: false },
                    emptyDoughnut: {
                        color: 'rgba(255, 99, 132, 0.8)',
                        width: 2,
                        textAlign: 'center',
                        textVerticalAlign: 'middle',
                        font: { weight: 'bold' }
                    }
                },
                scales: { 
                    y: { 
                        beginAtZero: true, 
                        max: 100,
                        ticks: { color: '#94a3b8', font: { weight: 'bold', size: 10 } }
                    },
                    x: {
                        ticks: { color: '#94a3b8', font: { weight: 'bold', size: 10 } }
                    }
                }
            }
        });
    }
}

// Temperature Alert Cards Generator
export function generateTempAlerts() {
    const now = new Date();
    const currentHour = now.getHours();
    
    const schedules = [
        { time: '08:00', hour: 8, label: '8 صباحاً', icon: 'sun' },
        { time: '12:00', hour: 12, label: '12 ظهراً', icon: 'sun' },
        { time: '16:00', hour: 16, label: '4 مساءً', icon: 'cloud-sun' },
        { time: '20:00', hour: 20, label: '8 مساءً', icon: 'moon' },
        { time: '00:00', hour: 0, label: '12 منتصف الليل', icon: 'moon' }
    ];
    
    const container = document.getElementById('temp-alerts');
    if (!container) return;
    
    container.innerHTML = schedules.map(schedule => {
        const isPast = currentHour > schedule.hour || (currentHour === 0 && schedule.hour !== 0);
        const isCurrent = currentHour === schedule.hour;
        const isUpcoming = currentHour < schedule.hour;
        
        let bgClass, borderClass, textClass, iconClass, statusText;
        
        if (isPast) {
            bgClass = 'bg-emerald-50';
            borderClass = 'border-emerald-500';
            textClass = 'text-emerald-700';
            iconClass = 'bg-emerald-500';
            statusText = 'تم';
        } else if (isCurrent) {
            bgClass = 'bg-rose-50';
            borderClass = 'border-rose-500';
            textClass = 'text-rose-700';
            iconClass = 'bg-rose-500 animate-pulse';
            statusText = 'الآن';
        } else {
            bgClass = 'bg-amber-50';
            borderClass = 'border-amber-500';
            textClass = 'text-amber-700';
            iconClass = 'bg-amber-500';
            statusText = 'قريباً';
        }
        
        return `
            <div class="glass-card p-4 ${bgClass} border-b-4 ${borderClass} transition-all hover:scale-105">
                <div class="flex items-center gap-3 mb-2">
                    <div class="w-10 h-10 ${iconClass} text-white rounded-xl flex items-center justify-center shadow-md">
                        <i class="fa-solid fa-${schedule.icon}"></i>
                    </div>
                    <div class="flex-1">
                        <p class="text-xs font-bold ${textClass} uppercase tracking-wider">${statusText}</p>
                    </div>
                </div>
                <h5 class="text-lg font-black ${textClass} mb-1">${schedule.time}</h5>
                <p class="text-xs font-bold text-slate-600">${schedule.label}</p>
            </div>
        `;
    }).join('');
}

// Global hook for app.js
window.initDashboardCharts = () => {
    const data = window.stateManager?.getState()?.currentData;
    if (data) DashboardService.initCharts(data);
    generateTempAlerts();
};
