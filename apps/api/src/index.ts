import 'express-async-errors';
import compression from 'compression';
import express from 'express';
import path from 'path';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import authRoutes from './modules/auth/auth.routes';
import bibleRoutes from './modules/bible/bible.routes';
import dailyVerseRoutes from './modules/daily-verse/daily-verse.routes';
import quizRoutes from './modules/quizzes/quizzes.routes';
import sermonRoutes from './modules/sermons/sermons.routes';
import sundaySchoolRoutes from './modules/sunday-school/sunday-school.routes';
import mediaRoutes from './modules/media/media.routes';
import commRoutes from './modules/communication/communication.routes';
import integrationRoutes from './modules/integrations/integration.routes';
import devotionalRoutes from './modules/devotionals/devotionals.routes';
import notificationRoutes from './modules/notifications/notifications.routes';
import userRoutes from './modules/users/users.routes';
import { errorHandler } from './middleware/error.middleware';
import prisma from './config/database';
import { apiLimiter } from './middleware/rate-limit.middleware';

dotenv.config({ path: path.join(__dirname, '../../.env') });

const app = express();
const PORT = process.env.PORT || 5000;

app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" }
}));

const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:4173',
    'http://localhost',
    'capacitor://localhost'
];

if (process.env.FRONTEND_URL) {
    const envOrigins = process.env.FRONTEND_URL.split(',').map(url => url.trim());
    allowedOrigins.push(...envOrigins);
}

app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);

        if (allowedOrigins.indexOf(origin) === -1) {
            console.log('BLOCKED ORIGIN:', origin);
            console.log('ALLOWED ORIGINS:', allowedOrigins);
            const msg = `The CORS policy for this site does not allow access from the specified Origin: ${origin}`;
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    },
    credentials: true
}));

app.use(compression());
app.use(express.json({ limit: '10mb' })); // Limit body size
app.use(apiLimiter);
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/bible', bibleRoutes);
app.use('/api/v1/daily-verse', dailyVerseRoutes);
app.use('/api/v1/quizzes', quizRoutes);
app.use('/api/v1/sermons', sermonRoutes);
app.use('/api/v1/sunday-school', sundaySchoolRoutes);
app.use('/api/v1/media', mediaRoutes);
app.use('/api/v1/communication', commRoutes);
app.use('/api/v1/integrations', integrationRoutes);
app.use('/api/v1/devotionals', devotionalRoutes);
app.use('/api/v1/notifications', notificationRoutes);

app.get('/', (req, res) => {
    res.json({ message: 'Church App API is running' });
});

// Global Error Handler
app.use(errorHandler);

app.listen(PORT, async () => {
    try {
        await prisma.$connect();
        console.log('Database connected successfully');
    } catch (error) {
        console.error('Database connection failed:', error);
        process.exit(1);
    }
    console.log(`Server is running on port ${PORT}`);
});
