// models/message.ts
import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true
  },
  receiverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true
  },
  text: {
    type: String,
    required: true
  },
  read: {
    type: Boolean,
    default: false
  },
  messageType: {
    type: String,
    enum: ['text', 'image', 'file'],
    default: 'text'
  }
}, {
  timestamps: true
});

// Index for efficient queries
messageSchema.index({ senderId: 1, receiverId: 1, createdAt: -1 });
messageSchema.index({ receiverId: 1, read: 1 });

const message = mongoose.models.messages || mongoose.model("messages", messageSchema);
export default message;