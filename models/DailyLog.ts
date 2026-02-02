import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface IDailyLog extends Document {
  userId: Types.ObjectId;
  date: Date;
  notes: string;
  mood?: "happy" | "neutral" | "sad" | "anxious" | "excited";
  createdAt: Date;
}

const DailyLogSchema: Schema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    date: {
      type: Date,
      required: true,
      default: Date.now,
    },
    notes: {
      type: String,
      default: "",
    },
    mood: {
      type: String,
      enum: ["happy", "neutral", "sad", "anxious", "excited"],
    },
  },
  {
    timestamps: true,
  }
);

// One log per user per day
DailyLogSchema.index({ userId: 1, date: 1 }, { unique: true });

const DailyLog: Model<IDailyLog> = mongoose.models.DailyLog || mongoose.model<IDailyLog>("DailyLog", DailyLogSchema);

export default DailyLog;
