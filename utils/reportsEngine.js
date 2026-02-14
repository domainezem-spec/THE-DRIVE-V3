/**
 * ReportsEngine - Handles exporting data to Excel and PDF.
 */
export const reportsEngine = {
    /**
     * Export a table to Excel
     * @param {string} tableId - ID of the table element
     * @param {string} fileName - Destination file name
     */
    exportToExcel(tableId, fileName = 'Report') {
        const table = document.getElementById(tableId);
        if (!table) return;
        
        const wb = XLSX.utils.table_to_book(table, { sheet: "Sheet1" });
        XLSX.writeFile(wb, `${fileName}_${new Date().toISOString().split('T')[0]}.xlsx`);
    },

    /**
     * Export data to PDF using jsPDF and autoTable
     * @param {string} title - Report title
     * @param {Array} headers - Column headers
     * @param {Array} data - Table data
     * @param {string} fileName - Destination file name
     */
    exportToPDF(title, headers, data, fileName = 'Report') {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF('p', 'pt', 'a4');
        
        // Add font support for Arabic if needed (Simplified placeholder)
        doc.setFontSize(18);
        doc.text(title, 40, 40);
        
        doc.autoTable({
            head: [headers],
            body: data,
            startY: 60,
            styles: { font: 'Amiri', halign: 'right' }, // Assuming font added
            headStyles: { fillStyle: '#0f172a' }
        });

        doc.save(`${fileName}.pdf`);
    },

    /**
     * Generic Print function
     * @param {string} title 
     * @param {string} contentId 
     */
    printContent(title, contentId) {
        window.print();
    }
};
