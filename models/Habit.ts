import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface IHabit extends Document {
  userId: Types.ObjectId;
  name: string;
  category: "health" | "learning" | "business" | "personal" | "custom";
  frequency: "daily" | "weekly" | "custom";
  priority: "low" | "medium" | "high";
  reminderTime?: string;
  ideaGenerating?: boolean;
  createdAt: Date;
}

const HabitSchema: Schema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: [true, "Habit name is required"],
      trim: true,
    },
    category: {
      type: String,
      enum: ["health", "learning", "business", "personal", "custom"],
      default: "personal",
    },
    frequency: {
      type: String,
      enum: ["daily", "weekly", "custom"],
      default: "daily",
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },
    reminderTime: {
      type: String,
    },
    ideaGenerating: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Habit: Model<IHabit> = mongoose.models.Habit || mongoose.model<IHabit>("Habit", HabitSchema);

export default Habit;
