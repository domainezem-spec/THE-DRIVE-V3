/**
 * NotificationsService - Business logic for notifications
 */

export const NotificationsService = {
    getUnreadCount: (notifications) => {
        return notifications.filter(n => !n.read).length;
    },

    getPriorityNotifications: (notifications, priority) => {
        return notifications.filter(n => n.priority === priority);
    },

    getCategoryNotifications: (notifications, category) => {
        return notifications.filter(n => n.category === category);
    },

    sortByDate: (notifications) => {
        return [...notifications].sort((a, b) => new Date(b.date) - new Date(a.date));
    },

    filterUnread: (notifications) => {
        return notifications.filter(n => !n.read);
    }
};
