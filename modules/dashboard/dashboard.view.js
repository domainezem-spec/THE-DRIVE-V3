/**
 * DashboardView - Generates the HTML for the dashboard.
 * 2026 Premium Style - Minimal & Non-Italic.
 */
export const DashboardView = (data) => {
    return `
        <!-- Stats Cards -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10 text-right">
            <div class="glass-card p-6 border-b-4 border-emerald-500 flex items-center justify-between">
                <div>
                    <p class="text-[10px] font-bold text-slate-400 mb-1 uppercase tracking-widest">إجمالي نقاط الجودة</p>
                    <h3 class="text-3xl font-bold text-slate-800 tracking-tight">${data.qualityPoints || 0}</h3>
                </div>
                <div class="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center text-xl shadow-sm"><i class="fa-solid fa-magnifying-glass-chart"></i></div>
            </div>

            <div class="glass-card p-6 border-b-4 border-rose-500 flex items-center justify-between">
                <div>
                    <p class="text-[10px] font-bold text-slate-400 mb-1 uppercase tracking-widest">مخزون منتهي الصلاحية</p>
                    <h3 class="text-3xl font-bold text-rose-600 tracking-tight">${data.expiredStock || 0}</h3>
                </div>
                <div class="w-12 h-12 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center text-xl shadow-sm"><i class="fa-solid fa-boxes-stacked"></i></div>
            </div>

            <div class="glass-card p-6 border-b-4 border-amber-500 flex items-center justify-between">
                <div>
                    <p class="text-[10px] font-bold text-slate-400 mb-1 uppercase tracking-widest">شهادات صحية منتهية</p>
                    <h3 class="text-3xl font-bold text-amber-600 tracking-tight">${data.expiredHealth || 0}</h3>
                </div>
                <div class="w-12 h-12 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center text-xl shadow-sm"><i class="fa-solid fa-address-card"></i></div>
            </div>

            <div id="quality-score-card" class="glass-card p-6 bg-slate-900 border-b-4 border-indigo-500 shadow-xl shadow-slate-200 flex items-center justify-between transition-transform cursor-pointer hover:scale-105 hover:shadow-2xl">
                <div>
                    <p class="text-[10px] font-bold text-indigo-400 mb-1 uppercase tracking-widest">معدل تقييم الفرع</p>
                    <h3 class="text-3xl font-bold text-white tracking-tight">${data.lastScore || 0}%</h3>
                </div>
                <div class="w-12 h-12 bg-indigo-500/20 text-indigo-400 rounded-2xl flex items-center justify-center text-xl shadow-lg border border-indigo-500/30"><i class="fa-solid fa-arrow-up-right-dots"></i></div>
            </div>
        </div>

        <!-- Temperature Alert Cards -->
        <div class="mb-10">
            <div class="flex items-center gap-3 mb-5">
                <div class="w-10 h-10 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center">
                    <i class="fa-solid fa-temperature-half"></i>
                </div>
                <div>
                    <h4 class="text-lg font-bold text-slate-800">تنبيهات قياس درجات الحرارة</h4>
                    <p class="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Temperature Monitoring Schedule</p>
                </div>
            </div>
            
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-4" id="temp-alerts">
                <!-- Dynamic temperature alerts will be inserted here -->
            </div>

            <!-- Warm Bowls Reminder -->
            <div class="glass-card p-5 bg-gradient-to-r from-orange-50 to-amber-50 border-r-4 border-orange-500">
                <div class="flex items-center gap-4">
                    <div class="w-14 h-14 bg-orange-500 text-white rounded-2xl flex items-center justify-center text-2xl shadow-lg">
                        <i class="fa-solid fa-camera"></i>
                    </div>
                    <div class="flex-1">
                        <h5 class="text-sm font-bold text-orange-900 mb-1">تصوير درجات حرارة Warm Bowls</h5>
                        <p class="text-xs text-orange-700 font-semibold">يرجى التأكد من تصوير درجات حرارة منتجات Warm Bowls مع كل قياس</p>
                    </div>
                    <div class="text-orange-500">
                        <i class="fa-solid fa-bell text-2xl animate-pulse"></i>
                    </div>
                </div>
            </div>
        </div>

        <!-- Stations Overview -->
        <div class="mb-10">
            <div class="flex items-center gap-3 mb-5">
                <div class="w-10 h-10 bg-violet-50 text-violet-600 rounded-xl flex items-center justify-center">
                    <i class="fa-solid fa-layer-group"></i>
                </div>
                <div>
                    <h4 class="text-lg font-bold text-slate-800">نظرة عامة على المحطات</h4>
                    <p class="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Stations Overview</p>
                </div>
            </div>
            
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" id="stations-overview">
                <!-- Fresh Bar Station -->
                <div class="glass-card p-4 border-l-4 border-emerald-500" data-station="fresh-bar">
                    <div class="flex items-center gap-3 mb-3">
                        <div class="w-10 h-10 bg-emerald-500 text-white rounded-xl flex items-center justify-center shadow-md">
                            <i class="fa-solid fa-seedling"></i>
                        </div>
                        <div class="flex-1">
                            <h5 class="text-sm font-bold text-slate-800">Fresh Bar</h5>
                            <p class="text-[10px] text-slate-400 font-bold">محطة الفريش بار</p>
                        </div>
                    </div>
                    <div class="space-y-2">
                        <div class="flex items-center gap-2 text-xs">
                            <i class="fa-solid fa-user text-indigo-500"></i>
                            <span class="font-semibold text-slate-600 station-employee">لم يتم التعيين</span>
                        </div>
                        <div class="flex items-center gap-2">
                            <span class="px-2 py-1 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 station-shift">صباحي</span>
                            <span class="text-[10px] font-bold text-slate-400 station-task-count">0 مهام</span>
                        </div>
                    </div>
                </div>

                <!-- Preparation Station -->
                <div class="glass-card p-4 border-l-4 border-blue-500" data-station="preparation">
                    <div class="flex items-center gap-3 mb-3">
                        <div class="w-10 h-10 bg-blue-500 text-white rounded-xl flex items-center justify-center shadow-md">
                            <i class="fa-solid fa-kitchen-set"></i>
                        </div>
                        <div class="flex-1">
                            <h5 class="text-sm font-bold text-slate-800">Preparation</h5>
                            <p class="text-[10px] text-slate-400 font-bold">محطة التحضير</p>
                        </div>
                    </div>
                    <div class="space-y-2">
                        <div class="flex items-center gap-2 text-xs">
                            <i class="fa-solid fa-user text-indigo-500"></i>
                            <span class="font-semibold text-slate-600 station-employee">لم يتم التعيين</span>
                        </div>
                        <div class="flex items-center gap-2">
                            <span class="px-2 py-1 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 station-shift">صباحي</span>
                            <span class="text-[10px] font-bold text-slate-400 station-task-count">0 مهام</span>
                        </div>
                    </div>
                </div>

                <!-- POS Station -->
                <div class="glass-card p-4 border-l-4 border-indigo-500" data-station="pos">
                    <div class="flex items-center gap-3 mb-3">
                        <div class="w-10 h-10 bg-indigo-500 text-white rounded-xl flex items-center justify-center shadow-md">
                            <i class="fa-solid fa-receipt"></i>
                        </div>
                        <div class="flex-1">
                            <h5 class="text-sm font-bold text-slate-800">POS</h5>
                            <p class="text-[10px] text-slate-400 font-bold">محطة الكاشير</p>
                        </div>
                    </div>
                    <div class="space-y-2">
                        <div class="flex items-center gap-2 text-xs">
                            <i class="fa-solid fa-user text-indigo-500"></i>
                            <span class="font-semibold text-slate-600 station-employee">لم يتم التعيين</span>
                        </div>
                        <div class="flex items-center gap-2">
                            <span class="px-2 py-1 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 station-shift">صباحي</span>
                            <span class="text-[10px] font-bold text-slate-400 station-task-count">0 مهام</span>
                        </div>
                    </div>
                </div>

                <!-- Dispatcher Station -->
                <div class="glass-card p-4 border-l-4 border-rose-500" data-station="dispatcher">
                    <div class="flex items-center gap-3 mb-3">
                        <div class="w-10 h-10 bg-rose-500 text-white rounded-xl flex items-center justify-center shadow-md">
                            <i class="fa-solid fa-dolly"></i>
                        </div>
                        <div class="flex-1">
                            <h5 class="text-sm font-bold text-slate-800">Pick up</h5>
                            <p class="text-[10px] text-slate-400 font-bold">محطة التوصيل</p>
                        </div>
                    </div>
                    <div class="space-y-2">
                        <div class="flex items-center gap-2 text-xs">
                            <i class="fa-solid fa-user text-indigo-500"></i>
                            <span class="font-semibold text-slate-600 station-employee">لم يتم التعيين</span>
                        </div>
                        <div class="flex items-center gap-2">
                            <span class="px-2 py-1 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 station-shift">صباحي</span>
                            <span class="text-[10px] font-bold text-slate-400 station-task-count">0 مهام</span>
                        </div>
                    </div>
                </div>

                <div class="glass-card p-4 border-l-4 border-amber-500" data-station="coffee">
                    <div class="flex items-center gap-3 mb-3">
                        <div class="w-10 h-10 bg-amber-500 text-white rounded-xl flex items-center justify-center shadow-md">
                            <i class="fa-solid fa-mug-hot"></i>
                        </div>
                        <div class="flex-1">
                            <h5 class="text-sm font-bold text-slate-800">Coffee</h5>
                            <p class="text-[10px] text-slate-400 font-bold">محطة القهوة</p>
                        </div>
                    </div>
                    <div class="space-y-2">
                        <div class="flex items-center gap-2 text-xs">
                            <i class="fa-solid fa-user text-indigo-500"></i>
                            <span class="font-semibold text-slate-600 station-employee">لم يتم التعيين</span>
                        </div>
                        <div class="flex items-center gap-2">
                            <span class="px-2 py-1 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 station-shift">صباحي</span>
                            <span class="text-[10px] font-bold text-slate-400 station-task-count">0 مهام</span>
                        </div>
                    </div>
                </div>

                <!-- Runner Station -->
                <div class="glass-card p-4 border-l-4 border-teal-500" data-station="runner">
                    <div class="flex items-center gap-3 mb-3">
                        <div class="w-10 h-10 bg-teal-500 text-white rounded-xl flex items-center justify-center shadow-md">
                            <i class="fa-solid fa-person-walking-arrow-right"></i>
                        </div>
                        <div class="flex-1">
                            <h5 class="text-sm font-bold text-slate-800">Runner</h5>
                            <p class="text-[10px] text-slate-400 font-bold">محطة الرانر</p>
                        </div>
                    </div>
                    <div class="space-y-2">
                        <div class="flex items-center gap-2 text-xs">
                            <i class="fa-solid fa-user text-indigo-500"></i>
                            <span class="font-semibold text-slate-600 station-employee">لم يتم التعيين</span>
                        </div>
                        <div class="flex items-center gap-2">
                            <span class="px-2 py-1 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 station-shift">صباحي</span>
                            <span class="text-[10px] font-bold text-slate-400 station-task-count">0 مهام</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div class="glass-card overflow-hidden">
                <div class="bg-slate-50 px-8 py-5 border-b flex justify-between items-center">
                    <h4 class="font-bold text-slate-700 flex items-center gap-2"><i class="fa-solid fa-box-open text-amber-500"></i> تنبيهات الصلاحية (FIFO)</h4>
                    <span class="text-[9px] font-bold bg-amber-100 text-amber-700 px-3 py-1 rounded-full uppercase tracking-widest">Priority Check</span>
                </div>
                <div id="critical-stock-list" class="p-6 space-y-3 max-h-[450px] overflow-y-auto">
                    <!-- Dynamic Loading -->
                    <p class="text-center py-10 text-slate-300 font-bold uppercase tracking-widest text-xs">Scanning Stock Records...</p>
                </div>
            </div>

            <div class="glass-card overflow-hidden">
                <div class="bg-slate-50 px-8 py-5 border-b flex justify-between items-center">
                    <h4 class="font-bold text-slate-700 flex items-center gap-2"><i class="fa-solid fa-id-badge text-indigo-500"></i> موعد تجديد الشهادات الصحية</h4>
                    <span class="text-[9px] font-bold bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full uppercase tracking-widest">Alert status</span>
                </div>
                <div id="critical-health-list" class="p-6 space-y-3 max-h-[450px] overflow-y-auto">
                    <!-- Dynamic Loading -->
                    <p class="text-center py-10 text-slate-300 font-bold uppercase tracking-widest text-xs">Reviewing Health Cards...</p>
                </div>
            </div>
        </div>

        <div class="glass-card p-12 mt-10 text-center bg-slate-900 text-white overflow-hidden relative">
            <div class="relative z-10">
                <div class="w-20 h-20 bg-indigo-600 text-white rounded-3xl flex items-center justify-center text-4xl mx-auto mb-8 shadow-2xl shadow-indigo-600/20">
                    <i class="fa-solid fa-shield-halved"></i>
                </div>
                <h3 class="text-4xl font-bold mb-4 tracking-tight">مرحباً بك في نظام THE DRIVE <span class="text-indigo-400">V3.2</span></h3>
                <p class="text-slate-400 font-bold text-sm uppercase tracking-widest">Advanced Quality Management System • Build 2026</p>
            </div>
            <!-- Decorative background element -->
            <div class="absolute -right-20 -bottom-20 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl"></div>
            <div class="absolute -left-20 -top-20 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl"></div>
        </div>
    `;
};
