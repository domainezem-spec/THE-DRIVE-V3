/**
 * NotificationsView - Notifications Management Page
 * 2026 Premium Style
 */

export const NotificationsView = (notifications) => {
    const getPriorityColor = (priority) => {
        const colors = {
            'urgent': 'bg-rose-50 border-rose-500 text-rose-700',
            'high': 'bg-orange-50 border-orange-500 text-orange-700',
            'medium': 'bg-amber-50 border-amber-500 text-amber-700',
            'low': 'bg-blue-50 border-blue-500 text-blue-700'
        };
        return colors[priority] || colors.medium;
    };

    const getCategoryIcon = (category) => {
        const icons = {
            'quality': 'fa-clipboard-check',
            'stock': 'fa-box-open',
            'health': 'fa-id-card-clip',
            'temp': 'fa-temperature-half',
            'procedures': 'fa-clipboard-list-check',
            'system': 'fa-gear',
            'general': 'fa-bell'
        };
        return icons[category] || icons.general;
    };

    const unreadCount = notifications.filter(n => !n.read).length;

    const notificationCards = notifications.map(notif => {
        const priorityClass = getPriorityColor(notif.priority);
        const icon = getCategoryIcon(notif.category);
        const isUnread = !notif.read;

        return `
            <div class="glass-card p-5 border-r-4 ${priorityClass} ${isUnread ? 'bg-indigo-50/30' : ''} transition-all hover:shadow-lg" data-notification-id="${notif.id}">
                <div class="flex items-start gap-4">
                    <div class="w-12 h-12 ${priorityClass.split(' ')[0]} rounded-xl flex items-center justify-center flex-shrink-0">
                        <i class="fa-solid ${icon} text-lg"></i>
                    </div>
                    <div class="flex-1">
                        <div class="flex items-start justify-between gap-3 mb-2">
                            <h4 class="font-bold text-slate-800 ${isUnread ? 'text-indigo-900' : ''}">${notif.title}</h4>
                            ${isUnread ? '<span class="w-2 h-2 bg-indigo-600 rounded-full flex-shrink-0 mt-2"></span>' : ''}
                        </div>
                        <p class="text-sm text-slate-600 mb-3">${notif.message}</p>
                        <div class="flex items-center justify-between">
                            <div class="flex items-center gap-3">
                                <span class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">${new Date(notif.date).toLocaleDateString('ar-EG')}</span>
                                <span class="px-2 py-1 rounded-full text-[9px] font-bold ${priorityClass}">${notif.priority === 'urgent' ? 'عاجل' : notif.priority === 'high' ? 'مهم' : notif.priority === 'medium' ? 'متوسط' : 'عادي'}</span>
                            </div>
                            <div class="flex gap-2">
                                ${isUnread ? `<button class="mark-read-btn text-xs text-indigo-600 hover:text-indigo-700 font-semibold" data-id="${notif.id}">تحديد كمقروء</button>` : ''}
                                <button class="delete-notif-btn text-xs text-rose-600 hover:text-rose-700 font-semibold admin-only" data-id="${notif.id}">حذف</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }).join('');

    return `
        <div class="flex flex-col gap-10 text-right">
            <div class="flex flex-wrap items-center justify-between gap-6">
                <div class="flex items-center gap-5">
                    <div class="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center text-2xl shadow-sm">
                        <i class="fa-solid fa-bell"></i>
                    </div>
                    <div>
                        <h3 class="text-3xl font-bold text-slate-800 tracking-tight">التنبيهات</h3>
                        <p class="text-xs text-slate-400 font-medium mt-1 uppercase tracking-widest">Notifications Center</p>
                    </div>
                </div>

                <div class="flex flex-wrap gap-3">
                    <button id="add-notification-btn" class="bg-indigo-600 text-white px-5 py-3 rounded-xl font-bold text-xs shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center gap-2 admin-only">
                        <i class="fa-solid fa-plus"></i> تنبيه جديد
                    </button>
                    <button id="mark-all-read-btn" class="bg-slate-900 text-white px-5 py-3 rounded-xl font-bold text-xs shadow-lg shadow-slate-200 hover:bg-slate-800 transition-all flex items-center gap-2">
                        <i class="fa-solid fa-check-double"></i> تحديد الكل كمقروء
                    </button>
                </div>
            </div>

            <!-- Stats -->
            <div class="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div class="glass-card p-4 border-b-4 border-indigo-500">
                    <p class="text-[10px] font-bold text-slate-400 mb-1 uppercase tracking-widest">إجمالي التنبيهات</p>
                    <h3 class="text-2xl font-bold text-slate-800">${notifications.length}</h3>
                </div>
                <div class="glass-card p-4 border-b-4 border-rose-500">
                    <p class="text-[10px] font-bold text-slate-400 mb-1 uppercase tracking-widest">غير مقروءة</p>
                    <h3 class="text-2xl font-bold text-rose-600">${unreadCount}</h3>
                </div>
                <div class="glass-card p-4 border-b-4 border-orange-500">
                    <p class="text-[10px] font-bold text-slate-400 mb-1 uppercase tracking-widest">عاجلة</p>
                    <h3 class="text-2xl font-bold text-orange-600">${notifications.filter(n => n.priority === 'urgent').length}</h3>
                </div>
                <div class="glass-card p-4 border-b-4 border-emerald-500">
                    <p class="text-[10px] font-bold text-slate-400 mb-1 uppercase tracking-widest">مقروءة</p>
                    <h3 class="text-2xl font-bold text-emerald-600">${notifications.length - unreadCount}</h3>
                </div>
            </div>

            <!-- Notifications List -->
            <div class="space-y-4" id="notifications-container">
                ${notifications.length > 0 ? notificationCards : `
                    <div class="glass-card p-10 text-center">
                        <i class="fa-solid fa-bell-slash text-5xl text-slate-300 mb-4"></i>
                        <p class="text-slate-400 font-semibold">لا توجد تنبيهات</p>
                    </div>
                `}
            </div>
        </div>
    `;
};
