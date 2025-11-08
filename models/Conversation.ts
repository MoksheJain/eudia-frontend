import mongoose, { Schema, Document, Model } from "mongoose"

export interface IConversation {
    user_email: string
    start_time: Date
    last_updated: Date
    topic?: string
}

export interface IConversationDocument extends IConversation, Document { }

const conversationSchema = new Schema<IConversationDocument>({
    user_email: {
        type: String,
        required: true,
        index: true,
        lowercase: true,
        trim: true
    },
    start_time: {
        type: Date,
        default: Date.now
    },
    last_updated: {
        type: Date,
        default: Date.now,
        index: true
    },
    topic: String
})

export const Conversation: Model<IConversationDocument> =
    (mongoose.models.Conversation as Model<IConversationDocument>) ||
    mongoose.model<IConversationDocument>("Conversation", conversationSchema)
