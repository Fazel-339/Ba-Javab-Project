import express, {Request, Response, NextFunction} from 'express';
import User from '../Models/User'; // مدل کاربرمون که تو مرحله قبل ساختیم رو میاریم
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';



const JWT_SECRET = 'your-secret-key';

export const authMiddleware = (req: Request & { userId?: string }, res: Response, next: NextFunction): void => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        console.log('توکن دریافتی:', token); // لاگ کردن توکن

        if (!token) {
            res.status(401).json({ error: 'توکن ارائه نشده' });
            return;
        }

        const decodedToken = jwt.verify(token, JWT_SECRET) as { userId: string };

        console.log('JWT_SECRET مورد استفاده در میدلور:', process.env.JWT_SECRET || 'defaultSecret');


        req.userId = decodedToken.userId;
        next();
    } catch (error) {
        console.error('خطا در احراز هویت:', error); // لاگ کردن خطا
        res.status(401).json({ error: 'احراز هویت ناموفق' });
    }
};

const router = express.Router();


// @ts-ignore
router.post('/signup', async (req: Request, res: Response) => {
    try {
        const { username, password } = req.body;

        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: 'نام کاربری قبلاً گرفته شده.' });
        }

        // ساخت کاربر جدید و ذخیره توی دیتابیس
        const newUser = new User({ username, password });
        await newUser.save();

        const token = jwt.sign({ userId: newUser._id }, JWT_SECRET, { expiresIn: '24h' });
        console.log('JWT_SECRET مورد استفاده در ساخت توکن:', process.env.JWT_SECRET || 'defaultSecret');


        res.status(201).json({

            message: 'ثبت‌نام با موفقیت انجام شد!',
            token,
            username: newUser.username

        });

    } catch (error) {
        res.status(500).json({ message: 'مشکلی پیش اومده، لطفاً دوباره تلاش کنید.' });
    }
});

// @ts-ignore
router.post('/login', async (req: Request, res: Response) => {
    try {
        const {username, password} = req.body;

        const user = await User.findOne({username})
        if (!user) {
            return res.status(401).json({ message: 'نام کاربری یا رمز عبور اشتباه است.' });

        }
        const isValidPassword = await bcrypt.compare(password, user.password);
            if (!isValidPassword) {
                return res.status(401).json({ message: 'نام کاربری یا رمز عبور اشتباه است.' });

            }

        const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '24h' });
        console.log('JWT_SECRET مورد استفاده در ساخت توکن:', process.env.JWT_SECRET || 'defaultSecret');

        res.status(201).json({

            message: 'ثبت‌نام با موفقیت انجام شد!',
            token,
            username: user.username

        });

    } catch (error) {
        res.status(500).json({ message: 'مشکلی پیش اومده، لطفاً دوباره تلاش کنید.' });
    }

    });






export default router;
