import mongoose, { Schema, Document } from 'mongoose';

interface IChat extends Document {
    userId: string;
    name: string; // نام گفتگو
    messages: {
        text: string;
        sender: 'user' | 'ai';
        timestamp: Date;
        mode: string;
    }[];
    mode: string;
    createdAt: Date;
}

const ChatSchema = new Schema<IChat>({
    userId: { type: String, required: true },
    name: { type: String, required: true }, // اضافه کردن نام گفتگو
    messages: [{
        text: { type: String, required: true },
        sender: { type: String, enum: ['user', 'ai'], required: true },
        timestamp: { type: Date, default: Date.now },
        mode: { type: String },
    }],
    mode: { type: String },
    createdAt: { type: Date, default: Date.now },
});

const Chat = mongoose.model<IChat>('Chat', ChatSchema);
export default Chat;
