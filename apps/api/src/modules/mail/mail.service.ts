import nodemailer from 'nodemailer';

class MailService {
    private transporter;

    constructor() {
        // Initialize transporter
        // Ideally, these would come from process.env
        // For development, we can use Ethereal or a placeholder
        this.transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST || 'smtp.ethereal.email',
            port: parseInt(process.env.SMTP_PORT || '587'),
            secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
            auth: {
                user: process.env.SMTP_USER || 'ethereal_user',
                pass: process.env.SMTP_PASS || 'ethereal_pass'
            }
        });
    }

    async sendEmail(to: string, subject: string, html: string) {
        try {
            const info = await this.transporter.sendMail({
                // from: '"Kingdom Connect" <noreply@kingdomconnect.com>',
                from: '"Kingdom Connect" <kkamalakar512@gmail.com>',
                to,
                subject,
                html,
            });
            console.log(`Message sent: ${info.messageId}`);
            if (process.env.NODE_ENV !== 'production') {
                console.log(`Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
            }
        } catch (error) {
            console.error('Error sending email:', error);
            // Don't crash the app if email fails, but log it
        }
    }

    async sendWelcomeEmail(email: string, name: string) {
        const subject = 'Welcome to Kingdom Connect!';
        const html = `
            <h1>Welcome to Kingdom Connect, ${name}!</h1>
            <p>We are thrilled to have you join our community.</p>
            <p>Get started by exploring sermons, quizzes, and connecting with others.</p>
        `;
        await this.sendEmail(email, subject, html);
    }

    async sendPasswordResetEmail(email: string, token: string) {
        const resetLink = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password?token=${token}`;
        const subject = 'Reset Your Password';
        const html = `
            <h1>Password Reset Request</h1>
            <p>You requested to reset your password. Click the link below to proceed:</p>
            <a href="${resetLink}">Reset Password</a>
            <p>If you did not request this, please ignore this email.</p>
        `;
        await this.sendEmail(email, subject, html);
    }

    async sendSecurityAlert(email: string, type: 'LOGIN' | 'PASSWORD_CHANGE') {
        const subject = type === 'LOGIN' ? 'New Login Detected' : 'Password Changed';
        const html = `
            <h1>Security Alert</h1>
            <p>A ${type === 'LOGIN' ? 'new login' : 'password change'} was detected on your account.</p>
            <p>If this was you, no action is needed.</p>
            <p>If this wasn't you, please secure your account immediately.</p>
        `;
        await this.sendEmail(email, subject, html);
    }
}

export const mailService = new MailService();
