/**
 * StateManager - Manages the global state of the application.
 */
class StateManager {
    constructor() {
        this.state = {
            currentUser: null,
            currentData: {},
            activeTab: 'dashboard',
            isOffline: !navigator.onLine,
            pendingOps: []
        };
        this.listeners = [];
    }

    setState(newState) {
        this.state = { ...this.state, ...newState };
        // Sync to localStorage for router permission checks
        localStorage.setItem('quality_system_state', JSON.stringify(this.state));
        this.notify();
    }

    getState() {
        return this.state;
    }

    subscribe(listener) {
        this.listeners.push(listener);
        return () => {
            this.listeners = this.listeners.filter(l => l !== listener);
        };
    }

    notify() {
        this.listeners.forEach(listener => listener(this.state));
    }

    setCurrentUser(user) {
        this.setState({ currentUser: user });
    }

    setCurrentData(data) {
        this.setState({ currentData: data });
    }

    setActiveTab(tabId) {
        this.setState({ activeTab: tabId });
    }

    setOfflineStatus(status) {
        this.setState({ isOffline: status });
    }
}

export const stateManager = new StateManager();
