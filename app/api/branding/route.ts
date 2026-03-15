// app/api/branding/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { BrandingSettings } from '@/lib/BrandingSettings';
import { supabaseServer } from '@/lib/supabaseServer';
import { getCompanyContext } from '@/lib/companyContext';

export async function GET(req: NextRequest) {
  const companyId = req.nextUrl.searchParams.get('companyId');
  const userId = req.nextUrl.searchParams.get('userId');
  if (!companyId || !userId) return NextResponse.json({ error: 'Missing companyId or userId' }, { status: 400 });
  try {
    await getCompanyContext(userId, companyId); // Validates access
    const { data, error } = await supabaseServer
      .from('company_profiles')
      .select('id, logo_url, favicon_url, color_palette, font_family, terminology, app_name, icon_set, email_templates')
      .eq('id', companyId)
      .maybeSingle();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    if (!data) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    // Map DB fields to BrandingSettings
    const branding: BrandingSettings = {
      companyId: data.id.toString(),
      logoUrl: data.logo_url || '',
      faviconUrl: data.favicon_url || '',
      colorPalette: data.color_palette || {},
      fontFamily: data.font_family || '',
      terminology: data.terminology || {},
      appName: data.app_name || '',
      iconSet: data.icon_set || '',
      emailTemplates: data.email_templates || { header: '', footer: '', login: '' },
    };
    return NextResponse.json(branding);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to fetch branding' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const data = await req.json();
  const { companyId, logoUrl, faviconUrl, colorPalette, fontFamily, terminology, appName, iconSet, emailTemplates } = data;
  const userId = req.nextUrl.searchParams.get('userId');
  if (!companyId || !userId) return NextResponse.json({ error: 'Missing companyId or userId' }, { status: 400 });
  try {
    await getCompanyContext(userId, companyId);
    const { error } = await supabaseServer
      .from('company_profiles')
      .update({
        logo_url: logoUrl,
        favicon_url: faviconUrl,
        color_palette: colorPalette,
        font_family: fontFamily,
        terminology,
        app_name: appName,
        icon_set: iconSet,
        email_templates: emailTemplates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', companyId);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to save branding' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  const data = await req.json();
  const { companyId, ...fields } = data;
  const userId = req.nextUrl.searchParams.get('userId');
  if (!companyId || !userId) return NextResponse.json({ error: 'Missing companyId or userId' }, { status: 400 });
  try {
    await getCompanyContext(userId, companyId);
    const updateFields: Record<string, any> = { updated_at: new Date().toISOString() };
    if (fields.logoUrl !== undefined) updateFields.logo_url = fields.logoUrl;
    if (fields.faviconUrl !== undefined) updateFields.favicon_url = fields.faviconUrl;
    if (fields.colorPalette !== undefined) updateFields.color_palette = fields.colorPalette;
    if (fields.fontFamily !== undefined) updateFields.font_family = fields.fontFamily;
    if (fields.terminology !== undefined) updateFields.terminology = fields.terminology;
    if (fields.appName !== undefined) updateFields.app_name = fields.appName;
    if (fields.iconSet !== undefined) updateFields.icon_set = fields.iconSet;
    if (fields.emailTemplates !== undefined) updateFields.email_templates = fields.emailTemplates;
    const { error } = await supabaseServer
      .from('company_profiles')
      .update(updateFields)
      .eq('id', companyId);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to update branding' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const companyId = req.nextUrl.searchParams.get('companyId');
  const userId = req.nextUrl.searchParams.get('userId');
  if (!companyId || !userId) return NextResponse.json({ error: 'Missing companyId or userId' }, { status: 400 });
  try {
    await getCompanyContext(userId, companyId);
    // Clear branding fields only, do not delete company
    const { error } = await supabaseServer
      .from('company_profiles')
      .update({
        logo_url: null,
        favicon_url: null,
        color_palette: null,
        font_family: null,
        terminology: null,
        app_name: null,
        icon_set: null,
        email_templates: null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', companyId);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to clear branding' }, { status: 500 });
  }
}
