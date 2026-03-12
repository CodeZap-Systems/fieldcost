import crypto from 'crypto';

function getDemoUserUUID(demoUserName) {
  const FIELDCOST_DEMO_NAMESPACE_BYTES = Buffer.from([
    0x55, 0x0e, 0x84, 0x00, 0xe2, 0x9b, 0x41, 0xd4,
    0xa7, 0x16, 0x44, 0x66, 0x55, 0x44, 0x00, 0x00
  ]);
  
  const hash = crypto.createHash('sha1');
  hash.update(Buffer.concat([FIELDCOST_DEMO_NAMESPACE_BYTES, Buffer.from(demoUserName)]));
  const digest = hash.digest();

  digest[6] = (digest[6] & 0x0f) | 0x50;
  digest[8] = (digest[8] & 0x3f) | 0x80;

  const hex = digest.toString('hex');
  const uuid = `${hex.substring(0, 8)}-${hex.substring(8, 12)}-${hex.substring(12, 16)}-${hex.substring(16, 20)}-${hex.substring(20, 32)}`;
  
  return uuid.toLowerCase();
}

const testUsers = ['demo', 'demo-live-test', 'demo-admin', 'demo-diagnostic-user'];
const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

console.log('Testing UUID Generation:\n');
testUsers.forEach(user => {
  const uuid = getDemoUserUUID(user);
  const isValid = uuidRegex.test(uuid);
  console.log(`${user.padEnd(20)} ${uuid}   ${isValid ? '✅ valid' : '❌ invalid'}`);
});
