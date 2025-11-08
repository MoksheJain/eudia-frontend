import { NextRequest, NextResponse } from 'next/server';
import { connectToMongo } from '@/lib/mongo';
import { Conversation, IConversationDocument } from "@/models/Conversation";
import mongoose from 'mongoose';
import { IMessageDocument, Message } from '@/models/Messages';

interface HistoryItem {
    _id: mongoose.Types.ObjectId;
    start_time: Date;
    last_updated: Date;
    messages: IMessageDocument[];
}

export async function GET(request: NextRequest) {
    try {
        // 1. Connect to the database
        await connectToMongo();

        const { email } = await request.json();
        const userEmail: string = email.toLowerCase();
        const conversations: Pick<IConversationDocument, '_id' | 'start_time' | 'last_updated'>[] = await Conversation.find({ user_email: userEmail })
            .sort({ last_updated: -1 }) // Sort by most recent
            .select('_id start_time last_updated');

        if (conversations.length === 0) {
            return NextResponse.json({ history: [] }, { status: 200 });
        }

        const conversationIds = conversations.map(c => c._id);
        const messages: IMessageDocument[] = await Message.find({ conversation_id: { $in: conversationIds } })
            .sort({ timestamp: 1 }) as IMessageDocument[]; // Assert type for safer usage

        const history: HistoryItem[] = conversations.map(conv => {
            const conversationMessages = messages.filter(msg =>
                (msg.conversation_id as mongoose.Types.ObjectId).equals(conv._id)
            );
            return {
                _id: conv._id,
                start_time: conv.start_time,
                last_updated: conv.last_updated,
                messages: conversationMessages
            };
        });

        return NextResponse.json({ history }, { status: 200 });

    } catch (err) {
        console.error('Error fetching chat history:', err);
        return NextResponse.json({ error: 'Internal server error: Failed to retrieve chat history.' }, { status: 500 });
    }
}