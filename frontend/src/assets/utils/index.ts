// Fonctions utilitaires globales

// Gestion du stockage local
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

// Formatage des dates
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

// Téléchargement de fichiers
export function downloadBlob(blob: Blob, filename: string) {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
}

// Validation des formulaires
export function validateEmail(email: string): boolean {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

export function validatePassword(password: string): boolean {
    return password.length >= 8;
}

// Gestion des erreurs
export function handleError(error: unknown): string {
    if (error && typeof error === 'object' && 'response' in error) {
        const err = error as { response?: { data?: { message?: string } } };
        if (err.response?.data?.message) {
            return err.response.data.message;
        }
    }
    return "Une erreur est survenue. Veuillez réessayer.";
}

// Gestion des notifications
export function showNotification(_message: string, _type: "success" | "error" | "warning" | "info") {
    // Cette fonction est dépréciée, utilisez le hook useNotification à la place
    console.warn("showNotification est dépréciée, utilisez le hook useNotification à la place");
}

// Gestion des permissions
export function hasPermission(userRole: string, requiredRole: string): boolean {
    return userRole === requiredRole;
}

// Gestion des URLs
export function buildApiUrl(path: string): string {
    return `${import.meta.env.VITE_API_URL || "http://localhost:8000/api"}${path}`;
}

// Gestion des chaînes de caractères
export function truncateString(str: string, maxLength: number): string {
    if (str.length <= maxLength) return str;
    return str.slice(0, maxLength) + "...";
}

// Gestion des nombres
export function formatPrice(price: number): string {
    return price.toFixed(2) + " €";
}

// Gestion des tableaux
export function chunkArray<T>(array: T[], size: number): T[][] {
    const chunks: T[][] = [];
    for (let i = 0; i < array.length; i += size) {
        chunks.push(array.slice(i, i + size));
    }
    return chunks;
}

// Gestion des objets
export function deepClone<T>(obj: T): T {
    return JSON.parse(JSON.stringify(obj));
}

// Gestion des promesses
export function sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

// Gestion des événements
export function debounce<T extends (...args: unknown[]) => unknown>(
    func: T,
    wait: number
): (...args: Parameters<T>) => void {
    let timeout: NodeJS.Timeout;
    return (...args: Parameters<T>) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), wait);
    };
}

// Gestion des styles
export function cn(...classes: (string | undefined | null | false)[]): string {
    return classes.filter(Boolean).join(" ");
}