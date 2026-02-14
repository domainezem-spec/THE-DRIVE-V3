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
        { id: 'dashboard', name: 'لوحة المتابعة' },
        { id: 'audit', name: 'عمليات التفتيش' },
        { id: 'stock', name: 'صلاحية المخزون' },
        { id: 'receiving', name: 'سجل الاستلام' },
        { id: 'temp', name: 'سجل الحرارة' },
        { id: 'checklists', name: 'قوائم التحقق' },
        { id: 'calibration', name: 'المعايرة' },
        { id: 'health', name: 'الشهادات الصحية' },
        { id: 'pest', name: 'مكافحة الآفات' },
        { id: 'training', name: 'سجل التدريب' },
        { id: 'complaints', name: 'شكاوى العملاء' }
    ];

    const userPerms = typeof userData?.permissions === 'string' 
        ? userData.permissions.split(',') 
        : (userData?.permissions || []);

    return `
        <form id="userForm" class="space-y-8">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="form-group flex flex-col gap-2">
                    <label class="text-xs font-bold text-slate-500 mr-2">الاسم بالكامل</label>
                    <input type="text" name="fullName" value="${userData?.fullName || ''}" placeholder="Eslam Azeem" class="bg-slate-50 border border-slate-100 rounded-2xl px-4 py-4 text-sm font-semibold outline-none focus:border-indigo-500 transition-all" required>
                </div>
                <div class="form-group flex flex-col gap-2">
                    <label class="text-xs font-bold text-slate-500 mr-2">البريد الإلكتروني</label>
                    <input type="email" name="email" value="${userData?.email || ''}" ${userData ? 'readonly style="opacity:0.6"' : ''} placeholder="admin@system.com" class="bg-slate-50 border border-slate-100 rounded-2xl px-4 py-4 text-sm font-semibold outline-none focus:border-indigo-500 transition-all" required>
                </div>
                <div class="form-group flex flex-col gap-2">
                    <label class="text-xs font-bold text-slate-500 mr-2">كلمة المرور</label>
                    <input type="password" name="password" placeholder="${userData ? '********' : '••••••••'}" class="bg-slate-50 border border-slate-100 rounded-2xl px-4 py-4 text-sm font-semibold outline-none focus:border-indigo-500 transition-all" ${userData ? '' : 'required'}>
                </div>
                <div class="form-group flex flex-col gap-2">
                    <label class="text-xs font-bold text-slate-500 mr-2">الرتبة / الدور</label>
                    <select name="role" class="bg-slate-50 border border-slate-100 rounded-2xl px-4 py-4 text-sm font-semibold outline-none focus:border-indigo-500 transition-all">
                        <option value="User" ${userData?.role === 'User' ? 'selected' : ''}>User (Staff)</option>
                        <option value="Admin" ${userData?.role === 'Admin' ? 'selected' : ''}>Admin (Power User)</option>
                    </select>
                </div>
            </div>

            <div class="space-y-4">
                <div class="flex items-center gap-3">
                    <div class="w-8 h-8 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center">
                        <i class="fa-solid fa-lock-open text-xs"></i>
                    </div>
                    <h4 class="text-xs font-bold text-slate-500 uppercase tracking-widest">صلاحيات الوصول (Module Permissions)</h4>
                </div>
                
                <div class="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    ${modules.map(mod => `
                        <label class="flex items-center gap-3 p-4 bg-slate-50 border border-slate-100 rounded-2xl cursor-pointer hover:bg-white hover:border-indigo-200 transition-all group shadow-sm hover:shadow-md">
                            <input type="checkbox" name="permissions" value="${mod.id}" ${userPerms.includes(mod.id) ? 'checked' : ''} class="w-5 h-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500">
                            <span class="text-xs font-bold text-slate-600 group-hover:text-indigo-600 transition-colors">${mod.name}</span>
                        </label>
                    `).join('')}
                </div>
            </div>

            <button type="submit" class="w-full bg-slate-900 text-white rounded-2xl py-5 font-bold mt-4 hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/10 tracking-wide">حفظ بيانات المستخدم</button>
        </form>
    `;
};
