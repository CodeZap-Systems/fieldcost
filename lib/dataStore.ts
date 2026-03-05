import { promises as fs } from 'node:fs';
import path from 'node:path';

const DATA_DIR = path.join(process.cwd(), 'data');

async function ensureDir() {
  await fs.mkdir(DATA_DIR, { recursive: true });
}

async function getFilePath(fileName: string) {
  await ensureDir();
  return path.join(DATA_DIR, fileName);
}

export async function readStore<T>(fileName: string, fallback: T): Promise<T> {
  try {
    const filePath = await getFilePath(fileName);
    const payload = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(payload) as T;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      return fallback;
    }
    throw error;
  }
}

export async function writeStore<T>(fileName: string, value: T): Promise<void> {
  const filePath = await getFilePath(fileName);
  await fs.writeFile(filePath, JSON.stringify(value, null, 2), 'utf-8');
}
