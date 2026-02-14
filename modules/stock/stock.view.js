/**
 * StockView - Generates the HTML for the stock module.
 * 2026 Premium Style - Minimal & Non-Italic.
 */
import { formatDate } from '../../utils/formatters.js';

export const StockView = (stockList) => {
    const rows = stockList.map(item => {
        const diff = Math.ceil((new Date(item.expiry) - new Date()) / 86400000);
        const statusBadge = diff <= 0 
            ? `<span class="bg-rose-50 text-rose-600 px-3 py-1 rounded-full text-[10px] font-bold">منتهي الصلاحية</span>` 
            : (diff <= 30 ? `<span class="bg-amber-50 text-amber-600 px-3 py-1 rounded-full text-[10px] font-bold">قرب ينتهي (${diff} يوم)</span>` 
            : `<span class="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full text-[10px] font-bold">صالح</span>`);

        return `
            <tr class="hover:bg-slate-50 transition border-b border-slate-50 last:border-0">
                <td class="p-4 font-bold text-slate-400 font-mono text-xs">${item.code || '-'}</td>
                <td class="p-4 font-bold text-slate-800">${item.name || '-'}</td>
                <td class="p-4"><span class="bg-indigo-50 text-indigo-600 px-2 py-1 rounded text-[10px] font-bold">${item.batch || 'N/A'}</span></td>
                <td class="p-4 font-bold text-slate-700">${item.qty || '0'} ${item.unit || ''}</td>
                <td class="p-4 font-bold text-slate-400 font-mono text-xs">${formatDate(item.prodDate)}</td>
                <td class="p-4 font-bold font-mono text-xs ${diff <= 30 ? 'text-amber-600' : 'text-slate-800'}">${formatDate(item.expiry)}</td>
                <td class="p-4">${statusBadge}</td>
                <td class="p-4">
                    <div class="flex gap-3 justify-center">
                        <button class="text-slate-300 hover:text-indigo-600 hover:scale-110 transition-all"><i class="fa-solid fa-pen"></i></button>
                        <button class="text-slate-300 hover:text-rose-600 hover:scale-110 admin-only transition-all ml-2"><i class="fa-solid fa-trash"></i></button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');

    return `
        <div class="flex flex-col gap-10 text-right">
            <div class="flex flex-wrap items-center justify-between gap-6">
                <div class="flex items-center gap-5">
                    <div class="w-14 h-14 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center text-2xl shadow-sm">
                        <i class="fa-solid fa-boxes-packing"></i>
                    </div>
                    <div>
                        <h3 class="text-3xl font-bold text-slate-800 tracking-tight">رصيد المخزون</h3>
                        <p class="text-xs text-slate-400 font-medium mt-1 uppercase tracking-widest">مراقبة تواريخ الصلاحية وحركة المخزون</p>
                    </div>
                </div>

                <div class="flex flex-wrap gap-3">
                    <button id="add-stock-btn" class="bg-indigo-600 text-white px-5 py-3 rounded-xl font-bold text-xs shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center gap-2">
                        <i class="fa-solid fa-plus-circle"></i> إضافة صنف للمخزن
                    </button>
                    <button class="bg-slate-900 text-white px-5 py-3 rounded-xl font-bold text-xs shadow-lg shadow-slate-200 hover:bg-slate-800 transition-all flex items-center gap-2">
                        <i class="fa-solid fa-file-export"></i> تصدير البيانات
                    </button>
                </div>
            </div>
            
            <div class="glass-card overflow-hidden">
                <table class="w-full text-right" id="stockTable">
                    <thead>
                        <tr>
                            <th>كود الصنف</th>
                            <th>اسم الصنف</th>
                            <th>رقم الـ Batch</th>
                            <th>الكمية الحالية</th>
                            <th>تاريخ الإنتاج</th>
                            <th>تاريخ الانتهاء</th>
                            <th>حالة الصلاحية</th>
                            <th class="text-center">إجراءات</th>
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
