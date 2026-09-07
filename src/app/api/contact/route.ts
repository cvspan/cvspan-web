import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Field limits. Without these the endpoint accepts a body of any size and
 * forwards it straight into an email.
 */
const LIMITS = {
    fullName: 120,
    email: 254, // the maximum length of an email address per RFC 5321
    message: 5000,
};

/**
 * Requests allowed per IP per window. This is held in memory, so it resets on
 * deploy and is not shared between server instances — it raises the cost of
 * casual abuse rather than stopping a determined attacker. Move it to a shared
 * store (Redis, Upstash) if the endpoint ever comes under real pressure.
 */
const RATE_LIMIT = { max: 5, windowMs: 15 * 60 * 1000 };
const hits = new Map<string, number[]>();

function isRateLimited(ip: string) {
    const now = Date.now();
    const recent = (hits.get(ip) ?? []).filter((t) => now - t < RATE_LIMIT.windowMs);
    recent.push(now);
    hits.set(ip, recent);

    // Stop the map growing without bound on a long-lived server.
    if (hits.size > 5000) {
        // forEach rather than for..of: the compile target predates Map iteration.
        hits.forEach((times: number[], key: string) => {
            if (times.every((t: number) => now - t >= RATE_LIMIT.windowMs)) hits.delete(key);
        });
    }

    return recent.length > RATE_LIMIT.max;
}

function escapeHtml(value: string) {
    return value
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

export async function POST(req: NextRequest) {
    const ip = (req.headers.get('x-forwarded-for') ?? '').split(',')[0].trim() || 'unknown';

    if (isRateLimited(ip)) {
        return NextResponse.json(
            { message: 'Too many messages', description: 'Please wait a few minutes before sending another message.' },
            { status: 429 },
        );
    }

    const body = await req.json().catch(() => null);

    const fullName = typeof body?.fullName === 'string' ? body.fullName.trim() : '';
    const email = typeof body?.email === 'string' ? body.email.trim() : '';
    const message = typeof body?.message === 'string' ? body.message.trim() : '';
    // Hidden field. A real person never sees it, so anything in it is a bot.
    const company = typeof body?.company === 'string' ? body.company.trim() : '';

    if (company) {
        // Report success so the bot does not learn to work around the check.
        return NextResponse.json({ message: 'Message sent successfully', description: 'Thanks for reaching out.' });
    }

    if (!fullName || !email || !message) {
        return NextResponse.json(
            { message: 'Missing required fields', description: 'Name, email, and message are all required.' },
            { status: 400 },
        );
    }

    if (fullName.length > LIMITS.fullName || email.length > LIMITS.email || message.length > LIMITS.message) {
        return NextResponse.json(
            {
                message: 'Message too long',
                description: `Please keep your message under ${LIMITS.message} characters.`,
            },
            { status: 413 },
        );
    }

    if (!EMAIL_PATTERN.test(email)) {
        return NextResponse.json(
            { message: 'Invalid email', description: 'Please provide a valid email address.' },
            { status: 400 },
        );
    }

    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: Number(process.env.EMAIL_PORT) || 465,
        secure: Number(process.env.EMAIL_PORT || 465) === 465,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    try {
        await transporter.sendMail({
            from: `"CVSpan Website" <${process.env.EMAIL_USER}>`,
            to: process.env.CONTACT_TO_EMAIL,
            replyTo: email,
            subject: `New contact form submission from ${fullName}`,
            html: `
                <div>
                    <p><strong>Name:</strong> ${escapeHtml(fullName)}</p>
                    <p><strong>Email:</strong> ${escapeHtml(email)}</p>
                    <p><strong>Message:</strong></p>
                    <p>${escapeHtml(message).replace(/\n/g, '<br />')}</p>
                </div>
            `,
        });
    } catch (error) {
        console.error('Failed to send contact form email', error);
        return NextResponse.json(
            { message: 'An error occurred', description: 'Failed to send your message. Please try again later.' },
            { status: 500 },
        );
    }

    return NextResponse.json({
        message: 'Message sent successfully',
        description: "Thanks for reaching out — we'll get back to you soon.",
    });
}
