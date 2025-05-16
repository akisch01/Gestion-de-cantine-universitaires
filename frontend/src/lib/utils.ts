// Fonctions utilitaires globales
export function cn(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export function saveToStorage<T>(key: string, value: T): void {
    localStorage.setItem(key, JSON.stringify(value));
}

export function getFromStorage<T>(key: string): T | null {
    const value = localStorage.getItem(key);
    if (!value) return null;
    try {
      return JSON.parse(value) as T;
    } catch {
      return null;
    }
}

export function removeFromStorage(key: string) {
    localStorage.removeItem(key);
}

export function formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
}

export function downloadBlob(blob: Blob, filename: string) {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
}