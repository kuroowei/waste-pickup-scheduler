import './config/env';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/auth.routes';
import pickupRoutes from './routes/pickup.routes';
import wasteTypeRoutes from './routes/wasteType.routes';
import adminRoutes from './routes/admin.routes';
import feedbackRoutes from './routes/feedback.routes';
import complaintRoutes from './routes/complaint.routes';
import announcementRoutes from './routes/announcement.routes';
import notificationRoutes from './routes/notification.routes';
const app = express();
app.use(helmet());
const allowedOrigins = [
  'http://localhost:5173',
  'https://waste-pickup-scheduler-web.vercel.app',
];
app.use(cors({ origin: allowedOrigins, credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.use('/api/auth', authRoutes);
app.use('/api/pickup', pickupRoutes);
app.use('/api/waste-types', wasteTypeRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/complaints', complaintRoutes);
app.use('/api/announcements', announcementRoutes);
app.use('/api/notifications', notificationRoutes);
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', service: 'waste-pickup-scheduler-api' });
});
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});