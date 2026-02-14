/**
 * UsersView - Generates the HTML for the User Management module.
 * 2026 Premium Style - Minimal & Non-Italic.
 */
export const UsersView = (usersList) => {
    const rows = usersList.map(user => {
        const permissions = user.permissions || [];
        return `
            <tr class="hover:bg-slate-50 transition border-b border-slate-50 last:border-0">
                <td class="p-4 font-bold text-slate-800">${user.fullName || '-'}</td>
                <td class="p-4 font-bold text-slate-400 text-[11px]">${user.email || '-'}</td>
                <td class="p-4">
                    <span class="px-3 py-1 rounded-full text-[10px] font-bold ${user.role === 'Admin' ? 'bg-rose-50 text-rose-600' : 'bg-emerald-50 text-emerald-600'}">
                        ${user.role || 'User'}
                    </span>
                </td>
                <td class="p-4">
                    <div class="flex flex-wrap gap-1 max-w-xs">
                        ${(() => {
                            const perms = typeof user.permissions === 'string' 
                                ? user.permissions.split(',').filter(p => p.trim() !== '')
                                : (Array.isArray(user.permissions) ? user.permissions : []);
                            
                            return perms.length > 0 ? perms.map(p => `
                                <span class="px-2 py-0.5 bg-slate-50 text-slate-500 rounded text-[9px] font-bold border border-slate-100 uppercase tracking-wider">${p}</span>
                            `).join('') : '<span class="text-slate-300 text-[10px]">No access</span>';
                        })()}
                    </div>
                </td>
                <td class="p-4">
                    <div class="flex gap-3 justify-center">
                        <button class="text-slate-300 hover:text-indigo-600 hover:scale-110 transition-all edit-user-btn" data-email="${user.email}"><i class="fa-solid fa-pen-to-square"></i></button>
                        <button class="text-slate-300 hover:text-rose-600 hover:scale-110 transition-all delete-user-btn" data-email="${user.email}"><i class="fa-solid fa-trash-can"></i></button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');

    return `
        <div class="flex flex-col gap-10 text-right">
            <div class="flex flex-wrap items-center justify-between gap-6">
                <div class="flex items-center gap-5">
                    <div class="w-14 h-14 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center text-2xl shadow-sm">
                        <i class="fa-solid fa-users-gear"></i>
                    </div>
                    <div>
                        <h3 class="text-3xl font-bold text-slate-800 tracking-tight">إدارة المستخدمين</h3>
                        <p class="text-xs text-slate-400 font-medium uppercase tracking-widest mt-1">التحكم في صلاحيات الوصول ومستويات الأمان</p>
                    </div>
                </div>

                <button id="add-user-btn" class="bg-indigo-600 text-white px-6 py-4 rounded-xl font-bold text-xs shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center gap-2">
                    <i class="fa-solid fa-user-plus"></i> إضافة مستخدم جديد
                </button>
            </div>
            
            <div class="glass-card overflow-hidden">
                <table class="w-full text-right" id="usersTable">
                    <thead>
                        <tr>
                            <th>الاسم الكامل</th>
                            <th>البريد الإلكتروني</th>
                            <th>الرتبة</th>
                            <th>الصلاحيات</th>
                            <th class="text-center">إجراء</th>
                        </tr>
                    </thead>
                    <tbody class="text-[13px] font-medium text-slate-600">
                        ${rows}
                    </tbody>
                </table>
            </div>

            <!-- Permission Legend -->
            <div class="p-8 bg-slate-900 rounded-3xl text-white relative overflow-hidden">
                <div class="relative z-10">
                    <h4 class="text-xl font-bold mb-2 tracking-tight">مستويات الصلاحية</h4>
                    <p class="text-slate-400 text-[11px] font-bold uppercase tracking-widest mb-6">Authority Legend</p>
                    <div class="flex flex-wrap gap-8">
                        <div class="flex items-center gap-3">
                            <span class="w-3 h-3 rounded-full bg-rose-500"></span>
                            <span class="text-xs font-bold uppercase tracking-wider">تحرير كامل (Full Edit)</span>
                        </div>
                        <div class="flex items-center gap-3">
                            <span class="w-3 h-3 rounded-full bg-emerald-500"></span>
                            <span class="text-xs font-bold uppercase tracking-wider">عرض فقط (Read Only)</span>
                        </div>
                    </div>
                </div>
                <div class="absolute -right-20 -bottom-20 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl"></div>
            </div>
        </div>
    `;
};

/**
 * UserFormTemplate - Shared by Add/Edit
 */
export const UserFormTemplate = (userData = null) => {
    const modules = [
        { id: 'dashboard', name: 'لوحة المتابعة', icon: 'fa-chart-pie' },
        { id: 'audit', name: 'عمليات التفتيش', icon: 'fa-clipboard-check' },
        { id: 'stock', name: 'صلاحية المخزون', icon: 'fa-box-open' },
        { id: 'receiving', name: 'سجل الاستلام', icon: 'fa-truck-loading' },
        { id: 'temp', name: 'سجل الحرارة', icon: 'fa-temperature-half' },
        { id: 'checklists', name: 'قوائم التحقق', icon: 'fa-list-check' },
        { id: 'calibration', name: 'المعايرة', icon: 'fa-wrench' },
        { id: 'health', name: 'الشهادات الصحية', icon: 'fa-id-card' },
        { id: 'pest', name: 'مكافحة الآفات', icon: 'fa-bug' },
        { id: 'training', name: 'سجل التدريب', icon: 'fa-graduation-cap' },
        { id: 'complaints', name: 'شكاوى العملاء', icon: 'fa-headset' }
    ];

    const userPerms = typeof userData?.permissions === 'string' 
        ? userData.permissions.split(',') 
        : (userData?.permissions || []);

    return `
        <form id="userForm" class="space-y-8">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="form-group flex flex-col gap-2">
                    <label class="text-[10px] font-bold text-slate-400 mr-2 uppercase tracking-widest">الاسم بالكامل</label>
                    <input type="text" name="fullName" value="${userData?.fullName || ''}" placeholder="Eslam Azeem" class="bg-slate-50 border border-slate-100 rounded-2xl px-4 py-4 text-sm font-semibold outline-none focus:border-indigo-500 transition-all" required>
                </div>
                <div class="form-group flex flex-col gap-2">
                    <label class="text-[10px] font-bold text-slate-400 mr-2 uppercase tracking-widest">البريد الإلكتروني</label>
                    <input type="email" name="email" value="${userData?.email || ''}" ${userData ? 'readonly style="opacity:0.6"' : ''} placeholder="admin@system.com" class="bg-slate-50 border border-slate-100 rounded-2xl px-4 py-4 text-sm font-semibold outline-none focus:border-indigo-500 transition-all" required>
                </div>
                <div class="form-group flex flex-col gap-2">
                    <label class="text-[10px] font-bold text-slate-400 mr-2 uppercase tracking-widest">كلمة المرور</label>
                    <input type="password" name="password" placeholder="${userData ? '********' : '••••••••'}" class="bg-slate-50 border border-slate-100 rounded-2xl px-4 py-4 text-sm font-semibold outline-none focus:border-indigo-500 transition-all" ${userData ? '' : 'required'}>
                </div>
                <div class="form-group flex flex-col gap-2">
                    <label class="text-[10px] font-bold text-slate-400 mr-2 uppercase tracking-widest">الرتبة / الدور</label>
                    <select name="role" class="bg-slate-50 border border-slate-100 rounded-2xl px-4 py-4 text-sm font-semibold outline-none focus:border-indigo-500 transition-all">
                        <option value="User" ${userData?.role === 'User' ? 'selected' : ''}>User (Staff)</option>
                        <option value="Admin" ${userData?.role === 'Admin' ? 'selected' : ''}>Admin (Power User)</option>
                    </select>
                </div>
            </div>

            <div class="space-y-6">
                <div class="flex items-center gap-3">
                    <div class="w-8 h-8 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center">
                        <i class="fa-solid fa-lock-open text-xs"></i>
                    </div>
                    <h4 class="text-xs font-black text-slate-800 uppercase tracking-widest">صلاحيات الوصول المتقدمة (Permissions Control)</h4>
                </div>
                
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    ${modules.map(mod => {
                        const hasView = userPerms.includes(`${mod.id}_v`) || userPerms.includes(mod.id);
                        const hasEdit = userPerms.includes(`${mod.id}_e`);
                        return `
                            <div class="p-4 bg-slate-50 border border-slate-100 rounded-2xl hover:bg-white hover:border-indigo-200 transition-all group shadow-sm">
                                <div class="flex items-center gap-3 mb-4">
                                    <div class="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-sm">
                                        <i class="fa-solid ${mod.icon} text-xs"></i>
                                    </div>
                                    <span class="text-xs font-black text-slate-700">${mod.name}</span>
                                </div>
                                <div class="flex gap-4 border-t border-slate-100 pt-3">
                                    <label class="flex items-center gap-2 cursor-pointer">
                                        <input type="checkbox" name="permissions" value="${mod.id}_v" ${hasView ? 'checked' : ''} class="w-4 h-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500">
                                        <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">عرض</span>
                                    </label>
                                    <label class="flex items-center gap-2 cursor-pointer">
                                        <input type="checkbox" name="permissions" value="${mod.id}_e" ${hasEdit ? 'checked' : ''} class="w-4 h-4 rounded border-slate-300 text-rose-600 focus:ring-rose-500">
                                        <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">تعديل</span>
                                    </label>
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>

            <button type="submit" class="w-full bg-slate-900 text-white rounded-2xl py-6 font-black mt-4 hover:bg-slate-800 transition-all shadow-2xl shadow-indigo-200 tracking-wide uppercase">حفظ وتحديث الصلاحيات</button>
        </form>
    `;
};
