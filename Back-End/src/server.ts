import express, {Application} from 'express';
import mongoose from 'mongoose';
import questionRoutes from './routes/questionRoutes';
import cors from 'cors';
import {ConnectOptions} from "mongodb";
import authRoutes from "./routes/authRoutes";
import chatRoutes from './routes/chatRoutes';

const app: Application = express();
app.use(express.json());

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST'],
}));


// اضافه کردن route سوالات
app.use('/api/auth', authRoutes);
app.use('/api/', questionRoutes);
app.use('/api/', chatRoutes);


const PORT = process.env.PORT || 4000;

const mongoURI = 'mongodb+srv://fazelkashani:fpBFWkYfZVmhDjZN@bajavab-cluster.sq1im.mongodb.net/?retryWrites=true&w=majority&appName=BaJavab-Cluster';

const options: ConnectOptions = {};

// اتصال به MongoDB
mongoose.connect(mongoURI, options)
    .then(() => {
        console.log('اتصال به MongoDB برقرار شد!');
        app.listen(PORT, () => {
            console.log(`سرور روی پورت ${PORT} در حال اجراست.`);
        });
    })
    .catch(err => console.error('خطا در اتصال به MongoDB:', err));

app.get('/', (req, res) => {
    res.status(200).send('سرور با جواب در حال اجراست!');



});
