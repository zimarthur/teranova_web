const REFRESH_KEY = "teranova.refreshToken";
const CLINIC_KEY = "teranova.selectedClinicId";
const RESET_EMAIL_KEY = "teranova.resetEmail";

let accessToken: string | null = null;
const listeners = new Set<() => void>();

const notify = () => {
  listeners.forEach((listener) => listener());
};

export const sessionStore = {
  getAccess: () => accessToken,
  getRefresh: () => localStorage.getItem(REFRESH_KEY),
  setSession(access: string, refresh: string) {
    accessToken = access;
    localStorage.setItem(REFRESH_KEY, refresh);
    notify();
  },
  setAccess(access: string) {
    accessToken = access;
  },
  clear() {
    accessToken = null;
    localStorage.removeItem(REFRESH_KEY);
    localStorage.removeItem(CLINIC_KEY);
    notify();
  },
  getClinicId: () => localStorage.getItem(CLINIC_KEY),
  setClinicId(id: string | null) {
    if (id) localStorage.setItem(CLINIC_KEY, id);
    else localStorage.removeItem(CLINIC_KEY);
  },
  getResetEmail: () => sessionStorage.getItem(RESET_EMAIL_KEY),
  setResetEmail(email: string | null) {
    if (email) sessionStorage.setItem(RESET_EMAIL_KEY, email);
    else sessionStorage.removeItem(RESET_EMAIL_KEY);
  },
  subscribe(listener: () => void) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
};
