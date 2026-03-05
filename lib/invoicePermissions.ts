export const canMutateInvoices = (role?: string | null) => {
  if (!role) return true;
  return role === "admin" || role === "demo" || role === "subcontractor";
};
