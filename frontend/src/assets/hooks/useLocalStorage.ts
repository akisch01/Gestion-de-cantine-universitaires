import { useState, useEffect } from "react";

export function useLocalStorage<T>(key: string, initialValue: T) {
  // Récupérer la valeur initiale du localStorage
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error("Erreur lors de la récupération de la valeur du localStorage:", error);
      return initialValue;
    }
  });

  // Mettre à jour le localStorage lorsque la valeur change
  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue));
    } catch (error) {
      console.error("Erreur lors de la sauvegarde de la valeur dans le localStorage:", error);
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue] as const;
}