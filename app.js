/**
 * App - Entry point of the application.
 */
import { stateManager } from './core/stateManager.js';
import { authService } from './core/authService.js';
import { apiService } from './core/apiService.js';
import { router } from './core/router.js';
import { DashboardView } from './modules/dashboard/dashboard.view.js';
import { DashboardService } from './modules/dashboard/dashboard.service.js';
import { StockView } from './modules/stock/stock.view.js';
import { ReceivingView } from './modules/receiving/receiving.view.js';
import { AuditView } from './modules/audit/audit.view.js';
import { ChecklistsView } from './modules/checklists/checklists.view.js';
import { HealthView } from './modules/health/health.view.js';
import { TempView } from './modules/temp/temp.view.js';
import { ComplaintsView } from './modules/complaints/complaints.view.js';
import { CalibrationView } from './modules/calibration/calibration.view.js';
import { ProductsView } from './modules/products/products.view.js';
import { ArchiveView } from './modules/archive/archive.view.js';
import { PestView } from './modules/pest/pest.view.js';
import { TrainingView } from './modules/training/training.view.js';
import { UsersView, UserFormTemplate } from './modules/users/users.view.js';
import { ProceduresView } from './modules/procedures/procedures.view.js';
import { initModalEvents } from './components/modal.component.js';
import { alertService } from './core/alertService.js';
import { formHandler } from './components/formHandler.js';
import { FormsComponent } from './components/forms.component.js';
import { ui } from './utils/ui.js';
import { NotificationsView } from './modules/notifications/notifications.view.js';
import { NotificationsService } from './modules/notifications/notifications.service.js';

class App {
    constructor() {
        this.init();
        this.registerRoutes();
        initModalEvents();
        authService.setupAutoLogout();
        alertService.start();
        this.registerServiceWorker();
    }

    async registerServiceWorker() {
        if ('serviceWorker' in navigator) {
            try {
                const registration = await navigator.serviceWorker.register('./sw.js');
                console.log('SW Registered:', registration.scope);
                
                // Request notification permission if not already granted
                if (Notification.permission === 'default') {
                    // Small delay to not overwhelm the user immediately on load
                    setTimeout(() => this.requestNotificationPermission(), 5000);
                }

                // Start background background checks for notifications
                this.startBackgroundNotificationChecks();

            } catch (error) {
                console.error('SW Registration Failed:', error);
            }
        }
    }

    startBackgroundNotificationChecks() {
        // Check every 10 minutes for critical updates that need background push
        setInterval(() => {
            this.checkForCriticalAlerts();
        }, 10 * 60 * 1000);
    }

    async checkForCriticalAlerts() {
        // This simulates checking the state or a quick API ping for high-priority items
        const state = stateManager.getState();
        const notifications = state.notifications || [];
        const unreadCritical = notifications.filter(n => !n.read && n.priority === 'high');

        if (unreadCritical.length > 0) {
            const latest = unreadCritical[0];
            this.triggerPushNotification(latest.title, latest.message);
        }
    }

    triggerPushNotification(title, body) {
        if ('serviceWorker' in navigator && Notification.permission === 'granted') {
            navigator.serviceWorker.ready.then((registration) => {
                registration.showNotification(title, {
                    body: body,
                    icon: 'assets/icons/icon-192x192.png',
                    vibrate: [200, 100, 200],
                    tag: 'critical-alert'
                });
            });
        }
    }

    async requestNotificationPermission() {
        const result = await Notification.requestPermission();
        if (result === 'granted') {
            console.log('Notification permission granted.');
            // Here you could send the subscription to the server if needed
        }
    }

    initTable(id) {
        if ($.fn.DataTable.isDataTable(`#${id}`)) {
            $(`#${id}`).DataTable().destroy();
        }
        return $(`#${id}`).DataTable({
            responsive: true,
            language: { url: '//cdn.datatables.net/plug-ins/1.13.6/i18n/ar.json' },
            order: [[0, 'desc']],
            pageLength: 25,
            dom: '<"flex flex-wrap gap-4 items-center justify-between mb-4"fB>rtip',
            buttons: ['copy', 'excel', 'pdf', 'print']
        });
    }

