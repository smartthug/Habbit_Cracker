import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface IHabitLog extends Document {
  habitId: Types.ObjectId;
  userId: Types.ObjectId;
  date: Date;
  status: "done" | "skipped";
  createdAt: Date;
}

const HabitLogSchema: Schema = new Schema(
  {
    habitId: {
      type: Schema.Types.ObjectId,
      ref: "Habit",
      required: true,
      index: true,
    },
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
    status: {
      type: String,
      enum: ["done", "skipped"],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index to prevent duplicate logs for same habit on same date
HabitLogSchema.index({ habitId: 1, date: 1 }, { unique: true });

const HabitLog: Model<IHabitLog> = mongoose.models.HabitLog || mongoose.model<IHabitLog>("HabitLog", HabitLogSchema);

export default HabitLog;
