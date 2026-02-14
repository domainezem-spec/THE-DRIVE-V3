/**
 * TrainingView - Generates the HTML for the Training Log module.
 * 2026 Premium Style - Minimal & Non-Italic.
 */
import { formatDate, formatImg } from '../../utils/formatters.js';

export const TrainingView = (trainingList) => {
    const rows = trainingList.map(item => {
        const hasImg = item.img && item.img.length > 5;
        const imgUrl = formatImg(item.img);
        return `
            <tr class="hover:bg-slate-50 transition border-b border-slate-50 last:border-0">
                <td class="p-4 font-bold text-slate-400 font-mono text-xs">${formatDate(item.date)}</td>
                <td class="p-4 font-bold text-slate-800">${item.topic || '-'}</td>
                <td class="p-4 text-indigo-600 font-bold">${item.trainer || '-'}</td>
                <td class="p-4 font-bold text-slate-500 text-xs">${item.trainees || '-'}</td>
                <td class="p-4 text-center">
                    ${hasImg ? `<a href="${imgUrl}" target="_blank" class="inline-flex items-center gap-1.5 text-indigo-500 hover:text-indigo-700 transition-all group cursor-pointer img-preview-btn" data-img="${imgUrl}" data-id="${item.id}" data-type="training"><i class="fa-solid fa-image text-base group-hover:scale-110 transition-transform"></i><span class="text-[10px] font-bold">عرض</span></a>` : `<span class="text-slate-200 text-xs">—</span>`}
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
                    <div class="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center text-2xl shadow-sm">
                        <i class="fa-solid fa-graduation-cap"></i>
                    </div>
                    <div>
                        <h3 class="text-3xl font-bold text-slate-800 tracking-tight">سجل التدريب</h3>
                        <p class="text-xs text-slate-400 font-medium mt-1 uppercase tracking-widest">تتبع الكفاءة والبرامج التدريبية لفريق العمل</p>
                    </div>
                </div>

                <div class="flex flex-wrap gap-3">
                    <button id="add-training-btn" class="bg-indigo-600 text-white px-5 py-3 rounded-xl font-bold text-xs shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center gap-2">
                        <i class="fa-solid fa-plus"></i> تدريب جديد
                    </button>
                    <button id="print-photo-report" class="bg-slate-900 text-white px-5 py-3 rounded-xl font-bold text-xs shadow-lg shadow-slate-200 hover:bg-slate-800 transition-all flex items-center gap-2">
                        <i class="fa-solid fa-camera"></i> تقرير بالصور
                    </button>
                </div>
            </div>
            
            <div class="glass-card overflow-hidden">
                <table class="w-full text-right" id="trainingTable">
                    <thead>
                        <tr>
                            <th>التاريخ</th>
                            <th>الموضوع</th>
                            <th>المدرب</th>
                            <th>المتدربين</th>
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
