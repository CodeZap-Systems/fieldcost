'use client';

import { useEffect, useState, useCallback } from 'react';
import { ensureClientUserId } from '@/lib/clientUser';
import { validateEncryptionPassword } from '@/lib/pdfEncryption';
import { BackButton } from '@/app/components/BackButton';

interface CompanySettings {
  id: number;
  name: string;
  email?: string;
  phone?: string;
  address_line1?: string;
  address_line2?: string;
  city?: string;
  province?: string;
  postal_code?: string;
  country?: string;
  logo_url?: string;
  logo_external_url?: string;
  invoice_template?: string;
  default_currency?: string;
  pdf_encryption_enabled?: boolean;
  created_at?: string;
  updated_at?: string;
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<CompanySettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  // PDF Encryption State
  const [encryptionEnabled, setEncryptionEnabled] = useState(false);
  const [encryptionPassword, setEncryptionPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordFeedback, setPasswordFeedback] = useState<string[]>([]);
  const [passwordStrength, setPasswordStrength] = useState<'weak' | 'moderate' | 'strong'>('weak');

  // Invoice Settings State
  const [invoiceTemplate, setInvoiceTemplate] = useState('standard');
  const [defaultCurrency, setDefaultCurrency] = useState('ZAR');

  // Company Info State
  const [companyName, setCompanyName] = useState('');
  const [companyEmail, setCompanyEmail] = useState('');
  const [companyPhone, setCompanyPhone] = useState('');

  useEffect(() => {
    let active = true;
    ensureClientUserId()
      .then(id => {
        if (active) setUserId(id);
      })
      .catch(err => {
        console.error(err);
        if (active) setError('Unable to resolve workspace user.');
      });
    return () => {
      active = false;
    };
  }, []);

