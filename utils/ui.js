/**
 * UI Utility - Provides premium, modern SweetAlert2 wrappers.
 */

const swalCustom = Swal.mixin({
    customClass: {
        confirmButton: 'bg-slate-900 text-white rounded-2xl px-8 py-3 font-black ml-3 hover:bg-slate-800 transition-all shadow-lg',
        cancelButton: 'bg-slate-100 text-slate-400 rounded-2xl px-8 py-3 font-black hover:bg-slate-200 transition-all',
        popup: 'rounded-[40px] p-8 border-none shadow-2xl overflow-hidden',
        title: 'text-2xl font-black text-slate-800 tracking-tighter',
        htmlContainer: 'text-sm font-bold text-slate-500 leading-relaxed'
    },
    buttonsStyling: false,
    showClass: {
        popup: 'animate__animated animate__fadeInUp animate__faster'
    },
    hideClass: {
        popup: 'animate__animated animate__fadeOutDown animate__faster'
    }
});

export const ui = {
    /**
     * Show a modern success message
     */
    success: (title, text) => {
        return swalCustom.fire({
            icon: 'success',
            iconColor: '#10b981',
            title: title || 'تمت العملية بنجاح',
            text: text,
            timer: 3000,
            showConfirmButton: false
        });
    },

    /**
     * Show a modern error message
     */
    error: (title, text) => {
        return swalCustom.fire({
            icon: 'error',
            iconColor: '#f43f5e',
            title: title || 'عذراً، حدث خطأ',
            text: text,
            confirmButtonText: 'فهمت'
        });
    },

    /**
     * Show a modern warning message
     */
    warning: (title, text) => {
        return swalCustom.fire({
            icon: 'warning',
            iconColor: '#f59e0b',
            title: title,
            text: text,
            confirmButtonText: 'موافق'
        });
    },

    /**
     * Show a modern notification (Toast)
     */
    toast: (title, icon = 'info') => {
        const Toast = Swal.mixin({
            toast: true,
            position: 'top-start',
            showConfirmButton: false,
            timer: 4000,
            timerProgressBar: true,
            didOpen: (toast) => {
                toast.addEventListener('mouseenter', Swal.stopTimer);
                toast.addEventListener('mouseleave', Swal.resumeTimer);
            },
            customClass: {
                popup: 'rounded-2xl shadow-xl'
            }
        });

        Toast.fire({
            icon: icon,
            title: title
        });
    },

    /**
     * Show a modern confirmation dialog
     */
    confirm: async (title, text) => {
        const result = await swalCustom.fire({
            title: title,
            text: text,
            icon: 'question',
            iconColor: '#6366f1',
            showCancelButton: true,
            confirmButtonText: 'نعم، استمر',
            cancelButtonText: 'إلغاء'
        });

        return result.isConfirmed;
    },

    /**
     * Show a loading state
     */
    loading: (title) => {
        swalCustom.fire({
            title: title || 'جاري المعالجة...',
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });
    },

    close: () => {
        Swal.close();
    }
};