    registerRoutes() {
        router.addRoute('dashboard', () => {
            const data = stateManager.getState().currentData;
            const stats = DashboardService.calculateStats(data);
            return DashboardView(stats);
        }, () => {
            if (window.initDashboardCharts) window.initDashboardCharts();
            this.updateDashboardStations();
            
            // Quality Score Chart Modal
            $('#quality-score-card').off('click').on('click', () => {
                const data = stateManager.getState().currentData;
                const scores = data.audit || [];
                
                if (scores.length === 0) {
                    ui.warning('لا توجد بيانات', 'لم يتم تسجيل أي تقييمات جودة بعد');
                    return;
                }
                
                // Prepare chart data
                const chartData = scores
                    .filter(s => s.score && s.date)
                    .sort((a, b) => new Date(a.date) - new Date(b.date))
                    .slice(-20); // Last 20 entries
                
                const labels = chartData.map(s => new Date(s.date).toLocaleDateString('ar-EG', { month: 'short', day: 'numeric' }));
                const values = chartData.map(s => parseFloat(s.score) || 0);
                
                Swal.fire({
                    title: 'معدل تقييم الجودة',
                    html: `
                        <div class="text-right" dir="rtl">
                            <p class="text-xs text-slate-400 font-bold uppercase tracking-widest mb-4">Quality Score Trend - Last ${chartData.length} Records</p>
                            <canvas id="qualityScoreChart" width="400" height="200"></canvas>
                        </div>
                    `,
                    width: '800px',
                    showConfirmButton: false,
                    showCloseButton: true,
                    customClass: {
                        popup: 'rounded-3xl',
                        title: 'text-2xl font-bold text-slate-800'
                    },
                    didOpen: () => {
                        const ctx = document.getElementById('qualityScoreChart').getContext('2d');
                        new Chart(ctx, {
                            type: 'line',
                            data: {
                                labels: labels,
                                datasets: [{
                                    label: 'درجة التقييم (%)',
                                    data: values,
                                    borderColor: '#6366f1',
                                    backgroundColor: 'rgba(99, 102, 241, 0.1)',
                                    borderWidth: 3,
                                    tension: 0.4,
                                    fill: true,
                                    pointBackgroundColor: '#ffffff',
                                    pointBorderColor: '#6366f1',
                                    pointBorderWidth: 2,
                                    pointRadius: 5,
                                    pointHoverRadius: 7
                                }]
                            },
                            options: {
                                responsive: true,
                                maintainAspectRatio: false,
                                plugins: {
                                    legend: { display: true, position: 'top' },
                                    tooltip: {
                                        backgroundColor: '#1e293b',
                                        titleColor: '#fff',
                                        bodyColor: '#cbd5e1',
                                        borderColor: '#6366f1',
                                        borderWidth: 1,
                                        padding: 12,
                                        displayColors: false
                                    }
                                },
                                scales: {
                                    y: {
                                        beginAtZero: true,
                                        max: 100,
                                        ticks: { 
                                            font: { family: 'Cairo', weight: 'bold' },
                                            callback: (value) => value + '%'
                                        },
                                        grid: { color: '#f1f5f9' }
                                    },
                                    x: {
                                        ticks: { font: { family: 'Cairo', weight: 'bold' } },
                                        grid: { display: false }
                                    }
                                }
                            }
                        });
                    }
                });
            });
        });

        router.addRoute('audit', () => {
            const data = stateManager.getState().currentData;
            return AuditView(data.audit || []);
        }, () => {
            this.initTable('auditTable');
            this.initImgPreview();
            $('#add-audit-btn').on('click', () => {
                this.openModal('إضافة ملاحظة جودة', 'قم بتسجيل ملاحظة تفتيش جديدة للفرع', FormsComponent.auditForm());
                this.initAuditForm();
            });
            $('#print-photo-report').on('click', () => this.generatePhotoReport('audit', 'تقرير الصور - تفتيش الجودة'));
        });

        router.addRoute('stock', () => {
            const data = stateManager.getState().currentData;
            return StockView(data.stock || []);
        }, () => {
            this.initTable('stockTable');
            $('#add-stock-btn').on('click', () => {
                this.openModal('إضافة صنف للمخزن', 'تسجيل شحنة جديدة في قاعدة بيانات المخزون', FormsComponent.stockForm());
                formHandler.populateProducts();
                this.initStockForm();
            });
        });

        router.addRoute('receiving', () => {
            const data = stateManager.getState().currentData;
            return ReceivingView(data.receiving || []);
        }, () => {
            this.initTable('receivingTable');
            $('#add-receiving-btn').on('click', () => {
                this.openModal('استلام مواد خام', 'تسجيل دخول شحنة جديدة للمخازن', FormsComponent.receivingForm());
                formHandler.populateProducts();
                this.initReceivingForm();
            });
        });

        router.addRoute('checklists', () => {
            const data = stateManager.getState().currentData;
            return ChecklistsView(data.checklists || []);
        }, () => {
            this.initTable('checklistsTable');
            this.initImgPreview();
            $('#add-checklist-btn').on('click', () => {
                this.openModal('فحص جديد', 'تسجيل بند فحص يومي جديد', FormsComponent.checklistForm());
                this.initChecklistForm();
            });
        });

        router.addRoute('health', () => {
            const data = stateManager.getState().currentData;
            return HealthView(data.health || []);
        }, () => {
            this.initTable('healthTable');
            this.initImgPreview();
            $('#add-health-btn').on('click', () => {
                this.openModal('إضافة شهادة صحية', 'تسجيل بيانات الشهادة الصحية لموظف جديد', FormsComponent.healthForm());
                this.initHealthForm();
            });
            $('#print-photo-report').on('click', () => this.generatePhotoReport('health', 'تقرير الصور - الشهادات الصحية'));
        });

        router.addRoute('temp', () => {
            const data = stateManager.getState().currentData;
            return TempView(data.temp || [], data.equipment || []);
        }, () => {
            this.initTable('tempTable');
            
            // Add handler for equipment clicks (requested "ease of use")
            $('.temp-equipment-card').on('click', (e) => {
                const equipId = $(e.currentTarget).data('equip-id');
                const equipName = $(e.currentTarget).data('equip-name');
                const data = stateManager.getState().currentData;
                this.openModal(`تسجيل حرارة: ${equipName}`, `توثيق درجة الحرارة للمعدة المختارة حالياً`, FormsComponent.tempForm(data.equipment || []));
                // Auto-set the equipment dropdown
                $('select[name="equipmentId"]').val(equipName); // Fixed: Use equipName if ID is name
                this.initTempForm(equipName);
            });

            $('#add-equipment-btn').on('click', () => {
                this.openModal('إضافة معدة جديدة', 'تعريف ثلاجة أو معدة جديدة لقاعدة البيانات', FormsComponent.equipmentForm());
                this.initEquipmentForm();
            });

            $('#add-product-btn').on('click', () => {
                this.openModal('إضافة صنف جديد', 'تعريف صنف طعام جديد للنظام', FormsComponent.entityProductForm());
                this.initEntityProductForm();
            });
            
            $('#print-photo-report').on('click', () => this.generatePhotoReport('temp', 'تقرير الصور - سجل درجات الحرارة'));
        });

        router.addRoute('complaints', () => {
            const data = stateManager.getState().currentData;
            return ComplaintsView(data.complaints || []);
        }, () => {
            this.initTable('complaintsTable');
            this.initImgPreview();
            $('#add-complaints-btn').on('click', () => {
                this.openModal('تسجيل شكوى عميل', 'متابعة وحل مشكلات جودة المنتجات', FormsComponent.complaintsForm());
                formHandler.populateProducts();
                this.initComplaintsForm();
            });
            $('#print-photo-report').on('click', () => this.generatePhotoReport('complaints', 'تقرير الصور - شكاوى الجودة'));
        });

        router.addRoute('calibration', () => {
            const data = stateManager.getState().currentData;
            return CalibrationView(data.calibration || []);
        }, () => {
            this.initTable('calibrationTable');
            $('#add-calibration-btn').on('click', () => {
                this.openModal('معايرة الأجهزة', 'تسجيل نتائج معايرة الموازين والثيرمومترات', FormsComponent.calibrationForm());
                this.initCalibrationForm();
            });
        });

        router.addRoute('products', () => {
            const data = stateManager.getState().currentData;
            return ProductsView(data.products || []);
        }, () => {
            this.initTable('productsTable');
            $('#add-product-btn').on('click', () => {
                this.openModal('إضافة صنف جديد', 'تعريف صنف جديد لقاعدة بيانات المنتجات', FormsComponent.entityProductForm());
                this.initEntityProductForm();
            });
        });

        router.addRoute('pest', () => {
            const data = stateManager.getState().currentData;
            return PestView(data.pest || []);
        }, () => {
            this.initTable('pestTable');
            this.initImgPreview();
            $('#add-pest-btn').on('click', () => {
                this.openModal('سجل مكافحة الآفات', 'توثيق زيارة فريق المكافحة والنتائج', FormsComponent.pestForm());
                this.initPestForm();
            });
            $('#print-photo-report').on('click', () => this.generatePhotoReport('pest', 'تقرير الصور - مكافحة الآفات'));
        });

        router.addRoute('training', () => {
            const data = stateManager.getState().currentData;
            return TrainingView(data.training || []);
        }, () => {
            this.initTable('trainingTable');
            this.initImgPreview();
            $('#add-training-btn').on('click', () => {
                this.openModal('سجل تدريب العاملين', 'توثيق البرامج التدريبية للأفراد', FormsComponent.trainingForm());
                this.initTrainingForm();
            });
            $('#print-photo-report').on('click', () => this.generatePhotoReport('training', 'تقرير الصور - سجل التدريب'));
        });

        router.addRoute('archive', () => {
            const data = stateManager.getState().currentData;
            return ArchiveView(data);
        });

        router.addRoute('notifications', () => {
            const data = stateManager.getState().currentData;
            const notifications = NotificationsService.sortByDate(data.notifications || []);
            return NotificationsView(notifications);
        }, () => {
            this.initNotificationPageEvents();
        });

        router.addRoute('procedures', () => {
            const data = stateManager.getState().currentData;
            return ProceduresView(data.procedures || [], data.ops_stations || []);
        }, () => {
            // Handle checkbox toggle
            $(document).off('change', '.task-checkbox').on('change', '.task-checkbox', async (e) => {
                const checkbox = $(e.currentTarget);
                const taskId = checkbox.data('id');
                const taskName = checkbox.data('name');
                const completed = checkbox.is(':checked');
                
                if (completed) {
                    // Open execution modal
                    checkbox.prop('checked', false); 
                    this.openModal('إتمام المهمة', 'يرجى رفع صورة لإثبات إتمام المهمة', FormsComponent.proceduresExecutionForm(taskName));
                    this.initProceduresExecutionForm(taskId);
                }
            });

            // Handle Print Procedures Report
            $('#print-procedures-btn').off('click').on('click', async () => {
                const { value: formValues } = await Swal.fire({
                    title: 'طباعة تقرير الإجراءات',
                    html: `
                        <div class="flex flex-col gap-4 text-right">
                            <div>
                                <label class="text-[10px] font-bold text-slate-400 block mb-1">من تاريخ</label>
                                <input id="swal-date-from" class="swal2-input m-0 w-full" type="date" value="${new Date().toLocaleDateString('en-CA')}">
                            </div>
                            <div>
                                <label class="text-[10px] font-bold text-slate-400 block mb-1">إلى تاريخ</label>
                                <input id="swal-date-to" class="swal2-input m-0 w-full" type="date" value="${new Date().toLocaleDateString('en-CA')}">
                            </div>
                            <div>
                                <label class="text-[10px] font-bold text-slate-400 block mb-1">اسم التقرير</label>
                                <input id="swal-report-name" class="swal2-input m-0 w-full" placeholder="تقرير إجراءات الجودة">
                            </div>
                        </div>
                    `,
                    focusConfirm: false,
                    preConfirm: () => {
                        return {
                            dateFrom: document.getElementById('swal-date-from').value,
                            dateTo: document.getElementById('swal-date-to').value,
                            reportName: document.getElementById('swal-report-name').value || 'تقرير إجراءات الجودة'
                        }
                    }
                });

                if (formValues) {
                    this.generateProceduresReport(formValues.dateFrom, formValues.dateTo, formValues.reportName);
                }
            });

            // Handle Add Procedure Button
            $('#add-procedure-btn').off('click').on('click', () => {
                this.openModal('مهمة جديدة', 'إضافة مهمة جديدة لإجراءات الفتح أو الغلق', FormsComponent.proceduresForm());
                this.initProceduresForm();
            });

            // Handle station card click - Show assignment modal
            $(document).off('click', '.station-card').on('click', '.station-card', function() {
                const station = $(this).data('station');
                const stationName = $(this).find('h5').text();
                const opsStations = stateManager.getState().currentData.ops_stations || [];
                const currentAssignment = opsStations.find(s => s.station === station);

                this.openModal(stationName, 'تعيين المسؤول عن المحطة لليوم', FormsComponent.stationAssignmentForm());
                
                // Pre-fill if exists
                if (currentAssignment) {
                    $('select[name="station"]').val(currentAssignment.station);
                    $('input[name="employeeName"]').val(currentAssignment.employeeName);
                    $(`input[name="shift"][value="${currentAssignment.shift}"]`).prop('checked', true);
                } else {
                    $('select[name="station"]').val(station);
                }

                $('#stationAssignmentForm').off('submit').on('submit', async (e) => {
                    e.preventDefault();
                    const formData = Object.fromEntries(new FormData(e.target));
                    
                    ui.loading('جاري حفظ التعيين...');
                    try {
                        await apiService.submitData('ops_station', { 
                            ...formData, 
                            date: new Date().toISOString().split('T')[0],
                            user: stateManager.getState().currentUser.fullName
                        });
                        
                        ui.success('تم التعيين', 'تم حفظ بيانات المحطة بنجاح');
                        this.closeModal();
                        
                        // Refresh all data to sync
                        const data = await apiService.fetchData();
                        stateManager.setCurrentData(data);
                        router.navigateTo('procedures');
                    } catch (error) {
                        ui.error('خطأ', 'فشل حفظ التعيين');
                    }
                });
            }.bind(this));

            // Add Task Button
            $('#add-procedure-task').off('click').on('click', () => {
                this.openModal('إضافة مهمة جديدة', 'إدارة إجراءات الفتح والغلق اليومية', FormsComponent.proceduresForm());
                this.initProceduresForm();
            });
        });

        router.addRoute('users', () => {
            const data = stateManager.getState().currentData;
            return UsersView(data.users || []);
        }, () => {
            this.initTable('usersTable');
            
            $('#add-user-btn').on('click', () => {
                this.openModal('إضافة مستخدم جديد', 'منح صلاحيات الوصول للنظام', UserFormTemplate());
                this.initUserForm();
            });

            $(document).off('click', '.edit-user-btn').on('click', '.edit-user-btn', (e) => {
                const email = $(e.currentTarget).data('email');
                const users = stateManager.getState().currentData.users || [];
                const user = users.find(u => u.email === email);
                this.openModal('تعديل بيانات المستخدم', 'تحديث الصلاحيات أو المعلومات', UserFormTemplate(user));
                this.initUserForm(email);
            });

            $(document).off('click', '.delete-user-btn').on('click', '.delete-user-btn', (e) => {
                const email = $(e.currentTarget).data('email');
                this.deleteUser(email);
            });
        });
    }

