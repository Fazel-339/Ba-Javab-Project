import { Router, Request, Response } from 'express';
import axios from 'axios';

const router :Router = Router();

// Endpoint برای پرسش
router.post('/ask', async (req: Request, res: Response) => {
    const { message, mode } = req.body;

    try {
        console.log('درخواست دریافت شد:', message);

        const aiResponse = await axios.post('http://localhost:8000/generate-answer',
            {
                prompt: message  // دقت کنید که کلید حتماً prompt باشد
            },
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );

        console.log('پاسخ AI:', aiResponse.data);

        res.json({ answer: aiResponse.data.answer });
    } catch (error) {
        console.error('خطای کامل:', error);

        if (axios.isAxiosError(error)) {
            console.error('پاسخ سرور:', error.response?.data);
            console.error('وضعیت:', error.response?.status);
        }

        res.status(500).json({ error: 'خطا در دریافت پاسخ از سرور' });
    }
});

export default router;

