"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("express-async-errors");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const dotenv_1 = __importDefault(require("dotenv"));
const auth_routes_1 = __importDefault(require("./modules/auth/auth.routes"));
const bible_routes_1 = __importDefault(require("./modules/bible/bible.routes"));
const daily_verse_routes_1 = __importDefault(require("./modules/daily-verse/daily-verse.routes"));
const quizzes_routes_1 = __importDefault(require("./modules/quizzes/quizzes.routes"));
const sermons_routes_1 = __importDefault(require("./modules/sermons/sermons.routes"));
const sunday_school_routes_1 = __importDefault(require("./modules/sunday-school/sunday-school.routes"));
const media_routes_1 = __importDefault(require("./modules/media/media.routes"));
const communication_routes_1 = __importDefault(require("./modules/communication/communication.routes"));
const integration_routes_1 = __importDefault(require("./modules/integrations/integration.routes"));
const devotionals_routes_1 = __importDefault(require("./modules/devotionals/devotionals.routes"));
const users_routes_1 = __importDefault(require("./modules/users/users.routes"));
const error_middleware_1 = require("./middleware/error.middleware");
const database_1 = __importDefault(require("./config/database"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use('/api/v1/auth', auth_routes_1.default);
app.use('/api/v1/users', users_routes_1.default);
app.use('/api/v1/bible', bible_routes_1.default);
app.use('/api/v1/daily-verse', daily_verse_routes_1.default);
app.use('/api/v1/quizzes', quizzes_routes_1.default);
app.use('/api/v1/sermons', sermons_routes_1.default);
app.use('/api/v1/sunday-school', sunday_school_routes_1.default);
app.use('/api/v1/media', media_routes_1.default);
app.use('/api/v1/communication', communication_routes_1.default);
app.use('/api/v1/integrations', integration_routes_1.default);
app.use('/api/v1/devotionals', devotionals_routes_1.default);
app.get('/', (req, res) => {
    res.json({ message: 'Church App API is running' });
});
// Global Error Handler
app.use(error_middleware_1.errorHandler);
app.listen(PORT, async () => {
    try {
        await database_1.default.$connect();
        console.log('Database connected successfully');
    }
    catch (error) {
        console.error('Database connection failed:', error);
        process.exit(1);
    }
    console.log(`Server is running on port ${PORT}`);
});
