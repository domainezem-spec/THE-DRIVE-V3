/**
 * HealthView - Generates the HTML for the Health Certificates module.
 * 2026 Premium Style - Minimal & Non-Italic.
 */
import { formatDate, formatImg } from '../../utils/formatters.js';

export const HealthView = (healthList) => {
    const rows = healthList.map(item => {
        const diff = Math.ceil((new Date(item.expiry) - new Date()) / (1000 * 60 * 60 * 24));
        const statusBadge = diff <= 0 
            ? `<span class="bg-rose-50 text-rose-600 px-3 py-1 rounded-full text-[10px] font-bold">منتهية</span>` 
            : (diff <= 45 ? `<span class="bg-amber-50 text-amber-600 px-3 py-1 rounded-full text-[10px] font-bold">تنتهي قريباً (${diff} يوم)</span>` 
            : `<span class="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full text-[10px] font-bold">سارية</span>`);
        const hasImg = item.img && item.img.length > 5;
        const imgUrl = formatImg(item.img);

        return `
            <tr class="hover:bg-slate-50 transition border-b border-slate-50 last:border-0">
                <td class="p-4 font-bold text-slate-400 font-mono text-xs">${item.code || '-'}</td>
                <td class="p-4 font-bold text-slate-800">${item.name || '-'}</td>
                <td class="p-4 font-bold text-slate-500 text-xs">${item.position || '-'}</td>
                <td class="p-4 font-mono text-xs text-slate-400">${formatDate(item.issue)}</td>
                <td class="p-4 font-bold text-slate-800 font-mono text-xs">${formatDate(item.expiry)}</td>
                <td class="p-4">${statusBadge}</td>
                <td class="p-4 max-w-[120px] overflow-hidden text-ellipsis whitespace-nowrap text-slate-400 text-xs">${item.notes || '-'}</td>
                <td class="p-4 text-center">
                    ${hasImg ? `<a href="${imgUrl}" target="_blank" class="inline-flex items-center gap-1.5 text-indigo-500 hover:text-indigo-700 transition-all group cursor-pointer img-preview-btn" data-img="${imgUrl}" data-id="${item.id}" data-type="health"><i class="fa-solid fa-image text-base group-hover:scale-110 transition-transform"></i><span class="text-[10px] font-bold">عرض</span></a>` : `<span class="text-slate-200 text-xs">—</span>`}
                </td>
                <td class="p-4">
                    <div class="flex gap-3 justify-center">
                        <button class="text-slate-300 hover:text-indigo-600 hover:scale-110 transition-all"><i class="fa-solid fa-pen-to-square"></i></button>
                        <button class="text-slate-300 hover:text-rose-600 hover:scale-110 admin-only transition-all"><i class="fa-solid fa-trash-can"></i></button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');

    return `
        <div class="flex flex-col gap-10 text-right">
            <div class="flex flex-wrap items-center justify-between gap-6">
                <div class="flex items-center gap-5">
                    <div class="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center text-2xl shadow-sm">
                        <i class="fa-solid fa-id-card-clip"></i>
                    </div>
                    <div>
                        <h3 class="text-3xl font-bold text-slate-800 tracking-tight">الشهادات الصحية</h3>
                        <p class="text-xs text-slate-400 font-medium mt-1 uppercase tracking-widest">سجل شهادات الموظفين وتواريخ التجديد</p>
                    </div>
                </div>

                <div class="flex flex-wrap gap-3">
                    <button id="add-health-btn" class="bg-indigo-600 text-white px-5 py-3 rounded-xl font-bold text-xs shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center gap-2">
                        <i class="fa-solid fa-user-plus"></i> إضافة موظف
                    </button>
                    <button id="print-photo-report" class="bg-rose-50 text-rose-600 px-5 py-3 rounded-xl font-bold text-xs hover:bg-rose-100 transition-all flex items-center gap-2">
                        <i class="fa-solid fa-camera-retro"></i> التقرير المصور
                    </button>
                    <button class="bg-slate-900 text-white px-5 py-3 rounded-xl font-bold text-xs shadow-lg shadow-slate-200 hover:bg-slate-800 transition-all flex items-center gap-2">
                        <i class="fa-solid fa-file-export"></i> تصدير البيانات
                    </button>
                </div>
            </div>
            
            <div class="glass-card overflow-hidden">
                <table class="w-full text-right" id="healthTable">
                    <thead>
                        <tr>
                            <th>كود</th>
                            <th>الاسم</th>
                            <th>الوظيفة</th>
                            <th>الإصدار</th>
                            <th>الانتهاء</th>
                            <th>الحالة</th>
                            <th>ملاحظات</th>
                            <th>صورة</th>
                            <th class="text-center">إجراء</th>
                        </tr>
                    </thead>
                    <tbody class="text-[13px] font-medium text-slate-600">
                        ${rows}
                    </tbody>
                </table>
            </div>
        </div>
    `;
};
