// app/api/verticals/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { VerticalPackage } from '@/lib/VerticalPackage';

// Demo: Predefined verticals (would be in DB in production)
const verticals: VerticalPackage[] = [
  {
    id: 'civil',
    name: 'Civil Engineering',
    description: 'Civil works, earthworks, drainage, foundations',
    iconSet: 'civil',
    customFields: [],
    workflows: [],
    reports: [],
    terminology: { project: 'Job', crew: 'Team' },
    complianceRules: []
  },
  {
    id: 'mining',
    name: 'Mining Operations',
    description: 'Equipment, fuel, production, safety',
    iconSet: 'mining',
    customFields: [],
    workflows: [],
    reports: [],
    terminology: { project: 'Pit', crew: 'Shift' },
    complianceRules: []
  },
  {
    id: 'realestate',
    name: 'Commercial Real Estate',
    description: 'Multi-phase, client management, sustainability',
    iconSet: 'realestate',
    customFields: [],
    workflows: [],
    reports: [],
    terminology: { project: 'Development', crew: 'Contractor' },
    complianceRules: []
  },
  {
    id: 'utility',
    name: 'Utility Contractor',
    description: 'Network mapping, dispatch, service orders',
    iconSet: 'utility',
    customFields: [],
    workflows: [],
    reports: [],
    terminology: { project: 'Service', crew: 'Crew' },
    complianceRules: []
  }
];

// In-memory store for company vertical activations
const companyVerticals: Record<string, string[]> = {};

export async function GET(req: NextRequest) {
  // List all verticals and which are active for the company
  const companyId = req.nextUrl.searchParams.get('companyId');
  if (!companyId) return NextResponse.json({ error: 'Missing companyId' }, { status: 400 });
  const active = companyVerticals[companyId] || [];
  return NextResponse.json({ verticals, active });
}

export async function POST(req: NextRequest) {
  // Activate a vertical for a company
  const { companyId, verticalId } = await req.json();
  if (!companyId || !verticalId) return NextResponse.json({ error: 'Missing companyId or verticalId' }, { status: 400 });
  if (!companyVerticals[companyId]) companyVerticals[companyId] = [];
  if (!companyVerticals[companyId].includes(verticalId)) companyVerticals[companyId].push(verticalId);
  return NextResponse.json({ success: true });
}

export async function DELETE(req: NextRequest) {
  // Deactivate a vertical for a company
  const companyId = req.nextUrl.searchParams.get('companyId');
  const verticalId = req.nextUrl.searchParams.get('verticalId');
  if (!companyId || !verticalId) return NextResponse.json({ error: 'Missing companyId or verticalId' }, { status: 400 });
  companyVerticals[companyId] = (companyVerticals[companyId] || []).filter(v => v !== verticalId);
  return NextResponse.json({ success: true });
}