  const loadSettings = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/settings?user_id=${userId}`);
      if (!res.ok) throw new Error('Failed to load settings');

      const data = await res.json();
      setSettings(data);
      setCompanyName(data.name || '');
      setCompanyEmail(data.email || '');
      setCompanyPhone(data.phone || '');
      setInvoiceTemplate(data.invoice_template || 'standard');
      setDefaultCurrency(data.default_currency || 'ZAR');
      setEncryptionEnabled(data.pdf_encryption_enabled || false);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'Failed to load settings');
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    loadSettings();
  }, [userId, loadSettings]);

  const validatePassword = useCallback(() => {
    if (!encryptionEnabled) {
      setPasswordError(null);
      setPasswordFeedback([]);
      return true;
    }

    if (!encryptionPassword.trim()) {
      setPasswordError('Password is required when encryption is enabled');
      return false;
    }

    if (encryptionPassword !== confirmPassword) {
      setPasswordError('Passwords do not match');
      return false;
    }

    const validation = validateEncryptionPassword(encryptionPassword);
    setPasswordError(validation.valid ? null : validation.feedback.join(', '));
    setPasswordFeedback(validation.feedback);
    setPasswordStrength(validation.strength);

    return validation.valid;
  }, [encryptionEnabled, encryptionPassword, confirmPassword]);

  useEffect(() => {
    validatePassword();
  }, [encryptionPassword, confirmPassword, encryptionEnabled, validatePassword]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!userId) {
      setError('Workspace context missing');
      return;
    }

    if (encryptionEnabled && !validatePassword()) {
      return;
    }

    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const updatePayload: Record<string, any> = {
        name: companyName,
        email: companyEmail,
        phone: companyPhone,
        invoice_template: invoiceTemplate,
        default_currency: defaultCurrency,
        pdf_encryption_enabled: encryptionEnabled,
      };

      if (encryptionEnabled && encryptionPassword.trim()) {
        updatePayload.pdf_encryption_password = encryptionPassword;
      }

      const res = await fetch(`/api/settings?user_id=${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatePayload),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to save settings');
      }

      const data = await res.json();
      setSettings(data.data);
      setSuccess('Settings saved successfully!');
      setEncryptionPassword('');
      setConfirmPassword('');
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <main className="p-8">
        <div className="text-gray-600">Loading settings...</div>
      </main>
    );
  }

  return (
    <main className="p-8 space-y-8 max-w-4xl">
      {/* Header */}
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-gray-600">Configure workspace preferences and security options.</p>
        </div>
        <BackButton />
      </div>

      {/* Status Messages */}
      {error && (
        <div className="rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-800">
          {error}
        </div>
      )}
      {success && (
        <div className="rounded-lg border border-green-300 bg-green-50 px-4 py-3 text-sm text-green-800">
          {success}
        </div>
      )}

      {/* Settings Form */}
      <form onSubmit={handleSave} className="space-y-8">
        {/* Company Information Section */}
        <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-6 text-gray-900">Company Information</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Company Name</label>
              <input
                type="text"
                value={companyName}
                onChange={e => setCompanyName(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                placeholder="Your company name"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  value={companyEmail}
                  onChange={e => setCompanyEmail(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                  placeholder="company@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                <input
                  type="tel"
                  value={companyPhone}
                  onChange={e => setCompanyPhone(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                  placeholder="+27 (0) 123 456 7890"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Invoice Settings Section */}
        <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-6 text-gray-900">Invoice Settings</h2>
          <div className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">PDF Template</label>
                <select
                  value={invoiceTemplate}
                  onChange={e => setInvoiceTemplate(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                >
                  <option value="standard">Standard</option>
                  <option value="detailed">Detailed</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Default Currency</label>
                <select
                  value={defaultCurrency}
                  onChange={e => setDefaultCurrency(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                >
                  <option value="ZAR">ZAR (South African Rand)</option>
                  <option value="USD">USD (US Dollar)</option>
                  <option value="EUR">EUR (Euro)</option>
                  <option value="GBP">GBP (British Pound)</option>
                  <option value="JPY">JPY (Japanese Yen)</option>
                  <option value="AUD">AUD (Australian Dollar)</option>
                </select>
              </div>
            </div>
          </div>
        </section>

        {/* PDF Security Section */}
        <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-6 text-gray-900">PDF Security</h2>
          <p className="text-sm text-gray-600 mb-6">
            Protect your PDF invoices with password encryption. Recipients will need to enter a password to open the file.
          </p>

          <div className="space-y-6">
            {/* Encryption Toggle */}
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg bg-gray-50">
              <div>
                <label className="block text-sm font-medium text-gray-900">Enable PDF Encryption</label>
                <p className="text-xs text-gray-600 mt-1">Protect invoices with password encryption</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setEncryptionEnabled(!encryptionEnabled);
                  if (encryptionEnabled) {
                    setEncryptionPassword('');
                    setConfirmPassword('');
                    setPasswordError(null);
                  }
                }}
                className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
                  encryptionEnabled ? 'bg-indigo-600' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block size-6 transform rounded-full bg-white transition-transform ${
                    encryptionEnabled ? 'translate-x-7' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* Encryption Password Fields */}
            {encryptionEnabled && (
              <div className="space-y-4 p-4 border border-indigo-200 rounded-lg bg-indigo-50">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Encryption Password</label>
                  <input
                    type="password"
                    value={encryptionPassword}
                    onChange={e => setEncryptionPassword(e.target.value)}
                    placeholder="Enter a strong password"
                    className={`w-full rounded-lg border ${
                      passwordError && encryptionPassword ? 'border-red-300' : 'border-gray-300'
                    } px-4 py-2 text-sm focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-100`}
                  />
                  {encryptionPassword && (
                    <div className="mt-2">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-medium text-gray-600">Password Strength:</span>
                        <span
                          className={`text-xs font-semibold ${
                            passwordStrength === 'strong'
                              ? 'text-green-600'
                              : passwordStrength === 'moderate'
                              ? 'text-yellow-600'
                              : 'text-red-600'
                          }`}
                        >
                          {passwordStrength.charAt(0).toUpperCase() + passwordStrength.slice(1)}
                        </span>
                      </div>
                      <div className="w-full h-1 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all ${
                            passwordStrength === 'strong'
                              ? 'w-full bg-green-600'
                              : passwordStrength === 'moderate'
                              ? 'w-2/3 bg-yellow-500'
                              : 'w-1/3 bg-red-500'
                          }`}
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter the password"
                    className={`w-full rounded-lg border ${
                      passwordError && confirmPassword ? 'border-red-300' : 'border-gray-300'
                    } px-4 py-2 text-sm focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-100`}
                  />
                </div>

                {passwordError && (
                  <div className="text-sm text-red-600 font-medium">{passwordError}</div>
                )}

                {passwordFeedback.length > 0 && !passwordError && (
                  <div className="text-xs text-green-600">
                    {passwordFeedback.join(', ')}
                  </div>
                )}

                <div className="text-xs text-gray-600 bg-white rounded p-3 border border-gray-200">
                  <p className="font-medium mb-1">️ Security Note:</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Recipients must enter this password to open exported PDFs</li>
                    <li>Use a strong password (12+ characters recommended)</li>
                    <li>Store passwords securely and share separately from PDFs</li>
                    <li>This setting applies to all new exports</li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={saving || (encryptionEnabled && !validatePassword())}
            className="px-6 py-2 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {saving ? 'Saving...' : 'Save Settings'}
          </button>
          <button
            type="button"
            onClick={() => loadSettings()}
            disabled={saving}
            className="px-6 py-2 rounded-lg border border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </main>
  );
}
