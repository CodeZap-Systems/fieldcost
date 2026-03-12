import { createHash } from 'crypto';

/**
 * Generate a deterministic UUID for demo users
 * Same input always generates the same UUID
 * Based on UUID v5 (namespace-based) approach using SHA1
 */
export function getDemoUserUUID(demoUserName: string): string {
  // Use a namespace UUID for FieldCost demo users (RFC 4122 v5)
  // Namespace: FieldCost Demo (a custom namespace UUID)
  const FIELDCOST_DEMO_NAMESPACE_BYTES = Buffer.from([
    0x55, 0x0e, 0x84, 0x00, 0xe2, 0x9b, 0x41, 0xd4,
    0xa7, 0x16, 0x44, 0x66, 0x55, 0x44, 0x00, 0x00
  ]);
  
  // Create SHA1 hash of namespace + name
  const hash = createHash('sha1');
  hash.update(Buffer.concat([FIELDCOST_DEMO_NAMESPACE_BYTES, Buffer.from(demoUserName)]));
  const digest = hash.digest();

  // Set version to 5 (SHA1) by setting bits 12-15 of time_hi_and_version to 0101
  digest[6] = (digest[6] & 0x0f) | 0x50;
  
  // Set variant to RFC 4122 by setting bits 6-7 of clock_seq_hi_and_reserved to 10
  digest[8] = (digest[8] & 0x3f) | 0x80;

  // Format as UUID string: 8-4-4-4-12
  const hex = digest.toString('hex');
  const uuid = `${hex.substring(0, 8)}-${hex.substring(8, 12)}-${hex.substring(12, 16)}-${hex.substring(16, 20)}-${hex.substring(20, 32)}`;
  
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
