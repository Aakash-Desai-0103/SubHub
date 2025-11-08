// Load environment variables from .env file
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const { startCron } = require('./utils/reminderJob'); // ✅ corrected folder path (was ./utils/)

// --- Import Routes ---
const authRoutes = require('./routes/authRoutes');
const subscriptionRoutes = require('./routes/subscriptionRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes'); // ✅ newly added
// (Later you'll also add) const contactRoutes = require('./routes/contactRoutes');

const app = express();

// --- Middleware ---
app.use(cors());
app.use(express.json()); // Parse JSON bodies

// --- DATABASE CONNECTION ---
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on http://localhost:${PORT}`);
    });

    // ✅ Start the reminder cron job *after DB connection succeeds*
    startCron(7, '0 9 * * *'); // 7 days ahead, runs daily at 09:00 UTC
  } catch (error) {
    console.error(`❌ MongoDB connection error: ${error.message}`);
    process.exit(1);
  }
};

// --- API ROUTES ---

// Test route
app.get('/', (req, res) => {
  res.send('Welcome to the SubHub API!');
});

// --- Main API Routes ---
app.use('/api/auth', authRoutes);
app.use('/api/subscriptions', subscriptionRoutes);
app.use('/api/analytics', analyticsRoutes); // ✅ newly added route
// (Later you'll also add) app.use('/api/contact', contactRoutes);

// ✅ TEMP TEST ROUTE for Mailtrap
app.get('/dev/test-email', async (req, res) => {
  const sendEmail = require('./utils/sendEmail');
  await sendEmail(
    'test@subhub.local',
    'Test from SubHub 🚀',
    'This is a test email from your SubHub backend using Mailtrap.'
  );
  res.send('✅ Test email sent! Check your Mailtrap inbox.');
});

// ✅ TEMP TEST ROUTE for running reminders manually
app.get('/dev/run-reminders', async (req, res) => {
  const { sendReminders } = require('./utils/reminderJob'); // ✅ corrected folder path
  try {
    const result = await sendReminders(7);
    res.json({ ok: true, result });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

// --- Connect and start server ---
connectDB();
