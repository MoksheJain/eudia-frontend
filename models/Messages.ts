import mongoose, { Schema, Document, Model } from "mongoose"

export interface IMessage {
    conversation_id: mongoose.Types.ObjectId
    sender: "user" | "chatbot"
    content: string
    timestamp: Date
}

export interface IMessageDocument extends IMessage, Document { }

const messageSchema = new Schema<IMessageDocument>({
    conversation_id: {
        type: Schema.Types.ObjectId,
        ref: "Conversation",
        required: true,
        index: true
    },
    sender: {
        type: String,
        enum: ["user", "chatbot"],
        required: true
    },
    content: {
        type: String,
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now,
        index: true
    }
})

export const Message: Model<IMessageDocument> =
    (mongoose.models.Message as Model<IMessageDocument>) ||
    mongoose.model<IMessageDocument>("Message", messageSchema)
