/**
 * Test Seed Client Utility
 * 
 * Provides convenient functions to seed test data via the /api/test/seed endpoint.
 * Useful for:
 * - Setting up test data before test suites
 * - Clearing data between test runs
 * - Seeding specific modules for targeted testing
 * 
 * Usage:
 * import { seedTestData, clearTestData } from '@tests/helpers/seed';
 * 
 * await seedTestData();           // Seed all test data
 * await seedTestData('projects'); // Seed only projects
 * await clearTestData();          // Clear all, then seed
 */

interface SeedResponse {
  success: boolean;
  message?: string;
  error?: string;
  details?: Record<string, any>;
  testCredentials?: {
    admin: { email: string; password: string };
    pm: { email: string; password: string };
    fieldCrew: { email: string; password: string };
    accountant: { email: string; password: string };
  };
}

interface SeedOptions {
  baseURL?: string;
  clear?: boolean;
  timeout?: number;
}

const DEFAULT_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
const DEFAULT_TIMEOUT = 60000; // 60 seconds

/**
 * Seed all test data
 * 
 * @example
 * const result = await seedTestData();
 * console.log(result.testCredentials.admin); // { email: '...', password: '...' }
 */
export async function seedTestData(
  module?: 'users' | 'companies' | 'projects' | 'invoices' | 'tasks' | 'customers' | 'inventory' | 'all',
  options: SeedOptions = {}
): Promise<SeedResponse> {
  const { baseURL = DEFAULT_BASE_URL, clear = false, timeout = DEFAULT_TIMEOUT } = options;

  const params = new URLSearchParams();
  if (module) params.append('module', module);
  if (clear) params.append('clear', 'true');

  const url = `${baseURL}/api/test/seed?${params.toString()}`;

  console.log(`🌱 Seeding test data${module ? ` (${module} only)` : ''}...`);

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Seed failed (${response.status}): ${error.error || error.message}`);
    }

    const result: SeedResponse = await response.json();

    if (result.success) {
      console.log('✅ Test data seeded successfully');
      if (result.details?.users?.count) {
        console.log(`   - ${result.details.users.count} users`);
      }
      if (result.details?.companies?.count) {
        console.log(`   - ${result.details.companies.count} companies`);
      }
      if (result.details?.projects?.count) {
        console.log(`   - ${result.details.projects.count} projects`);
      }
    }

    return result;
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error(`Seed request timed out after ${timeout}ms`);
    }
    throw error;
  }
}

/**
 * Clear all test data then reseed
 * 
 * @example
 * await clearAndReseedTestData();
 */
export async function clearAndReseedTestData(
  module?: 'users' | 'companies' | 'projects' | 'invoices' | 'tasks' | 'customers' | 'inventory' | 'all',
  options: SeedOptions = {}
): Promise<SeedResponse> {
  console.log('🗑️  Clearing test data...');
  return seedTestData(module, { ...options, clear: true });
}

/**
 * Get seed endpoint info
 * 
 * @example
 * const info = await getSeedInfo();
 * console.log(info.examples); // All available examples
 */
export async function getSeedInfo(baseURL: string = DEFAULT_BASE_URL): Promise<any> {
  const url = `${baseURL}/api/test/seed`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to get seed info (${response.status})`);
    }

    return response.json();
  } catch (error) {
    console.error('Failed to get seed info:', error);
    throw error;
  }
}

/**
 * Test seed availability
 * Useful for checking if endpoint exists before usage
 */
export async function testSeedEndpoint(baseURL: string = DEFAULT_BASE_URL): Promise<boolean> {
  try {
    const response = await fetch(`${baseURL}/api/test/seed`, {
      method: 'GET',
    });
    return response.ok;
  } catch (error) {
    return false;
  }
}

/**
 * Get test credentials from seed
 * 
 * @example
 * const credentials = await getTestCredentials();
 * const adminEmail = credentials.admin.email;
 */
export async function getTestCredentials(
  baseURL: string = DEFAULT_BASE_URL
): Promise<{
  admin: { email: string; password: string };
  pm: { email: string; password: string };
  fieldCrew: { email: string; password: string };
  accountant: { email: string; password: string };
} | null> {
  try {
    const result = await seedTestData('all', { baseURL });
    return result.testCredentials || null;
  } catch (error) {
    console.error('Failed to get test credentials:', error);
    return null;
  }
}

/**
 * Batch seed with retry logic
 * Useful for CI/CD where network might be unstable
 */
export async function seedWithRetry(
  module?: string,
  maxRetries: number = 3,
  delayMs: number = 1000
): Promise<SeedResponse> {
  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`Seed attempt ${attempt}/${maxRetries}...`);
      return await seedTestData(module as any);
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      console.warn(`❌ Attempt ${attempt} failed: ${lastError.message}`);

      if (attempt < maxRetries) {
        await new Promise((resolve) => setTimeout(resolve, delayMs * attempt));
      }
    }
  }

  throw new Error(`Seed failed after ${maxRetries} attempts: ${lastError?.message}`);
}

// Export default object with all functions
export default {
  seed: seedTestData,
  clearAndReseed: clearAndReseedTestData,
  getInfo: getSeedInfo,
  testEndpoint: testSeedEndpoint,
  getCredentials: getTestCredentials,
  seedWithRetry,
};
