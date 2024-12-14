// routes/chatRoutes.ts
import express, { Request, Response } from 'express';
import Chat from '../Models/Chat';
import { authMiddleware } from './authRoutes';

const router = express.Router();

// ذخیره چت جدید
router.post('/save-chat', authMiddleware, async (req: Request & { userId?: string }, res: Response) => {
    try {
        const userId = req.userId;  // استفاده از userId از middleware
        const { message, sender, mode,name } = req.body;

        console.log('درخواست ذخیره چت دریافت شد:', { userId, message, sender, mode });


        // پیدا کردن یا ایجاد چت فعال
        let chat = await Chat.findOne({ userId, mode });

        if (!chat) {
            console.log('چت جدید ایجاد شد');
            chat = new Chat({
                userId,
                mode,
                messages: []
            });
        }

        chat.messages.push({
            text: message,
            sender,
            timestamp: new Date(),
            mode
        });

        await chat.save();
        console.log('چت با موفقیت ذخیره شد:', chat);


        res.status(200).json({ message: 'چت ذخیره شد' });
    } catch (error) {
        res.status(500).json({ error: 'خطا در ذخیره چت' });
    }
});


// دریافت سابقه چت‌ها
router.get('/chat-history', authMiddleware, async (req: Request & { userId?: string }, res: Response) => {
    try {
        const userId = req.userId;  // استفاده از userId از middleware
        const mode = req.query.mode as string;

        const chats = await Chat.find({
            userId,
            ...(mode ? { mode } : {})
        }).sort({ createdAt: -1 });

        res.status(200).json(chats);
    } catch (error) {
        res.status(500).json({ error: 'خطا در بازیابی سابقه چت' });
    }
});


router.get('/chat-list', authMiddleware, async (req: Request & { userId?: string }, res: Response) => {
    try {
        const userId = req.userId;

        // فقط نام گفتگوها رو برگردون
        const chats = await Chat.find({ userId }).select("name mode createdAt");

        res.status(200).json(chats);
    } catch (error) {
        res.status(500).json({ error: "خطا در دریافت لیست گفتگوها" });
    }
});






export default router;