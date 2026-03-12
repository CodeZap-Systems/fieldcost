import { createHash } from 'crypto';

/**
 * Generate a deterministic UUID for demo users
 * Same input always generates the same UUID
 * Based on UUID v5 (namespace-based) approach
 */
export function getDemoUserUUID(demoUserName: string): string {
  // Use a namespace for FieldCost demo users
  const FIELDCOST_DEMO_NAMESPACE = '550e8400-e29b-41d4-a716-446655440000';
  
  // Create a deterministic UUID from the demo user name
  // This ensures "demo" always maps to the same UUID
  const hash = createHash('sha1');
  hash.update(FIELDCOST_DEMO_NAMESPACE + demoUserName);
  const digest = hash.digest();

  // Format as UUID v5: 8-4-4-4-12
  const uuid = `${digest.toString('hex', 0, 4)}-${digest.toString('hex', 4, 6)}-5${digest.toString('hex', 7, 10)}-${(0x80 | (digest[10] & 0x3f)).toString(16).padStart(2, '0')}${digest.toString('hex', 11, 12)}-${digest.toString('hex', 12, 18)}`;
  
  return uuid.toLowerCase();
}

/**
 * Get the user ID - either a UUID (if demo user) or the original ID
 * This is used when calling Supabase auth methods that require UUIDs
 */
export function normalizeUserId(userId: string): string {
  if (!userId) return '';
  
  // Check if it's already a UUID
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (uuidRegex.test(userId)) {
    return userId;
  }
  
  // If it's a demo user (starts with "demo"), convert to deterministic UUID
  if (userId.startsWith('demo')) {
    return getDemoUserUUID(userId);
  }
  
  // Otherwise return as-is (might be invalid for non-demo users)
  return userId;
}

/**
 * Known demo users and their UUIDs
 */
export const DEMO_USER_UUIDS: Record<string, string> = {
  'demo': getDemoUserUUID('demo'),
  'demo-live-test': getDemoUserUUID('demo-live-test'),
  'demo-admin': getDemoUserUUID('demo-admin'),
  'demo-subcontractor': getDemoUserUUID('demo-subcontractor'),
  'demo-diagnostic-user': getDemoUserUUID('demo-diagnostic-user'),
};

// Log the mappings for debugging
console.log('[demoUserUUIDs] Loaded demo user UUID mappings:');
Object.entries(DEMO_USER_UUIDS).forEach(([name, uuid]) => {
  console.log(`  ${name} → ${uuid}`);
});
