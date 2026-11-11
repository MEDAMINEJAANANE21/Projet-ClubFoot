/**
 * Accès au localStorage qui ne plante jamais : en navigation privée ou si le stockage
 * est bloqué, les lectures renvoient null et les écritures sont ignorées.
 */
export const safeStorage = {
  read<T>(key: string): T | null {
    try {
      const raw = localStorage.getItem(key);
      return raw === null ? null : (JSON.parse(raw) as T);
    } catch {
      return null;
    }
  },

  write(key: string, value: unknown): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Stockage indisponible : l'état reste en mémoire pour la session en cours.
    }
  },

  remove(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch {
      // Rien à nettoyer si le stockage est inaccessible.
    }
  },
};
