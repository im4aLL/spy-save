export class BrowserStorage {
    constructor() {
        this.storageMode = 'sessionStorage';
    }

    get storage() {
        return window[this.storageMode];
    }

    setItem(key, value) {
        if (typeof value !== 'string') {
            value = this.convertToString(value);
        }

        this.storage.setItem(key, value);
    }

    getItem(key) {
        return this.storage.getItem(key);
    }

    getJson(key) {
        return JSON.json(this.getItem(key));
    }

    removeItem(key) {
        this.storage.removeItem(key);
    }

    clear() {
        this.storage.clear();
    }

    convertToString(value) {
        return JSON.stringify(value);
    }
}