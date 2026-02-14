/**
 * ProceduresView - Opening/Closing Procedures Module
 * 2026 Premium Style - Minimal & Non-Italic
 */
import { formatDate } from '../../utils/formatters.js';

export const ProceduresView = (proceduresList, opsStations = []) => {
    const normalizeDate = (dateVal) => {
        if (!dateVal) return '';
        try {
            // If it's a Date object, convert to YYYY-MM-DD
            if (dateVal instanceof Date) return dateVal.toLocaleDateString('en-CA');
            // If it's an ISO string (contains T)
            if (typeof dateVal === 'string' && dateVal.includes('T')) return dateVal.split('T')[0];
            // If it's a date string but potentially in a different format, try to parse it
            const parsed = new Date(dateVal);
            if (!isNaN(parsed)) return parsed.toLocaleDateString('en-CA');
            return String(dateVal).trim();
        } catch (e) {
            return String(dateVal).trim();
        }
    };

    // Separate opening and closing tasks (Case-insensitive)
    const openingTasks = proceduresList.filter(p => String(p.procedureType || '').toLowerCase().trim() === 'opening');
    const closingTasks = proceduresList.filter(p => String(p.procedureType || '').toLowerCase().trim() === 'closing');

    // Get today's local date for filtering (Format: YYYY-MM-DD)
    const today = new Date().toLocaleDateString('en-CA');

    const todayOpening = openingTasks.filter(t => normalizeDate(t.date) === today);
    const todayClosing = closingTasks.filter(t => normalizeDate(t.date) === today);
    
    // Create a helper to get station details
    const getStationData = (stationId) => {
        const assignment = opsStations.find(s => s.station === stationId);
        return assignment || { employeeName: 'لم يتم التعيين', shift: 'morning' };
    };
    
    // Calculate progress
    const openingCompleted = todayOpening.filter(t => t.completed).length;
    const openingTotal = todayOpening.length;
    const openingProgress = openingTotal > 0 ? Math.round((openingCompleted / openingTotal) * 100) : 0;
    
    const closingCompleted = todayClosing.filter(t => t.completed).length;
    const closingTotal = todayClosing.length;
    const closingProgress = closingTotal > 0 ? Math.round((closingCompleted / closingTotal) * 100) : 0;
    
    const renderTaskList = (tasks, type) => {
        return `
            <div class="overflow-x-auto">
                <table class="w-full text-right border-collapse">
                    <thead>
                        <tr class="border-b border-slate-100 italic">
                            <th class="py-4 px-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">الحالة</th>
                            <th class="py-4 px-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">المهمة</th>
                            <th class="py-4 px-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">الوقت</th>
                            <th class="py-4 px-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">التكرار</th>
                            <th class="py-4 px-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">المرفق</th>
                            <th class="py-4 px-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">المسؤول</th>
                            <th class="py-4 px-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">إجراءات</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-50">
                        ${tasks.length === 0 ? `
                            <tr>
                                <td colspan="7" class="py-10 text-center text-slate-300 font-bold uppercase tracking-widest text-xs">لا توجد مهام لليوم</td>
                            </tr>
                        ` : tasks.map(task => {
                            const hasImg = task.img && task.img.length > 5;
                            const imgUrls = hasImg ? task.img.split(',').map(u => u.trim()) : [];
                            const thumbUrl = imgUrls.length > 0 ? imgUrls[0] : '';
                            const frequencyLabel = {
                                'daily': 'يومي',
                                'weekly': 'أسبوعي',
                                'monthly': 'شهري'
                            }[task.taskFrequency] || 'يومي';
                            
                            return `
                                <tr class="hover:bg-slate-50/50 transition-colors group">
                                    <td class="py-4 px-4">
                                        <div class="flex items-center gap-3">
                                            <input type="checkbox" 
                                                   class="task-checkbox w-6 h-6 rounded-lg border-2 border-slate-300 checked:bg-emerald-500 checked:border-emerald-500 cursor-pointer transition-all" 
                                                   data-id="${task.id}" 
                                                   data-name="${task.taskName}"
                                                   data-type="procedures"
                                                   ${task.completed ? 'checked disabled' : ''}>
                                            <span class="text-[10px] font-black tracking-tighter ${task.completed ? 'text-emerald-600 bg-emerald-50' : 'text-amber-600 bg-amber-50'} px-2 py-0.5 rounded-full uppercase">
                                                ${task.completed ? 'تم الإنجاز' : 'قيد الانتظار'}
                                            </span>
                                        </div>
                                    </td>
                                    <td class="py-4 px-4">
                                        <h5 class="text-sm font-bold ${task.completed ? 'text-slate-400 line-through' : 'text-slate-800'}">${task.taskName || '-'}</h5>
                                    </td>
                                    <td class="py-4 px-4">
                                        <span class="text-xs font-black text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">${task.taskTime || task.time || '-'}</span>
                                    </td>
                                    <td class="py-4 px-4">
                                        <span class="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded-md">${frequencyLabel}</span>
                                    </td>
                                    <td class="py-4 px-4">
                                        ${hasImg ? `
                                            <button class="img-preview-btn w-10 h-10 rounded-xl overflow-hidden border-2 border-indigo-100 hover:border-indigo-500 transition-all shadow-sm relative" 
                                                    data-img="${task.img}" 
                                                    data-id="${task.id}" 
                                                    data-type="procedures">
                                                <img src="${thumbUrl}" class="w-full h-full object-cover" alt="Task Image">
                                                ${imgUrls.length > 1 ? `<span class="absolute bottom-0 right-0 bg-indigo-600 text-white text-[8px] font-bold px-1 rounded-tl-md">+${imgUrls.length - 1}</span>` : ''}
                                            </button>
                                        ` : `
                                            <div class="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center border border-dashed border-slate-200 text-slate-300">
                                                <i class="fa-solid fa-camera text-xs"></i>
                                            </div>
                                        `}
                                    </td>
                                    <td class="py-4 px-4">
                                        <p class="text-xs text-slate-500 font-bold">
                                            <i class="fa-solid fa-user text-slate-300 ml-1"></i> ${task.responsible || '-'}
                                        </p>
                                    </td>
                                    <td class="py-4 px-4">
                                        <div class="flex gap-2 transition-all">
                                            <button class="action-edit text-slate-400 hover:text-indigo-600 hover:scale-110 transition-all admin-only" 
                                                    data-id="${task.id}" 
                                                    data-type="procedures">
                                                <i class="fa-solid fa-pen-to-square"></i>
                                            </button>
                                            <button class="action-delete text-slate-400 hover:text-rose-600 hover:scale-110 transition-all admin-only" 
                                                    data-id="${task.id}" 
                                                    data-type="procedures">
                                                <i class="fa-solid fa-trash-can"></i>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            `;
                        }).join('')}
                    </tbody>
                </table>
            </div>
        `;
    };

    const formattedToday = new Date().toLocaleDateString('ar-EG', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

    return `
        <div class="p-6 md:p-10 space-y-10">
            <!-- Header section with Today's Date and Print Button -->
            <div class="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-8 rounded-[32px] shadow-sm border border-slate-100">
                <div class="flex items-center gap-6">
                    <div class="w-16 h-16 bg-slate-950 rounded-2xl flex items-center justify-center shadow-xl rotate-3">
                        <i class="fa-solid fa-clipboard-check text-2xl text-white"></i>
                    </div>
                    <div>
                        <h2 class="text-3xl font-black text-slate-900 tracking-tight">إجراءات الجودة</h2>
                        <div class="flex items-center gap-3 mt-1">
                            <span class="text-sm font-bold text-slate-400">${formattedToday}</span>
                            <span class="w-1 h-1 bg-slate-200 rounded-full"></span>
                            <span class="text-xs font-black text-indigo-500 uppercase tracking-widest">Quality Procedures</span>
                        </div>
                    </div>
                </div>
                
                <div class="flex items-center gap-3">
                    <button id="print-procedures-btn" class="bg-slate-50 text-slate-700 hover:bg-slate-100 px-6 py-4 rounded-2xl font-black text-sm transition-all border border-slate-200 flex items-center gap-2">
                        <i class="fa-solid fa-print text-indigo-500"></i>
                        <span>طباعة التقرير المصور</span>
                    </button>
                    <button id="add-procedure-btn" class="bg-slate-950 text-white hover:bg-slate-800 px-8 py-4 rounded-2xl font-black text-sm transition-all shadow-xl shadow-slate-900/10 flex items-center gap-2 admin-only">
                        <i class="fa-solid fa-plus"></i>
                        <span>مهمة جديدة</span>
                    </button>
                </div>
            </div>
            
            <!-- Opening Procedures Section -->
            <div class="glass-card overflow-hidden">
                <div class="bg-gradient-to-r from-emerald-50 to-teal-50 px-8 py-5 border-b flex justify-between items-center">
                    <div class="flex items-center gap-3">
                        <div class="w-10 h-10 bg-emerald-500 text-white rounded-xl flex items-center justify-center shadow-md">
                            <i class="fa-solid fa-door-open"></i>
                        </div>
                        <div>
                            <h4 class="font-bold text-emerald-900">إجراءات الفتح</h4>
                            <p class="text-[10px] text-emerald-700 font-bold uppercase tracking-widest">Opening Procedures</p>
                        </div>
                    </div>
                    <div class="flex items-center gap-4">
                        <div class="text-left">
                            <p class="text-xs text-emerald-700 font-bold">نسبة الإتمام</p>
                            <p class="text-2xl font-black text-emerald-900">${openingProgress}%</p>
                        </div>
                        <div class="w-20 h-20 relative">
                            <svg class="transform -rotate-90" width="80" height="80">
                                <circle cx="40" cy="40" r="32" stroke="#D1FAE5" stroke-width="6" fill="none"/>
                                <circle cx="40" cy="40" r="32" stroke="#10B981" stroke-width="6" fill="none"
                                        stroke-dasharray="${2 * Math.PI * 32}" 
                                        stroke-dashoffset="${2 * Math.PI * 32 * (1 - openingProgress / 100)}"
                                        class="transition-all duration-500"/>
                            </svg>
                            <div class="absolute inset-0 flex items-center justify-center">
                                <span class="text-xs font-bold text-emerald-900">${openingCompleted}/${openingTotal}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="p-6 space-y-3 max-h-[500px] overflow-y-auto">
                    ${renderTaskList(todayOpening, 'opening')}
                </div>
            </div>

            <!-- Closing Procedures Section -->
            <div class="glass-card overflow-hidden">
                <div class="bg-gradient-to-r from-indigo-50 to-blue-50 px-8 py-5 border-b flex justify-between items-center">
                    <div class="flex items-center gap-3">
                        <div class="w-10 h-10 bg-indigo-500 text-white rounded-xl flex items-center justify-center shadow-md">
                            <i class="fa-solid fa-door-closed"></i>
                        </div>
                        <div>
                            <h4 class="font-bold text-indigo-900">إجراءات الغلق</h4>
                            <p class="text-[10px] text-indigo-700 font-bold uppercase tracking-widest">Closing Procedures</p>
                        </div>
                    </div>
                    <div class="flex items-center gap-4">
                        <div class="text-left">
                            <p class="text-xs text-indigo-700 font-bold">نسبة الإتمام</p>
                            <p class="text-2xl font-black text-indigo-900">${closingProgress}%</p>
                        </div>
                        <div class="w-20 h-20 relative">
                            <svg class="transform -rotate-90" width="80" height="80">
                                <circle cx="40" cy="40" r="32" stroke="#E0E7FF" stroke-width="6" fill="none"/>
                                <circle cx="40" cy="40" r="32" stroke="#4F46E5" stroke-width="6" fill="none"
                                        stroke-dasharray="${2 * Math.PI * 32}" 
                                        stroke-dashoffset="${2 * Math.PI * 32 * (1 - closingProgress / 100)}"
                                        class="transition-all duration-500"/>
                            </svg>
                            <div class="absolute inset-0 flex items-center justify-center">
                                <span class="text-xs font-bold text-indigo-900">${closingCompleted}/${closingTotal}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="p-6 space-y-3 max-h-[500px] overflow-y-auto">
                    ${renderTaskList(todayClosing, 'closing')}
                </div>
            </div>

            <!-- Stations Management Section -->
            <div class="glass-card overflow-hidden">
                <div class="bg-gradient-to-r from-violet-50 to-purple-50 px-8 py-5 border-b">
                    <div class="flex items-center gap-3">
                        <div class="w-10 h-10 bg-violet-500 text-white rounded-xl flex items-center justify-center shadow-md">
                            <i class="fa-solid fa-layer-group"></i>
                        </div>
                        <div>
                            <h4 class="font-bold text-violet-900">إدارة المحطات</h4>
                            <p class="text-[10px] text-violet-700 font-bold uppercase tracking-widest">Stations Management</p>
                        </div>
                    </div>
                </div>
                
                <div class="p-6">
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <!-- Fresh Bar Station -->
                        <div class="station-card glass-card p-5 border-l-4 border-emerald-500 cursor-pointer hover:shadow-xl transition-all" data-station="fresh-bar">
                            <div class="flex items-center gap-3 mb-3">
                                <div class="w-12 h-12 bg-emerald-500 text-white rounded-xl flex items-center justify-center shadow-md">
                                    <i class="fa-solid fa-seedling"></i>
                                </div>
                                <div class="flex-1">
                                    <h5 class="text-sm font-bold text-slate-800">Fresh Bar Station</h5>
                                    <p class="text-[10px] text-slate-400 font-bold uppercase tracking-wider">محطة الفريش بار</p>
                                </div>
                            </div>
                            <div class="space-y-2">
                                <div class="flex items-center gap-2 text-xs">
                                    <i class="fa-solid fa-user text-indigo-500"></i>
                                    <span class="font-semibold text-slate-600 station-employee">${getStationData('fresh-bar').employeeName}</span>
                                </div>
                                <div class="flex items-center gap-2">
                                    <span class="px-3 py-1 rounded-full text-[10px] font-bold ${getStationData('fresh-bar').shift === 'morning' ? 'bg-amber-50 text-amber-700' : 'bg-indigo-50 text-indigo-700'} station-shift">${getStationData('fresh-bar').shift === 'morning' ? 'صباحي' : 'مسائي'}</span>
                                    <span class="text-[10px] font-bold text-slate-400 station-task-count">0 مهام</span>
                                </div>
                            </div>
                        </div>

                        <!-- Preparation Station -->
                        <div class="station-card glass-card p-5 border-l-4 border-blue-500 cursor-pointer hover:shadow-xl transition-all" data-station="preparation">
                            <div class="flex items-center gap-3 mb-3">
                                <div class="w-12 h-12 bg-blue-500 text-white rounded-xl flex items-center justify-center shadow-md">
                                    <i class="fa-solid fa-kitchen-set"></i>
                                </div>
                                <div class="flex-1">
                                    <h5 class="text-sm font-bold text-slate-800">Preparation Station</h5>
                                    <p class="text-[10px] text-slate-400 font-bold uppercase tracking-wider">محطة التحضير</p>
                                </div>
                            </div>
                            <div class="space-y-2">
                                <div class="flex items-center gap-2 text-xs">
                                    <i class="fa-solid fa-user text-indigo-500"></i>
                                    <span class="font-semibold text-slate-600 station-employee">${getStationData('preparation').employeeName}</span>
                                </div>
                                <div class="flex items-center gap-2">
                                    <span class="px-3 py-1 rounded-full text-[10px] font-bold ${getStationData('preparation').shift === 'morning' ? 'bg-amber-50 text-amber-700' : 'bg-indigo-50 text-indigo-700'} station-shift">${getStationData('preparation').shift === 'morning' ? 'صباحي' : 'مسائي'}</span>
                                    <span class="text-[10px] font-bold text-slate-400 station-task-count">0 مهام</span>
                                </div>
                            </div>
                        </div>

                        <!-- POS Station -->
                        <div class="station-card glass-card p-5 border-l-4 border-indigo-500 cursor-pointer hover:shadow-xl transition-all" data-station="pos">
                            <div class="flex items-center gap-3 mb-3">
                                <div class="w-12 h-12 bg-indigo-500 text-white rounded-xl flex items-center justify-center shadow-md">
                                    <i class="fa-solid fa-receipt"></i>
                                </div>
                                <div class="flex-1">
                                    <h5 class="text-sm font-bold text-slate-800">POS Station</h5>
                                    <p class="text-[10px] text-slate-400 font-bold uppercase tracking-wider">محطة الكاشير</p>
                                </div>
                            </div>
                            <div class="space-y-2">
                                <div class="flex items-center gap-2 text-xs">
                                    <i class="fa-solid fa-user text-indigo-500"></i>
                                    <span class="font-semibold text-slate-600 station-employee">${getStationData('pos').employeeName}</span>
                                </div>
                                <div class="flex items-center gap-2">
                                    <span class="px-3 py-1 rounded-full text-[10px] font-bold ${getStationData('pos').shift === 'morning' ? 'bg-amber-50 text-amber-700' : 'bg-indigo-50 text-indigo-700'} station-shift">${getStationData('pos').shift === 'morning' ? 'صباحي' : 'مسائي'}</span>
                                    <span class="text-[10px] font-bold text-slate-400 station-task-count">0 مهام</span>
                                </div>
                            </div>
                        </div>

                        <!-- Pick up (Dispatcher) Station -->
                        <div class="station-card glass-card p-5 border-l-4 border-rose-500 cursor-pointer hover:shadow-xl transition-all" data-station="dispatcher">
                            <div class="flex items-center gap-3 mb-3">
                                <div class="w-12 h-12 bg-rose-500 text-white rounded-xl flex items-center justify-center shadow-md">
                                    <i class="fa-solid fa-dolly"></i>
                                </div>
                                <div class="flex-1">
                                    <h5 class="text-sm font-bold text-slate-800">Pick up Station</h5>
                                    <p class="text-[10px] text-slate-400 font-bold uppercase tracking-wider">محطة التوصيل</p>
                                </div>
                            </div>
                            <div class="space-y-2">
                                <div class="flex items-center gap-2 text-xs">
                                    <i class="fa-solid fa-user text-indigo-500"></i>
                                    <span class="font-semibold text-slate-600 station-employee">${getStationData('dispatcher').employeeName}</span>
                                </div>
                                <div class="flex items-center gap-2">
                                    <span class="px-3 py-1 rounded-full text-[10px] font-bold ${getStationData('dispatcher').shift === 'morning' ? 'bg-amber-50 text-amber-700' : 'bg-indigo-50 text-indigo-700'} station-shift">${getStationData('dispatcher').shift === 'morning' ? 'صباحي' : 'مسائي'}</span>
                                    <span class="text-[10px] font-bold text-slate-400 station-task-count">0 مهام</span>
                                </div>
                            </div>
                        </div>

                        <!-- Coffee Station -->
                        <div class="station-card glass-card p-5 border-l-4 border-amber-500 cursor-pointer hover:shadow-xl transition-all" data-station="coffee">
                            <div class="flex items-center gap-3 mb-3">
                                <div class="w-12 h-12 bg-amber-500 text-white rounded-xl flex items-center justify-center shadow-md">
                                    <i class="fa-solid fa-mug-hot"></i>
                                </div>
                                <div class="flex-1">
                                    <h5 class="text-sm font-bold text-slate-800">Coffee Station</h5>
                                    <p class="text-[10px] text-slate-400 font-bold uppercase tracking-wider">محطة القهوة</p>
                                </div>
                            </div>
                            <div class="space-y-2">
                                <div class="flex items-center gap-2 text-xs">
                                    <i class="fa-solid fa-user text-indigo-500"></i>
                                    <span class="font-semibold text-slate-600 station-employee">${getStationData('coffee').employeeName}</span>
                                </div>
                                <div class="flex items-center gap-2">
                                    <span class="px-3 py-1 rounded-full text-[10px] font-bold ${getStationData('coffee').shift === 'morning' ? 'bg-amber-50 text-amber-700' : 'bg-indigo-50 text-indigo-700'} station-shift">${getStationData('coffee').shift === 'morning' ? 'صباحي' : 'مسائي'}</span>
                                    <span class="text-[10px] font-bold text-slate-400 station-task-count">0 مهام</span>
                                </div>
                            </div>
                        </div>

                        <!-- Runner Station -->
                        <div class="station-card glass-card p-5 border-l-4 border-teal-500 cursor-pointer hover:shadow-xl transition-all" data-station="runner">
                            <div class="flex items-center gap-3 mb-3">
                                <div class="w-12 h-12 bg-teal-500 text-white rounded-xl flex items-center justify-center shadow-md">
                                    <i class="fa-solid fa-person-walking-arrow-right"></i>
                                </div>
                                <div class="flex-1">
                                    <h5 class="text-sm font-bold text-slate-800">Runner Station</h5>
                                    <p class="text-[10px] text-slate-400 font-bold uppercase tracking-wider">محطة الرانر</p>
                                </div>
                            </div>
                            <div class="space-y-2">
                                <div class="flex items-center gap-2 text-xs">
                                    <i class="fa-solid fa-user text-indigo-500"></i>
                                    <span class="font-semibold text-slate-600 station-employee">${getStationData('runner').employeeName}</span>
                                </div>
                                <div class="flex items-center gap-2">
                                    <span class="px-3 py-1 rounded-full text-[10px] font-bold ${getStationData('runner').shift === 'morning' ? 'bg-amber-50 text-amber-700' : 'bg-indigo-50 text-indigo-700'} station-shift">${getStationData('runner').shift === 'morning' ? 'صباحي' : 'مسائي'}</span>
                                    <span class="text-[10px] font-bold text-slate-400 station-task-count">0 مهام</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
};
