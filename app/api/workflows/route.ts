// app/api/workflows/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { WorkflowDefinition } from '@/lib/WorkflowDefinition';

// In-memory store for demo (replace with DB in production)
const workflowStore: Record<string, WorkflowDefinition[]> = {};

export async function GET(req: NextRequest) {
  const companyId = req.nextUrl.searchParams.get('companyId');
  if (!companyId) return NextResponse.json({ error: 'Missing companyId' }, { status: 400 });
  return NextResponse.json(workflowStore[companyId] || []);
}

export async function POST(req: NextRequest) {
  const data = await req.json();
  if (!data.companyId) return NextResponse.json({ error: 'Missing companyId' }, { status: 400 });
  if (!workflowStore[data.companyId]) workflowStore[data.companyId] = [];
  workflowStore[data.companyId].push(data);
  return NextResponse.json({ success: true });
}

export async function PATCH(req: NextRequest) {
  const data = await req.json();
  if (!data.companyId || !data.id) return NextResponse.json({ error: 'Missing companyId or id' }, { status: 400 });
  const workflows = workflowStore[data.companyId] || [];
  const idx = workflows.findIndex(w => w.id === data.id);
  if (idx === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  workflows[idx] = { ...workflows[idx], ...data };
  return NextResponse.json({ success: true });
}

export async function DELETE(req: NextRequest) {
  const companyId = req.nextUrl.searchParams.get('companyId');
  const id = req.nextUrl.searchParams.get('id');
  if (!companyId || !id) return NextResponse.json({ error: 'Missing companyId or id' }, { status: 400 });
  workflowStore[companyId] = (workflowStore[companyId] || []).filter(w => w.id !== id);
  return NextResponse.json({ success: true });
}
