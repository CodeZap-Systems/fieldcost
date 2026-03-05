import { readStore, writeStore } from './dataStore';

export type RegistrationEntry = {
  email: string;
  companyName: string;
  role: string;
  status: 'pending' | 'confirmed';
  registeredAt: string;
  confirmedAt?: string;
};

type RegistrationStore = Record<string, RegistrationEntry>;

const FILE_NAME = 'registrations.json';

export async function recordRegistration(entry: RegistrationEntry) {
  const store = await readStore<RegistrationStore>(FILE_NAME, {});
  store[entry.email.toLowerCase()] = entry;
  await writeStore(FILE_NAME, store);
  return entry;
}

export async function markRegistrationConfirmed(email: string) {
  const store = await readStore<RegistrationStore>(FILE_NAME, {});
  const key = email.toLowerCase();
  const existing = store[key];
  if (!existing) {
    return null;
  }
  const updated: RegistrationEntry = {
    ...existing,
    status: 'confirmed',
    confirmedAt: new Date().toISOString(),
  };
  store[key] = updated;
  await writeStore(FILE_NAME, store);
  return updated;
}
