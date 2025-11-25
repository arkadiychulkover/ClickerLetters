export function AddValue(key, value) {
    if (localStorage.getItem(key) !== null) {
        return false;
    }
    localStorage.setItem(key, JSON.stringify(value));
    return true;
}

export function ChangeValue(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
}

export function GetValue(key) {
    const item = localStorage.getItem(key);
    if (item === null) return null;
    return JSON.parse(item);
}

export function ClearStorage() {
    localStorage.clear();
    return true;
}
