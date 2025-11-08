import { NextRequest, NextResponse } from 'next/server';
import { connectToMongo } from '@/lib/mongo';
import { Conversation, IConversationDocument } from "@/models/Conversation";
import { Message } from '@/models/Messages';
interface MessagePayload {
    user_email: string;
    content: string;
    conversation_id?: string;
}
const getChatbotResponse = (userMessage: string): string => {
    const responseMap: { [key: string]: string } = {
        "hello": "Hello there! How can I assist you with your account today?",
        "weather": "I am a chat history bot and don't have access to live weather data. Try asking about your recent conversations!",
        "name": "I am the Gemini chat assistant, here to log your conversations.",
    };
    const defaultResponse = "I'm not sure how to respond to that, but I'm learning! Is there anything else I can help you save?";

    // Simple keyword matching for simulation
    const keywords = Object.keys(responseMap);
    for (const keyword of keywords) {
        if (userMessage.toLowerCase().includes(keyword)) {
            return responseMap[keyword];
        }
    }
    return defaultResponse;
};
export async function POST(request: NextRequest) {
    try {
        // 1. Connect to the database
        await connectToMongo();
        // 2. Parse and type the request body
        const { user_email, content, conversation_id } = await request.json() as MessagePayload;

        if (!user_email || !content) {
            return NextResponse.json({ error: 'Missing user_email or content.' }, { status: 400 });
        }

        let conversation: IConversationDocument | null = null;

        // 3. Find or Create Conversation Session
        if (conversation_id) {
            // A. If an ID is provided, try to find the existing conversation
            conversation = await Conversation.findById(conversation_id);
        }

        if (!conversation) {
            // B. If no ID or conversation not found, create a new one
            conversation = new Conversation({ user_email: user_email.toLowerCase() });
            await conversation.save();
        }

        const currentConversationId = conversation._id;

        // 4. Store User Message
        const userMessage = new Message({
            conversation_id: currentConversationId,
            sender: 'user',
            content: content
        });
        await userMessage.save();

        // 5. Get Chatbot Response (Simulated)
        const botResponseText = getChatbotResponse(content);

        // 6. Store Chatbot Message
        const chatbotMessage = new Message({
            conversation_id: currentConversationId,
            sender: 'chatbot',
            content: botResponseText
        });
        await chatbotMessage.save();

        // 7. Update Conversation Last Updated Time
        await Conversation.updateOne(
            { _id: currentConversationId },
            { $set: { last_updated: new Date() } }
        );

        // 8. Respond to Client
        return NextResponse.json({
            botResponse: botResponseText,
            conversationId: currentConversationId,
            status: 'Messages successfully saved.'
        }, { status: 200 });

    } catch (err) {
        console.error('Error saving chat messages:', err);
        // Use a generic error message for security
        return NextResponse.json({ error: 'Internal server error: Failed to process and store messages.' }, { status: 500 });
    }
}