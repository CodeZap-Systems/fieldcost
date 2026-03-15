/**
 * Company Settings API Endpoint
 * Handles updating company profile settings including PDF encryption preferences
 */

import { NextResponse } from 'next/server';
import { supabaseServer } from '../../../lib/supabaseServer';
import { supabase } from '../../../lib/supabaseClient';
import { resolveServerUserId } from '../../../lib/serverUser';
import { validateEncryptionPassword } from '../../../lib/pdfEncryption';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = await resolveServerUserId(searchParams.get('user_id'));

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Fetch company settings
    const { data: company, error } = await supabaseServer
      .from('company_profiles')
      .select(
        'id, name, email, phone, address_line1, address_line2, city, province, postal_code, country, logo_url, logo_external_url, invoice_template, default_currency, pdf_encryption_enabled, created_at, updated_at'
      )
      .eq('user_id', userId)
      .maybeSingle();

    if (error) {
      console.error('Settings retrieval error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!company) {
      return NextResponse.json({ error: 'Company profile not found' }, { status: 404 });
    }

    return NextResponse.json(company);
  } catch (err) {
    console.error('GET /api/settings error:', err);
    return NextResponse.json({ error: 'Failed to retrieve settings' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = await resolveServerUserId(searchParams.get('user_id'));

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      name,
      email,
      phone,
      address_line1,
      address_line2,
      city,
      province,
      postal_code,
      country,
      logo_url,
      logo_external_url,
      invoice_template,
      default_currency,
      pdf_encryption_enabled,
      pdf_encryption_password,
    } = body;

    // Validate encryption password if provided
    if (pdf_encryption_password !== undefined && pdf_encryption_enabled === true) {
      if (!pdf_encryption_password || !pdf_encryption_password.trim()) {
        return NextResponse.json(
          { error: 'PDF encryption password is required when encryption is enabled' },
          { status: 400 }
        );
      }

      const validation = validateEncryptionPassword(pdf_encryption_password);
      if (!validation.valid) {
        return NextResponse.json(
          {
            error: 'Invalid encryption password',
            feedback: validation.feedback,
          },
          { status: 400 }
        );
      }
    }

    // Prepare update object with provided fields only
    const updateData: Record<string, any> = {
      updated_at: new Date().toISOString(),
    };

    if (name !== undefined) updateData.name = name;
    if (email !== undefined) updateData.email = email;
    if (phone !== undefined) updateData.phone = phone;
    if (address_line1 !== undefined) updateData.address_line1 = address_line1;
    if (address_line2 !== undefined) updateData.address_line2 = address_line2;
    if (city !== undefined) updateData.city = city;
    if (province !== undefined) updateData.province = province;
    if (postal_code !== undefined) updateData.postal_code = postal_code;
    if (country !== undefined) updateData.country = country;
    if (logo_url !== undefined) updateData.logo_url = logo_url;
    if (logo_external_url !== undefined) updateData.logo_external_url = logo_external_url;
    if (invoice_template !== undefined) updateData.invoice_template = invoice_template;
    if (default_currency !== undefined) updateData.default_currency = default_currency;
    if (pdf_encryption_enabled !== undefined) updateData.pdf_encryption_enabled = pdf_encryption_enabled;
    if (pdf_encryption_password !== undefined) {
      // In production, this should be encrypted using a KMS or similar
      // For now, we store it as-is but production would need encryption at rest
      updateData.pdf_encryption_password = pdf_encryption_password;
    }

    // Update company profile
    const { data: updated, error } = await supabaseServer
      .from('company_profiles')
      .update(updateData)
      .eq('user_id', userId)
      .select(
        'id, name, email, phone, address_line1, address_line2, city, province, postal_code, country, logo_url, logo_external_url, invoice_template, default_currency, pdf_encryption_enabled, created_at, updated_at'
      )
      .maybeSingle();

    if (error) {
      console.error('Settings update error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!updated) {
      return NextResponse.json({ error: 'Company profile not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: updated,
    });
  } catch (err) {
    console.error('PATCH /api/settings error:', err);
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 });
  }
}

export const runtime = 'nodejs';
