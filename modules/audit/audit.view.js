/**
 * AuditView - Generates the HTML for the Quality Audit module.
 * 2026 Premium Style - Minimal & Non-Italic.
 */
import { formatDate, formatImg } from '../../utils/formatters.js';

export const AuditView = (auditList) => {
    const rows = auditList.map(item => {
        const hasImg = item.img && item.img.length > 5;
        const imgUrl = formatImg(item.img);
        return `
            <tr class="hover:bg-slate-50 transition border-b border-slate-50 last:border-0">
                <td class="p-4 font-bold text-slate-400 font-mono text-xs">${formatDate(item.visitDate || item.date)}</td>
                <td class="p-4 font-bold text-slate-700">${item.branchName || '-'}</td>
                <td class="p-4 font-bold text-indigo-600 text-xs">${item.pointNo || '-'}</td>
                <td class="p-4 font-bold text-slate-600 text-xs">${item.department || item.deptName || '-'}</td>
                <td class="p-4 font-bold text-slate-500 text-xs max-w-[180px] truncate" title="${item.observedComments || item.comment || '-'}">${item.observedComments || item.comment || '-'}</td>
                <td class="p-4 font-bold text-emerald-600 text-xs max-w-[180px] truncate" title="${item.correctiveActions || '-'}">${item.correctiveActions || '-'}</td>
                <td class="p-4 font-bold text-slate-600 text-xs">${item.responsible || item.user || '-'}</td>
                <td class="p-4 font-bold text-amber-600 text-xs">${item.timeline || '-'}</td>
                <td class="p-4 text-center">
                    ${hasImg ? `<a href="${imgUrl}" target="_blank" class="inline-flex items-center gap-1.5 text-indigo-500 hover:text-indigo-700 transition-all group cursor-pointer img-preview-btn" data-img="${imgUrl}" data-id="${item.id}" data-type="audit"><i class="fa-solid fa-image text-base group-hover:scale-110 transition-transform"></i><span class="text-[10px] font-bold">عرض</span></a>` : `<span class="text-slate-200 text-xs">—</span>`}
                </td>
                <td class="p-4">
                    <div class="flex gap-3 justify-center">
                        <button class="action-edit text-slate-300 hover:text-indigo-600 hover:scale-110 transition-all" data-id="${item.id}" data-type="audit"><i class="fa-solid fa-pen-to-square"></i></button>
                        <button class="action-delete text-slate-300 hover:text-rose-600 hover:scale-110 admin-only transition-all" data-id="${item.id}" data-type="audit"><i class="fa-solid fa-trash-can"></i></button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');

    return `
        <div class="flex flex-col gap-10 text-right">
            <div class="flex flex-wrap items-center justify-between gap-6">
                <div class="flex items-center gap-5">
                    <div class="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center text-2xl shadow-sm">
                        <i class="fa-solid fa-clipboard-check"></i>
                    </div>
                    <div>
                        <h3 class="text-3xl font-bold text-slate-800 tracking-tight">عمليات التفتيش</h3>
                        <p class="text-xs text-slate-400 font-medium mt-1 uppercase tracking-widest">Inspection Operations & Quality Audits</p>
                    </div>
                </div>

                <div class="flex flex-wrap gap-3">
                    <button id="add-audit-btn" class="bg-indigo-600 text-white px-5 py-3 rounded-xl font-bold text-xs shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center gap-2">
                        <i class="fa-solid fa-plus"></i> تفتيش جديد
                    </button>
                    <button id="print-photo-report" class="bg-slate-900 text-white px-5 py-3 rounded-xl font-bold text-xs shadow-lg shadow-slate-200 hover:bg-slate-800 transition-all flex items-center gap-2">
                        <i class="fa-solid fa-camera"></i> تقرير بالصور
                    </button>
                </div>
            </div>
            
            <div class="glass-card overflow-hidden">
                <table class="w-full text-right" id="auditTable">
                    <thead>
                        <tr>
                            <th>تاريخ الزيارة</th>
                            <th>اسم الفرع</th>
                            <th>رقم النقطة</th>
                            <th>القسم / الفئة</th>
                            <th>الملاحظات المرصودة</th>
                            <th>الإجراءات التصحيحية</th>
                            <th>المسؤول</th>
                            <th>الجدول الزمني</th>
                            <th>المرفق</th>
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
