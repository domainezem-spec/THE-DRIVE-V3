/**
 * ImageProcessor - Handles image watermarking and processing
 */

export const imageProcessor = {
    /**
     * Add watermark to image with date/time
     * @param {File} file - Image file
     * @param {string} dateTime - Date and time to watermark
     * @returns {Promise<Blob>} - Processed image blob
     */
    async addWatermark(file, dateTime) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            
            reader.onload = (e) => {
                const img = new Image();
                
                img.onload = () => {
                    // Create canvas
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');
                    
                    // Set canvas size to image size
                    canvas.width = img.width;
                    canvas.height = img.height;
                    
                    // Draw original image
                    ctx.drawImage(img, 0, 0);
                    
                    // Configure watermark style
                    const fontSize = Math.max(img.width * 0.03, 16); // Responsive font size
                    ctx.font = `bold ${fontSize}px Cairo, Arial`;
                    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
                    ctx.strokeStyle = 'rgba(0, 0, 0, 0.7)';
                    ctx.lineWidth = 3;
                    ctx.textAlign = 'left';
                    ctx.textBaseline = 'bottom';
                    
                    // Position watermark at bottom-left
                    const padding = fontSize * 0.5;
                    const x = padding;
                    const y = img.height - padding;
                    
                    // Draw text with stroke (outline) and fill
                    ctx.strokeText(dateTime, x, y);
                    ctx.fillText(dateTime, x, y);
                    
                    // Convert canvas to blob
                    canvas.toBlob((blob) => {
                        if (blob) {
                            resolve(blob);
                        } else {
                            reject(new Error('Failed to create watermarked image'));
                        }
                    }, file.type || 'image/jpeg', 0.92);
                };
                
                img.onerror = () => reject(new Error('Failed to load image'));
                img.src = e.target.result;
            };
            
            reader.onerror = () => reject(new Error('Failed to read file'));
            reader.readAsDataURL(file);
        });
    },

    /**
     * Process multiple images with watermarks
     * @param {FileList} files - Image files (max 3)
     * @param {string} dateTime - Date and time to watermark
     * @returns {Promise<Blob[]>} - Array of processed image blobs
     */
    async processMultipleImages(files, dateTime) {
        const fileArray = Array.from(files).slice(0, 3); // Max 3 images
        const promises = fileArray.map(file => this.addWatermark(file, dateTime));
        return Promise.all(promises);
    },

    /**
     * Create preview thumbnails for selected images
     * @param {FileList} files - Image files
     * @returns {Promise<string[]>} - Array of data URLs for preview
     */
    async createPreviews(files) {
        const fileArray = Array.from(files).slice(0, 3);
        const promises = fileArray.map(file => {
            return new Promise((resolve) => {
                const reader = new FileReader();
                reader.onload = (e) => resolve(e.target.result);
                reader.readAsDataURL(file);
            });
        });
        return Promise.all(promises);
    }
};
