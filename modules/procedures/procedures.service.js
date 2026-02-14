/**
 * ProceduresService - Handles procedures logic
 */
export class ProceduresService {
    static calculateProgress(tasks, date) {
        const todayTasks = tasks.filter(t => t.date === date);
        const completed = todayTasks.filter(t => t.completed).length;
        const total = todayTasks.length;
        return total > 0 ? Math.round((completed / total) * 100) : 0;
    }
    
    static getOpeningTasks(data) {
        return (data.procedures || []).filter(p => p.procedureType === 'opening');
    }
    
    static getClosingTasks(data) {
        return (data.procedures || []).filter(p => p.procedureType === 'closing');
    }
    
    static toggleTaskCompletion(taskId, currentData) {
        const procedures = currentData.procedures || [];
        const task = procedures.find(p => p.id === taskId);
        if (task) {
            task.completed = !task.completed;
        }
        return procedures;
    }
}
