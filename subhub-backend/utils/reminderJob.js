// jobs/reminderJob.js
const cron = require('node-cron');
const mongoose = require('mongoose');
const Subscription = require('../models/Subscription');
const sendEmail = require('../utils/sendEmail');
const User = require('../models/User');

/**
 * sendReminders(settings)
 * - daysBefore: how many days ahead to consider "upcoming" (e.g. 7)
 * - now: allows injection for testing
 */
async function sendReminders(daysBefore = 7, now = new Date()) {
  try {
    const start = new Date(now);
    start.setHours(0,0,0,0);

    const end = new Date(now);
    end.setDate(end.getDate() + daysBefore);
    end.setHours(23,59,59,999);

    // Find active subscriptions with nextDueDate between start..end
    // and which haven't been reminded today (or at all)
    const subs = await Subscription.find({
      status: 'Active',
      nextDueDate: { $gte: start, $lte: end }
    }).populate('user');

    let sentCount = 0;
    for (const s of subs) {
      // Skip if user missing or email missing
      if (!s.user || !s.user.email) continue;

      // If we already sent a reminder today, skip
      if (s.lastReminderSent) {
        const last = new Date(s.lastReminderSent);
        if (last.getFullYear() === start.getFullYear() &&
            last.getMonth() === start.getMonth() &&
            last.getDate() === start.getDate()) {
          continue;
        }
      }

      // Calculate days left
      const diffMs = s.nextDueDate - start;
      const daysLeft = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

      // Compose email
      const subject = `Upcoming payment for ${s.name} in ${daysLeft} day${daysLeft!==1 ? 's' : ''}`;
      const text = `Hi ${s.user.name || 'there'},\n\nThis is a reminder that your subscription for "${s.name}" (₹${s.cost}) is due on ${s.nextDueDate.toDateString()} — that's in ${daysLeft} day${daysLeft!==1 ? 's' : ''}.\n\nIf you already paid or changed the date, you can ignore this message.\n\n– The SubHub Team`;

      try {
        await sendEmail(s.user.email, subject, text);
        // update lastReminderSent to today
        s.lastReminderSent = new Date();
        await s.save();
        sentCount++;
      } catch (err) {
        console.error('Reminder send error for sub', s._id, err.message || err);
      }
    }

    console.log(`Reminder job: checked ${subs.length} subs, sent ${sentCount} emails.`);
    return { checked: subs.length, sent: sentCount };
  } catch (err) {
    console.error('Reminder job error:', err.message || err);
    throw err;
  }
}

/**
 * startCron: call this from server.js to schedule daily run at 09:00
 * Cron expression: '0 9 * * *' => every day at 09:00 server time
 */
function startCron(daysBefore = 7, cronExpression = '0 9 * * *') {
  // Run immediately on startup (optional)
  sendReminders(daysBefore).catch(err => console.error('Initial reminders error', err));

  // Schedule daily job
  cron.schedule(cronExpression, async () => {
    console.log('Reminder cron triggered at', new Date().toISOString());
    await sendReminders(daysBefore);
  }, {
    scheduled: true,
    timezone: 'UTC' // optionally set to your timezone, e.g. 'Asia/Kolkata'
  });

  console.log('Reminder cron scheduled with expression:', cronExpression);
}

module.exports = { sendReminders, startCron };
