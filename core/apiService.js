// Google Apps Script Deployment URL
const BASE_URL = 'https://script.google.com/macros/s/AKfycbwdN8lMn9eSWvJVYUDdRhJ-zRR62USAHMVL5WUfGFxVEqlxuNpmkhRx5sPRZfSQxOY_/exec';

/**
 * ApiService - Handles all communications with the Google Apps Script backend.
 */
class ApiService {
  constructor() {
    this.scriptUrl = BASE_URL;
    this.timeout = 25000; // Increased to 25s for slower GAS starts
  }

  setScriptUrl(url) {
    this.scriptUrl = url;
  }

  async fetchWithTimeout(url, options = {}) {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), this.timeout);
    
    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal
      });
      clearTimeout(id);
      return response;
    } catch (error) {
      clearTimeout(id);
      throw error;
    }
  }

  /**
   * Submit data to the backend
   */
  async submitData(type, data = null, action = null) {
    if (!this.scriptUrl) throw new Error("رابط السيرفر غير معرف");
    try {
      let payload;
      if (data === null) {
        payload = { ...type };
      } else {
        payload = { ...data, type: type };
      }

      // Action precedence: 1. Argument, 2. Payload, 3. Default 'save'
      payload.action = action || payload.action || 'save';

      await fetch(this.scriptUrl, {
        method: "POST",
        mode: "no-cors",
        cache: "no-cache",
        headers: {
            "Content-Type": "text/plain;charset=utf-8",
        },
        body: JSON.stringify(payload),
      });
      
      return { success: true };
    } catch (error) {
      console.error("Submit error:", error);
      throw new Error("فشل في حفظ البيانات. يرجى المحاولة مرة أخرى.");
    }
  }

  /**
   * Fetch all data from the backend
   */
  async fetchData() {
    if (!this.scriptUrl) return null;
    try {
      const response = await this.fetchWithTimeout(`${this.scriptUrl}?action=getSystemData&_nc=${Date.now()}`, {
        method: "GET"
      });
      if (!response.ok) throw new Error("Network response was not ok");
      const result = await response.json();
      return result;
    } catch (error) {
      console.error("Fetch error:", error);
      return null;
    }
  }

  /**
   * Check if the backend is responsive
   */
  async checkServerStatus() {
    if (!this.scriptUrl) return false;
    try {
      // Use a simple fetch, if it doesn't throw it's likely alive
      const response = await this.fetchWithTimeout(`${this.scriptUrl}?_nc=${Date.now()}`, {
        method: "GET",
        mode: "no-cors" // Use no-cors to avoid preflight/CORS issues for simple check
      });
      // With no-cors, we can't check response.ok, but if we got here, the request was sent
      return true;
    } catch (error) {
      return false;
    }
  }
}

export const apiService = new ApiService();
