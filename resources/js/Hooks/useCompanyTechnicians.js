import { useState, useEffect } from 'react';

export const EMPLOYEES_STORAGE_KEY = 'company_employees_data_v1';

export function getAllStoredCompanyTechnicians(initialFallback = []) {
  if (typeof window === 'undefined') return initialFallback;
  try {
    const saved = localStorage.getItem(EMPLOYEES_STORAGE_KEY);
    if (saved !== null) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Failed to read stored technicians from localStorage:', e);
  }
  return initialFallback;
}

export function getActiveCompanyTechnicians(initialFallback = []) {
  const all = getAllStoredCompanyTechnicians(initialFallback);
  return all.filter((t) => t.status !== 'inactive' && t.status !== 'deleted');
}

export function notifyCompanyTechniciansUpdated() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('company_technicians_updated'));
  }
}

export function useCompanyTechnicians(initialFallback = []) {
  const [technicians, setTechniciansState] = useState(() =>
    getAllStoredCompanyTechnicians(initialFallback)
  );

  useEffect(() => {
    const handleSync = () => {
      setTechniciansState(getAllStoredCompanyTechnicians(initialFallback));
    };

    window.addEventListener('storage', handleSync);
    window.addEventListener('company_technicians_updated', handleSync);

    return () => {
      window.removeEventListener('storage', handleSync);
      window.removeEventListener('company_technicians_updated', handleSync);
    };
  }, []);

  const setTechnicians = (action) => {
    setTechniciansState((prev) => {
      const updated = typeof action === 'function' ? action(prev) : action;
      if (typeof window !== 'undefined') {
        localStorage.setItem(EMPLOYEES_STORAGE_KEY, JSON.stringify(updated));
        notifyCompanyTechniciansUpdated();
      }
      return updated;
    });
  };

  const activeTechnicians = technicians.filter(
    (t) => t.status !== 'inactive' && t.status !== 'deleted'
  );

  return {
    technicians,
    activeTechnicians,
    setTechnicians,
  };
}
