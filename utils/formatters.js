/**
 * Formatters - Utility functions for data representation.
 */

export const formatDate = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toISOString().split('T')[0];
};

export const formatImg = (id) => {
    if (!id || id.length < 5) return 'https://placehold.co/600x400?text=No+Photo';
    
    // If multiple images (comma-separated), return the first one for single image slots
    const firstId = String(id).split(',')[0].trim();
    
    if (firstId.startsWith('http')) return firstId;
    return `https://drive.google.com/uc?export=view&id=${firstId}`;
};

export const formatStatusBadge = (status) => {
    switch (status.toLowerCase()) {
        case 'active': return 'bg-emerald-100 text-emerald-700';
        case 'expired': return 'bg-red-100 text-red-700';
        case 'near expiry': return 'bg-amber-100 text-amber-700';
        default: return 'bg-slate-100 text-slate-700';
    }
};
