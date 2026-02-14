/**
 * FormHandler - Manage form logic, common selects, and data submission.
 */
import { apiService } from '../core/apiService.js';
import { stateManager } from '../core/stateManager.js';
import { ui } from '../utils/ui.js';

export const formHandler = {
    /**
     * Common method to handle image selection and preview
     */
    handleImage(input, previewId, dataId, customFileName = null) {
        const file = input.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            $(`#${previewId}`).attr('src', e.target.result).show();
            // Store the data URL
            $(`#${dataId}`).val(e.target.result);
            if (customFileName) {
               $(`#${dataId}`).attr('data-filename', customFileName);
            }
        };
        reader.readAsDataURL(file);
    },

    /**
     * Handle multiple images with watermarking (max 3)
     */
    async handleMultipleImages(input, previewsId, dataId, dateTime) {
        const files = Array.from(input.files).slice(0, 3); // Max 3 images
        if (files.length === 0) return;

        const previewsContainer = $(`#${previewsId}`);
        previewsContainer.empty();

        try {
            // Import imageProcessor dynamically
            const { imageProcessor } = await import('../utils/imageProcessor.js');
            
            // Show loading state
            previewsContainer.html('<span class="text-xs text-slate-400 font-bold">جاري معالجة الصور...</span>');

            // Process images with watermarks
            const watermarkedBlobs = await imageProcessor.processMultipleImages(files, dateTime);
            
            // Convert blobs to data URLs and create previews
            const dataUrls = await Promise.all(watermarkedBlobs.map(blob => {
                return new Promise((resolve) => {
                    const reader = new FileReader();
                    reader.onload = (e) => resolve(e.target.result);
                    reader.readAsDataURL(blob);
                });
            }));

            // Clear loading and show previews
            previewsContainer.empty();
            dataUrls.forEach((dataUrl, index) => {
                previewsContainer.append(`
                    <div class="relative group">
                        <img src="${dataUrl}" class="h-20 w-20 rounded-2xl object-cover border-2 border-indigo-200 shadow-sm">
                        <span class="absolute -top-2 -right-2 bg-indigo-600 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center shadow-lg">${index + 1}</span>
                    </div>
                `);
            });

            // Store comma-separated data URLs
            $(`#${dataId}`).val(dataUrls.join('|||')); // Use ||| as separator

        } catch (error) {
            console.error('Image processing failed:', error);
            previewsContainer.html('<span class="text-xs text-rose-500 font-bold">فشل في معالجة الصور</span>');
        }
    },

    /**
     * Submit any form to API
     */
    async submit(type, formId, data, successCallback) {
        const btn = $(`#${formId}`).find('button[type="submit"]');
        const originalText = btn.html();
        
        btn.prop('disabled', true).html('<i class="fa-solid fa-spinner fa-spin ml-2"></i> جاري الحفظ...');

        try {
            await apiService.submitData(type, data);
            
            ui.success('تم الحفظ بنجاح', 'تم تسجيل البيانات وتحديث السجلات');

            // Update local state
            const currentData = await apiService.fetchData();
            stateManager.setCurrentData(currentData);

            if (successCallback) successCallback();
            
            // Close modal
            $(`#${formId}`).closest('.modal').removeClass('show');
            
        } catch (error) {
            console.error('Submission failed:', error);
            ui.error('فشل في الحفظ', error.message || 'حدث خطأ أثناء إرسال البيانات للسيرفر');
        } finally {
            btn.prop('disabled', false).html(originalText);
        }
    },

    /**
     * Populate product dropdowns globally
     */
    populateProducts() {
        const products = stateManager.getState().currentData.products || [];
        const selectors = $('.product-selector');
        
        selectors.each(function() {
            const $this = $(this);
            $this.empty().append('<option value="">-- اختر الصنف --</option>');
            products.forEach(p => {
                $this.append(`<option value="${p.code}">${p.name} (${p.code})</option>`);
            });
        });
    }
};
