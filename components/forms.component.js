/**
 * FormsComponent - Templates for various system forms.
 * 2026 Premium Style - Minimal & Non-Italic.
 */
export const FormsComponent = {

    // Equipment Form Template
    equipmentForm: () => `
        <form id="equipmentForm" class="space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="form-group flex flex-col gap-2">
                    <label class="text-xs font-bold text-slate-500 mr-2">اسم المعدة</label>
                    <input type="text" name="name" placeholder="ثلاجة 1 / فريزر A" class="bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 text-sm font-semibold outline-none focus:border-indigo-500 transition-all" required>
                </div>
                <div class="form-group flex flex-col gap-2">
                    <label class="text-xs font-bold text-slate-500 mr-2">الموقع</label>
                    <input type="text" name="location" placeholder="المطبخ / المخزن" class="bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 text-sm font-semibold outline-none focus:border-indigo-500 transition-all" required>
                </div>
            </div>
            <button type="submit" class="w-full bg-slate-900 text-white rounded-2xl py-4 font-bold mt-4 hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/10">حفظ المعدة</button>
        </form>
    `,

    // Product Form Template (for entity registration)
    entityProductForm: () => `
        <form id="entityProductForm" class="space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="form-group flex flex-col gap-2">
                    <label class="text-xs font-bold text-slate-500 mr-2">كود الصنف</label>
                    <input type="text" name="code" placeholder="PROD-001" class="bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 text-sm font-semibold outline-none focus:border-indigo-500 transition-all" required>
                </div>
                <div class="form-group flex flex-col gap-2">
                    <label class="text-xs font-bold text-slate-500 mr-2">اسم المنتج</label>
                    <input type="text" name="name" placeholder="دجاج مجمد / لحم بقر" class="bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 text-sm font-semibold outline-none focus:border-indigo-500 transition-all" required>
                </div>
                <div class="form-group flex flex-col gap-2">
                    <label class="text-xs font-bold text-slate-500 mr-2">مدة الصلاحية</label>
                    <input type="number" name="life" placeholder="30" class="bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 text-sm font-semibold outline-none focus:border-indigo-500 transition-all" required>
                </div>
                <div class="form-group flex flex-col gap-2">
                    <label class="text-xs font-bold text-slate-500 mr-2">الوحدة</label>
                    <select name="unit" class="bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 text-sm font-semibold outline-none focus:border-indigo-500 transition-all">
                        <option value="يوم">يوم</option>
                        <option value="شهر">شهر</option>
                        <option value="سنة">سنة</option>
                    </select>
                </div>
                <div class="form-group flex flex-col gap-2">
                    <label class="text-xs font-bold text-slate-500 mr-2">التصنيف</label>
                    <select name="category" class="bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 text-sm font-semibold outline-none focus:border-indigo-500 transition-all">
                        <option value="لحوم">لحوم</option>
                        <option value="دواجن">دواجن</option>
                        <option value="خضروات">خضروات</option>
                        <option value="ألبان">ألبان</option>
                        <option value="أسماك">أسماك</option>
                        <option value="مواد جافة">مواد جافة</option>
                        <option value="ممتستلزمات">مستلزمات</option>
                        <option value="أخرى">أخرى</option>
                    </select>
                </div>
                <div class="form-group flex flex-col gap-2">
                    <label class="text-xs font-bold text-slate-500 mr-2">ملاحظات</label>
                    <input type="text" name="notes" placeholder="معايير الجودة" class="bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 text-sm font-semibold outline-none focus:border-indigo-500 transition-all">
                </div>
            </div>
            <button type="submit" class="w-full bg-slate-900 text-white rounded-2xl py-4 font-bold mt-4 hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/10">حفظ الصنف</button>
        </form>
    `,

    // Temperature Form Template
    tempForm: (equipmentList) => {
        const options = equipmentList.map(e => `<option value="${e.name}">${e.name} (${e.location})</option>`).join('');
        return `
            <form id="tempForm" class="space-y-6">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div class="form-group flex flex-col gap-2">
                        <label class="text-xs font-bold text-slate-500 mr-2">التاريخ</label>
                        <input type="date" name="date" class="bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 text-sm font-semibold outline-none focus:border-indigo-500 transition-all" required>
                    </div>
                    <div class="form-group flex flex-col gap-2">
                        <label class="text-xs font-bold text-slate-500 mr-2">وقت القياس</label>
                        <input type="time" name="time" class="bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 text-sm font-semibold outline-none focus:border-indigo-500 transition-all" required>
                    </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div class="form-group flex flex-col gap-2">
                        <label class="text-xs font-bold text-slate-500 mr-2">المعدة المختارة</label>
                        <select name="equipmentId" class="bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 text-sm font-semibold outline-none focus:border-indigo-500 transition-all" required>
                            <option value="">-- اختر المعدة --</option>
                            ${options}
                        </select>
                    </div>
                    <div class="form-group flex flex-col gap-2">
                        <label class="text-xs font-bold text-slate-500 mr-2">قراءة الـ Display (°C)</label>
                        <input type="number" step="0.1" name="reading" placeholder="0.0" class="bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 text-sm font-semibold outline-none focus:border-indigo-500 transition-all" required>
                    </div>
                </div>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div class="form-group flex flex-col gap-2">
                        <label class="text-xs font-bold text-slate-500 mr-2">المنتج (اختياري)</label>
                        <select name="product" class="product-selector bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 text-sm font-semibold outline-none focus:border-indigo-500 transition-all">
                            <option value="">-- لا يوجد --</option>
                        </select>
                    </div>
                    <div class="form-group flex flex-col gap-2">
                        <label class="text-xs font-bold text-slate-500 mr-2">نوع القياس</label>
                        <select name="measureType" class="bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 text-sm font-semibold outline-none focus:border-indigo-500 transition-all">
                            <option value="Display">Display</option>
                            <option value="Probe">Probe</option>
                            <option value="IR Gun">IR Gun</option>
                        </select>
                    </div>
                </div>

                <div class="form-group flex flex-col gap-2">
                    <label class="text-xs font-bold text-slate-500 mr-2">صور التوثيق (حتى 3 صور)</label>
                    <div class="flex flex-col gap-3">
                        <label class="bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 cursor-pointer hover:bg-slate-100 transition-all flex items-center gap-3">
                            <i class="fa-solid fa-images text-indigo-500"></i>
                            <span class="text-xs font-bold text-slate-500">اختر صور (حد أقصى 3)</span>
                            <input type="file" id="tempImgInput" accept="image/*" multiple class="hidden">
                        </label>
                        <div id="tempImgPreviews" class="flex gap-2 flex-wrap"></div>
                        <input type="hidden" name="img" id="tempImgData">
                    </div>
                </div>
                
                <button type="submit" class="w-full bg-slate-900 text-white rounded-2xl py-5 font-bold mt-4 hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/10 tracking-wide">حفظ القراءة الحالية</button>
            </form>
        `;
    },

    auditForm: () => `
        <form id="auditForm" class="space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div class="form-group flex flex-col gap-2">
                    <label class="text-xs font-bold text-slate-500 mr-2">تاريخ الزيارة - Visit Date</label>
                    <input type="date" name="visitDate" class="bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 text-sm font-semibold outline-none focus:border-indigo-500 transition-all" required>
                </div>
                <div class="form-group flex flex-col gap-2">
                    <label class="text-xs font-bold text-slate-500 mr-2">اسم الفرع - Branch Name</label>
                    <input type="text" name="branchName" placeholder="فرع المعادي / فرع المهندسين" class="bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 text-sm font-semibold outline-none focus:border-indigo-500 transition-all" required>
                </div>
                <div class="form-group flex flex-col gap-2">
                    <label class="text-xs font-bold text-slate-500 mr-2">رقم النقطة - Point No</label>
                    <input type="text" name="pointNo" placeholder="P-001" class="bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 text-sm font-semibold outline-none focus:border-indigo-500 transition-all" required>
                </div>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="form-group flex flex-col gap-2">
                    <label class="text-xs font-bold text-slate-500 mr-2">القسم / الفئة - Department / Category</label>
                    <select name="department" class="bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 text-sm font-semibold outline-none focus:border-indigo-500 transition-all" required>
                        <option value="">-- اختر القسم --</option>
                        <option value="المطبخ">المطبخ - Kitchen</option>
                        <option value="المخازن">المخازن - Storage</option>
                        <option value="الاستقبال">الاستقبال - Reception</option>
                        <option value="الإنتاج">الإنتاج - Production</option>
                        <option value="التعبئة">التعبئة - Packaging</option>
                        <option value="النظافة">النظافة - Hygiene</option>
                        <option value="الصيانة">الصيانة - Maintenance</option>
                        <option value="السلامة">السلامة - Safety</option>
                        <option value="الجودة">الجودة - Quality</option>
                    </select>
                </div>
                <div class="form-group flex flex-col gap-2">
                    <label class="text-xs font-bold text-slate-500 mr-2">المسؤول - Responsible</label>
                    <input type="text" name="responsible" placeholder="اسم المسؤول" class="bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 text-sm font-semibold outline-none focus:border-indigo-500 transition-all" required>
                </div>
            </div>

            <div class="form-group flex flex-col gap-2">
                <label class="text-xs font-bold text-slate-500 mr-2">الملاحظات المرصودة - Observed Comments</label>
                <textarea name="observedComments" rows="3" placeholder="تفاصيل الملاحظات المرصودة أثناء التفتيش..." class="bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 text-sm font-semibold outline-none focus:border-indigo-500 transition-all resize-none" required></textarea>
            </div>

            <div class="form-group flex flex-col gap-2">
                <label class="text-xs font-bold text-slate-500 mr-2">الإجراءات التصحيحية - Corrective Actions</label>
                <textarea name="correctiveActions" rows="3" placeholder="الإجراءات المطلوبة لتصحيح الملاحظات..." class="bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 text-sm font-semibold outline-none focus:border-indigo-500 transition-all resize-none" required></textarea>
            </div>

            <div class="form-group flex flex-col gap-2">
                <label class="text-xs font-bold text-slate-500 mr-2">الجدول الزمني - Timeline</label>
                <input type="text" name="timeline" placeholder="خلال 24 ساعة / أسبوع / فوري" class="bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 text-sm font-semibold outline-none focus:border-indigo-500 transition-all" required>
            </div>

            <div class="form-group flex flex-col gap-2">
                <label class="text-xs font-bold text-slate-500 mr-2">المرفق - Attachment (حتى 3 صور)</label>
                <div class="flex flex-col gap-3">
                    <label class="bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 cursor-pointer hover:bg-slate-100 transition-all flex items-center gap-3">
                        <i class="fa-solid fa-images text-indigo-500"></i>
                        <span class="text-xs font-bold text-slate-500">اختر صور (حد أقصى 3)</span>
                        <input type="file" id="auditImgInput" accept="image/*" multiple class="hidden">
                    </label>
                    <div id="auditImgPreviews" class="flex gap-2 flex-wrap"></div>
                    <input type="hidden" name="img" id="auditImgData">
                </div>
            </div>
            
            <button type="submit" class="w-full bg-slate-900 text-white rounded-2xl py-5 font-bold mt-4 hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/10">حفظ التقرير</button>
        </form>
    `,

    proceduresForm: () => `
        <form id="proceduresForm" class="space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="form-group flex flex-col gap-2">
                    <label class="text-xs font-bold text-slate-500 mr-2">نوع الإجراء - Procedure Type</label>
                    <select name="procedureType" class="bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 text-sm font-semibold outline-none focus:border-indigo-500 transition-all" required>
                        <option value="opening">إجراءات الفتح - Opening</option>
                        <option value="closing">إجراءات الغلق - Closing</option>
                    </select>
                </div>
                <div class="form-group flex flex-col gap-2">
                    <label class="text-xs font-bold text-slate-500 mr-2">التاريخ - Date</label>
                    <input type="date" name="date" class="bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 text-sm font-semibold outline-none focus:border-indigo-500 transition-all" required>
                </div>
            </div>

            <div class="form-group flex flex-col gap-2">
                <label class="text-xs font-bold text-slate-500 mr-2">اسم المهمة - Task Name</label>
                <input type="text" name="taskName" placeholder="تشغيل الأجهزة / فحص المخزون" class="bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 text-sm font-semibold outline-none focus:border-indigo-500 transition-all" required>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="form-group flex flex-col gap-2">
                    <label class="text-xs font-bold text-slate-500 mr-2">الوقت - Time</label>
                    <input type="time" name="taskTime" class="bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 text-sm font-semibold outline-none focus:border-indigo-500 transition-all" required>
                </div>
                <div class="form-group flex flex-col gap-2">
                    <label class="text-xs font-bold text-slate-500 mr-2">التكرار - Frequency</label>
                    <select name="taskFrequency" class="bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 text-sm font-semibold outline-none focus:border-indigo-500 transition-all" required>
                        <option value="daily">يومي - Daily</option>
                        <option value="weekly">أسبوعي - Weekly</option>
                        <option value="monthly">شهري - Monthly</option>
                    </select>
                </div>
            </div>

            <div class="form-group flex flex-col gap-2">
                <label class="text-xs font-bold text-slate-500 mr-2">المسؤول - Responsible Person</label>
                <input type="text" name="responsible" placeholder="اسم المسؤول عن المهمة" class="bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 text-sm font-semibold outline-none focus:border-indigo-500 transition-all" required>
            </div>
            
            <button type="submit" class="w-full bg-slate-900 text-white rounded-2xl py-5 font-bold mt-4 hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/10">حفظ المهمة</button>
        </form>
    `,

    proceduresExecutionForm: (taskName) => `
        <form id="proceduresExecutionForm" class="space-y-6">
            <div class="p-4 bg-indigo-50 rounded-2xl border border-indigo-100 mb-6">
                <span class="text-[10px] font-bold text-indigo-400 block mb-1">المهمة قيد التنفيذ - Active Task</span>
                <h4 class="text-lg font-black text-indigo-700">${taskName}</h4>
            </div>

            <div class="form-group flex flex-col gap-2">
                <label class="text-xs font-bold text-slate-500 mr-2">إثبات الإنجاز (صورة) - Completion Proof (Photo)</label>
                <div class="flex flex-col gap-3">
                    <label class="bg-slate-50 border border-slate-200 rounded-2xl px-6 py-8 cursor-pointer hover:bg-slate-100 transition-all flex flex-col items-center justify-center gap-3 border-dashed">
                        <i class="fa-solid fa-camera text-3xl text-indigo-500"></i>
                        <span class="text-xs font-bold text-slate-500">التقط صورة أو اختر ملف</span>
                        <input type="file" id="executionImgInput" accept="image/*" capture="environment" class="hidden" required>
                    </label>
                    <div id="executionImgPreview" class="flex justify-center gap-2"></div>
                    <input type="hidden" name="img" id="executionImgData" required>
                </div>
            </div>

            <button type="submit" class="w-full bg-emerald-600 text-white rounded-2xl py-5 font-bold mt-4 hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-900/10">تأكيد الإنجاز ورفع الصورة</button>
        </form>
    `,

    stationAssignmentForm: () => `
        <form id="stationAssignmentForm" class="space-y-6">
            <div class="form-group flex flex-col gap-2">
                <label class="text-xs font-bold text-slate-500 mr-2">المحطة - Station</label>
                <select name="station" class="bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 text-sm font-semibold outline-none focus:border-indigo-500 transition-all" required>
                    <option value="">-- اختر المحطة --</option>
                    <option value="fresh-bar">Fresh Bar Station - محطة الفريش بار</option>
                    <option value="preparation">Preparation Station - محطة التحضير</option>
                    <option value="pos">POS Station - محطة الكاشير</option>
                    <option value="dispatcher">Pick up Station - محطة التوصيل</option>
                    <option value="coffee">Coffee Station - محطة القهوة</option>
                    <option value="runner">Runner Station - محطة الرانر</option>
                </select>
            </div>

            <div class="form-group flex flex-col gap-2">
                <label class="text-xs font-bold text-slate-500 mr-2">اسم الموظف - Employee Name</label>
                <input type="text" name="employeeName" placeholder="أحمد محمد" class="bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 text-sm font-semibold outline-none focus:border-indigo-500 transition-all" required>
            </div>

            <div class="form-group flex flex-col gap-2">
                <label class="text-xs font-bold text-slate-500 mr-2">الشيفت - Shift</label>
                <div class="flex gap-4">
                    <label class="flex-1 cursor-pointer">
                        <input type="radio" name="shift" value="morning" class="hidden peer" required>
                        <div class="bg-slate-50 border-2 border-slate-200 rounded-2xl px-6 py-4 text-center font-bold text-sm transition-all peer-checked:bg-amber-50 peer-checked:border-amber-500 peer-checked:text-amber-700 hover:border-amber-300">
                            <i class="fa-solid fa-sun text-lg mb-2"></i>
                            <p>صباحي</p>
                            <p class="text-[10px] uppercase tracking-wider">Morning</p>
                        </div>
                    </label>
                    <label class="flex-1 cursor-pointer">
                        <input type="radio" name="shift" value="evening" class="hidden peer" required>
                        <div class="bg-slate-50 border-2 border-slate-200 rounded-2xl px-6 py-4 text-center font-bold text-sm transition-all peer-checked:bg-indigo-50 peer-checked:border-indigo-500 peer-checked:text-indigo-700 hover:border-indigo-300">
                            <i class="fa-solid fa-moon text-lg mb-2"></i>
                            <p>مسائي</p>
                            <p class="text-[10px] uppercase tracking-wider">Evening</p>
                        </div>
                    </label>
                </div>
            </div>
            
            <button type="submit" class="w-full bg-violet-600 text-white rounded-2xl py-5 font-bold mt-4 hover:bg-violet-700 transition-all shadow-xl shadow-violet-900/10">تعيين الموظف</button>
        </form>
    `,

    stockForm: () => `
        <form id="stockForm" class="space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="form-group flex flex-col gap-2">
                    <label class="text-xs font-bold text-slate-500 mr-2">الصنف</label>
                    <select name="code" class="product-selector bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 text-sm font-semibold outline-none focus:border-indigo-500 transition-all" required>
                        <!-- Dynamic Loading -->
                    </select>
                </div>
                <div class="form-group flex flex-col gap-2">
                    <label class="text-xs font-bold text-slate-500 mr-2">Batch No</label>
                    <input type="text" name="batch" placeholder="B-2026-X" class="bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 text-sm font-semibold outline-none focus:border-indigo-500 transition-all" required>
                </div>
            </div>
            <button type="submit" class="w-full bg-slate-900 text-white rounded-2xl py-4 font-bold mt-4 hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/10">حفظ في المخزن</button>
        </form>
    `,

    receivingForm: () => `
        <form id="receivingForm" class="space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="form-group flex flex-col gap-2">
                    <label class="text-xs font-bold text-slate-500 mr-2">المورد</label>
                    <input type="text" name="supplier" placeholder="اسم المورد" class="bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 text-sm font-semibold outline-none focus:border-indigo-500 transition-all" required>
                </div>
                <div class="form-group flex flex-col gap-2">
                    <label class="text-xs font-bold text-slate-500 mr-2">الصنف المُستلم</label>
                    <select name="product" class="product-selector bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 text-sm font-semibold outline-none focus:border-indigo-500 transition-all" required></select>
                </div>
                <div class="form-group flex flex-col gap-2">
                    <label class="text-xs font-bold text-slate-500 mr-2">الكمية</label>
                    <input type="number" name="quantity" placeholder="25" class="bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 text-sm font-semibold outline-none focus:border-indigo-500 transition-all" required>
                </div>
                <div class="form-group flex flex-col gap-2">
                    <label class="text-xs font-bold text-slate-500 mr-2">تاريخ الانتهاء</label>
                    <input type="date" name="expiry" class="bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 text-sm font-semibold outline-none focus:border-indigo-500 transition-all" required>
                </div>
                <div class="form-group flex flex-col gap-2">
                    <label class="text-xs font-bold text-slate-500 mr-2">درجة الحرارة عند الاستلام</label>
                    <input type="number" step="0.1" name="temp" placeholder="4.5" class="bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 text-sm font-semibold outline-none focus:border-indigo-500 transition-all">
                </div>
                <div class="form-group flex flex-col gap-2">
                    <label class="text-xs font-bold text-slate-500 mr-2">الحالة</label>
                    <select name="status" class="bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 text-sm font-semibold outline-none focus:border-indigo-500 transition-all">
                        <option value="Accepted">مقبول</option>
                        <option value="Rejected">مرفوض</option>
                    </select>
                </div>
            </div>
            <button type="submit" class="w-full bg-slate-900 text-white rounded-2xl py-4 font-bold mt-4 hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/10">تسجيل الاستلام</button>
        </form>
    `,

    calibrationForm: () => `
        <form id="calibrationForm" class="space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="form-group flex flex-col gap-2">
                    <label class="text-xs font-bold text-slate-500 mr-2">التاريخ</label>
                    <input type="date" name="date" class="bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 text-sm font-semibold outline-none focus:border-indigo-500 transition-all" required>
                </div>
                <div class="form-group flex flex-col gap-2">
                    <label class="text-xs font-bold text-slate-500 mr-2">الجهاز</label>
                    <input type="text" name="equipment" placeholder="ميزان رقمي / ثيرمومتر" class="bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 text-sm font-semibold outline-none focus:border-indigo-500 transition-all" required>
                </div>
                <div class="form-group flex flex-col gap-2">
                    <label class="text-xs font-bold text-slate-500 mr-2">القراءة</label>
                    <input type="text" name="reading" placeholder="0.00" class="bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 text-sm font-semibold outline-none focus:border-indigo-500 transition-all" required>
                </div>
                <div class="form-group flex flex-col gap-2">
                    <label class="text-xs font-bold text-slate-500 mr-2">الحالة</label>
                    <select name="status" class="bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 text-sm font-semibold outline-none focus:border-indigo-500 transition-all" required>
                        <option value="Pass">مطابق</option>
                        <option value="Fail">غير مطابق</option>
                    </select>
                </div>
                <div class="form-group flex flex-col gap-2">
                    <label class="text-xs font-bold text-slate-500 mr-2">المعايرة القادمة</label>
                    <input type="date" name="nextDate" class="bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 text-sm font-semibold outline-none focus:border-indigo-500 transition-all" required>
                </div>
            </div>
            <button type="submit" class="w-full bg-slate-900 text-white rounded-2xl py-4 font-bold mt-4 hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/10">حفظ المعايرة</button>
        </form>
    `,

    checklistForm: () => `
        <form id="checklistForm" class="space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="form-group flex flex-col gap-2">
                    <label class="text-xs font-bold text-slate-500 mr-2">التاريخ</label>
                    <input type="date" name="date" class="bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 text-sm font-semibold outline-none focus:border-indigo-500 transition-all" required>
                </div>
                <div class="form-group flex flex-col gap-2">
                    <label class="text-xs font-bold text-slate-500 mr-2">الفترة</label>
                    <select name="shift" class="bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 text-sm font-semibold outline-none focus:border-indigo-500 transition-all" required>
                        <option value="Morning">صباحية</option>
                        <option value="Evening">مسائية</option>
                        <option value="Night">ليلية</option>
                    </select>
                </div>
                <div class="form-group flex flex-col gap-2">
                    <label class="text-xs font-bold text-slate-500 mr-2">التصنيف</label>
                    <select name="category" class="bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 text-sm font-semibold outline-none focus:border-indigo-500 transition-all">
                        <option value="نظافة">نظافة</option>
                        <option value="سلامة">سلامة</option>
                        <option value="جودة">جودة</option>
                        <option value="بنية تحتية">بنية تحتية</option>
                    </select>
                </div>
                <div class="form-group flex flex-col gap-2">
                    <label class="text-xs font-bold text-slate-500 mr-2">البند</label>
                    <input type="text" name="item" placeholder="فحص النظافة العامة" class="bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 text-sm font-semibold outline-none focus:border-indigo-500 transition-all" required>
                </div>
                <div class="form-group flex flex-col gap-2">
                    <label class="text-xs font-bold text-slate-500 mr-2">النتيجة</label>
                    <select name="status" class="bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 text-sm font-semibold outline-none focus:border-indigo-500 transition-all" required>
                        <option value="Pass">مطابق</option>
                        <option value="Fail">غير مطابق</option>
                    </select>
                </div>
            </div>
            <button type="submit" class="w-full bg-slate-900 text-white rounded-2xl py-4 font-bold mt-4 hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/10">حفظ الفحص</button>
        </form>
    `,

    trainingForm: () => `
        <form id="trainingForm" class="space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="form-group flex flex-col gap-2">
                    <label class="text-xs font-bold text-slate-500 mr-2">التاريخ</label>
                    <input type="date" name="date" class="bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 text-sm font-semibold outline-none focus:border-indigo-500 transition-all" required>
                </div>
                <div class="form-group flex flex-col gap-2">
                    <label class="text-xs font-bold text-slate-500 mr-2">موضوع التدريب</label>
                    <input type="text" name="topic" placeholder="سلامة الغذاء / النظافة" class="bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 text-sm font-semibold outline-none focus:border-indigo-500 transition-all" required>
                </div>
                <div class="form-group flex flex-col gap-2">
                    <label class="text-xs font-bold text-slate-500 mr-2">المدرب</label>
                    <input type="text" name="trainer" placeholder="اسم المدرب" class="bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 text-sm font-semibold outline-none focus:border-indigo-500 transition-all" required>
                </div>
                <div class="form-group flex flex-col gap-2">
                    <label class="text-xs font-bold text-slate-500 mr-2">المتدربين</label>
                    <input type="text" name="trainees" placeholder="أسماء الحضور" class="bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 text-sm font-semibold outline-none focus:border-indigo-500 transition-all" required>
                </div>
            </div>
                <div class="form-group flex flex-col gap-2">
                    <label class="text-xs font-bold text-slate-500 mr-2">صور التوثيق (حتى 3 صور)</label>
                    <div class="flex flex-col gap-3">
                        <label class="bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 cursor-pointer hover:bg-slate-100 transition-all flex items-center gap-3">
                            <i class="fa-solid fa-images text-indigo-500"></i>
                            <span class="text-xs font-bold text-slate-500">اختر صور (حد أقصى 3)</span>
                            <input type="file" id="trainingImgInput" accept="image/*" multiple class="hidden">
                        </label>
                        <div id="trainingImgPreviews" class="flex gap-2 flex-wrap"></div>
                        <input type="hidden" name="img" id="trainingImgData">
                    </div>
                </div>
            <button type="submit" class="w-full bg-slate-900 text-white rounded-2xl py-4 font-bold mt-4 hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/10">تسجيل التدريب</button>
        </form>
    `,

    pestForm: () => `
        <form id="pestForm" class="space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="form-group flex flex-col gap-2">
                    <label class="text-xs font-bold text-slate-500 mr-2">التاريخ</label>
                    <input type="date" name="date" class="bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 text-sm font-semibold outline-none focus:border-indigo-500 transition-all" required>
                </div>
                <div class="form-group flex flex-col gap-2">
                    <label class="text-xs font-bold text-slate-500 mr-2">نوع الزيارة</label>
                    <select name="visitType" class="bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 text-sm font-semibold outline-none focus:border-indigo-500 transition-all" required>
                        <option value="دورية">زيارة دورية</option>
                        <option value="طارئة">زيارة طارئة</option>
                        <option value="متابعة">متابعة</option>
                    </select>
                </div>
                <div class="form-group flex flex-col gap-2">
                    <label class="text-xs font-bold text-slate-500 mr-2">المنطقة</label>
                    <input type="text" name="area" placeholder="المطبخ / المخزن / الصالة" class="bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 text-sm font-semibold outline-none focus:border-indigo-500 transition-all" required>
                </div>
                <div class="form-group flex flex-col gap-2">
                    <label class="text-xs font-bold text-slate-500 mr-2">النتائج</label>
                    <input type="text" name="findings" placeholder="لا يوجد / بقايا حشرية" class="bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 text-sm font-semibold outline-none focus:border-indigo-500 transition-all">
                </div>
                <div class="form-group flex flex-col gap-2 md:col-span-2">
                    <label class="text-xs font-bold text-slate-500 mr-2">الإجراء التقويمي</label>
                    <textarea name="action" rows="2" placeholder="تم الرش / تنظيف عميق..." class="bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 text-sm font-semibold outline-none focus:border-indigo-500 transition-all resize-none"></textarea>
                </div>
            </div>
                <div class="form-group flex flex-col gap-2">
                    <label class="text-xs font-bold text-slate-500 mr-2">صور التوثيق (حتى 3 صور)</label>
                    <div class="flex flex-col gap-3">
                        <label class="bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 cursor-pointer hover:bg-slate-100 transition-all flex items-center gap-3">
                            <i class="fa-solid fa-images text-indigo-500"></i>
                            <span class="text-xs font-bold text-slate-500">اختر صور (حد أقصى 3)</span>
                            <input type="file" id="pestImgInput" accept="image/*" multiple class="hidden">
                        </label>
                        <div id="pestImgPreviews" class="flex gap-2 flex-wrap"></div>
                        <input type="hidden" name="img" id="pestImgData">
                    </div>
                </div>
            <button type="submit" class="w-full bg-slate-900 text-white rounded-2xl py-4 font-bold mt-4 hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/10">حفظ الزيارة</button>
        </form>
    `,

    complaintsForm: () => `
        <form id="complaintsForm" class="space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="form-group flex flex-col gap-2">
                    <label class="text-xs font-bold text-slate-500 mr-2">التاريخ</label>
                    <input type="date" name="date" class="bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 text-sm font-semibold outline-none focus:border-indigo-500 transition-all" required>
                </div>
                <div class="form-group flex flex-col gap-2">
                    <label class="text-xs font-bold text-slate-500 mr-2">العميل</label>
                    <input type="text" name="customer" placeholder="اسم العميل" class="bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 text-sm font-semibold outline-none focus:border-indigo-500 transition-all" required>
                </div>
                <div class="form-group flex flex-col gap-2">
                    <label class="text-xs font-bold text-slate-500 mr-2">الصنف المرتبط</label>
                    <select name="item" class="product-selector bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 text-sm font-semibold outline-none focus:border-indigo-500 transition-all"></select>
                </div>
                <div class="form-group flex flex-col gap-2">
                    <label class="text-xs font-bold text-slate-500 mr-2">الحالة</label>
                    <select name="status" class="bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 text-sm font-semibold outline-none focus:border-indigo-500 transition-all">
                        <option value="Pending">قيد المتابعة</option>
                        <option value="Resolved">تم الحل</option>
                    </select>
                </div>
                <div class="form-group flex flex-col gap-2 md:col-span-2">
                    <label class="text-xs font-bold text-slate-500 mr-2">المشكلة</label>
                    <textarea name="problem" rows="2" placeholder="وصف المشكلة..." class="bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 text-sm font-semibold outline-none focus:border-indigo-500 transition-all resize-none" required></textarea>
                </div>
                <div class="form-group flex flex-col gap-2">
                    <label class="text-xs font-bold text-slate-500 mr-2">السبب الجذري</label>
                    <input type="text" name="rootCause" placeholder="تحليل السبب" class="bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 text-sm font-semibold outline-none focus:border-indigo-500 transition-all">
                </div>
                <div class="form-group flex flex-col gap-2">
                    <label class="text-xs font-bold text-slate-500 mr-2">الإجراء المتخذ</label>
                    <input type="text" name="actionTaken" placeholder="تم الاستبدال / الاعتذار" class="bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 text-sm font-semibold outline-none focus:border-indigo-500 transition-all">
                </div>
            </div>
                <div class="form-group flex flex-col gap-2">
                    <label class="text-xs font-bold text-slate-500 mr-2">صور التوثيق (حتى 3 صور)</label>
                    <div class="flex flex-col gap-3">
                        <label class="bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 cursor-pointer hover:bg-slate-100 transition-all flex items-center gap-3">
                            <i class="fa-solid fa-images text-indigo-500"></i>
                            <span class="text-xs font-bold text-slate-500">اختر صور (حد أقصى 3)</span>
                            <input type="file" id="complaintsImgInput" accept="image/*" multiple class="hidden">
                        </label>
                        <div id="complaintsImgPreviews" class="flex gap-2 flex-wrap"></div>
                        <input type="hidden" name="img" id="complaintsImgData">
                    </div>
                </div>
            <button type="submit" class="w-full bg-slate-900 text-white rounded-2xl py-4 font-bold mt-4 hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/10">تسجيل الشكوى</button>
        </form>
    `,

    healthForm: () => `
        <form id="healthForm" class="space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="form-group flex flex-col gap-2">
                    <label class="text-xs font-bold text-slate-500 mr-2">كود الموظف</label>
                    <input type="text" name="code" placeholder="EMP-001" class="bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 text-sm font-semibold outline-none focus:border-indigo-500 transition-all" required>
                </div>
                <div class="form-group flex flex-col gap-2">
                    <label class="text-xs font-bold text-slate-500 mr-2">اسم الموظف</label>
                    <input type="text" name="name" placeholder="الاسم الكامل" class="bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 text-sm font-semibold outline-none focus:border-indigo-500 transition-all" required>
                </div>
                <div class="form-group flex flex-col gap-2">
                    <label class="text-xs font-bold text-slate-500 mr-2">الوظيفة</label>
                    <input type="text" name="position" placeholder="طباخ / مساعد" class="bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 text-sm font-semibold outline-none focus:border-indigo-500 transition-all" required>
                </div>
                <div class="form-group flex flex-col gap-2">
                    <label class="text-xs font-bold text-slate-500 mr-2">تاريخ الإصدار</label>
                    <input type="date" name="issue" class="bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 text-sm font-semibold outline-none focus:border-indigo-500 transition-all" required>
                </div>
                <div class="form-group flex flex-col gap-2">
                    <label class="text-xs font-bold text-slate-500 mr-2">تاريخ الانتهاء</label>
                    <input type="date" name="expiry" class="bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 text-sm font-semibold outline-none focus:border-indigo-500 transition-all" required>
                </div>
                <div class="form-group flex flex-col gap-2">
                    <label class="text-xs font-bold text-slate-500 mr-2">ملاحظات</label>
                    <input type="text" name="notes" placeholder="..." class="bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 text-sm font-semibold outline-none focus:border-indigo-500 transition-all">
                </div>
            </div>
                <div class="form-group flex flex-col gap-2">
                    <label class="text-xs font-bold text-slate-500 mr-2">صور الشهادة (حتى 3 صور)</label>
                    <div class="flex flex-col gap-3">
                        <label class="bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 cursor-pointer hover:bg-slate-100 transition-all flex items-center gap-3">
                            <i class="fa-solid fa-images text-indigo-500"></i>
                            <span class="text-xs font-bold text-slate-500">اختر صور (حد أقصى 3)</span>
                            <input type="file" id="healthImgInput" accept="image/*" multiple class="hidden">
                        </label>
                        <div id="healthImgPreviews" class="flex gap-2 flex-wrap"></div>
                        <input type="hidden" name="img" id="healthImgData">
                    </div>
                </div>
            <button type="submit" class="w-full bg-slate-900 text-white rounded-2xl py-4 font-bold mt-4 hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/10">حفظ الشهادة</button>
        </form>
    `,

    notificationForm: () => `
        <form id="notificationForm" class="space-y-6">
            <div class="form-group flex flex-col gap-2">
                <label class="text-xs font-bold text-slate-500 mr-2">العنوان - Title</label>
                <input type="text" name="title" placeholder="عنوان التنبيه" class="bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 text-sm font-semibold outline-none focus:border-indigo-500 transition-all" required>
            </div>
            <div class="form-group flex flex-col gap-2">
                <label class="text-xs font-bold text-slate-500 mr-2">الرسالة - Message</label>
                <textarea name="message" rows="3" placeholder="محتوى التنبيه..." class="bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 text-sm font-semibold outline-none focus:border-indigo-500 transition-all resize-none" required></textarea>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="form-group flex flex-col gap-2">
                    <label class="text-xs font-bold text-slate-500 mr-2">الأولوية - Priority</label>
                    <select name="priority" class="bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 text-sm font-semibold outline-none focus:border-indigo-500 transition-all" required>
                        <option value="low">عادي - Low</option>
                        <option value="medium">متوسط - Medium</option>
                        <option value="high">مهم - High</option>
                        <option value="urgent">عاجل - Urgent</option>
                    </select>
                </div>
                <div class="form-group flex flex-col gap-2">
                    <label class="text-xs font-bold text-slate-500 mr-2">التصنيف - Category</label>
                    <select name="category" class="bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 text-sm font-semibold outline-none focus:border-indigo-500 transition-all" required>
                        <option value="general">عام - General</option>
                        <option value="quality">جودة - Quality</option>
                        <option value="stock">مخزون - Stock</option>
                        <option value="system">نظام - System</option>
                    </select>
                </div>
            </div>
            <button type="submit" class="w-full bg-indigo-600 text-white rounded-2xl py-4 font-bold mt-4 hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-900/10">إرسال التنبيه</button>
        </form>
    `
};
