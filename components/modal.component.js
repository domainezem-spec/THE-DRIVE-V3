/**
 * ModalComponent - Reusable modal structure.
 */
export const ModalComponent = ({ title, content, id }) => {
    return `
        <div id="${id}" class="modal-bg hidden">
            <div class="modal-content animate__animated animate__zoomIn">
                <div class="flex justify-between items-center mb-6">
                    <h3 class="text-xl font-black text-slate-800">${title}</h3>
                    <button class="close-modal text-slate-400 hover:text-red-500 transition" data-target="${id}">
                        <i class="fa-solid fa-circle-xmark text-2xl"></i>
                    </button>
                </div>
                <div>
                    ${content}
                </div>
            </div>
        </div>
    `;
};

// Helper to open/close
export const initModalEvents = () => {
    document.addEventListener('click', (e) => {
        if (e.target.closest('.close-modal')) {
            const id = e.target.closest('.close-modal').getAttribute('data-target');
            document.getElementById(id).classList.add('hidden');
        }
    });

    // Close when clicking background
    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal-bg')) {
            e.target.classList.add('hidden');
        }
    });
};
