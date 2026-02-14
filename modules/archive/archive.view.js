/**
 * ArchiveView - Generates the HTML for the Archive module.
 * 2026 Premium Style - Minimal & Non-Italic.
 */
export const ArchiveView = (data) => {
    const types = {
        'audit': { label: 'تقارير الجودة', icon: 'fa-clipboard-check', color: 'emerald' },
        'health': { label: 'سجلات الموظفين', icon: 'fa-id-card-clip', color: 'blue' },
        'pest': { label: 'زيارات المكافحة', icon: 'fa-bug', color: 'purple' },
        'temp': { label: 'سجلات الحرارة', icon: 'fa-temperature-high', color: 'rose' },
        'receiving': { label: 'سجلات الاستلام', icon: 'fa-truck-ramp-box', color: 'teal' },
        'stock': { label: 'صلاحية المخزون', icon: 'fa-box-open', color: 'amber' },
        'training': { label: 'سجلات التدريب', icon: 'fa-graduation-cap', color: 'indigo' },
        'complaints': { label: 'شكاوى العملاء', icon: 'fa-comment-dots', color: 'rose' },
        'checklists': { label: 'قوائم التحقق', icon: 'fa-list-check', color: 'cyan' },
        'calibration': { label: 'سجلات المعايرة', icon: 'fa-scale-balanced', color: 'lime' }
    };

    const sections = Object.entries(types).map(([type, config]) => {
        return `
            <div class="glass-card p-6 border-r-4 border-${config.color}-500 group hover:shadow-lg transition-all duration-300">
                <div class="flex items-center gap-4 mb-4">
                    <div class="w-12 h-12 bg-${config.color}-50 text-${config.color}-600 rounded-2xl flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
                        <i class="fa-solid ${config.icon}"></i>
                    </div>
                    <div>
                        <h4 class="font-bold text-slate-800 text-base">${config.label}</h4>
                        <span class="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Cloud Sourced</span>
                    </div>
                </div>
                <div id="archiveGrid-${type}" class="space-y-2 max-h-[300px] overflow-y-auto custom-scrollbar">
                    <p class="text-center text-slate-300 text-[10px] py-10 font-bold uppercase tracking-widest">Loading records...</p>
                </div>
            </div>
        `;
    }).join('');

    return `
        <div class="flex flex-col gap-10 text-right">
            <div class="flex flex-wrap items-center justify-between gap-6">
                <div class="flex items-center gap-5">
                    <div class="w-14 h-14 bg-slate-900 text-white rounded-2xl flex items-center justify-center text-2xl shadow-xl">
                        <i class="fa-solid fa-box-archive"></i>
                    </div>
                    <div>
                        <h3 class="text-3xl font-bold text-slate-800 tracking-tight">الأرشيف السحابي</h3>
                        <p class="text-xs text-slate-400 font-medium mt-1 uppercase tracking-widest">الوصول السريع لكافة البيانات التاريخية</p>
                    </div>
                </div>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                ${sections}
            </div>
        </div>
    `;
};
