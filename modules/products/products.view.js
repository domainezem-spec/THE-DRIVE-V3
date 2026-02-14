/**
 * ProductsView - Generates the HTML for the Products Database module.
 * 2026 Premium Style - Minimal & Non-Italic.
 */
export const ProductsView = (productsList) => {
    const rows = productsList.map(item => `
        <tr class="hover:bg-slate-50 transition border-b border-slate-50 last:border-0">
            <td class="p-4 font-bold text-slate-400 font-mono text-xs">${item.code || '-'}</td>
            <td class="p-4 font-bold text-slate-800">${item.name || '-'}</td>
            <td class="p-4 text-emerald-600 font-bold">${item.life || '-'} ${item.unit || '-'}</td>
            <td class="p-4">
                <span class="px-3 py-1 rounded-full text-[10px] font-bold bg-slate-50 text-slate-500 border border-slate-100">${item.category || '-'}</span>
            </td>
            <td class="p-4 max-w-[150px] overflow-hidden text-ellipsis whitespace-nowrap text-slate-400 text-xs">${item.notes || '-'}</td>
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
                    <div class="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center text-2xl shadow-sm">
                        <i class="fa-solid fa-layer-group"></i>
                    </div>
                    <div>
                        <h3 class="text-3xl font-bold text-slate-800 tracking-tight">قاعدة الأصناف</h3>
                        <p class="text-xs text-slate-400 font-medium mt-1 uppercase tracking-widest">إدارة معايير جودة المنتجات وفترة الصلاحية</p>
                    </div>
                </div>

                <div class="flex flex-wrap gap-3">
                    <button id="add-product-btn" class="bg-indigo-600 text-white px-5 py-3 rounded-xl font-bold text-xs shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center gap-2">
                        <i class="fa-solid fa-plus"></i> صنف جديد
                    </button>
                    <button class="bg-slate-900 text-white px-5 py-3 rounded-xl font-bold text-xs shadow-lg shadow-slate-200 hover:bg-slate-800 transition-all flex items-center gap-2">
                        <i class="fa-solid fa-file-export"></i> تصدير البيانات
                    </button>
                </div>
            </div>
            
            <div class="glass-card overflow-hidden">
                <table class="w-full text-right" id="productsTable">
                    <thead>
                        <tr>
                            <th>كود</th>
                            <th>الاسم</th>
                            <th>الصلاحية</th>
                            <th>التصنيف</th>
                            <th>المعايير</th>
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
