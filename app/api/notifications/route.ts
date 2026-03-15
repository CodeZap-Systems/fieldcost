/**
 * Notifications API Route
 * Handle task assignments, invoice reminders, and notification preferences
 */

import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabaseServer';
import { resolveServerUserId } from '@/lib/serverUser';
import { ensureAuthUser, EnsureAuthUserError } from '@/lib/ensureAuthUser';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { searchParams } = new URL(req.url);
    const userId = resolveServerUserId(searchParams.get('user_id'));

    // Validate authentication
    try {
      await ensureAuthUser(userId);
    } catch (error) {
      if (error instanceof EnsureAuthUserError) {
        return NextResponse.json(
          { error: error.message },
          { status: error.statusCode }
        );
      }
      return NextResponse.json(
        { error: 'Unable to prepare user context' },
        { status: 500 }
      );
    }

    const { action, companyId } = body;

    if (!action) {
      return NextResponse.json(
        { error: 'action is required' },
        { status: 400 }
      );
    }

    switch (action) {
      case 'create': {
        return await createNotification(body, userId);
      }

      case 'get-all': {
        return await getNotifications({ userId, companyId });
      }

      case 'mark-read': {
        const { notificationId } = body;
        return await markAsRead({ notificationId, userId });
      }

      case 'update-preferences': {
        return await updatePreferences(body, userId);
      }

      case 'get-preferences': {
        return await getPreferences({ userId, companyId });
      }

      case 'send-task-notification': {
        return await sendTaskNotification(body, userId);
      }

      case 'check-past-due-invoices': {
        return await checkPastDueInvoices(body);
      }

      default:
        return NextResponse.json(
          { error: 'Unknown action' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Notifications API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * Create a notification
 */
async function createNotification(
  body: any,
  userId: string
) {
  try {
    const {
      recipientUserId,
      type,
      title,
      message,
      relatedEntityType,
      relatedEntityId,
      companyId,
      metadata,
    } = body;

    const { data, error } = await supabaseServer
      .from('notifications')
      .insert({
        recipient_id: recipientUserId,
        type,
        title,
        message,
        related_entity_type: relatedEntityType,
        related_entity_id: relatedEntityId,
        company_id: companyId,
        is_read: false,
        metadata: metadata || {},
        created_by: userId,
      })
      .select('*')
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json({
      success: true,
      notification: data,
    });
  } catch (error) {
    console.error('Create notification error:', error);
    throw error;
  }
}

/**
 * Get all notifications for a user
 */
async function getNotifications({
  userId,
  companyId,
}: {
  userId: string;
  companyId?: number;
}) {
  try {
    let query = supabaseServer
      .from('notifications')
      .select('*')
      .eq('recipient_id', userId)
      .order('created_at', { ascending: false });

    if (companyId) {
      query = query.eq('company_id', companyId);
    }

    const { data, error } = await query;

    if (error && error.code !== 'PGRST116') {
      throw error;
    }

    return NextResponse.json({
      success: true,
      notifications: data || [],
      unreadCount: (data || []).filter((n: any) => !n.is_read).length,
    });
  } catch (error) {
    console.error('Get notifications error:', error);
    throw error;
  }
}

/**
 * Mark notification as read
 */
async function markAsRead({
  notificationId,
  userId,
}: {
  notificationId: number;
  userId: string;
}) {
  try {
    const { error } = await supabaseServer
      .from('notifications')
      .update({ is_read: true })
      .eq('id', notificationId)
      .eq('recipient_id', userId);

    if (error) {
      throw error;
    }

    return NextResponse.json({
      success: true,
      message: 'Notification marked as read',
    });
  } catch (error) {
    console.error('Mark as read error:', error);
    throw error;
  }
}

/**
 * Update notification preferences
 */
async function updatePreferences(body: any, userId: string) {
  try {
    const {
      companyId,
      preferences,
    } = body;

    const { error } = await supabaseServer
      .from('notification_preferences')
      .upsert({
        user_id: userId,
        company_id: companyId,
        preferences,
        updated_at: new Date(),
      });

    if (error) {
      throw error;
    }

    return NextResponse.json({
      success: true,
      message: 'Notification preferences updated',
    });
  } catch (error) {
    console.error('Update preferences error:', error);
    throw error;
  }
}

/**
 * Get notification preferences
 */
async function getPreferences({
  userId,
  companyId,
}: {
  userId: string;
  companyId?: number;
}) {
  try {
    let query = supabaseServer
      .from('notification_preferences')
      .select('*')
      .eq('user_id', userId);

    if (companyId) {
      query = query.eq('company_id', companyId);
    }

    const { data, error } = await query;

    if (error && error.code !== 'PGRST116') {
      throw error;
    }

    // Return default preferences if none exist
    const defaults = {
      email_on_task_assignment: true,
      email_on_invoice_due: true,
      email_on_quote_accepted: true,
      in_app_notifications: true,
      browser_notifications: false,
    };

    return NextResponse.json({
      success: true,
      preferences: data && data.length > 0 ? data[0].preferences : defaults,
    });
  } catch (error) {
    console.error('Get preferences error:', error);
    throw error;
  }
}

/**
 * Send task assignment notification
 */
async function sendTaskNotification(body: any, userId: string) {
  try {
    const {
      taskId,
      assigneeId,
      taskName,
      projectId,
      companyId,
    } = body;

    // Create notification
    const { data: notification, error } = await supabaseServer
      .from('notifications')
      .insert({
        recipient_id: assigneeId,
        type: 'task_assigned',
        title: 'New Task Assigned',
        message: `You have been assigned to: ${taskName}`,
        related_entity_type: 'task',
        related_entity_id: taskId,
        company_id: companyId,
        metadata: {
          projectId,
          assignedBy: userId,
        },
      })
      .select('*')
      .single();

    if (error) {
      throw error;
    }

    // Get preferences to check if email should be sent
    const { data: prefs } = await supabaseServer
      .from('notification_preferences')
      .select('preferences')
      .eq('user_id', assigneeId)
      .eq('company_id', companyId)
      .single();

    const shouldEmail =
      !prefs || prefs.preferences?.email_on_task_assignment !== false;

    return NextResponse.json({
      success: true,
      notification,
      shouldEmailAssignee: shouldEmail,
    });
  } catch (error) {
    console.error('Send task notification error:', error);
    throw error;
  }
}

/**
 * Check for past-due invoices and send notifications
 */
async function checkPastDueInvoices(body: any) {
  try {
    const { companyId } = body;
    const now = new Date();

    // Get past-due invoices
    const { data: pastDueInvoices, error } = await supabaseServer
      .from('invoices')
      .select('*')
      .eq('company_id', companyId)
      .eq('status', 'unpaid')
      .lt('due_date', now.toISOString().split('T')[0]);

    if (error && error.code !== 'PGRST116') {
      throw error;
    }

    // Create notifications for each past-due invoice
    const notificationsToCreate = (pastDueInvoices || []).map((invoice: any) => ({
      recipient_id: invoice.user_id,
      type: 'invoice_overdue',
      title: 'Invoice Past Due',
      message: `Invoice #${invoice.reference} is now ${Math.floor(
        (now.getTime() - new Date(invoice.due_date).getTime()) /
          (1000 * 60 * 60 * 24)
      )} days overdue`,
      related_entity_type: 'invoice',
      related_entity_id: invoice.id,
      company_id: companyId,
      metadata: {
        amount: invoice.amount,
        daysOverdue: Math.floor(
          (now.getTime() - new Date(invoice.due_date).getTime()) /
            (1000 * 60 * 60 * 24)
        ),
      },
    }));

    if (notificationsToCreate.length > 0) {
      const { error: createError } = await supabaseServer
        .from('notifications')
        .insert(notificationsToCreate);

      if (createError) {
        throw createError;
      }
    }

    return NextResponse.json({
      success: true,
      pastDueInvoicesCount: pastDueInvoices?.length || 0,
      notificationsCreated: notificationsToCreate.length,
    });
  } catch (error) {
    console.error('Check past-due invoices error:', error);
    throw error;
  }
}

/**
 * GET endpoint to retrieve notifications
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('user_id');
    const companyId = searchParams.get('company_id');

    if (!userId) {
      return NextResponse.json(
        { error: 'user_id is required' },
        { status: 400 }
      );
    }

    return await getNotifications({
      userId,
      companyId: companyId ? parseInt(companyId) : undefined,
    });
  } catch (error) {
    console.error('GET notifications error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve notifications' },
      { status: 500 }
    );
  }
}
