/**
 * CalibrationView - Generates the HTML for the Calibration module.
 * 2026 Premium Style - Minimal & Non-Italic.
 */
import { formatDate } from '../../utils/formatters.js';

export const CalibrationView = (calibrationList) => {
    const rows = calibrationList.map(item => `
        <tr class="hover:bg-slate-50 transition border-b border-slate-50 last:border-0">
            <td class="p-4 font-bold text-slate-400 font-mono text-xs">${formatDate(item.date)}</td>
            <td class="p-4 font-bold text-slate-800">${item.equipment || '-'}</td>
            <td class="p-4 font-bold text-slate-700">${item.reading || '-'}</td>
            <td class="p-4">
                <span class="px-3 py-1 rounded-full text-[10px] font-bold ${item.status === 'Pass' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}">
                    ${item.status === 'Pass' ? 'مطابق ✅' : 'غير مطابق ❌'}
                </span>
            </td>
            <td class="p-4 text-indigo-600 font-bold font-mono text-xs">${formatDate(item.nextDate)}</td>
            <td class="p-4 font-bold text-slate-500">${item.user || '-'}</td>
            <td class="p-4">
                <div class="flex gap-3 justify-center">
                    <button class="text-slate-300 hover:text-indigo-600 hover:scale-110 transition-all"><i class="fa-solid fa-pen-to-square"></i></button>
                    <button class="text-slate-300 hover:text-rose-600 hover:scale-110 admin-only transition-all"><i class="fa-solid fa-trash-can"></i></button>
                </div>
            </td>
        </tr>
    `).join('');

    return `
        <div class="flex flex-col gap-10 text-right">
            <div class="flex flex-wrap items-center justify-between gap-6">
                <div class="flex items-center gap-5">
                    <div class="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center text-2xl shadow-sm">
                        <i class="fa-solid fa-scale-balanced"></i>
                    </div>
                    <div>
                        <h3 class="text-3xl font-bold text-slate-800 tracking-tight">المعايرة</h3>
                        <p class="text-xs text-slate-400 font-medium mt-1 uppercase tracking-widest">تسجيل نتائج معايرة الموازين والثيرمومترات</p>
                    </div>
                </div>

                <div class="flex flex-wrap gap-3">
                    <button id="add-calibration-btn" class="bg-indigo-600 text-white px-5 py-3 rounded-xl font-bold text-xs shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center gap-2">
                        <i class="fa-solid fa-plus"></i> معايرة جديدة
                    </button>
                    <button class="bg-slate-900 text-white px-5 py-3 rounded-xl font-bold text-xs shadow-lg shadow-slate-200 hover:bg-slate-800 transition-all flex items-center gap-2">
                        <i class="fa-solid fa-file-export"></i> تصدير البيانات
                    </button>
                </div>
            </div>
            
            <div class="glass-card overflow-hidden">
                <table class="w-full text-right" id="calibrationTable">
                    <thead>
                        <tr>
                            <th>التاريخ</th>
                            <th>الجهاز</th>
                            <th>القراءة</th>
                            <th>الحالة</th>
                            <th>المعايرة القادمة</th>
                            <th>المسؤول</th>
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
