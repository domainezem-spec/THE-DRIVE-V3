/**
 * TempView - Generates the HTML for the Temperature Monitoring module.
 * 2026 Premium Style - Minimal & Non-Italic.
 */
import { formatDate, formatImg } from '../../utils/formatters.js';

export const TempView = (tempData, equipmentList) => {
    // Generate Equipment Cards
    const cards = (equipmentList || []).map(eq => {
        const lastLog = (tempData || []).filter(l => l.equipment === eq.name).sort((a, b) => new Date(b.date) - new Date(a.date))[0];
        const temp = lastLog ? lastLog.reading + '°C' : '--';
        const status = lastLog ? lastLog.status : 'No Data';
        
        let statusClass = 'text-slate-400';
        let borderClass = 'border-slate-100';
        let dotClass = 'bg-slate-300';
        
        if (status === 'Normal') { statusClass = 'text-emerald-500'; borderClass = 'border-emerald-100'; dotClass = 'bg-emerald-500'; }
        if (status === 'Warning') { statusClass = 'text-amber-500'; borderClass = 'border-amber-100'; dotClass = 'bg-amber-500'; }
        if (status === 'Critical') { statusClass = 'text-rose-500'; borderClass = 'border-rose-100'; dotClass = 'bg-rose-500'; }

        return `
            <div class="glass-card p-6 border-b-4 ${borderClass} group hover:shadow-xl transition-all cursor-pointer temp-equipment-card relative overflow-hidden" data-equip-id="${eq.id || eq.name}" data-equip-name="${eq.name}">
                <div class="absolute top-0 right-0 p-4">
                    <span class="flex h-2 w-2 rounded-full ${dotClass}"></span>
                </div>
                
                <div class="flex flex-col gap-4">
                    <div class="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-500 transition-colors">
                        <i class="fa-solid fa-server text-xl"></i>
                    </div>
                    
                    <div>
                        <h4 class="font-bold text-slate-800 text-lg mb-0.5">${eq.name}</h4>
                        <p class="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none">${eq.location || 'General Area'}</p>
                    </div>
                    
                    <div class="py-2">
                        <span class="block text-3xl font-black ${statusClass} tracking-tight">${temp}</span>
                        <span class="text-[9px] font-bold text-slate-300 uppercase tracking-widest">Last Check</span>
                    </div>

                    <div class="bg-indigo-50 color-indigo-600 text-indigo-700 w-full py-3 rounded-xl text-[11px] font-bold hover:bg-indigo-100 transition-all flex items-center justify-center gap-2">
                        <i class="fa-solid fa-plus-circle"></i> تسجيل قراءة الآن
                    </div>
                </div>
            </div>
        `;
    }).join('');

    const rows = (tempData || []).slice(0, 50).map(item => {
        const hasImg = item.img && item.img.length > 5;
        const imgUrl = formatImg(item.img);
        return `
        <tr class="hover:bg-slate-50 transition border-b border-slate-50 last:border-0">
            <td class="p-4 font-bold text-slate-400 font-mono text-xs">${formatDate(item.date)} ${item.time ? `<span class="block text-[10px] text-slate-300">${item.time}</span>` : ''}</td>
            <td class="p-4 font-bold text-slate-800">${item.equipment || '-'}</td>
            <td class="p-4"><span class="text-sm font-bold text-slate-700 px-3 py-1 bg-slate-100 rounded-lg">${item.reading || '-'}°C</span></td>
            <td class="p-4 font-bold text-slate-500">${item.productName || '---'}</td>
            <td class="p-4 font-bold text-slate-700">${item.prodReading ? item.prodReading + '°C' : '---'}</td>
            <td class="p-4"><span class="bg-slate-100 text-slate-500 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">${item.measType || 'Ambient'}</span></td>
            <td class="p-4">
                <span class="px-3 py-1 rounded-full text-[10px] font-bold ${item.status === 'Normal' ? 'bg-emerald-50 text-emerald-600' : (item.status === 'Critical' ? 'bg-rose-50 text-rose-600' : 'bg-amber-50 text-amber-600')}">
                    ${item.status || '-'}
                </span>
            </td>
            <td class="p-4 font-bold text-slate-500">${item.observer || '-'}</td>
            <td class="p-4 text-center">
                ${hasImg ? `<a href="${imgUrl}" target="_blank" class="inline-flex items-center gap-1.5 text-indigo-500 hover:text-indigo-700 transition-all group cursor-pointer img-preview-btn" data-img="${imgUrl}" data-id="${item.id}" data-type="temp"><i class="fa-solid fa-image text-base group-hover:scale-110 transition-transform"></i><span class="text-[10px] font-bold">عرض</span></a>` : `<span class="text-slate-200 text-xs">—</span>`}
            </td>
            <td class="p-4">
                <div class="flex gap-2 justify-center">
                    <button class="text-slate-300 hover:text-indigo-500 hover:scale-110 transition-all action-edit" data-id="${item.id}" data-type="temp"><i class="fa-solid fa-pen"></i></button>
                    <button class="text-slate-300 hover:text-rose-500 hover:scale-110 admin-only transition-all action-delete" data-id="${item.id}" data-type="temp"><i class="fa-solid fa-trash-can"></i></button>
                </div>
            </td>
        </tr>
    `}).join('');

    return `
        <div class="flex flex-col gap-10 text-right">
            <!-- Header Section -->
            <div class="flex flex-wrap items-center justify-between gap-6">
                <div class="flex items-center gap-5">
                    <div class="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center text-2xl shadow-sm">
                        <i class="fa-solid fa-temperature-three-quarters"></i>
                    </div>
                    <div>
                        <h3 class="text-3xl font-bold text-slate-800 tracking-tight">سجل درجات الحرارة</h3>
                        <p class="text-xs text-slate-400 font-medium mt-1 uppercase tracking-widest">مراقبة جودة المعدات والمواد الغذائية</p>
                    </div>
                </div>

                <div class="flex flex-wrap gap-3">
                    <div class="admin-only flex gap-3 mr-3 pl-3 border-l border-slate-200">
                        <button id="add-equipment-btn" class="bg-white border-2 border-indigo-100 text-indigo-600 px-5 py-3 rounded-xl font-bold text-xs hover:bg-indigo-50 transition-all flex items-center gap-2">
                            <i class="fa-solid fa-folder-plus text-sm"></i> إضافة معدة
                        </button>
                        <button id="add-product-btn" class="bg-white border-2 border-emerald-100 text-emerald-600 px-5 py-3 rounded-xl font-bold text-xs hover:bg-emerald-50 transition-all flex items-center gap-2">
                            <i class="fa-solid fa-plus text-sm"></i> إضافة منتج
                        </button>
                    </div>
                    
                    <button id="print-photo-report" class="bg-rose-50 text-rose-600 px-5 py-3 rounded-xl font-bold text-xs hover:bg-rose-100 transition-all flex items-center gap-2">
                        <i class="fa-solid fa-camera-retro"></i> التقرير المصور
                    </button>
                    <button class="bg-indigo-600 text-white px-5 py-3 rounded-xl font-bold text-xs shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center gap-2">
                        <i class="fa-solid fa-file-excel"></i> تصدير البيانات
                    </button>
                </div>
            </div>

            <!-- Equipment Section -->
            <div>
                <div class="flex items-center gap-3 mb-6">
                    <span class="w-8 h-1 bg-indigo-500 rounded-full"></span>
                    <h4 class="font-bold text-slate-800 text-xl tracking-tight">نظرة عامة على المعدات</h4>
                </div>
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    ${cards || '<p class="col-span-full text-center py-20 text-slate-300 font-bold uppercase tracking-widest bg-white rounded-3xl border-2 border-dashed border-slate-100">No equipment found</p>'}
                </div>
            </div>
            
            <!-- Logs Table Section -->
            <div class="space-y-6">
                <div class="flex items-center gap-3">
                    <span class="w-8 h-1 bg-emerald-500 rounded-full"></span>
                    <h4 class="font-bold text-slate-800 text-xl tracking-tight">القراءات التاريخية</h4>
                </div>
                <div class="glass-card overflow-hidden">
                    <table class="w-full text-right" id="tempTable">
                        <thead>
                            <tr>
                                <th>الوقت</th>
                                <th>اسم المعدة</th>
                                <th>درجة المعدة</th>
                                <th>المنتج</th>
                                <th>درجة المنتج</th>
                                <th>نوع المسح</th>
                                <th>الحالة</th>
                                <th>المسؤول</th>
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
        </div>
    `;
};
