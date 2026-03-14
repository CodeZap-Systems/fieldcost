/**
 * Test Company Generator Helper
 * Creates test companies for multi-company testing
 */

export interface TestCompany {
  id?: string;
  name: string;
  registrationNumber: string;
  taxNumber: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
}

/**
 * Generate a unique test company
 */
export function generateTestCompany(overrides?: Partial<TestCompany>): TestCompany {
  const timestamp = Date.now();
  return {
    name: `Test Company ${timestamp}`,
    registrationNumber: `REG${timestamp}`,
    taxNumber: `TAX${timestamp}`,
    email: `company_${timestamp}@fieldcost.com`,
    phone: '+27111234567',
    address: '123 Test Street',
    city: 'Johannesburg',
    postalCode: '2000',
    country: 'South Africa',
    ...overrides,
  };
}

/**
 * Generate multiple test companies
 */
export function generateTestCompanies(count: number): TestCompany[] {
  return Array.from({ length: count }, (_, i) => 
    generateTestCompany({
      name: `Test Company ${i + 1}`,
      registrationNumber: `REG${i + 1}`,
      taxNumber: `TAX${i + 1}`,
      email: `company_${i + 1}@fieldcost.com`,
    })
  );
}

/**
 * Get sample contractor company
 */
export function getSampleContractorCompany(): TestCompany {
  return {
    name: 'ABC Construction (Pty) Ltd',
    registrationNumber: '2023/ABC001',
    taxNumber: '9876543210',
    email: 'info@abcconstruction.co.za',
    phone: '+27114455667',
    address: '456 Builder Avenue',
    city: 'Cape Town',
    postalCode: '8001',
    country: 'South Africa',
  };
}

/**
 * Get sample mining company
 */
export function getSampleMiningCompany(): TestCompany {
  return {
    name: 'XYZ Mining Solutions',
    registrationNumber: '2024/XYZ001',
    taxNumber: '1234567890',
    email: 'operations@xyzmining.co.za',
    phone: '+27114455668',
    address: '789 Mining Road',
    city: 'Johannesburg',
    postalCode: '2100',
    country: 'South Africa',
  };
}

/**
 * Validate test company structure
 */
export function validateTestCompany(company: TestCompany): boolean {
  return (
    company.name &&
    company.registrationNumber &&
    company.taxNumber &&
    company.email &&
    company.phone &&
    company.address &&
    company.city &&
    company.postalCode
  );
}

/**
 * Generate company with specific tier
 */
export function generateCompanyForTier(tier: 'tier1' | 'tier2' | 'tier3'): TestCompany {
  const baseCompany = generateTestCompany();
  
  switch (tier) {
    case 'tier1':
      return {
        ...baseCompany,
        name: `Small Contractor ${Date.now()}`,
        phone: '+27111111111',
      };
    case 'tier2':
      return {
        ...baseCompany,
        name: `Mid-Market Contractor ${Date.now()}`,
        phone: '+27222222222',
      };
    case 'tier3':
      return {
        ...baseCompany,
        name: `Enterprise Group ${Date.now()}`,
        phone: '+27333333333',
      };
    default:
      return baseCompany;
  }
}
