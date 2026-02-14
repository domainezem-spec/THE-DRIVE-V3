/**
 * AuthService - Handles user authentication and permissions.
 */
import { stateManager } from './stateManager.js';

class AuthService {
    constructor() {
        this.sessionKey = 'drive2_session';
    }

    async login(username, password, users) {
        console.log('Attempting login for:', username, 'with users list:', users);
        const user = users.find(u => {
            const identifier = (u.email || u.username || '').toString().trim().toLowerCase();
            return identifier === String(username).trim().toLowerCase() && String(u.password) == String(password);
        });
        if (user && (!user.status || String(user.status).toLowerCase() === 'active' || user.status === '')) {
            const sessionData = {
                user: user,
                expiry: Date.now() + (30 * 60 * 1000) // 30 minutes
            };
            localStorage.setItem(this.sessionKey, JSON.stringify(sessionData));
            stateManager.setCurrentUser(user);
            return true;
        }
        return false;
    }

    logout() {
        localStorage.removeItem(this.sessionKey);
        stateManager.setCurrentUser(null);
    }

    checkSession() {
        const sessionStr = localStorage.getItem(this.sessionKey);
        if (!sessionStr) return null;

        const session = JSON.parse(sessionStr);
        if (Date.now() > session.expiry) {
            this.logout();
            return null;
        }

        stateManager.setCurrentUser(session.user);
        return session.user;
    }

    canAccess(roleRequired) {
        const user = stateManager.getState().currentUser;
        if (!user) return false;
        if (user.role === 'Admin') return true;
        return user.role === roleRequired;
    }

    canAccessWithPermission(permission) {
        const user = stateManager.getState().currentUser;
        if (!user) return false;
        if (user.role === 'Admin') return true;
        
        const perms = (user.access || '').toLowerCase().split(',');
        return perms.includes(permission.toLowerCase()) || perms.includes('all');
    }

    setupAutoLogout() {
        let timer;
        const resetTimer = () => {
            clearTimeout(timer);
            timer = setTimeout(() => {
                Swal.fire({
                    title: 'انتهت الجلسة',
                    text: 'تم تسجيل الخروج تلقائياً لعدم النشاط لحماية بياناتك',
                    icon: 'warning',
                    confirmButtonText: 'حسناً'
                }).then(() => {
                    this.logout();
                    location.reload();
                });
            }, 30 * 60 * 1000); // 30 minutes
        };

        window.onload = resetTimer;
        window.onmousemove = resetTimer;
        window.onmousedown = resetTimer;
        window.ontouchstart = resetTimer;
        window.onclick = resetTimer;
        window.onkeydown = resetTimer;
    }
}

export const authService = new AuthService();