    async init() {
        const user = authService.checkSession();
        if (user) {
            this.startDashboard();
        } else {
            this.initLogin();
            this.updateServerStatus();
        }
        
        stateManager.subscribe((state) => this.handleStateChange(state));
        window.addEventListener('app-alerts', (e) => this.handleAppAlerts(e.detail));

        // Background Status Monitor
        setInterval(() => this.updateServerStatus(), 60000); // Check every minute

        setInterval(() => {
            $('#liveClock').text(new Date().toLocaleString('ar-EG', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric', 
                hour: '2-digit', 
                minute: '2-digit',
                second: '2-digit'
            }));
        }, 1000);
    }

    handleStateChange(state) {
        if (state.currentData) {
            router.handleHashChange();
        }
    }

    handleAppAlerts(alerts) {
        const critical = alerts.filter(a => a.priority === 'danger');
        critical.forEach(alert => {
            ui.toast(alert.message, 'error');
        });
    }

    async updateServerStatus() {
        // Find all status elements
        const dots = $('[id^="server-status-dot"]');
        const texts = $('[id^="server-status-text"]');
        if (!dots.length) return;

        const isOnline = await apiService.checkServerStatus();
        
        dots.removeClass('bg-slate-300 bg-emerald-500 bg-red-500');
        texts.removeClass('text-slate-400 text-emerald-500 text-red-500');

        if (isOnline) {
            dots.addClass('bg-emerald-500');
            texts.text('Server Online').addClass('text-emerald-500');
        } else {
            dots.addClass('bg-red-500');
            texts.text('Server Offline').addClass('text-red-500');
        }
    }

    initLogin() {
        const loginForm = document.getElementById('login-form');
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const username = $('#login-email').val();
            const password = $('#login-password').val();
            
            const btn = $(e.target).find('button');
            const originalText = btn.html();
            btn.prop('disabled', true).html('<i class="fa-solid fa-spinner fa-spin ml-2"></i> جاري التحقق...');
            
            try {
                ui.loading('جاري التحقق من الصلاحيات والاتصال بالسيرفر...');
                const data = await apiService.fetchData();
                if (!data) throw new Error("Connection failed");
                
                stateManager.setCurrentData(data);
                const usersList = data.users || [];
                const success = await authService.login(username, password, usersList);
                
                ui.close();

                if (success) {
                    ui.success('أهلاً بك مجدداً', 'تم تسجيل دخولك بنجاح');
                    setTimeout(() => this.startDashboard(), 1000);
                } else {
                    // Check if user exists but status is not active
                    const user = data.users.find(u => (u.email || u.username || '').toString().toLowerCase() === username.toLowerCase());
                    if (user && user.status !== 'active') {
                        ui.error('حساب معطل', 'هذا الحساب غير نشط حالياً، يرجى التواصل مع المدير');
                    } else {
                        ui.error('خطأ في الدخول', 'اسم المستخدم أو كلمة المرور غير صحيحة. يرجى التأكد من البيانات والمحاولة مرة أخرى');
                    }
                }
            } catch (error) {
                ui.close();
                console.error('Login error:', error);
                if (error.message === "Connection failed") {
                    ui.error('مشكلة في الاتصال', 'تعذر الاتصال بالسيرفر. يرجى التأكد من حالة الإنترنت أو تواصل مع الدعم الفني');
                } else {
                    ui.error('فشل في دخول النظام', 'حدث خطأ غير متوقع أثناء محاولة الدخول. حاول مرة أخرى لاحقاً');
                }
            } finally {
                btn.prop('disabled', false).html(originalText);
            }
        });
    }

    async startDashboard() {
        $('#login-screen').addClass('hidden');
        $('#app-wrapper').removeClass('hidden');
        
        const state = stateManager.getState();
        const user = state.currentUser;
        
        $('#header-user-name').text(user.fullName);
        $('#header-user-role').text(user.role);
        $('#header-user-img').attr('src', `https://ui-avatars.com/api/?name=${encodeURIComponent(user.fullName)}&background=10b981&color=fff`);

        if (user.role === 'Admin') {
            $('#app-wrapper').addClass('is-admin');
            $('.admin-only').show(); // Legacy support if needed
        } else {
            $('#app-wrapper').removeClass('is-admin');
            $('.admin-only').hide();
        }

        const data = await apiService.fetchData();
        stateManager.setCurrentData(data);

        this.initUIEvents();
        this.updateNotificationBadge();
        this.updateServerStatus();
        router.navigateTo('dashboard');
    }

    initUIEvents() {
        this.initAdminActions();

        $('#sidebar-toggle').off('click').on('click', () => {
            const sidebar = $('#sidebar');
            const mainContent = $('#main-content');
            
            if (window.innerWidth <= 1024) {
                sidebar.toggleClass('show-mobile');
            } else {
                sidebar.toggleClass('collapsed');
                mainContent.toggleClass('full-width');
            }
            
            // Re-initialize any components that might need resizing
            if ($.fn.DataTable.isDataTable('.dataTable')) {
                $('.dataTable').DataTable().columns.adjust().responsive.recalc();
            }
        });

        $('#logout-btn').off('click').on('click', () => {
            authService.logout();
            location.reload();
        });

        $('.nav-item').off('click').on('click', function() {
            const route = $(this).data('route');
            if (route) {
                router.navigateTo(route);
                
                // Auto-hide sidebar on mobile after selection
                if (window.innerWidth <= 1024) {
                    $('#sidebar').removeClass('show-mobile');
                }
            }
        });

        $('.close-modal, .modal-backdrop').off('click').on('click', () => this.closeModal());
        
        this.initNotificationHeaderEvents();
    }

    // --- Notifications Logic ---

    updateDashboardStations() {
        const data = stateManager.getState().currentData;
        const opsStations = data.ops_stations || [];
        
        opsStations.forEach(item => {
            const card = $(`#stations-overview [data-station="${item.station}"]`);
            if (card.length) {
                card.find('.station-employee').text(item.employeeName);
                const shiftLabel = item.shift === 'morning' ? 'صباحي' : 'مسائي';
                card.find('.station-shift').text(shiftLabel);
                
                // Update styles
                card.find('.station-shift').removeClass('bg-amber-50 text-amber-700 bg-indigo-50 text-indigo-700');
                if (item.shift === 'morning') {
                    card.find('.station-shift').addClass('bg-amber-50 text-amber-700');
                } else {
                    card.find('.station-shift').addClass('bg-indigo-50 text-indigo-700');
                }
            }
        });
    }

    updateNotificationBadge() {
        const data = stateManager.getState().currentData;
        const notifications = data.notifications || [];
        const unreadCount = NotificationsService.getUnreadCount(notifications);
        const badge = $('#notification-badge');
        
        if (unreadCount > 0) {
            badge.text(unreadCount > 99 ? '99+' : unreadCount).removeClass('hidden');
        } else {
            badge.addClass('hidden');
        }
    }

    initNotificationHeaderEvents() {
        // Toggle Dropdown
        $('#notification-bell').off('click').on('click', (e) => {
            e.stopPropagation();
            $('#notification-dropdown').toggleClass('hidden');
            if (!$('#notification-dropdown').hasClass('hidden')) {
                this.renderMiniNotificationList();
            }
        });

        $(document).on('click', (e) => {
            if (!$(e.target).closest('#notification-dropdown, #notification-bell').length) {
                $('#notification-dropdown').addClass('hidden');
            }
        });

        // Mark all as read in header
        $('#mark-all-read-header').off('click').on('click', async (e) => {
            e.stopPropagation();
            const data = stateManager.getState().currentData;
            const unread = NotificationsService.filterUnread(data.notifications || []);
            
            if (unread.length === 0) return;

            ui.loading('جاري تحديث التنبيهات...');
            try {
                // In Apps Script, we'll implement markAllRead
                await apiService.submitData('notifications', { action: 'markAllRead' });
                
                // Update local state
                data.notifications.forEach(n => n.read = true);
                stateManager.updateState({ currentData: data });
                this.updateNotificationBadge();
                this.renderMiniNotificationList();
                ui.close();
            } catch (error) {
                ui.error('خطأ', 'فشل تحديث التنبيهات');
            }
        });
    }

    renderMiniNotificationList() {
        const data = stateManager.getState().currentData;
        const notifications = NotificationsService.sortByDate(data.notifications || []).slice(0, 5);
        const list = $('#notification-list');
        
        if (notifications.length === 0) {
            list.html('<div class="p-6 text-center text-slate-300 font-bold uppercase tracking-widest text-xs">لا توجد تنبيهات جديدة</div>');
            return;
        }

        const html = notifications.map(n => `
            <div class="p-4 hover:bg-slate-50 transition-colors cursor-pointer ${!n.read ? 'bg-indigo-50/30' : ''}" onclick="router.navigateTo('notifications')">
                <div class="flex items-start gap-3">
                    <div class="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${n.priority === 'urgent' ? 'bg-rose-100 text-rose-600' : 'bg-indigo-100 text-indigo-600'}">
                        <i class="fa-solid ${n.priority === 'urgent' ? 'fa-triangle-exclamation' : 'fa-bell'} text-xs"></i>
                    </div>
                    <div class="flex-1 min-w-0">
                        <p class="text-xs font-bold text-slate-800 truncate">${n.title}</p>
                        <p class="text-[10px] text-slate-500 truncate mt-0.5">${n.message}</p>
                        <p class="text-[9px] text-slate-400 mt-1">${new Date(n.date).toLocaleDateString('ar-EG')}</p>
                    </div>
                </div>
            </div>
        `).join('');

        list.html(html);
    }

    initNotificationPageEvents() {
        $('#add-notification-btn').off('click').on('click', () => {
            this.openModal('إرسال تنبيه جديد', 'إرسال إشعار لكافة الموظفين أو لفريق محدد', FormsComponent.notificationForm());
            this.initNotificationForm();
        });

        $('#mark-all-read-btn').off('click').on('click', async () => {
             $('#mark-all-read-header').click();
        });

        $(document).off('click', '.mark-read-btn').on('click', '.mark-read-btn', async (e) => {
            const id = $(e.currentTarget).data('id');
            await this.markNotificationAsRead(id);
        });

        $(document).off('click', '.delete-notif-btn').on('click', '.delete-notif-btn', async (e) => {
            const id = $(e.currentTarget).data('id');
            await this.deleteNotification(id);
        });
    }

    async markNotificationAsRead(id) {
        try {
            await apiService.submitData('notifications', { id, action: 'markAsRead' });
            const data = stateManager.getState().currentData;
            const notif = data.notifications.find(n => n.id == id);
            if (notif) notif.read = true;
            stateManager.updateState({ currentData: data });
            this.updateNotificationBadge();
            router.handleHashChange(); 
        } catch (error) {
            ui.error('خطأ', 'فشل تحديث التنبيه');
        }
    }

    async deleteNotification(id) {
        const result = await Swal.fire({
            title: 'حذف التنبيه؟',
            text: 'هل أنت متأكد من حذف هذا التنبيه نهائياً؟',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#EF4444'
        });

        if (result.isConfirmed) {
            try {
                await apiService.submitData('notifications', { id, action: 'delete' });
                const data = stateManager.getState().currentData;
                data.notifications = data.notifications.filter(n => n.id != id);
                stateManager.updateState({ currentData: data });
                this.updateNotificationBadge();
                router.handleHashChange();
            } catch (error) {
                ui.error('خطأ', 'فشل حذف التنبيه');
            }
        }
    }

    initNotificationForm() {
        $('#notificationForm').on('submit', async (e) => {
            e.preventDefault();
            const formData = Object.fromEntries(new FormData(e.target));
            ui.loading('جاري إرسال التنبيه...');
            try {
                await apiService.submitData('notifications', {
                    ...formData,
                    date: new Date().toISOString(),
                    user: stateManager.getState().currentUser.fullName
                });
                ui.success('تم الإرسال', 'تم نشر التنبيه بنجاح');
                this.closeModal();
                const data = await apiService.fetchData();
                stateManager.setCurrentData(data);
                this.updateNotificationBadge();
                router.navigateTo('notifications');
            } catch (error) {
                ui.error('خطأ', 'فشل إرسال التنبيه');
            }
        });
    }

    initProceduresForm() {
        const todayStr = new Date().toLocaleDateString('en-CA');
        $('input[name="date"]').val(todayStr);
        
        $('#proceduresForm').on('submit', async (e) => {
            e.preventDefault();
            const formData = Object.fromEntries(new FormData(e.target));
            
            await formHandler.submit('procedures', 'proceduresForm', {
                ...formData,
                id: 'PROC-' + Date.now(),
                completed: false,
                img: '',
                taskFrequency: formData.taskFrequency || 'daily',
                user: stateManager.getState().currentUser.fullName
            }, async () => { 
                this.closeModal(); 
                const data = await apiService.fetchData();
                stateManager.setCurrentData(data);
                router.navigateTo('procedures');
            });
        });
    }

    initProceduresExecutionForm(taskId) {
        $('#executionImgInput').on('change', function() {
            formHandler.handleImage(this, 'executionImgPreview', 'executionImgData');
        });

        $('#proceduresExecutionForm').on('submit', async (e) => {
            e.preventDefault();
            const imgData = $('#executionImgData').val();
            
            if (!imgData) {
                ui.error('خطأ', 'يرجى التقاط صورة لإثبات الإنجاز');
                return;
            }

            ui.loading('جاري حفظ المهمة...');
            try {
                await apiService.submitData('procedures', { 
                    id: taskId, 
                    img: imgData, 
                    completed: true, 
                    action: 'updateTask' 
                });
                
                this.closeModal();
                ui.success('تم الإنجاز', 'تم تحديث المهمة بنجاح');
                
                const data = await apiService.fetchData();
                stateManager.setCurrentData(data);
                router.navigateTo('procedures');
            } catch (error) {
                ui.error('خطأ', 'فشل تحديث المهمة');
            }
        });
    }

    async generateProceduresReport(dateFrom, dateTo, reportName) {
        ui.loading('جاري تحضير التقرير...');
        
        const data = stateManager.getState().currentData.procedures || [];
        const from = new Date(dateFrom);
        const to = new Date(dateTo);
        
        const filteredData = data.filter(item => {
            const itemDate = new Date(item.date);
            return itemDate >= from && itemDate <= to && item.completed;
        });

        if (filteredData.length === 0) {
            ui.error('لا توجد بيانات', 'لا توجد مهام منجزة في الفترة المحددة');
            return;
        }

        const formatImgUrl = (id) => {
            if (!id || id.length < 5) return '';
            if (id.startsWith('http')) return id;
            return `https://lh3.googleusercontent.com/d/${id}`;
        };

        const printWindow = window.open('', '_blank');
        printWindow.document.write(`
            <html>
                <head>
                    <title>${reportName}</title>
                    <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;900&display=swap" rel="stylesheet">
                    <style>
                        * { box-sizing: border-box; margin: 0; padding: 0; direction: rtl; }
                        body { font-family: 'Cairo', sans-serif; padding: 40px; }
                        .header { text-align: center; margin-bottom: 40px; border-bottom: 4px solid #000; padding-bottom: 20px; }
                        .report-title { font-size: 28px; font-weight: 900; }
                        .report-meta { color: #666; font-size: 14px; margin-top: 5px; }
                        
                        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                        th { background: #f8fafc; color: #64748b; font-size: 11px; font-weight: 900; text-transform: uppercase; padding: 15px; border: 1px solid #e2e8f0; text-align: right; }
                        td { padding: 15px; border: 1px solid #e2e8f0; vertical-align: middle; }
                        
                        .task-name { font-weight: 800; color: #1e293b; font-size: 14px; }
                        .task-time { font-family: monospace; font-weight: 900; color: #4f46e5; background: #eef2ff; padding: 4px 8px; rounded: 4px; }
                        .img-container { width: 120px; height: 80px; overflow: hidden; border-radius: 8px; border: 1px solid #eee; }
                        .img-container img { width: 100%; height: 100%; object-cover: cover; }
                        .responsible { font-size: 12px; font-weight: 700; color: #64748b; }
                        
                        .print-btn { position: fixed; bottom: 20px; right: 20px; background: #000; color: #fff; padding: 15px 30px; border-radius: 50px; cursor: pointer; border: none; font-family: inherit; font-weight: 900; }
                        @media print { .print-btn { display: none; } }
                    </style>
                </head>
                <body>
                    <div class="header">
                        <div class="report-title">${reportName}</div>
                        <div class="report-meta">الفترة: ${dateFrom} إلى ${dateTo} | تاريخ الاستخراج: ${new Date().toLocaleDateString('ar-EG')}</div>
                    </div>
                    
                    <table>
                        <thead>
                            <tr>
                                <th>المهمة</th>
                                <th>الوقت</th>
                                <th>المرفق</th>
                                <th>المسؤول</th>
                                <th>التاريخ</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${filteredData.map(item => `
                                <tr>
                                    <td><div class="task-name">${item.taskName}</div></td>
                                    <td><span class="task-time">${item.taskTime || item.time || '-'}</span></td>
                                    <td>
                                        <div class="img-container">
                                            <img src="${formatImgUrl(item.img)}" onerror="this.src='https://via.placeholder.com/120x80?text=No+Image'">
                                        </div>
                                    </td>
                                    <td><div class="responsible">${item.responsible || '-'}</div></td>
                                    <td><div class="responsible">${item.date}</div></td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                    
                    <button class="print-btn" onclick="window.print()">طباعة التقرير</button>
                </body>
            </html>
        `);
        printWindow.document.close();
        ui.success('تم التحضير', 'تم فتح التقرير في نافذة جديدة');
    }

    closeModal() {
        const content = $('#modal-container .modal-content');
        content.addClass('scale-95 opacity-0');
        setTimeout(() => {
            $('#modal-container').addClass('hidden');
        }, 200);
    }

    openModal(title, subtitle, bodyHtml) {
        $('#modal-title').text(title);
        $('#modal-subtitle').text(subtitle);
        $('#modal-body').html(bodyHtml);
        $('#modal-container').removeClass('hidden');
        
        // Populate specific dropdowns
        this.populateProductSelectors();
        
        // Setup multi-image handlers
        this.setupMultiImageHandlers();

        setTimeout(() => {
            $('#modal-container .modal-content').removeClass('scale-95 opacity-0');
        }, 10);
    }
    
    setupMultiImageHandlers() {
        // Define image input configurations
        const imageConfigs = [
            { inputId: 'tempImgInput', previewsId: 'tempImgPreviews', dataId: 'tempImgData', dateField: 'date', timeField: 'time' },
            { inputId: 'auditImgInput', previewsId: 'auditImgPreviews', dataId: 'auditImgData', dateField: 'date' },
            { inputId: 'trainingImgInput', previewsId: 'trainingImgPreviews', dataId: 'trainingImgData', dateField: 'date' },
            { inputId: 'pestImgInput', previewsId: 'pestImgPreviews', dataId: 'pestImgData', dateField: 'date' },
            { inputId: 'complaintsImgInput', previewsId: 'complaintsImgPreviews', dataId: 'complaintsImgData', dateField: 'date' },
            { inputId: 'healthImgInput', previewsId: 'healthImgPreviews', dataId: 'healthImgData', dateField: 'expiry' }
        ];

        imageConfigs.forEach(config => {
            const input = document.getElementById(config.inputId);
            if (!input) return; // Skip if not in current form

            $(input).off('change').on('change', async function() {
                // Get date/time for watermark
                const dateValue = $(`[name="${config.dateField}"]`).val();
                const timeValue = config.timeField ? $(`[name="${config.timeField}"]`).val() : '';
                
                let watermarkText = '';
                if (dateValue) {
                    const dateObj = new Date(dateValue);
                    watermarkText = dateObj.toLocaleDateString('ar-EG', { year: 'numeric', month: 'short', day: 'numeric' });
                    if (timeValue) {
                        watermarkText += ' ' + timeValue;
                    }
                } else {
                    watermarkText = new Date().toLocaleString('ar-EG');
                }

                // Call formHandler with watermark
                await formHandler.handleMultipleImages(this, config.previewsId, config.dataId, watermarkText);
            });
        });
    }
    
    populateProductSelectors() {
        // Fetch products from state
        const products = stateManager.getState().currentData.products || [];
        
        // Find all selectors
        $('.product-selector').each(function() {
            const select = $(this);
            const currentVal = select.val(); // Preserve if editing
            
            // Generate options
            let options = '<option value="">-- اختر الصنف --</option>';
            products.forEach(p => {
                options += `<option value="${p.name}">${p.name} (${p.code || '-'})</option>`;
            });
            
            select.html(options);
            
            if (currentVal) select.val(currentVal);
        });
    }

    // --- Form Handlers ---

    initUserForm(existingEmail = null) {
        $('#userForm').on('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const permissions = [];
            formData.getAll('permissions').forEach(p => permissions.push(p));
            
            const payload = {
                type: 'user_management',
                action: existingEmail ? 'update' : 'create',
                fullName: formData.get('fullName'),
                email: formData.get('email'),
                password: formData.get('password'),
                role: formData.get('role'),
                permissions: permissions.join(','),
                status: 'active'
            };

            ui.loading('جاري حفظ بيانات المستخدم...');
            try {
                const response = await apiService.submitData(payload);
                if (response.success) {
                    ui.success('تم الحفظ', 'تم تحديث بيانات المستخدم بنجاح');
                    this.closeModal();
                    const data = await apiService.fetchData();
                    stateManager.setCurrentData(data);
                    router.handleHashChange(); // Refresh view
                } else {
                    ui.error('فشل الخدمة', response.message || 'خطأ غير معروف');
                }
            } catch (error) {
                ui.error('فشل الحفظ', 'حدث خطأ أثناء الاتصال بالسيرفر');
            }
        });
    }

    async deleteUser(email) {
        const result = await Swal.fire({
            title: 'هل أنت متأكد؟',
            text: `سيتم حذف المستخدم (${email}) نهائياً من النظام.`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#EF4444',
            cancelButtonColor: '#64748B',
            confirmButtonText: 'نعم، احذف',
            cancelButtonText: 'إلغاء',
            reverseButtons: true
        });

        if (result.isConfirmed) {
            ui.loading('جاري حذف المستخدم...');
            try {
                const response = await apiService.submitData({
                    type: 'user_management',
                    action: 'delete',
                    email: email
                });
                
                if (response.success) {
                    ui.success('تم الحذف', 'تم حذف المستخدم من قاعدة البيانات');
                    const data = await apiService.fetchData();
                    stateManager.setCurrentData(data);
                    router.handleHashChange();
                } else {
                    ui.error('فشل الحذف', response.message || 'لا يمكن حذف المستخدم حالياً');
                }
            } catch (error) {
                ui.error('خطأ', 'فشل الاتصال بالسيرفر');
            }
        }
    }

    initAuditForm() {
        $('#auditImgInput').on('change', function() {
            formHandler.handleImage(this, 'auditImgPreview', 'auditImgData');
        });

        $('#auditForm').on('submit', async (e) => {
            e.preventDefault();
            const formData = Object.fromEntries(new FormData(e.target));
            await formHandler.submit('audit', 'auditForm', {
                ...formData,
                id: 'AUD-' + Date.now(),
                user: stateManager.getState().currentUser.fullName
            }, () => router.handleHashChange());
        });
    }

    initStockForm() {
        $('#stockForm').on('submit', async (e) => {
            e.preventDefault();
            const formData = Object.fromEntries(new FormData(e.target));
            await formHandler.submit('stock', 'stockForm', {
                ...formData,
                user: stateManager.getState().currentUser.fullName
            }, () => router.handleHashChange());
        });
    }



    initEquipmentForm() {
        $('#equipmentForm').on('submit', async (e) => {
            e.preventDefault();
            const formData = Object.fromEntries(new FormData(e.target));
            await formHandler.submit('equipment', 'equipmentForm', {
                ...formData,
                id: 'EQ-' + Date.now()
            }, () => {
                this.closeModal();
                router.handleHashChange();
            });
        });
    }

    initEntityProductForm() {
        $('#entityProductForm').on('submit', async (e) => {
            e.preventDefault();
            const formData = Object.fromEntries(new FormData(e.target));
            await formHandler.submit('products', 'entityProductForm', {
                ...formData,
                id: 'PROD-' + Date.now()
            }, () => {
                this.closeModal();
                router.handleHashChange();
            });
        });
    }

    // --- Image Preview ---

    initImgPreview() {

        $(document).off('click', '.img-preview-btn').on('click', '.img-preview-btn', (e) => {
            e.preventDefault();
            const btn = $(e.currentTarget);
            const urls = btn.data('img') ? String(btn.data('img')).split(',').map(u => u.trim()) : [];
            if (urls.length === 0) return;

            const primaryImg = urls[0];
            const hasMultiple = urls.length > 1;

            // Rich Preview Logic
            if (id && type && stateManager.getState().currentData[type]) {
                const data = stateManager.getState().currentData[type];
                const item = data.find(i => i.id == id);
                
                if (item) {
                    let detailsHtml = '';

                    // Define templates for each module
                    if (type === 'temp') {
                        detailsHtml = `
                            <div class="grid grid-cols-2 gap-4">
                                <div class="bg-slate-50 p-3 rounded-xl"><span class="text-[10px] font-bold text-slate-400 block mb-1">الوقت</span><span class="text-sm font-bold text-slate-700">${item.time || '-'}</span></div>
                                <div class="bg-slate-50 p-3 rounded-xl"><span class="text-[10px] font-bold text-slate-400 block mb-1">المعدة</span><span class="text-sm font-bold text-slate-700">${item.equipment || '-'}</span></div>
                                <div class="bg-indigo-50 p-3 rounded-xl"><span class="text-[10px] font-bold text-indigo-400 block mb-1">درجة المعدة</span><span class="text-lg font-black text-indigo-600">${item.reading || '-'}°C</span></div>
                                <div class="bg-emerald-50 p-3 rounded-xl"><span class="text-[10px] font-bold text-emerald-400 block mb-1">درجة المنتج</span><span class="text-lg font-black text-emerald-600">${item.prodReading || '-'}°C</span></div>
                                <div class="col-span-2 bg-slate-50 p-3 rounded-xl"><span class="text-[10px] font-bold text-slate-400 block mb-1">المنتج</span><span class="text-sm font-bold text-slate-700">${item.productName || '-'}</span></div>
                                <div class="col-span-2 bg-slate-50 p-3 rounded-xl flex justify-between items-center"><div><span class="text-[10px] font-bold text-slate-400 block">نوع المسح</span><span class="text-sm font-bold text-slate-700">${item.measType || 'Infrared'}</span></div><i class="fa-solid fa-barcode-read text-slate-300 text-xl"></i></div>
                            </div>`;
                    } else if (type === 'audit') {
                        detailsHtml = `
                            <div class="grid grid-cols-2 gap-4">
                                <div class="bg-slate-50 p-3 rounded-xl"><span class="text-[10px] font-bold text-slate-400 block mb-1">اسم الفرع</span><span class="text-sm font-bold text-slate-700">${item.branchName || '-'}</span></div>
                                <div class="bg-indigo-50 p-3 rounded-xl"><span class="text-[10px] font-bold text-indigo-400 block mb-1">رقم النقطة</span><span class="text-sm font-bold text-indigo-600">${item.pointNo || '-'}</span></div>
                                <div class="bg-slate-50 p-3 rounded-xl"><span class="text-[10px] font-bold text-slate-400 block mb-1">القسم / الفئة</span><span class="text-sm font-bold text-slate-700">${item.department || item.deptName || '-'}</span></div>
                                <div class="bg-slate-50 p-3 rounded-xl"><span class="text-[10px] font-bold text-slate-400 block mb-1">المسؤول</span><span class="text-sm font-bold text-slate-700">${item.responsible || item.user || '-'}</span></div>
                                <div class="col-span-2 bg-rose-50 p-3 rounded-xl"><span class="text-[10px] font-bold text-rose-400 block mb-1">الملاحظات المرصودة</span><span class="text-sm font-bold text-rose-700">${item.observedComments || item.comment || '-'}</span></div>
                                <div class="col-span-2 bg-emerald-50 p-3 rounded-xl"><span class="text-[10px] font-bold text-emerald-400 block mb-1">الإجراءات التصحيحية</span><span class="text-sm font-bold text-emerald-700">${item.correctiveActions || '-'}</span></div>
                                <div class="bg-amber-50 p-3 rounded-xl col-span-2"><span class="text-[10px] font-bold text-amber-400 block mb-1">الجدول الزمني</span><span class="text-sm font-bold text-amber-700">${item.timeline || '-'}</span></div>
                            </div>`;
                    } else if (type === 'complaints') {
                        detailsHtml = `
                            <div class="grid grid-cols-1 gap-4">
                                <div class="bg-slate-50 p-3 rounded-xl"><span class="text-[10px] font-bold text-slate-400 block mb-1">العميل</span><span class="text-sm font-bold text-slate-700">${item.customer || '-'}</span></div>
                                <div class="bg-rose-50 p-3 rounded-xl"><span class="text-[10px] font-bold text-rose-400 block mb-1">المشكلة</span><span class="text-sm font-bold text-rose-700">${item.problem || '-'}</span></div>
                                <div class="bg-slate-50 p-3 rounded-xl"><span class="text-[10px] font-bold text-slate-400 block mb-1">السبب الجذري</span><span class="text-sm font-bold text-slate-700">${item.rootCause || '-'}</span></div>
                                <div class="bg-emerald-50 p-3 rounded-xl"><span class="text-[10px] font-bold text-emerald-400 block mb-1">الإجراء المتخذ</span><span class="text-sm font-bold text-emerald-700">${item.actionTaken || '-'}</span></div>
                            </div>`;
                    } else if (type === 'pest') {
                        detailsHtml = `
                            <div class="grid grid-cols-2 gap-4">
                                <div class="bg-slate-50 p-3 rounded-xl"><span class="text-[10px] font-bold text-slate-400 block mb-1">المنطقة</span><span class="text-sm font-bold text-slate-700">${item.area || '-'}</span></div>
                                <div class="bg-slate-50 p-3 rounded-xl"><span class="text-[10px] font-bold text-slate-400 block mb-1">النوع</span><span class="text-sm font-bold text-slate-700">${item.visitType || '-'}</span></div>
                                <div class="col-span-2 bg-rose-50 p-3 rounded-xl"><span class="text-[10px] font-bold text-rose-400 block mb-1">النتائج</span><span class="text-sm font-bold text-rose-700">${item.findings || '-'}</span></div>
                                <div class="col-span-2 bg-emerald-50 p-3 rounded-xl"><span class="text-[10px] font-bold text-emerald-400 block mb-1">الإجراء</span><span class="text-sm font-bold text-emerald-700">${item.action || '-'}</span></div>
                            </div>`;
                    } else if (type === 'training') {
                        detailsHtml = `
                            <div class="grid grid-cols-1 gap-4">
                                <div class="bg-indigo-50 p-3 rounded-xl"><span class="text-[10px] font-bold text-indigo-400 block mb-1">الموضوع</span><span class="text-lg font-bold text-indigo-700">${item.topic || '-'}</span></div>
                                <div class="bg-slate-50 p-3 rounded-xl"><span class="text-[10px] font-bold text-slate-400 block mb-1">المدرب</span><span class="text-sm font-bold text-slate-700">${item.trainer || '-'}</span></div>
                                <div class="bg-slate-50 p-3 rounded-xl"><span class="text-[10px] font-bold text-slate-400 block mb-1">المتدربين</span><span class="text-sm font-bold text-slate-700 leading-relaxed">${item.trainees || '-'}</span></div>
                            </div>`;
                    } else if (type === 'health') {
                        detailsHtml = `
                            <div class="grid grid-cols-2 gap-4">
                                <div class="bg-slate-50 p-3 rounded-xl"><span class="text-[10px] font-bold text-slate-400 block mb-1">الاسم</span><span class="text-sm font-bold text-slate-700">${item.name || '-'}</span></div>
                                <div class="bg-slate-50 p-3 rounded-xl"><span class="text-[10px] font-bold text-slate-400 block mb-1">الوظيفة</span><span class="text-sm font-bold text-slate-700">${item.position || '-'}</span></div>
                                <div class="col-span-2 bg-slate-50 p-3 rounded-xl"><span class="text-[10px] font-bold text-slate-400 block mb-1">تاريخ الانتهاء</span><span class="text-sm font-bold text-slate-700">${item.expiry ? new Date(item.expiry).toLocaleDateString('ar-EG') : '-'}</span></div>
                            </div>`;
                    } else if (type === 'procedures') {
                        detailsHtml = `
                            <div class="grid grid-cols-2 gap-4">
                                <div class="col-span-2 bg-indigo-50 p-3 rounded-xl"><span class="text-[10px] font-bold text-indigo-400 block mb-1">المهمة</span><span class="text-lg font-black text-indigo-700">${item.taskName || '-'}</span></div>
                                <div class="bg-slate-50 p-3 rounded-xl"><span class="text-[10px] font-bold text-slate-400 block mb-1">الوقت المجدول</span><span class="text-sm font-bold text-slate-700">${item.taskTime || '-'}</span></div>
                                <div class="bg-slate-50 p-3 rounded-xl"><span class="text-[10px] font-bold text-slate-400 block mb-1">النوع</span><span class="text-sm font-bold text-slate-700">${item.procedureType === 'opening' ? 'إجراءات فتح' : 'إجراءات غلق'}</span></div>
                                <div class="col-span-2 bg-slate-50 p-3 rounded-xl"><span class="text-[10px] font-bold text-slate-400 block mb-1">المسؤول</span><span class="text-sm font-bold text-slate-700">${item.responsible || '-'}</span></div>
                                <div class="col-span-2 bg-emerald-50 p-3 rounded-xl flex items-center justify-between">
                                    <span class="text-[10px] font-bold text-emerald-400 block">حالة الإتمام</span>
                                    <span class="text-sm font-black text-emerald-700">${item.completed ? 'تم الإنجاز' : 'قيد الانتظار'}</span>
                                </div>
                            </div>`;
                    } else {
                        // Unknown type fallback
                        detailsHtml = `<div class="p-4 text-slate-400 text-center">لا توجد تفاصيل إضافية لهذا النوع</div>`;
                    }

                    const galleryHtml = `
                        <div class="space-y-4">
                            <img src="${primaryImg}" class="w-full h-64 md:h-[400px] object-cover rounded-2xl border-2 border-slate-100 shadow-sm" alt="Evidence">
                            ${hasMultiple ? `
                                <div class="grid grid-cols-3 gap-2">
                                    ${urls.map(url => `<img src="${url}" class="h-20 w-full object-cover rounded-xl border border-slate-200 cursor-pointer hover:border-indigo-500 transition-all">`).join('')}
                                </div>
                            ` : ''}
                        </div>
                    `;

                    const htmlContent = `
                        <div class="flex flex-col md:flex-row gap-6 text-right rtl" dir="rtl">
                            <div class="w-full md:w-1/2">
                                ${galleryHtml}
                            </div>
                            <div class="w-full md:w-1/2 flex flex-col justify-center gap-4">
                                <h3 class="text-xl font-bold text-slate-800 border-b border-slate-100 pb-2">تفاصيل السجل</h3>
                                ${detailsHtml}
                            </div>
                        </div>
                    `;

                    Swal.fire({
                        html: htmlContent,
                        showConfirmButton: false,
                        showCloseButton: true,
                        width: '900px',
                        padding: '2em',
                        background: '#ffffff',
                        customClass: { popup: 'rounded-3xl' }
                    });
                    return;
                }
            }

            // Default Simple Preview for multi
            if (hasMultiple) {
                 Swal.fire({
                    html: `
                        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
                            ${urls.map(url => `<img src="${url}" class="w-full rounded-2xl border-4 border-slate-800 shadow-2xl">`).join('')}
                        </div>
                    `,
                    width: '90%',
                    background: '#0f172a',
                    showConfirmButton: false,
                    showCloseButton: true
                });
            } else {
                Swal.fire({
                    imageUrl: primaryImg,
                    imageAlt: 'Preview',
                    showConfirmButton: false,
                    showCloseButton: true,
                    width: '80%',
                    background: '#0f172a',
                    customClass: { image: 'rounded-2xl max-h-[80vh] object-contain' }
                });
            }
        });
    }

    // --- Form Handlers ---

    initChecklistForm() {
        const now = new Date();
        $('input[name="date"]').val(now.toISOString().split('T')[0]);
        $('#checklistForm').on('submit', async (e) => {
            e.preventDefault();
            const formData = Object.fromEntries(new FormData(e.target));
            await formHandler.submit('checklists', 'checklistForm', {
                ...formData,
                user: stateManager.getState().currentUser.fullName
            }, () => { this.closeModal(); router.handleHashChange(); });
        });
    }

    initCalibrationForm() {
        const now = new Date();
        $('input[name="date"]').val(now.toISOString().split('T')[0]);
        $('#calibrationForm').on('submit', async (e) => {
            e.preventDefault();
            const formData = Object.fromEntries(new FormData(e.target));
            await formHandler.submit('calibration', 'calibrationForm', {
                ...formData,
                user: stateManager.getState().currentUser.fullName
            }, () => { this.closeModal(); router.handleHashChange(); });
        });
    }

    initTempForm(defaultEquip = '') {
        const now = new Date();
        $('input[name="date"]').val(now.toISOString().split('T')[0]);
        if(defaultEquip) $('select[name="equipment"]').val(defaultEquip);
        
        $('#tempImgInput').on('change', function() {
            formHandler.handleImage(this, 'tempImgPreview', 'tempImgData');
        });

        $('#tempForm').on('submit', async (e) => {
            e.preventDefault();
            const formData = Object.fromEntries(new FormData(e.target));
            
            // Allow override of status logic if needed, but for now auto-calc could work
            // Let's rely on backend or simplified logic for status
            let status = 'Normal';
            const reading = parseFloat(formData.reading);
            if (reading > 10 || reading < -20) status = 'Critical'; 
            else if (reading > 5) status = 'Warning';

            await formHandler.submit('temp', 'tempForm', {
                ...formData,
                status: status,
                observer: stateManager.getState().currentUser.fullName
            }, () => { this.closeModal(); router.handleHashChange(); });
        });
    }

    initHealthForm() {
        $('#healthImgInput').on('change', function() {
            formHandler.handleImage(this, 'healthImgPreview', 'healthImgData');
        });
        $('#healthForm').on('submit', async (e) => {
            e.preventDefault();
            const formData = Object.fromEntries(new FormData(e.target));
            await formHandler.submit('health', 'healthForm', {
                ...formData,
                user: stateManager.getState().currentUser.fullName
            }, () => { this.closeModal(); router.handleHashChange(); });
        });
    }

    initComplaintsForm() {
        const now = new Date();
        $('input[name="date"]').val(now.toISOString().split('T')[0]);
        $('#complaintsImgInput').on('change', function() {
            formHandler.handleImage(this, 'complaintsImgPreview', 'complaintsImgData');
        });
        $('#complaintsForm').on('submit', async (e) => {
            e.preventDefault();
            const formData = Object.fromEntries(new FormData(e.target));
            await formHandler.submit('complaints', 'complaintsForm', {
                ...formData,
                user: stateManager.getState().currentUser.fullName
            }, () => { this.closeModal(); router.handleHashChange(); });
        });
    }

    initPestForm() {
        const now = new Date();
        $('input[name="date"]').val(now.toISOString().split('T')[0]);
        $('#pestImgInput').on('change', function() {
            formHandler.handleImage(this, 'pestImgPreview', 'pestImgData');
        });
        $('#pestForm').on('submit', async (e) => {
            e.preventDefault();
            const formData = Object.fromEntries(new FormData(e.target));
            await formHandler.submit('pest', 'pestForm', {
                ...formData,
                user: stateManager.getState().currentUser.fullName
            }, () => { this.closeModal(); router.handleHashChange(); });
        });
    }

    initTrainingForm() {
        const now = new Date();
        $('input[name="date"]').val(now.toISOString().split('T')[0]);
        $('#trainingImgInput').on('change', function() {
            formHandler.handleImage(this, 'trainingImgPreview', 'trainingImgData');
        });
        $('#trainingForm').on('submit', async (e) => {
            e.preventDefault();
            const formData = Object.fromEntries(new FormData(e.target));
            await formHandler.submit('training', 'trainingForm', {
                ...formData,
                user: stateManager.getState().currentUser.fullName
            }, () => { this.closeModal(); router.handleHashChange(); });
        });
    }

    initReceivingForm() {
        $('#receivingForm').on('submit', async (e) => {
            e.preventDefault();
            const formData = Object.fromEntries(new FormData(e.target));
            await formHandler.submit('receiving', 'receivingForm', {
                ...formData,
                user: stateManager.getState().currentUser.fullName
            }, () => { this.closeModal(); router.handleHashChange(); });
        });
    }

    // --- Reports & Printing ---

    async generatePhotoReport(moduleType, defaultTitle) {
        const data = stateManager.getState().currentData[moduleType] || [];
        
        // 1. Prompt for Report Name & Date Range
        const { value: formValues } = await Swal.fire({
            title: 'استخراج تقرير مصور',
            html: `
                <div class="flex flex-col gap-4 text-right" dir="rtl">
                    <div>
                        <label class="block text-sm font-bold text-slate-700 mb-1">اسم التقرير</label>
                        <input id="swal-input1" class="swal2-input w-full m-0" value="${defaultTitle}">
                    </div>
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-bold text-slate-700 mb-1">من تاريخ</label>
                            <input id="swal-input2" type="date" class="swal2-input w-full m-0">
                        </div>
                        <div>
                            <label class="block text-sm font-bold text-slate-700 mb-1">إلى تاريخ</label>
                            <input id="swal-input3" type="date" class="swal2-input w-full m-0">
                        </div>
                    </div>
                </div>
            `,
            focusConfirm: false,
            showCancelButton: true,
            confirmButtonText: 'استخراج التقرير',
            cancelButtonText: 'إلغاء',
            confirmButtonColor: '#4F46E5',
            preConfirm: () => {
                return [
                    document.getElementById('swal-input1').value,
                    document.getElementById('swal-input2').value,
                    document.getElementById('swal-input3').value
                ]
            }
        });

        if (!formValues) return; // Cancelled
        
        const [title, dateFrom, dateTo] = formValues;
        const reportTitle = title || defaultTitle;

        // 2. Filter Data - Support both single and multiple images
        let filteredData = data.filter(item => {
            if (!item.img) return false;
            // Check if it's a single image or multiple images
            const imgArray = item.img.includes('|||') ? item.img.split('|||') : [item.img];
            return imgArray.some(img => img && img.length > 10);
        });
        
        if (dateFrom) {
            const from = new Date(dateFrom);
            filteredData = filteredData.filter(item => new Date(item.date) >= from);
        }
        if (dateTo) {
            const to = new Date(dateTo);
            filteredData = filteredData.filter(item => new Date(item.date) <= to);
        }

        if (filteredData.length === 0) {
            ui.error('لا توجد بيانات', 'لا توجد سجلات تحتوي على صور في الفترة المحددة');
            return;
        }

        const user = stateManager.getState().currentUser;
        const now = new Date();
        const extractDate = now.toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' });
        const extractTime = now.toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' });

        const formatImgUrl = (id) => {
            if (!id || id.length < 5) return '';
            if (id.startsWith('http')) return id;
            return `https://lh3.googleusercontent.com/d/${id}`;
        };

        // 3. Header Restoration (Legacy "THE DRIVE 2" Style + Active User)
        let reportHtml = `
            <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #0f172a; padding-bottom: 24px; margin-bottom: 32px; direction: rtl; font-family: 'Cairo', sans-serif;">
                <!-- Right: Branding -->
                <div style="text-align: right;">
                    <h2 style="font-size: 1.875rem; font-weight: 900; color: #0f172a; margin: 0;">THE DRIVE 2</h2>
                    <p style="font-size: 0.875rem; font-weight: 700; color: #64748b; margin: 0;">Quality Control System</p>
                </div>
                
                <!-- Center: Title & Date -->
                <div style="text-align: center;">
                    <h1 style="font-size: 1.5rem; font-weight: 900; text-decoration: underline; margin: 0; color: #000;">${reportTitle}</h1>
                    <p style="margin-top: 8px; font-weight: 700; color: #000;">${extractDate}</p>
                </div>
                
                <!-- Left: User Info (Modified) -->
                <div style="text-align: left; direction: ltr;">
                    <p style="font-size: 1.125rem; font-weight: 900; margin: 0; color: #000;">By Active User: ${user.fullName}</p>
                    <p style="font-size: 0.875rem; color: #64748b; margin: 0;">${user.role}</p>
                    <p style="font-size: 0.8rem; color: #64748b; margin: 0;">${extractTime}</p>
                </div>
            </div>
            
            <div class="photo-report-grid" style="display:grid; grid-template-columns: repeat(2, 1fr); gap:30px; padding:20px 40px; direction:rtl;">
                    ${filteredData.map(item => {
                        // Handle multiple images (separated by |||)
                        const imgData = item.img || '';
                        const imgArray = imgData.includes('|||') ? imgData.split('|||') : [imgData];
                        const validImages = imgArray.filter(img => img && img.length > 10);
                        
                        let itemDate = item.date || '';
                        try { if(itemDate) itemDate = new Date(itemDate).toLocaleDateString('ar-EG'); } catch(e) {}
                        
                        // Data Preparation
                        const time = item.taskTime || item.time || '-';
                        const taskName = item.taskName || '-';
                        const equip = item.equipment || item.equipmentName || '-';
                        const equipTemp = item.reading ? item.reading + '°C' : '-';
                        const product = item.productName || item.product || '-';
                        const prodTemp = item.prodReading ? item.prodReading + '°C' : '-';
                        const type = item.measType || 'Infrared';
                        const note = item.comment || item.observation || item.findings || 'لا توجد ملاحظات';

                        // Generate image collage based on count
                        let imageHtml = '';
                        if (validImages.length === 1) {
                            const imgSrc = formatImgUrl(validImages[0]);
                            imageHtml = `<img src="${imgSrc}" style="width: 100%; height: 100%; object-fit: contain;" onerror="this.style.display='none'">`;
                        } else if (validImages.length === 2) {
                            imageHtml = `
                                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 5px; width: 100%; height: 100%;">
                                    <img src="${formatImgUrl(validImages[0])}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 4px;" onerror="this.style.display='none'">
                                    <img src="${formatImgUrl(validImages[1])}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 4px;" onerror="this.style.display='none'">
                                </div>
                            `;
                        } else if (validImages.length >= 3) {
                            imageHtml = `
                                <div style="display: grid; grid-template-columns: 1fr 1fr; grid-template-rows: 1fr 1fr; gap: 5px; width: 100%; height: 100%;">
                                    <img src="${formatImgUrl(validImages[0])}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 4px;" onerror="this.style.display='none'">
                                    <img src="${formatImgUrl(validImages[1])}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 4px;" onerror="this.style.display='none'">
                                    <img src="${formatImgUrl(validImages[2])}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 4px; grid-column: 1 / -1;" onerror="this.style.display='none'">
                                </div>
                            `;
                        }

                        return `
                            <div style="border: 1px solid #ddd; border-radius: 8px; padding: 15px; page-break-inside: avoid; break-inside: avoid;">
                                <!-- Image Collage -->
                                <div style="height: 300px; width: 100%; margin-bottom: 15px; border: 1px solid #eee; background-color: #f9f9f9; display: flex; align-items: center; justify-content: center; overflow: hidden; border-radius: 4px;">
                                    ${imageHtml}
                                </div>
                                
                                <!-- Full Data details (No Icons) -->
                                <div style="margin-bottom: 10px; border-bottom: 1px solid #eee; padding-bottom: 5px;">
                                    <span style="color: #666; font-weight: bold; display: block; font-size: 10px;">المهمة - Task</span>
                                    <span style="color: #4f46e5; font-size: 14px; font-weight: 900;">${taskName}</span>
                                </div>
                                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; font-size: 12px; border-bottom: 1px solid #eee; padding-bottom: 10px; margin-bottom: 10px;">
                                    <div>
                                        <span style="color: #666; font-weight: bold; display: block;">التاريخ / الوقت:</span>
                                        <span style="color: #000;">${itemDate} | ${time}</span>
                                    </div>
                                    <div>
                                        <span style="color: #666; font-weight: bold; display: block;">نوع المسح:</span>
                                        <span style="color: #000;">${type}</span>
                                    </div>
                                    <div>
                                        <span style="color: #666; font-weight: bold; display: block;">المعدة:</span>
                                        <span style="color: #000; font-weight: bold;">${equip}</span>
                                    </div>
                                    <div>
                                        <span style="color: #666; font-weight: bold; display: block;">درجة المعدة:</span>
                                        <span style="color: #000; font-weight: bold;">${equipTemp}</span>
                                    </div>
                                    <div>
                                        <span style="color: #666; font-weight: bold; display: block;">المنتج:</span>
                                        <span style="color: #000;">${product}</span>
                                    </div>
                                    <div>
                                        <span style="color: #666; font-weight: bold; display: block;">درجة المنتج:</span>
                                        <span style="color: #000;">${prodTemp}</span>
                                    </div>
                                </div>
                                
                                <!-- Notes -->
                                <div>
                                    <span style="color: #666; font-weight: bold; display: block; font-size: 12px;">الملاحظات:</span>
                                    <p style="margin: 3px 0 0; font-size: 13px; color: #333; line-height: 1.4;">${note}</p>
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>
        `;

        const printWindow = window.open('', '_blank');
        printWindow.document.write(`
            <html>
                <head>
                    <title>${reportTitle}</title>
                    <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;900&display=swap" rel="stylesheet">
                    <style>
                        * { box-sizing: border-box; margin: 0; padding: 0; }
                        body { font-family: 'Cairo', sans-serif; background: white; }
                        
                        .control-bar {
                            position: fixed; top: 0; left: 0; width: 100%;
                            background: #333; padding: 10px;
                            display: flex; justify-content: center; gap: 20px; z-index: 1000;
                        }
                        .control-btn {
                            padding: 8px 16px; border-radius: 4px; font-family: 'Cairo', sans-serif;
                            font-weight: bold; cursor: pointer; border: none; color: white;
                        }
                        .btn-print { background: #4f46e5; }
                        .btn-close { background: #ef4444; }
                        
                        @media print {
                            .control-bar { display: none !important; }
                            @page { size: A3 landscape; margin: 10mm; }
                            body { -webkit-print-color-adjust: exact; }
                            .photo-report-grid { grid-template-columns: repeat(3, 1fr) !important; gap: 20px !important; }
                        }
                    </style>
                </head>
                <body dir="rtl">
                    <div class="control-bar">
                        <button onclick="window.print()" class="control-btn btn-print">طباعة</button>
                        <button onclick="window.close()" class="control-btn btn-close">إغلاق</button>
                    </div>
                    ${reportHtml}
                </body>
            </html>
        `);
        printWindow.document.close();
    }

    // --- Admin Actions ---
    
    initAdminActions() {
        $(document).off('click', '.action-delete').on('click', '.action-delete', async (e) => {
            e.preventDefault();
            const btn = $(e.currentTarget);
            const id = btn.data('id');
            const type = btn.data('type'); // e.g., 'temp', 'audit'
            
            if (!id || !type) return;

            const result = await Swal.fire({
                title: 'هل أنت متأكد؟',
                text: "لن تتمكن من التراجع عن هذا الإجراء!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#d33',
                cancelButtonColor: '#3085d6',
                confirmButtonText: 'نعم، احذف',
                cancelButtonText: 'إلغاء'
            });

            if (result.isConfirmed) {
                try {
                    ui.loading('جاري الحذف...');
                    // In a real app, this would be an API call
                    // Send generic delete action
                    await apiService.submitData(type, { id: id, action: 'delete' });
                    
                    ui.success('تم الحذف', 'تم حذف السجل بنجاح');
                    
                    // Refresh data
                    const data = await apiService.fetchData();
                    stateManager.setCurrentData(data);
                    router.handleHashChange(); // Reload current view
                } catch (error) {
                    ui.error('خطأ', 'حدث خطأ أثناء الحذف');
                    console.error(error);
                }
            }
        });

        $(document).off('click', '.action-edit').on('click', '.action-edit', (e) => {
            e.preventDefault();
            const btn = $(e.currentTarget);
            const id = btn.data('id');
            const type = btn.data('type');
            
            if (!id || !type) return;

            const data = stateManager.getState().currentData[type];
            const item = data.find(i => i.id == id);
            
            if (!item) {
                ui.error('خطأ', 'السجل غير موجود');
                return;
            }

            // Open appropriate form and fill data
            if (type === 'temp') {
                this.openModal('تعديل قراءة الحرارة', 'تحديث بيانات السجل', FormsComponent.tempForm(stateManager.getState().currentData.equipment || []));
                this.initTempForm(); // Re-bind events
                
                // Fill form
                $('input[name="date"]').val(item.date ? new Date(item.date).toISOString().split('T')[0] : '');
                $('input[name="time"]').val(item.time || '');
                $('select[name="equipment"]').val(item.equipment);
                $('input[name="reading"]').val(item.reading);
                
                // Override submit handler for Update
                $('#tempForm').off('submit').on('submit', async (e) => {
                    e.preventDefault();
                    const formData = Object.fromEntries(new FormData(e.target));
                    let status = 'Normal';
                    const reading = parseFloat(formData.reading);
                    if (reading > 10 || reading < -20) status = 'Critical'; 
                    else if (reading > 5) status = 'Warning';

                    await formHandler.submit('temp', 'tempForm', {
                        ...formData,
                        id: item.id, // Keep existing ID
                        action: 'update', // Backend should handle this as update
                        status: status,
                        observer: stateManager.getState().currentUser.fullName
                    }, () => { this.closeModal(); router.handleHashChange(); });
                });
            } else if (type === 'audit' || type === 'complaints' || type === 'pest' || type === 'procedures') {
                // Generic Edit Logic for simple modules
                let formHtml, initFunc;
                if (type === 'audit') { formHtml = FormsComponent.auditForm(); initFunc = () => this.initAuditForm(); }
                if (type === 'complaints') { formHtml = FormsComponent.complaintsForm(); initFunc = () => this.initComplaintsForm(); }
                if (type === 'procedures') { formHtml = FormsComponent.proceduresForm(); initFunc = () => this.initProceduresForm(); }
                if (type === 'pest') { formHtml = FormsComponent.pestForm(); initFunc = () => this.initPestForm(); }

                this.openModal('تعديل السجل', 'تحديث البيانات', formHtml);
                if (initFunc) initFunc();

                // Fill standard fields
                $('input[name="date"]').val(item.date ? new Date(item.date).toISOString().split('T')[0] : '');
                Object.keys(item).forEach(key => {
                    const el = $(`[name="${key}"]`);
                    if (el.length) el.val(item[key]);
                });

                // Override submit
                const formIdMapping = {
                    'audit': '#auditForm',
                    'complaints': '#complaintsForm',
                    'pest': '#pestForm',
                    'procedures': '#proceduresForm'
                };
                const formId = formIdMapping[type];
                $(formId).off('submit').on('submit', async (e) => {
                    e.preventDefault();
                    const formData = Object.fromEntries(new FormData(e.target));
                    await formHandler.submit(type, formId.substring(1), {
                        ...formData,
                        id: item.id,
                        action: 'update',
                        user: stateManager.getState().currentUser.fullName
                    }, () => { this.closeModal(); router.handleHashChange(); });
                });
            } else {
                 ui.toast('وظيفة التعديل لهذا القسم قيد التطوير', 'info');
            }
        });
    }
}

new App();
