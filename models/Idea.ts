import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface IIdea extends Document {
  userId: Types.ObjectId;
  topicId?: Types.ObjectId;
  habitId?: Types.ObjectId;
  text: string;
  tags: string[];
  priority: "normal" | "important";
  createdAt: Date;
}

const IdeaSchema: Schema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    topicId: {
      type: Schema.Types.ObjectId,
      ref: "Topic",
    },
    habitId: {
      type: Schema.Types.ObjectId,
      ref: "Habit",
    },
    text: {
      type: String,
      required: [true, "Idea text is required"],
      trim: true,
    },
    tags: {
      type: [String],
      default: [],
    },
    priority: {
      type: String,
      enum: ["normal", "important"],
      default: "normal",
    },
  },
  {
    timestamps: true,
  }
);

const Idea: Model<IIdea> = mongoose.models.Idea || mongoose.model<IIdea>("Idea", IdeaSchema);

export default Idea;
