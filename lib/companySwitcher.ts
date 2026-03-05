export const ACTIVE_COMPANY_STORAGE_KEY = "fieldcostActiveCompanyId";

export function readActiveCompanyId() {
  if (typeof window === "undefined") return null;
  const value = window.localStorage.getItem(ACTIVE_COMPANY_STORAGE_KEY);
  return value && value.trim().length ? value : null;
}

export function persistActiveCompanyId(id: string | null) {
  if (typeof window === "undefined") return;
  if (id && id.trim().length) {
    window.localStorage.setItem(ACTIVE_COMPANY_STORAGE_KEY, id.trim());
  } else {
    window.localStorage.removeItem(ACTIVE_COMPANY_STORAGE_KEY);
  }
}
