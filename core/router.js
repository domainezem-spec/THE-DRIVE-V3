/**
 * Router - Simple hash-based router for SPA navigation.
 */
class Router {
    constructor() {
        this.routes = {};
        window.addEventListener('hashchange', () => this.handleHashChange());
    }

    addRoute(path, component, callback = null) {
        this.routes[path] = { component, callback };
    }

    navigateTo(path) {
        window.location.hash = path;
    }

    handleHashChange() {
        const path = window.location.hash.slice(1) || 'dashboard';
        const route = this.routes[path];
        
        // Update Active UI State
        $('.nav-item').removeClass('active-nav');
        $(`.nav-item[data-route="${path}"]`).addClass('active-nav');

        if (route) {
            // Check for Admin Permissions
            const state = JSON.parse(localStorage.getItem('quality_system_state') || '{}');
            const currentUser = state.currentUser;
            
            if (path === 'users' && (!currentUser || currentUser.role !== 'Admin')) {
                this.navigateTo('dashboard');
                return;
            }

            const outlet = document.getElementById('router-outlet');
            if (outlet) {
                outlet.innerHTML = route.component();
                if (route.callback) {
                    route.callback();
                }
            }
            
            // Scroll to top
            window.scrollTo(0, 0);
        }
    }

    init() {
        this.handleHashChange();
    }
}

export const router = new Router();
