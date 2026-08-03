import { EventEmitter } from 'events';

class NotificationService extends EventEmitter {
  constructor() {
    super();
    this.notifications = [
      {
        id: 'n-1',
        title: 'Morning Stoic Reflection',
        message: '“When you arise in the morning, think of what a privilege it is to be alive, to think, to enjoy, to love.” — Marcus Aurelius',
        type: 'daily_insight',
        philosophy: 'Stoicism',
        timestamp: new Date().toISOString()
      },
      {
        id: 'n-2',
        title: 'Jungian Shadow Awareness',
        message: 'Notice what irritates you today in others. It holds a mirror to your unexamined potentials.',
        type: 'habit_reminder',
        philosophy: 'Jungian',
        timestamp: new Date(Date.now() - 3600000).toISOString()
      }
    ];

    // Listen to internal events for decoupled logging/broadcasting
    this.on('daily_insight', (data) => {
      console.log(`[NotificationService] Event 'daily_insight' emitted:`, data.title);
      this._addNotification(data);
    });

    this.on('habit_completed', (data) => {
      console.log(`[NotificationService] Event 'habit_completed' emitted:`, data.title);
      this._addNotification({
        title: 'Habit Accomplished',
        message: `Great focus on completing: "${data.title}"`,
        type: 'habit_completed',
        philosophy: data.philosophy || 'General',
        timestamp: new Date().toISOString()
      });
    });

    // Periodically generate a daily insight event every 10 minutes to simulate real-time wisdom pushes
    this._startScheduler();
  }

  _addNotification(data) {
    const newNotice = {
      id: `n-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      title: data.title || 'Wisdom Insight',
      message: data.message || '',
      type: data.type || 'daily_insight',
      philosophy: data.philosophy || 'Stoicism',
      timestamp: data.timestamp || new Date().toISOString()
    };
    this.notifications.unshift(newNotice);
    if (this.notifications.length > 20) {
      this.notifications.pop();
    }
  }

  dispatchInsight(title, message, philosophy = 'Stoicism') {
    this.emit('daily_insight', {
      title,
      message,
      type: 'daily_insight',
      philosophy,
      timestamp: new Date().toISOString()
    });
  }

  dispatchHabitCompletion(title, philosophy = 'Stoicism') {
    this.emit('habit_completed', { title, philosophy });
  }

  getRecent() {
    return this.notifications;
  }

  _startScheduler() {
    const quotes = [
      {
        title: 'Taoist Harmony',
        message: 'Nature does not hurry, yet everything is accomplished. — Lao Tzu',
        philosophy: 'Taoism'
      },
      {
        title: 'Existential Courage',
        message: 'Freedom is what you do with what’s been done to you. — Jean-Paul Sartre',
        philosophy: 'Existentialism'
      },
      {
        title: 'Buddhist Peace',
        message: 'Holding on to anger is like grasping a hot coal with the intent of throwing it at someone else.',
        philosophy: 'Buddhism'
      }
    ];

    let idx = 0;
    setInterval(() => {
      const q = quotes[idx % quotes.length];
      this.dispatchInsight(q.title, q.message, q.philosophy);
      idx++;
    }, 600000); // Every 10 mins
  }
}

export const notificationService = new NotificationService();
export default notificationService;
