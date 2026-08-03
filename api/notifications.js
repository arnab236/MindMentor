import { notificationService } from '../services/notificationService.js';

export default async function handler(req, res) {
  try {
    // ============================================================
    // GET /api/notifications
    // ============================================================

    if (req.method === 'GET') {
      return res.status(200).json({
        status: 'success',
        notifications: notificationService.getRecent()
      });
    }

    // ============================================================
    // POST /api/notifications
    // ============================================================

    if (req.method === 'POST') {
      const {
        action,
        title,
        message,
        philosophy
      } = req.body || {};

      if (action === 'complete-habit') {
        if (title) {
          notificationService.dispatchHabitCompletion(
            title,
            philosophy
          );
        }

        return res.status(200).json({
          status: 'success',
          message: 'Habit completion recorded'
        });
      }

      if (action === 'trigger-insight') {
        notificationService.dispatchInsight(
          title || 'Philosophical Reflection',
          message ||
            'Reflect on what is within your power today.',
          philosophy || 'Stoicism'
        );

        return res.status(200).json({
          status: 'success',
          message: 'Insight event emitted'
        });
      }

      return res.status(400).json({
        error: 'Unknown notification action'
      });
    }

    return res.status(405).json({
      error: 'Method Not Allowed'
    });

  } catch (error) {
    console.error('[api/notifications] Error:', error);

    return res.status(500).json({
      error: 'Internal Server Error',
      details: error.message
    });
  }
}